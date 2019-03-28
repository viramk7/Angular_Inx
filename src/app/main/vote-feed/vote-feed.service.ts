import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppConstant } from "../../app.constant";
import { FeedLikeModel } from "../../models/feed-like.model";

@Injectable({
    providedIn: 'root'
})
export class VoteFeedService {

    url: string;

    constructor(private http: HttpClient) {
        this.url = AppConstant.Base_URL;
    }

    //get particular stock data
    likeDislikeVoteFeed(data: FeedLikeModel) {
        return this.http.post(this.url + 'feeds/likes', data);
    }

    //for feed comment
    commentFeed(data: any) {
        return this.http.post(this.url + 'feeds/replies',data);
    }

    //for ininappropriate feed
    ininappropriateFeed(groupId: number, feedItemId: number) {
        return this.http.get(this.url + 'groups/' + groupId + '/feeds/' + feedItemId + '/flag');
    }

    //get feed list
    getFeedList(feedList: any) {
        return this.http.post(this.url + 'feeds', feedList);
    }

    //reply feed message
    replyFeed(data: any){
        return this.http.post(this.url+'feeds/replies/fetch',data);
    }

}