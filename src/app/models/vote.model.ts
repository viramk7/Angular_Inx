export class VoteModel{
    id: number;
    groupId:number;
    symbol: string;
    exchange:string;
    type: string;
    comments:string;
    name: string;
    voteDetail?: any = {};
}