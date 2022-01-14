const User = require("../models/user")
const { MSG_TYPES } = require('../constant/types');
const bcrypt = require('bcrypt');
const { GenerateCode, mailSender } = require('../utils/index')
const moment = require("moment");

const saltNumber = 10
class AuthService {

    /**
     * User Login
     * @param {Object} body request body object
    */
    static login(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ email: body.email });
                if (!user) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.ACCOUNT_INVALID })
                }

                if (!user.isVerified) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.ACCOUNT_NOTVERIFIED })
                }

                const validPassword = await bcrypt.compare(body.password, user.password)
                if (!validPassword) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.INVALID_PASSWORD })
                }

                const token = user.generateAuthToken();
                resolve({ token, user })
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    /**
     * Update User Password
     * @param {Object} body request body object
     * @param {Objec} user request body object
    */
    static updatedPassword(user, body) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(user, body)
                const currentUser = await User.findOne({
                    _id: user._id,
                    status: "active"
                })
                if (!currentUser) {
                    reject({ statusCode: 404, msg: MSG_TYPES.ACCOUNT_EXIST })
                }

                const validPassword = await bcrypt.compare(
                    body.oldPassword,
                    currentUser.password
                )
                if (!validPassword) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.ACCOUNT_INVALID });
                }

                const salt = await bcrypt.genSalt(saltNumber);
                const updatedPassword = await bcrypt.hash(body.newPassword, salt);

                const updateUser = await User.updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            password: updatedPassword,
                        },
                    }
                );
                resolve({ updateUser })
            } catch (error) {
                return reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error });
            }
        })
    }

    /**
     * Resend Link
     * @param {String} email 
     * @param {Objec} req 
    */
    static resendLink(email, req) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ email: email })
                if (!user) {
                    return reject({ statusCode: 401, msg: MSG_TYPES.NOT_FOUND })
                } else if (user.isVerified) {
                    return reject({ statusCode: 200, msg: MSG_TYPES.ACCOUNT_HASVERIFIED })
                }

                const token = GenerateCode(16);
                const expiredDate = moment().add(20, "minutes");

                const newToken = {
                    token: token,
                    expiredDate: expiredDate
                }

                const updateUser = await User.updateOne(
                    { email: email },
                    {
                        $set: {
                            rememberToken: newToken
                        }
                    }
                )
                let to = {
                    "Email": updateUser.email,
                    "Name": updateUser.name
                };
                let subject = "Account Verification Link"
                let textpart = "Please Click on verify your account"
                let HTMLPart = 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host +
                    '\/user\/confirmation\/' + updateUser.email + '\/' + updateUser.rememberToken.token + '\n\nThank You!\n';

                await mailSender(to, subject, textpart, HTMLPart)

                resolve({ msg: MSG_TYPES.SENT });
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    /**
     * Recover Password
     * @param {Object} user 
     * @param {Objec} req 
    */
    static recover(body, req) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(body.email)
                const user = await User.findOne({
                    email: body.email
                })
                if (!user) {
                    reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND });
                    return;
                }

                const token = GenerateCode(16);
                user.passwordRetrive.resetPasswordToken = token;
                user.passwordRetrive.resetPasswordExpires = moment().add(20, "minutes");

                let to = {
                    "Email": user.email,
                    "Name": user.name
                };
                let subject = "Reset Password Link"
                let textpart = "Please Click on reset your password"
                let HTMLPart = 'Hello ' + user.name + ',\n\n' + 'Please reset your password by clicking the link: \nhttp:\/\/' + req.headers.host +
                    '\/auth\/forgot\/' + user.email + '\/' + user.passwordRetrive.resetPasswordToken + '\n\nThank You!\n';

                await mailSender(to, subject, textpart, HTMLPart);

                await user.save();

                resolve({ user })
            } catch (error) {
                return reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error });
            }
        })
    }

    static reset(email, token) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentDate = new Date();

                const user = await User.findOne({
                    email: email,
                    "passwordRetrive.token": token,
                    "passwordRetrive.resetPasswordExpires": { $gte: currentDate },
                })

                if(!user){
                    return reject({statusCode:401, msg: MSG_TYPES.NOT_FOUND})
                }

                resolve({msg: 'Redirect to forgot password'})
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static resetPassword(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({
                    email: body.email,
                    "passwordRetrive.token": body.token,
                })

                if(!user){
                    return reject({statusCode:401, msg: MSG_TYPES.NOT_FOUND})
                }

                user.password = body.password;
                user.passwordRetrive = null

                user.save()
                resolve({user})
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }
}

module.exports = AuthService