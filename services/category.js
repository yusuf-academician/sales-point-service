const Category = require('../models/category');
const { MSG_TYPES } = require('../constant/types');


class CategoryService {

    static create(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const category = await Category.findOne({
                    user: body.user,
                    category: body.category
                })

                if(category){
                    reject({ statusCode: 404, msg: MSG_TYPES.EXIST });
                    return;
                }

                const newCategory = new Category(body)
                await newCategory.save()

                resolve(newCategory)
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static getCategory(filter){
        return new Promise(async (resolve, reject) => {
            try {
                const category  = await Category.findOne(filter);

                if (!category) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                resolve(category) 
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static getCategories(skip, pageSize, filter = {}){
        return new Promise(async (resolve, reject) => {
            try {
                const categories = await Category.find(filter)

                const total = await Category.find(filter).countDocuments()

                resolve({ categories, total })
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static updateCategory(categoryId, categoryObject){
        return new Promise(async (resolve, reject) => {
            try {
                const category = await Category.findById(categoryId)
                if (!category) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                await category.updateOne(
                    {
                        $set: categoryObject
                    }
                )

                resolve(category)
            } catch (error) {
                reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error })
            }
        })
    }

    static deleteCategory(user, categoryId){
        return new Promise(async (resolve, reject) => {
            try {
                const category = await Category.findOne({
                    user: user._id,
                    _id: categoryId
                })
                if (!category) {
                    return reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND })
                }

                await category.delete();

                resolve({ msg: MSG_TYPES.DELETED })
            } catch (error) {

            }
        })
    }
}

module.exports = CategoryService