const User = require("../models/user")
const { MSG_TYPES } = require('../constant/types');
const { mailSender, GenerateCode } = require('../utils/index');
const moment = require("moment");

class UserService {

    /**
     * Create User 
     * @param {Object} body request body object
    */
    static create(body, req) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({
                    email: body.email
                })

                if (user) {
                    reject({ statusCode: 404, msg: MSG_TYPES.ACCOUNT_EXIST });
                    return;
                }

                const newUser = new User(body);
                newUser.email.toLowerCase();

                const token = GenerateCode(16);
                newUser.rememberToken.token = token;
                newUser.rememberToken.expiredDate = moment().add(20, "minutes");

                //email verification link
                let to = {
                    "Email": newUser.email,
                    "Name": newUser.name
                };
                let subject = "Account Verification Link"
                let textpart = "Please Click on verify your account"
                let HTMLPart = 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host +
                    '\/user\/confirmation\/' + newUser.email + '\/' + newUser.rememberToken.token + '\n\nThank You!\n';

                await mailSender(to, subject, textpart, HTMLPart);

                await newUser.save();

                resolve(newUser)
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static confirmEmail(email, token) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentDate = new Date();

                const user = await User.findOne({
                    email: email,
                    "rememberToken.token": token,
                    "rememberToken.expiredDate": { $gte: currentDate },
                })
                if (!user) {
                    return reject({ statusCode: 401, msg: MSG_TYPES.NOT_FOUND })
                }

                user.isVerified = true;
                user.rememberToken = null
                user.save();

                resolve({ msg: MSG_TYPES.ACCOUNT_VERIFIED });
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }


    /**
     * Get Users 
     * @param {Number} skip skip
     * @param {Number} pageSize page size
     * @param {Object} filter filter
    */
    static getAllUser(skip, pageSize, filter = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.find(filter)
                    .skip(skip).limit(pageSize)

                const total = await User.find(filter).countDocuments()

                resolve({ users, total })
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    /**
     * Get User 
     * @param {Object} filter filter
    */
    static getUser(filter) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne(filter);

                if (!user) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }
                if (user.status === "terminated") {
                    return reject({ statusCode: 200, mgs: MSG_TYPES.ACCOUNT_UNVERIFIED })
                }

                resolve(user)
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    /**
     * Update Users 
     * @param {object} userId user's id
     * @param {Object} userObject updated details
    */
    static update(userId, userObject) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findById(userId)
                if (!user) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                await user.updateOne(
                    {
                        $set: userObject
                    }
                )

                await this.calculateBMI(userId);

                resolve(user)
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static calculateBMI(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findById(userId)

                if (user.currentWeight && user.currentHeight) {
                    const heightConversion = this.unitConversions(user.heightUnit);
                    const weightConversion = this.unitConversions(user.weightUnit);
                    
                    let currentBMI = (user.currentWeight*weightConversion) / (user.currentHeight*heightConversion) * (user.currentHeight*heightConversion)
                    let currentBMICategory = this.returnCategoryBMI(currentBMI)
                    await user.updateOne(
                        {
                            $set: {
                                currentBMI: currentBMI,
                                currentBMICategory: currentBMICategory
                            }
                        }
                    );
                }

                if (user.targetWeight && user.targetHeight) {
                    const heightConversion = this.unitConversions(user.heightUnit);
                    const weightConversion = this.unitConversions(user.weightUnit);

                    let targetBMI = (user.targetWeight*weightConversion) / (user.targetHeight*heightConversion) * (user.targetHeight*heightConversion);
                    let targetBMICategory = this.returnCategoryBMI(targetBMI);

                    await user.updateOne(
                        {
                            $set: {
                                targetBMI: targetBMI,
                                targetBMICategory: targetBMICategory
                            }
                        }
                    );
                }

                resolve(user)
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static returnCategoryBMI(BMI) {
        let categoryBMI = ""
        if (BMI < 18.5) {
            categoryBMI = 'UnderWeight'
        } else if (BMI > 18.5 && BMI < 24.9) {
            categoryBMI = 'Normal'
        } else if (BMI > 25 && BMI < 29.9) {
            categoryBMI = 'OverWeight'
        } else {
            categoryBMI = 'Obese'
        }

        return categoryBMI
    }

    static unitConversions(unit){
        let conversion = 0;
        if (unit === 'm' || unit === 'kg'){
            conversion = 1;
        }else if (unit === 'ft'){
            conversion = 0.3048
        }else if (unit === 'cm'){
            conversion = 0.01
        }else if(unit == 'g'){
            conversion = 0.001;
        }else if(unit == 'lbs'){
            conversion = 0.454;
        }else{
            'invalid Unit'
        }
        return conversion;
    }

    /**
     * Terminate User 
     * @param {Object} user user
    */
    static terminateMe(user) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentUser = await User.findOne({
                    _id: user._id,
                    status: "active"
                })
                if (!currentUser) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                currentUser.status = "terminated";
                await currentUser.save();

                resolve({ msg: MSG_TYPES.DELETED })
            } catch (error) {
                return reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error });
            }
        })
    }
}

module.exports = UserService