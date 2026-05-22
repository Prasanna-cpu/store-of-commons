import {NextFunction, Request, Response} from "express";
import {clerkClient, getAuth} from "@clerk/express";
import {getUserById} from "../crud-operations/users";
import {getStreamChatServer, streamChatDisplayName, streamUserId} from "../stream/stream";

export async function createStreamToken(req : Request, res : Response, next : NextFunction){
    try{

        const {userId, isAuthenticated} = getAuth(req)
        if (!isAuthenticated || !userId){
            return res.status(401).json({
                message : "Unauthorized",
                statusCode : res.statusCode
            })
        }

        const [localUser] = await getUserById(userId)

        if (!localUser){
            return res.status(503).json({
                message : "Account Not Synced Yet",
                statusCode : res.statusCode
            })
        }

        const server = getStreamChatServer()

        const clerkUser = await clerkClient.users.getUser(userId)

        const combinedName  = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || undefined;

        const name = streamChatDisplayName(localUser.role
            , localUser.displayName ?? combinedName ?? clerkUser.username
            , localUser.email)

        const image = clerkUser.imageUrl || undefined
        const sid = streamUserId(userId)

        await server.upsertUser({
            id : sid,
            name,
            image
        })

        const token = server.createToken(sid)

        return res.status(200).json({
            message : "Token created",
            statusCode : res.statusCode,
            data : {
                token : token
            }
        })

    }

    catch (e) {
        next(e)
    }
}
