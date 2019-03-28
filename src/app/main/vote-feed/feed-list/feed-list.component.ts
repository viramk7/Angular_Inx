import { Component, OnInit, Input } from '@angular/core';

import { FeedLikeEnum } from '../../../enums/FeedLike.enum';

import { GroupModel } from '../../../models/group.model';
import { FeedLikeModel } from '../../../models/feed-like.model';
import { FeedModel } from '../../../models/feed-list.model';
import { BadgesModel } from '../../../models/badges.model';

import { MyProfileService } from '../../myProfile/myProfile.service';
import { VoteFeedService } from '../vote-feed.service';
import { SharedService } from '../../../shared/shared.service';
import { GroupService } from '../../group/group.service';
import { UserModel } from '../../../models/user.model';

@Component({
    selector: 'app-feed-list',
    templateUrl: './feed-list.component.html'
})
export class FeedListComponent implements OnInit {

    @Input() selectedGroup = new GroupModel();
    feedListData = new Array<FeedModel>();
    userProfileBadges: BadgesModel[] = [];
    groupId: number;

    constructor(private sharedService: SharedService,
        private voteFeedService: VoteFeedService,
        private myProfileService: MyProfileService,
        private groupService: GroupService) { }

    ngOnInit() {

    }

    //list of all feeds
    onGetFeedList() {
        debugger
        let data = {
            id: this.selectedGroup.id,
            // maxNumberOfItems,
            // lastFeedId  
        }
        this.voteFeedService.getFeedList(data).subscribe((response: any) => {
            this.feedListData = response;
            let userIds = this.feedListData.map(a=>a.generatedByUserId);
            this.getUserDetails(userIds, this.selectedGroup.id);
            console.log(response)
        });
    };

    getUserDetails(userIds: Array<number>, groupId) {
        let data = {
            groupId: groupId,
            memberIds: userIds,
            take: userIds.length
        };
        this.groupService.getUserProfiles(data).subscribe((data: Array<UserModel>)=>{
            data.forEach(user => {
                let userIndex = this.feedListData.findIndex(a => a.generatedByUserId == user.id);
                this.feedListData[userIndex].userDetail = user;
            });
        })
    }

    //reply feed(comments)
    onCommentFeed(feed: FeedModel) {
        let data = {
            id: this.selectedGroup.id,
            feedMessageId: feed.id,
            content: feed.newComment
        }
        this.voteFeedService.commentFeed(data).subscribe((response: any) => {
            //any
            debugger
        });
    };

    likeVoteFeed(isLike, feedId) {
        let data: FeedLikeModel = {
            groupId: this.selectedGroup.id,
            feedMessageId: feedId,
            type: isLike == true ? FeedLikeEnum.like : FeedLikeEnum.dislike
        }
        let msg = isLike == true ? "Post liked successfully!" : "Post disliked successfully!";

        this.voteFeedService.likeDislikeVoteFeed(data).subscribe(() => {
            this.sharedService.loggerSuccess(msg);
            //TODO: Refresh like or dislike count
        })
    }

    //for inappropriate
    onIninappropriate(feedItemId) {
        this.groupId = this.selectedGroup.id;
        this.voteFeedService.ininappropriateFeed(this.groupId, feedItemId).subscribe((response: any) => {
            //any
            this.sharedService.loggerSuccess('Marked ininappropriate successfuly!');
        });
    };

    //reply feed
    onRepyFeedMessage() {
        let data = {
            // feedListData
        }
        this.voteFeedService.replyFeed(data).subscribe((response: any) => {
            //any
        });
    }

    //get badges of particular user
    getBadgesOfUser(badgesRequest) {
        this.myProfileService.getUserBadges(badgesRequest).subscribe((response: any) => {
            this.userProfileBadges = response.filter((data) => {
                return !data.hasOwnProperty('groupId');
            });
            // this.groupBadges = response.filter((data) => {
            //     return data.hasOwnProperty('groupId');
            // });
        });
    };

    cancelComment(feedData: FeedModel) {
        feedData.isShowComment = false;
        feedData.newComment = null;
    }

    showComment(feedData: FeedModel) {
        feedData.isShowComment = true;
    }


    getReplies(feed: FeedModel) {
        //Todo: implement infinite scroll
        let data = {
            groupId: this.selectedGroup.id,
            maxResults: 100,
            feedMessageId: feed.id
        }
        this.voteFeedService.replyFeed(data).subscribe((response: any) => {
            debugger
        })
    }

}