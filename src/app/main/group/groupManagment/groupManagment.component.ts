import { Component, OnInit, OnDestroy } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";


import { GroupService } from "../group.service";
import { GroupModel } from "../../../models/group.model";
import { SharedService } from "../../../shared/shared.service";
import { InviteModel } from "../../../models/invite.model";
import { InviteUserComponent } from "../inviteUser/inviteUser.component";
import { Subscription } from "rxjs";
import { MemberModel } from "../../../models/member.model";
import { Router } from "@angular/router";
import { GroupCreateEditComponent } from "../groupCreateEdit/groupCreateEdit.component";
import { ConfirmationModalComponent } from "../../../shared/confirmation-modal/confirmation.component";
import { MyProfileService } from '../../myProfile/myProfile.service';
import { AcceptDeclineModel } from '../../../models/acceptDecline.model';
import { UserModel } from "../../../models/user.model";
import { InvitationStatus } from "../../../enums/invitationStatus.enum";


@Component({
    templateUrl: './groupManagment.component.html'
})
export class GroupManagmentComponent implements OnInit, OnDestroy {
    groups: GroupModel[] = [];
    groupsManager: GroupModel[] = [];
    managers: any[] = [];
    userInfo: any = {};
    selectedGroup = new GroupModel();
    applicationList: InviteModel[] = [];
    bsModalRef: BsModalRef;
    subscription = new Subscription();
    editGroupSubscription = new Subscription();
    confirmSubscription = new Subscription();
    membersList: MemberModel[] = [];
    acceptDeclinedata: AcceptDeclineModel;
    isInvitationFound: boolean = false;
    isApplicationFound: boolean = false;

    constructor(
        private router: Router,
        private groupService: GroupService,
        private sharedService: SharedService,
        private modalService: BsModalService,
        private myProfileService: MyProfileService) { }
    ngOnInit() {
        this.userInfo = this.sharedService.getDecodedToken();
        this.getGroupWithmanagerRight();
        this.getUserGroups();
    }

    private getGroupWithmanagerRight() {
        this.managers = this.userInfo.man.split(',').map(Number);
    }

    //get user group for manager
    getUserGroups() {
        this.groupService.getUserGroups().subscribe((response: Array<GroupModel>) => {
            this.groups = response.filter(group => {
                return this.managers.includes(group.id);
            });
            this.selectedGroup = this.groups[0];
            this.getApplication();
            this.groupMember();
        });

    }

    onSelectGroup(index) {
        this.selectedGroup = this.groups[index];
        this.getApplication();
        this.groupMember();
    }

    getApplication() {
        this.groupService.getGroupApplication(this.selectedGroup.id).subscribe((applications: InviteModel[]) => {
            this.applicationList = applications;
            this.setUserName();
        })
    }

    setUserName() {
        let userIds = this.applicationList.map(a => a.userId);
        this.isInvitationFound = this.applicationList.findIndex(a => a.status == 'Issued') == -1 ? false : true;
        this.isApplicationFound = this.applicationList.findIndex(a => a.status == 'Applied') == -1 ? false : true;
        if (userIds.length > 0) {
            let model = {
                groupId: this.selectedGroup.id,
                memberIds: userIds,
                take: userIds.length
            }
            this.groupService.getUserProfiles(model).subscribe((data: Array<UserModel>) => {
                data.forEach(user => {
                    let userIndex = this.applicationList.findIndex(a => a.userId == user.id);
                    this.applicationList[userIndex].userDetail = user;
                });
            });
        }
    }

    inviteUser() {
        let groupId = this.selectedGroup.id;
        const initialState = {
            groupId: groupId
        }
        this.bsModalRef = this.modalService.show(InviteUserComponent, { initialState });
        this.subscription = this.modalService.onHide.subscribe(data => {
            if (data == 'true') {
                this.getApplication();
            }
            this.subscription.unsubscribe();
        });
    }

    groupMember() {
        this.groupService.groupMembers(this.selectedGroup.id).subscribe((response: any) => {
            this.membersList = response;
        });
    }

    //Other user profile
    onOtherUserProfile(memberId) {
        this.router.navigate(['/main/otherUserProfile', this.selectedGroup.id, memberId]);
    }

    //update group
    onEditGroup() {
        const initialState = {
            group: { ...this.selectedGroup }
        }
        this.bsModalRef = this.modalService.show(GroupCreateEditComponent, { initialState });
        this.editGroupSubscription = this.modalService.onHide.subscribe(data => {
            if (data == 'true') {
                this.getUserGroups();
            }
            this.editGroupSubscription.unsubscribe();
        });
    }

    //Kick user form group
    removeUserFromGroup(userName) {
        const initialState = {
            title: "Are you sure you want to remove user from this group?"
        }
        this.bsModalRef = this.modalService.show(ConfirmationModalComponent, {
            initialState,
            class: 'modal-sm'
        });
        this.confirmSubscription = this.modalService.onHide.subscribe(data => {
            if (data == 'true') {
                let data = {
                    userName: userName,
                    groupId: this.selectedGroup.id
                }
                this.groupService.kickFromGroup(data).subscribe((response) => {
                    this.groupMember();
                    this.sharedService.loggerSuccess("User removed from group successfully!");
                })
            }
            this.confirmSubscription.unsubscribe();
        });

    }

    onAcceptRequest(id) {
        let acceptDeclinedata = {
            invitationId: id, status: InvitationStatus.accepted,
            groupId: this.selectedGroup.id
        };
        this.groupService.groupApplication(acceptDeclinedata).subscribe((response: any) => {
            this.sharedService.loggerSuccess("Request accepted successfully!");
            this.getApplication();
            this.groupMember();
        });
    }

    onCancelRequest(id) {
        let acceptDeclinedata = {
            invitationId: id,
            status: InvitationStatus.expired,
            groupId: this.selectedGroup.id
        };
        const initialState = {
            title: "Are you sure you want to cancel this request?"
        }
        this.bsModalRef = this.modalService.show(ConfirmationModalComponent, {
            initialState,
            class: 'modal-sm'
        });
        this.confirmSubscription = this.modalService.onHide.subscribe(data => {
            if (data == 'true') {
                this.groupService.groupApplication(acceptDeclinedata).subscribe((response: any) => {
                    this.sharedService.loggerSuccess("Request canceled successfully!");
                    this.getApplication();
                });
            }
            this.confirmSubscription.unsubscribe();
        });
    }

    onDeclineRequest(id) {
        let acceptDeclinedata = {
            invitationId: id,
            status: InvitationStatus.rejectedByGroup,
            groupId: this.selectedGroup.id
        };
        const initialState = {
            title: "Are you sure you want to decline this request?",
            isShowInput: true
        }
        this.bsModalRef = this.modalService.show(ConfirmationModalComponent, {
            initialState,
            class: 'modal-sm'
        });
        this.confirmSubscription = this.modalService.onHide.subscribe(data => {
            if (data) {
                let parsedData = JSON.parse(data);
                if (parsedData.isAction == true) {
                    acceptDeclinedata["comments"] = parsedData.reason;
                    this.groupService.groupApplication(acceptDeclinedata).subscribe((response: any) => {
                        this.sharedService.loggerSuccess("Request declined successfully!")
                        this.getApplication();
                    });
                }

            }
            this.confirmSubscription.unsubscribe();
        });
    }

    //back to myprofile page
    backToMyProfile() {
        this.router.navigate(['/main/myProfile']);
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.editGroupSubscription.unsubscribe();
        this.confirmSubscription.unsubscribe();
    }

}