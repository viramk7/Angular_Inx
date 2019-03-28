export class PendingRequestModel{
    id: number;
    userId: number;
    groupId: number;
    status: number;
    message: string;
    createdUtcTimestamp: string;
    groupName: string;
    groupImageUrl:string;
}