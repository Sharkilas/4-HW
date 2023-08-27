import { ObjectId } from "mongodb";
import { itemUserVievDBModel } from "../models/itemModels";
import { PaginationInputUserModel, PaginationOutputModel } from "../models/pagination.model";
import { userClientCollection } from "./db";



export const userRepository = {
    async getAllUser(Values: PaginationInputUserModel): Promise<PaginationOutputModel<itemUserVievDBModel>> {
        const filter = {}
        const users = await userClientCollection.find(filter, {projection: {_id: 0}})
                                     .sort({[Values.sortBy]: Values.sortDirection})
                                     .skip(Values.skip)
                                     .limit(Values.pageSize)
                                     .toArray()

const totalCount = await userClientCollection.countDocuments(filter)
const pagesCount = Math.ceil(totalCount / Values.pageSize)
return {
pagesCount,
page:	Values.pageNumber,
pageSize:	Values.pageSize,
totalCount,
items: users
}


        // у Димыча было в видео ТАк
        // return userClientCollection
        //     .find()
        //     .sort('createdAt', -1)
        //     .toArray()
    },

    async createUser(user: itemUserVievDBModel): Promise<itemUserVievDBModel> {
        const result = await userClientCollection.insertOne(user)
        return user
    },

    async findUserById(id :string):  Promise<itemUserVievDBModel| null> {     
    let user = await userClientCollection.findOne({id: id})
    if (user){
        return user
    } else {
        return null 
    }
    },

    async findByLoginOrEmail(loginOrEmail: string){
        const user = await userClientCollection.findOne({$or: [{email:loginOrEmail}, {userName: loginOrEmail}]})
        return user
    },
    
    async deleteUser(id: string):  Promise <boolean> {
        const result = await userClientCollection.deleteOne ({id: id}) 
        return  result.deletedCount === 1
      },  




}