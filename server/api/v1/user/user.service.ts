import { IUser } from "../../../../types/user";
import { Location, User } from "../../../models";
import jwt from "jsonwebtoken";
import MailService from "../../../services/mail.service";
import GoogleDriveService from "../../../services/google-drive.service";
import { config } from "../../../../environment/environment";
import { Types } from "mongoose";

export class UserService {

	constructor() { }

	async getUsersWithQuery(query): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				let offset = +query?.offset || 0, limit = +query?.limit || 50;
				offset = offset * limit;
				let hash = {}
				if (query) {
					if (query.q) {
						let search = String(query.q).toLowerCase();
						hash = {
							...hash,
							$or: [
								{ firstName: { $regex: search, $options: "i" } },
								{ lastName: { $regex: search, $options: "i" } },
								{ email: { $regex: search, $options: "i" } },
								{ username: { $regex: search, $options: "i" } }

							]
						}
					}
					if (query.location && query.location.length) {
						hash = {
							...hash,
							locationId: { $in: query.location }
						}
					}
					if (query.role && query.role.length) {
						hash = {
							...hash,
							roleId: { $in: query.role }
						}
					}
					if (query.active === 'true') {
						hash = {
							...hash,
							active: true
						}
					}
				}

				let users;
				if (query?.sort) {
					let sortable: any = {}
					for (let u in query?.sort) {
						sortable[u] = +query?.sort[u];
					}
					if (sortable?.location) {
						const pipelineLocation = [
							{
								$lookup: {
									from: 'locations',
									localField: 'locationId',
									foreignField: '_id',
									as: 'loc'
								}
							},
							{
								$match: {
									...hash
								}
							},
							{
								$sort: {
									'loc.name': sortable.location,
								}
							},
							{
								$skip: offset
							},
							{
								$limit: limit
							}
						]
						users = await User.aggregate(pipelineLocation).exec();
					}
					else if (sortable?.role) {
						const pipelineLocation = [
							{
								$lookup: {
									from: 'roles',
									localField: 'roleId',
									foreignField: '_id',
									as: 'role'
								}
							},
							{
								$match: {
									...hash
								}
							},
							{
								$sort: {
									'role.role': sortable.role,
								}
							},
							{
								$skip: offset
							},
							{
								$limit: limit
							}
						]
						users = await User.aggregate(pipelineLocation).exec();
					}
					else {
						users = await User.find({ ...hash }).sort(sortable).skip(offset).limit(limit);
					}
				} else {
					users = await User.find(hash).skip(offset).limit(limit);
				}
				return resolve({
					data: users,
					page: {
						total: (await User.find(hash)).length,
						offset: query?.offset || 0,
						limit: query?.limit || 10
					}
				});
			} catch (err) {
				return reject(err);
			}
		})
	}
	async get(query): Promise<Array<IUser>> {
		return new Promise(async (resolve, reject) => {
			try {
				const locations = await Location.find({});
				let users;
				if (query) {
					users = await User.find({ username: { $regex: query, $options: 'i' } });
				} else {
					users = await User.find({});
				}
				let results = [];
				users.forEach((user) => {
					let obj = JSON.parse(JSON.stringify(user));
					let location: any = locations.find((e) => e._id.toString() === user.locationId);
					obj.locationName = location;
					results.push(obj);
				})
				resolve(results);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async updateFirstNameLastName(): Promise<Array<IUser>> {
		return new Promise(async (resolve, reject) => {
			try {
				const user = await User.find();
				const promises = []
				user.forEach((usr) => {
					if (!usr.firstName) {
						const username = usr.username.replace(/\s+$/, "").split(' ');
						const lastName = username.pop();
						const firstName = username.join(' ');
						let obj = usr;
						if (username.length <= 1) {
							obj.firstName = lastName;
						} else {
							obj.firstName = firstName;
							obj.lastName = lastName;
						}
						const update = User.findOneAndUpdate({ _id: usr._id }, obj)
						promises.push(update)
					}
				})
				Promise.all(promises).then((res) => {
					return resolve(res);
				}).catch((err) => {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}
	async create(userData: IUser): Promise<IUser> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!userData?.email) {
					return reject({ code: 400, message: 'Invalid Email.' })
				}
				if (!userData?.username) {
					return reject({ code: 400, message: 'Invalid Username.' })
				}
				if (!userData?.roleId) {
					return reject({ code: 400, message: 'Invalid Role.' })
				}

				const email = userData.email.toLowerCase();

				const oldUser = await User.findOne({ email: email }).lean();

				if (oldUser) {
					return reject({ code: 409, message: 'User already exists with this email.' })
				}
				const password = '';

				const payload = { ...userData, email, password };
				payload.locationId = new Types.ObjectId(String(payload.locationId));
				payload.roleId = new Types.ObjectId(String(payload.roleId));

				const userInstance = new User(payload);

				return resolve(userInstance.save());
			} catch (err) {
				return reject(err);
			}
		})
	}
	async setupUserPassword(id): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ code: 400, message: "Invalid Request ID" })
				}

				const user = await User.findOne({ _id: id });

				if (!user) {
					return reject({ message: 'No user found with requested email address', code: 400 });
				}

				const token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
					expiresIn: 7200, // 2 hours
					algorithm: 'HS256'
				});
				user.resetPasswordToken = token;
				await user.save();

				let options = {
					username: user.username,
					email: user.email,
					resetPasswordToken: user.resetPasswordToken
				}

				MailService.sendSetupPasswordEmail(options)
					.then((success) => {
						resolve(success);
					})
					.catch((error) => {
						reject(error)
					});
			} catch (err) {
				return reject(err);
			}
		})
	}
	async getById(id): Promise<IUser> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const [get] = await User.find({ _id: id });
				return resolve(get);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async update(id, user): Promise<IUser> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				if (!user) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const updateQuery = await User.findOneAndUpdate({ _id: id }, user);
				return resolve(updateQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
	async updateProfilePicture(id, file: Express.Multer.File): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id || !file) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				GoogleDriveService.uploadFile(file).then(async (res: any) => {
					await User.findOneAndUpdate({ _id: id }, {
						profilePicture: res.webContentLink
					});
					return resolve({
						profileImage: res.webContentLink
					});
				}).catch((err) => {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		})
	}
	async delete(id): Promise<IUser> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) {
					return reject({ message: "Invalid Payload", code: 400 })
				}
				const deleteQuery = await User.findOneAndDelete({ _id: id });
				return resolve(deleteQuery);
			} catch (err) {
				return reject(err);
			}
		})
	}
}

export default new UserService();
