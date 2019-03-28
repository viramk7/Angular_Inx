import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { MyProfileService } from './myProfile.service';
import { GroupCreateEditComponent } from '../group/groupCreateEdit/groupCreateEdit.component';
import { GroupService } from '../group/group.service';
import { UserModel } from '../../models/user.model';
import { GroupModel } from '../../models/group.model';
import { SharedService } from '../../shared/shared.service';
import { BadgesModel } from '../../models/badges.model';
import { PendingRequestModel } from '../../models/pendingRequest.model';
import { AcceptDeclineModel } from '../../models/acceptDecline.model';
import { MemberModel } from '../../models/member.model';
import { AddVoteComponent } from './vote/addVote.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

import { InsightService } from './insight.service';
import { AuthService } from '../../auth/auth.service';
import { InsightModel } from '../../models/insight.model';
import { StockService } from './stock.service';
import { StockModel } from '../../models/stock.model';
import { from } from 'rxjs/internal/observable/from';
import { InvitationStatus } from '../../enums/invitationStatus.enum';
import { JoinGroupComponent } from '../group/join-group/join-group.component';
import { VoteService } from '../myProfile/vote/vote.service';
import { VoteModel } from '../../models/vote.model';
import { BestVoteModel } from '../../models/bestVote.model';

@Component({
    selector: 'app-myProfile',
    templateUrl: './myProfile.component.html'
})
export class MyProfileComponent implements OnInit, OnDestroy {

    bsModalRef: BsModalRef;
    subscription = new Subscription();
    editProfileSubscription = new Subscription();
    joinGroupSubscription = new Subscription();
    confirmSubscription = new Subscription();
    addVoteSubscription = new Subscription();
    groups: GroupModel[] = [];
    groupData: any = {};
    userInfo: any = {};
    selectedGroupMember: MemberModel[];
    token: string;
    profileBadges: BadgesModel[] = [];
    groupBadges: BadgesModel[] = [];
    pendingRequests: PendingRequestModel[] = [];
    acceptDeclinedata: AcceptDeclineModel;
    managers: any[];
    votes: any = [];
    gameId: number;
    groupId: number;
    insightProfile: any;
    selectedGameType = 1; //Default Quarterly
    insightData: InsightModel[] = [];
    searchPharse: string;
    stockData: StockModel[] = [];
    isShowPopover: boolean = false;
    gameTypes = [
        { value: 1, viewValue: 'Quarterly Game Type' },
        { value: 2, viewValue: 'Annual Game Type    ' },
        { value: 3, viewValue: 'All-Time Game Type' },
    ];
    bestVote1: BestVoteModel[] = [];
    bestVote2: BestVoteModel[] = [];
    tempGroupId: any;
    selectedGroupId: number;
    user = new UserModel;
    userGroupVotes: VoteModel[] = [];

    constructor(private modalService: BsModalService,
        private sharedService: SharedService,
        private myProfileService: MyProfileService,
        private groupService: GroupService,
        private router: Router,
        private insightService: InsightService,
        private authService: AuthService,
        private stockService: StockService,
        private voteService: VoteService) {
    }

    ngOnInit() {
        this.userInfo = this.sharedService.getDecodedToken();
        this.onUserProfile();
        this.tempGroupId = localStorage.getItem('myProfileGroupId');
        this.selectedGroupId = parseInt(this.tempGroupId);
    }


    //user profile
    onUserProfile() {
        this.myProfileService.getUserProfile().subscribe((response: any) => {
            this.user = response;
            this.myProfileService.updateProfileImage(this.user.imageUrlMedium);
            this.onUserGroups().then((isGroupFound) => {
                //Get badges if user is member of any group
                if (isGroupFound) {
                    this.getBadgesOfUser({
                        groupId: this.groups[0].id, userName: this.userInfo["un"]
                    });
                }
            });
            //Calling this API on init because we need pending request coount
            this.getUserPendingRequest();
        });
    }

