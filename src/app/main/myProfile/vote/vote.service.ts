import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppConstant } from "../../../app.constant";

@Injectable()
export class VoteService {

    url: string;

    constructor(private http: HttpClient) {
        this.url = AppConstant.Base_URL + 'votes';
    }

    //add vote
    addVote(voteData) {
        return this.http.post(this.url, voteData);
    }

    //get active votes by user for specified group
    getUserGroupVote(groupId: number) {
        return this.http.get(this.url + '/' + groupId);
    }

    //get active votes of other user for specified group
    getOtherUserGroupVote(groupId: number, userId: number) {
        return this.http.get(this.url + '/' + groupId + '/' + userId);
    }

}