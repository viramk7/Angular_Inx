import { UserModel } from "./user.model";

export class InviteModel {
    id: number
    userId: number
    groupId: number
    status: string
    message: string
    createdUtcTimestamp: string
    emails:Array<string>
    userDetail?: UserModel
}