    //edit user profile
    onEditProfile(user) {
        const initialState = {
            user: user
        }
        this.bsModalRef = this.modalService.show(EditProfileComponent, { initialState, class: 'modal-sm' });
        this.editProfileSubscription = this.modalService.onHide.subscribe(data => {
            if (data == 'true') {
                this.myProfileService.getUserProfile().subscribe((response: UserModel) => {
                    // Update header's profile
                    this.user = response;
                    this.myProfileService.updateProfileImage(response.imageUrlMedium);

                })
            }
            this.editProfileSubscription.unsubscribe();
        });
    };

    //join group
    onJoinGroup() {
        this.bsModalRef = this.modalService.show(JoinGroupComponent, { class: 'modal-sm' });
        this.joinGroupSubscription = this.modalService.onHide.subscribe(data => {
            if (data == 'true') {
                this.getUserPendingRequest();
            }
            this.joinGroupSubscription.unsubscribe();
        });
    }

    //get gameId
    onGetGameId(id: number) {
        this.insightService.getGameId(id).subscribe((response: any) => {
            this.gameId = response;
            this.onGetInsightProfile(this.groupId, this.gameId);
            this.onGetUserGroupVote(this.groupId);
        });
    }

    //get insight profile detail
    onGetInsightProfile(groupId, gameId) {
        this.insightService.getInsightProfile(groupId, gameId).subscribe((response: any) => {
            this.insightProfile = response;
        })
    }

