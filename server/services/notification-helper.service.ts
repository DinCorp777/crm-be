import { Notification, Roles, User } from "../models";

export class NotificationHelperService {

    createNotification(payload, user) {
        return new Promise(async (resolve, reject) => {
            try {
                if (payload?.sender && payload?.sender?.trim().toLowerCase() == "system") {
                    payload.sender = "SYSTEM";
                } else {
                    payload.sender = {
                        userId: user._id,
                        name: user.username,
                        avatar: user.profilePicture,
                    };
                }

                let notificationsPromise = [];

                if (payload?.sendTo && payload?.sendTo?.trim().toLowerCase() === 'all') {
                    const promise = new Notification({
                        message: payload?.message,
                        type: payload?.type,
                        link: payload?.link,
                        recep: 'all',
                        leadId: payload?.leadId,
                        frequency: payload?.frequency,
                        sendTo: payload?.sendTo,
                        sender: payload?.sender,
                        dismissed: false,
                        startDate: payload?.startDate,
                        endDate: payload?.endDate
                    }).save();
                    notificationsPromise.push(promise);
                }
                if (payload?.sendTo && payload?.sendTo?.trim().toLowerCase() === 'role') {
                    let [role] = await Roles.find({ _id: payload?.recep })
                    const promise = new Notification({
                        message: payload?.message,
                        type: payload?.type,
                        link: payload?.link,
                        recep: role?._id,
                        leadId: payload?.leadId,
                        frequency: payload?.frequency,
                        sendTo: payload?.sendTo,
                        sender: payload?.sender,
                        dismissed: false,
                        startDate: payload?.startDate,
                        endDate: payload?.endDate
                    }).save();
                    notificationsPromise.push(promise);

                }
                if (payload?.sendTo && payload?.sendTo?.trim().toLowerCase() === 'user') {
                    let user;
                    if (payload?.recep) {
                        user = await User.find({ _id: payload?.recep });
                    }
                    const promise = new Notification({
                        message: payload?.message,
                        type: payload?.type,
                        link: payload?.link,
                        recep: user?._id,
                        leadId: payload?.leadId,
                        frequency: payload?.frequency,
                        sendTo: payload?.sendTo,
                        sender: payload?.sender,
                        dismissed: false,
                        startDate: payload?.startDate,
                        endDate: payload?.endDate
                    }).save();
                    notificationsPromise.push(promise);
                }

                Promise.all(notificationsPromise).then((res) => {
                    return resolve(res);
                }).catch((err) => {
                    return reject(err);
                })
            } catch (err) {
                return reject(err);
            }
        })
    }
}

export default new NotificationHelperService();