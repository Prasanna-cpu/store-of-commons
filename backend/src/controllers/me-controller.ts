import {NextFunction, Response, Request} from "express";
import {getAuth} from "@clerk/express";
import {getUserById} from "../crud-operations/users";

export async function getMe(req : Request, res : Response, next : NextFunction) {
    try{
        const {userId, isAuthenticated} = getAuth(req)

        if (!isAuthenticated || !userId){
            return res.status(401).json({
                message : "Unauthorized",
                statusCode : res.statusCode
            })
        }

        const user = await getUserById(userId)

        return res.json({
            message : "User found",
            statusCode : res.statusCode,
            data : {
                user : user
            }
        })

    }
    catch (e) {
        //
        next(e)
    }
}