    //get user's groups
    onUserGroups(): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.groupService.getUserGroups().subscribe((response: any) => {
                this.groups = response;
                if (this.userInfo.man) {
                    this.managers = this.userInfo.man.split(',').map(Number);
                }
                if (this.groups.length > 0) {
                    this.tempGroupId = localStorage.getItem('myProfileGroupId');
                    this.selectedGroupId = parseInt(this.tempGroupId);
                    if (this.tempGroupId == null) {
                        this.onGroupDetail(this.groups[0].id);
                    } else {
                        this.onGroupDetail(this.selectedGroupId);
                    }
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    //group detail
    onGroupDetail(id: number) {
        this.tempGroupId = localStorage.setItem('myProfileGroupId', id.toString());
        let temp = this.groups.filter(group => group.id === id);
        this.groupId = id;
        this.groupData = temp[0];
        this.groupMember(this.groupId);
        this.onGetGameId(this.selectedGameType);
        // this.getGroupInsight(this.groupId);
    }

    //group members
    groupMember(groupId) {
        this.groupService.groupMembers(groupId).subscribe((response: any) => {
            this.selectedGroupMember = response;
        });
    }

    //create group
    onCreateGroup() {
        //this.updateJWTAndGroup();
        this.bsModalRef = this.modalService.show(GroupCreateEditComponent);
        this.subscription = this.modalService.onHide.subscribe((data: any) => {
            if (data == true) {
                this.onUserGroups();
            }
            this.subscription.unsubscribe();
        });
    }

    //update group
    onEditGroup(groupData: any) {
        let x = groupData;
        let copyGroupData = { ...x };
        const initialState = {
            group: copyGroupData,
        }
        this.bsModalRef = this.modalService.show(GroupCreateEditComponent, { initialState });
        this.subscription = this.modalService.onHide.subscribe(data => {
            if (data == 'true') {
                this.onUserGroups();
            }
            this.subscription.unsubscribe();
        });
    }

    //get badges of particular user
    getBadgesOfUser(badgesRequest) {
        this.myProfileService.getUserBadges(badgesRequest).subscribe((response: any) => {
            //Set over all profile badges
            this.profileBadges = response.filter((data) => {
                return !data.hasOwnProperty('groupId');
            });
            this.groupBadges = response.filter((data) => {
                return data.hasOwnProperty('groupId');
            });
        });
    }

    //get user pending request
    getUserPendingRequest() {
        this.myProfileService.getUserPendingRequest().subscribe((response: any) => {
            this.pendingRequests = response;
        });
    }

    onAcceptRequest(invitationId: number) {
        let acceptDeclinedata = { invitationId: invitationId, status: InvitationStatus.accepted };
        this.acceptOrRejectRequest(acceptDeclinedata, "Request accepted successfully!")
    }

    onDeclineRequest(invitationId: number) {
        let acceptDeclinedata = { invitationId: invitationId, status: InvitationStatus.rejectedByUser };
        const initialState = {
            title: "Are you sure you want to decline this request?"
        }
        this.bsModalRef = this.modalService.show(ConfirmationModalComponent, {
            initialState,
            class: 'modal-sm'
        });
        this.confirmSubscription = this.modalService.onHide.subscribe(data => {
            if (data == 'true') {
                this.acceptOrRejectRequest(acceptDeclinedata, "Request declined successfully!")
            }
            this.confirmSubscription.unsubscribe();
        });
    }

    onCancelRequest(invitationId: number) {
        let acceptDeclinedata = { invitationId: invitationId, status: InvitationStatus.expired };
        const initialState = {
            title: "Are you sure you want to cancel this request?"
        }
        this.bsModalRef = this.modalService.show(ConfirmationModalComponent, {
            initialState,
            class: 'modal-sm'
        });
        this.confirmSubscription = this.modalService.onHide.subscribe(data => {
            if (data == 'true') {
                this.acceptOrRejectRequest(acceptDeclinedata, "Request canceled successfully!")
            }
            this.confirmSubscription.unsubscribe();
        });
    }

    acceptOrRejectRequest(acceptDeclinedata, msg) {
        this.myProfileService.onRequestAcceptAndDecline(acceptDeclinedata).subscribe((response: any) => {
            this.sharedService.loggerSuccess(msg);
            this.onUserGroups().then();
            this.getUserPendingRequest();
        });
    }

    onAddVote() {
        // this.getSearchStock(this.searchPharse);
        let groupId = this.groupData.id
        const initialState = {
            groupId: groupId
        }
        this.bsModalRef = this.modalService.show(AddVoteComponent, { initialState });
        this.subscription = this.modalService.onHide.subscribe(data => {
            if (data == true) {
                //this.onUserGroups();
            }
            this.subscription.unsubscribe();
        });
    }

    onGetUserGroupVote(id: number) {
        this.groupId = id;
        this.voteService.getUserGroupVote(this.groupId).subscribe((response: any) => {
            this.userGroupVotes = response;
            for (let i = 0; i < this.userGroupVotes.length; i++) {
                let data = {
                    voteId: this.userGroupVotes[i].id,
                    groupId: this.groupId,
                    gameId: this.gameId
                }
                this.insightService.getMyVotes(data).subscribe((response: any) => {
                    this.userGroupVotes[i].voteDetail = response[0];
                });
            }
        });
    };

    insightUserImage1: any = [];
    getGroupInsight(groupId) {
        this.insightService.getInsight(groupId).subscribe((response: InsightModel[]) => {
            this.insightData = response;
            if (this.insightData.length > 0) {
                this.insightService.getBestVotes(this.groupId, this.insightData[0].tradeStrategyId, this.insightData[0].stockSectorId).subscribe((bestVoteResponse1: any[]) => {
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
                this.insightService.getBestVotes(this.groupId, this.insightData[1].tradeStrategyId, this.insightData[1].stockSectorId).subscribe((bestVoteResponse2: any[]) => {
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
    }

    //Other user profile
    onOtherUserProfile(memberId) {
        let groupId = this.groupData.id;
        this.router.navigate(['/main/otherUserProfile', groupId, memberId]);
    }

    //Updare JWT
    updateJWTAndGroup() {
        this.authService.refreshToken().subscribe((res: any) => {
            this.authService.setAuthToken(res);
            this.userInfo = this.sharedService.getDecodedToken();
            this.onUserGroups();
        });
    }

    //get stock data on searchPharse
    getSearchStock(searchPharse: string) {
        this.stockService.getSearchStock(searchPharse).subscribe((response: any) => {
            this.stockData = response[0];
            this.isShowPopover = true;
        });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.confirmSubscription.unsubscribe();
    }
}