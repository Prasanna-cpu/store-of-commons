import {UserRole} from "../types/UserRole";
import {StreamChat} from "stream-chat";

export function streamChatDisplayName(role : UserRole, displayName : string | null, email : string){
    const base = displayName ?? email.split("@")[0]
    if (role === "admin") return `Admin . ${base}`
    if (role === "support") return `User . ${base}`
    return base
}

export function getStreamChatServer(){
    return StreamChat.getInstance(process.env.STREAM_API_KEY as string, process.env.STREAM_API_SECRET as string)
}

export function streamUserId(clerkUserId){
    return `clerk_${clerkUserId}`;
}