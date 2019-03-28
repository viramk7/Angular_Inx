import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from 'lodash';

import { MemberModel } from "../../models/member.model";
import { GroupService } from "../group/group.service";
import { GroupModel } from "../../models/group.model";
import { InsightService } from "../myProfile/insight.service";
import { InsightModel } from "../../models/insight.model";
import { StockService } from '../myProfile/stock.service';
import { StockModel } from '../../models/stock.model';
import { MyProfileService } from '../myProfile/myProfile.service';
import { BadgesModel } from '../../models/badges.model';
import { VoteService } from '../../main/myProfile/vote/vote.service';
import { VoteModel } from '../../models/vote.model';

@Component({
    selector: 'app-otherUserProfile',
    templateUrl: './otherUserProfile.component.html'
})
export class OtherUserProfileComponent implements OnInit {
    @ViewChild('usefulSwiper') usefulSwiper;
    otherUsersProfiles: MemberModel[] = [];
    groupId: any;
    memberId: number;
    groups: GroupModel[];
    selected;
    initialIndex: number
    config: SwiperOptions = {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 30,
        onSlideChangeStart: this.onSlideChangeStart.bind(this)
    };
    isShowSlider: boolean = false;
    gameId: any;
    selectedGameType = 1; //Default Quarterly
    gameTypes = [
        { value: 1, viewValue: 'Quarterly Game Type' },
        { value: 2, viewValue: 'Annual Game Type    ' },
        { value: 3, viewValue: 'All-Time Game Type' },
    ];
    insightProfile: any;
    votes: any = [];
    bestVote1: any[] = [];
    bestVote2: any[] = [];
    insightData: InsightModel[] = [];
    groupData: GroupModel;
    stockData: StockModel[] = [];
    isShowPopover: boolean = false;
    profileBadges: BadgesModel[] = [];
    groupBadges: BadgesModel[] = [];
    otherUserVotes: VoteModel[] = [];
    otherUserName: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private groupService: GroupService,
        private insightService: InsightService,
        private myProfileService: MyProfileService,
        private stockService: StockService,
        private voteService: VoteService) {

    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.groupId = params.groupId;
            this.memberId = params.memberId;
        });
        this.groupMembers(this.groupId);
    }

    onSlideChangeStart(event: Swiper) {
        this.memberId = this.otherUsersProfiles[event.activeIndex].id;
        this.otherUserName = this.otherUsersProfiles[event.activeIndex].userName;
        this.onGetGameId();
        this.getBadgesOfGroup({
            groupId: this.groupId, userName: this.otherUserName
        });
        console.log(this.otherUserName);
    }

    //get other user profile's group name
    getGroupDetails() {
        this.groupService.getUserGroups().subscribe((response: GroupModel[]) => {
            this.groupData = response.find(group => group.id == this.groupId);
        });
    }

    //get members
    groupMembers(groupId) {
        this.groupService.groupMembers(groupId).subscribe((response: any) => {
            this.otherUsersProfiles = response;
            if (this.otherUsersProfiles) {
                this.getIndex();
            }
            this.getGroupDetails();
        });
    }

    //for getting index of user
    getIndex() {
        this.initialIndex = _.findIndex(this.otherUsersProfiles, (index) => {
            return index.id == this.memberId;
        });
        if (this.initialIndex >= 0) {
            this.isShowSlider = true;
            this.setSliderIndex();
        }
        //Get data if slider is set to first item
        if (this.initialIndex == 0) {
            this.onGetGameId();
        }
    }

    setSliderIndex() {
        setTimeout(() => {
            this.usefulSwiper.swiper.slideTo(this.initialIndex);
        }, 0);
    }

    backToProfile() {
        this.router.navigate(['/main/myProfile']);
    }

    onGetGameId() {
        this.insightService.getGameId(this.selectedGameType).subscribe((response: any) => {
            this.gameId = response;
            this.onGetInsightProfile();
            this.getGroupInsight();
            this.onGetOtherUserGroupVote();
        });
    }

    onGetInsightProfile() {
        let data = {
            gameId: this.gameId,
            userId: this.memberId
        }
        this.insightService.getOtherUserInsightProile(this.groupId, data).subscribe((response: any) => {
            this.insightProfile = response;
        })
    }

    //get other user vote for specified group
    onGetOtherUserGroupVote() {
        this.voteService.getOtherUserGroupVote(this.groupId, this.memberId).subscribe((response: any) => {
            this.otherUserVotes = response;
            for (let i = 0; i < this.otherUserVotes.length; i++) {
                let data = {
                    voteId: this.otherUserVotes[i].id,
                    groupId: this.groupId,
                    gameId: this.gameId
                }
                this.insightService.getMyVotes(data).subscribe((response: any) => {
                    this.otherUserVotes[i].voteDetail = response[0];
                });
            }
        });
    }

    //get stock data on searchPharse
    getSearchStock(searchPharse: string) {
        this.stockService.getSearchStock(searchPharse).subscribe((response: any) => {
            this.stockData = response[0];
            this.isShowPopover = true;
        });
    }

    //other user best votes
    getGroupInsight() {
        this.insightService.getOtherUserInsight(this.groupId, this.memberId).subscribe((response: InsightModel[]) => {
            this.insightData = response;
            if (this.insightData.length > 0) {
                let data1 = {
                    userId: this.memberId,
                    tradeStrategyId: this.insightData[0].tradeStrategyId,
                    stockSectorId: this.insightData[0].stockSectorId
                }
                this.insightService.getBestVotesOtherUser(this.groupId, data1).subscribe((bestVoteResponse1: any[]) => {
                    this.bestVote1 = bestVoteResponse1;
                    let len1: any = [];
                    let dataImage1 = {
                        groupId: this.groupId,
                        memberIds: [],
                        take: 10,
                        lastId: 0
                    }
                    for (let i = 0; i < this.bestVote1.length; i++) {
                        len1[i] = this.bestVote1[i].userId;
                        dataImage1.memberIds.push(len1[i]);
                    }
                    this.groupService.getUserProfiles(dataImage1).subscribe((response: any) => {
                        for (let i = 0; i < this.bestVote1.length; i++) {
                            this.bestVote1[i].userDetail = response[0];
                        }
                    });
                });
                let data2 = {
                    userId: this.memberId,
                    tradeStrategyId: this.insightData[1].tradeStrategyId,
                    stockSectorId: this.insightData[1].stockSectorId
                }
                this.insightService.getBestVotesOtherUser(this.groupId, data2).subscribe((bestVoteResponse2: any[]) => {
                    this.bestVote2 = bestVoteResponse2;
                    let len2: any = [];
                    let dataImage2 = {
                        groupId: this.groupId,
                        memberIds: [],
                        take: 10,
                        lastId: 0
                    }
                    for (let i = 0; i < this.bestVote2.length; i++) {
                        len2[i] = this.bestVote2[i].userId;
                        dataImage2.memberIds.push(len2[i]);
                    }
                    this.groupService.getUserProfiles(dataImage2).subscribe((response: any) => {
                        for (let i = 0; i < this.bestVote2.length; i++) {
                            this.bestVote2[i].userDetail = response[0];
                        }
                    });
                });
            }
        });
    };


    //get badges of particular group
    getBadgesOfGroup(badgesRequest) {
        this.myProfileService.getUserBadges(badgesRequest).subscribe((response: any) => {
            this.groupBadges = response;
        });
    };

}


