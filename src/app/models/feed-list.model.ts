import { FeedItemEnum } from "../enums/FeedItem.enum";
import { UserModel } from "./user.model";

export class FeedModel {
    id: number;
    userId: number;
    groupId: number;
    feedType: FeedItemEnum;
    createdUtcTimestamp: any;
    isDeleted: boolean;
    generatedByUserId: number;
    isFlagged: boolean;
    feedData: {};
    hostName: string;
    likes: number;
    dislikes: number;
    newComment?: string;
    isShowComment?: boolean;
    userDetail?: UserModel
}