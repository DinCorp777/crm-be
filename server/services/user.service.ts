import { User } from "../models";

export class UserService {
    // Function for getting the user
    public getUsers(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let [user] = await User.find({ _id: id });
                return resolve(user);
            } catch (err) {
                return reject(err);
            }
        });
    }

    public async getManager(lId) {
        const [manager] = await User.find({ roleId: "6425793d73e386a02cb01189", locationId: lId });
        return manager;
    }
}

export default new UserService();
