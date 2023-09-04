import { Location, User } from "../../../models";

export class PriorityService {
    constructor() { }

    async getAllClosers(id): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                const usersAssigned = await User.find({ roleId: { $ne: "6425796a73e386a02cb01199" }, available: true, locationId: id }).sort({ priority: -1 });
                const usersAvailable = await User.find({ roleId: { $ne: "6425796a73e386a02cb01199" }, available: false, locationId: id }).sort({ priority: -1 });
                resolve({
                    usersAssigned,
                    usersAvailable
                });
            } catch (err) {
                return reject(err);
            }
        });
    }
    async updateCloserCount(id, payload): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }
                if (!payload) {
                    return reject({ message: "Invalid Payload", code: 400 });
                }

                const [user] = await User.find({ _id: id });
                let toUpdate = {};
                if (!user.count && user.count === 0) {
                    toUpdate = {
                        count: payload.appointCount,
                        allotCount: payload.appointCount,
                    };
                } else {
                    toUpdate = {
                        allotCount: payload.appointCount,
                    };
                }
                const query = User.findByIdAndUpdate({ _id: id }, toUpdate);
                return resolve(query);
            } catch (err) {
                return reject(err);
            }
        });
    }
    async updatePriorityList(payload): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!payload) {
                    return reject({ code: 400, message: "Invalid Payload" });
                }
                if (payload.length) {
                    const promise = [];
                    for (let i = 0; i < payload.length; i++) {
                        if (payload[i]?.count === 0 || payload[i]?.count === undefined) {
                            let update = User.findOneAndUpdate(
                                { _id: payload[i]?.userId },
                                {
                                    priority: payload[i].priority,
                                    count: payload[i].allotCount,
                                    allotCount: payload[i].allotCount,
                                }
                            );
                            promise.push(update);
                        } else {
                            let update = User.findOneAndUpdate(
                                { _id: payload[i]?.userId },
                                {
                                    priority: payload[i].priority,
                                    allotCount: payload[i].allotCount,
                                }
                            );
                            promise.push(update);
                        }
                    }
                    Promise.all(promise)
                        .then((res) => {
                            return resolve(res);
                        })
                        .catch((err) => {
                            return reject(err);
                        });
                } else {
                    return reject({ code: 400, message: "Payload is empty." });
                }
            } catch (err) {
                return reject(err);
            }
        });
    }
    async updatePriorityUserLocation(data): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data) {
                    return reject({ message: 'Invalid Payload', code: 400 })
                }
                User.find({ roleId: { $ne: "6425796a73e386a02cb01199" }, available: true, locationId: data.locationId }).then((usr) => {
                    let priorities = usr.map((e) => e.priority);

                    User.findByIdAndUpdate({ _id: data.userId }, { available: true, count: 0, allotCount: 0, priority: Math.max(...priorities) + 1 }).then((update) => {
                        return resolve(update);
                    }).catch((err) => {
                        return reject(err);
                    })
                }).catch((err) => {
                    return reject(err);
                })
            } catch (err) {
                return reject(err);
            }
        });
    }
    async removeUserFromTheRotationList(data): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data) {
                    return reject({ message: 'Invalid Payload', code: 400 })
                }
                const update = await User.findByIdAndUpdate({ _id: data.userId }, { available: false, count: 0, allotCount: 0 })
                return resolve(update);
            } catch (err) {
                return reject(err);
            }
        });
    }
    async resetCount(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.find({});
                let promises = [];
                users.forEach((user) => {
                    let obj = user;
                    obj.count = obj.count + obj.allotCount > obj.allotCount ? obj.allotCount : obj.count + obj.allotCount;
                    const query = new User(obj).save();
                    promises.push(query);
                });
                Promise.all(promises)
                    .then(async (res) => {
                        const updatedUser = await User.find({});
                        return resolve(updatedUser);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            } catch (err) {
                return reject(err);
            }
        });
    }
}

export default new PriorityService();
