import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { GroupModel } from '../../models/group.model';
import { UserModel } from '../../models/user.model';
import { MemberModel } from '../../models/member.model';
import { GroupService } from '../group/group.service';
import { MyProfileService } from '../myProfile/myProfile.service';
import { SharedService } from '../../shared/shared.service';
import { InviteUserComponent } from '../group/inviteUser/inviteUser.component';
import { GroupCreateEditComponent } from '../group/groupCreateEdit/groupCreateEdit.component';
import { FeedListComponent } from './feed-list/feed-list.component';

@Component({
  templateUrl: './vote-feed.component.html'
})


export class VoteFeedComponent implements OnInit, OnDestroy {
  @ViewChild('appFeedList') feedListComponent: FeedListComponent;
  user = new UserModel();
  groups: GroupModel[] = [];
  selectedGroup = new GroupModel();
  selectedGroupMember: MemberModel[];
  managers: MemberModel[] = [];
  man: any[];
  tempIndex: any;
  selectedIndex: number;
  config: SwiperOptions = {
    slidesPerView: 4,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 0,
    breakpoints: {
      1023: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      767: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  };
  isShowSlider: boolean = true;
  index: number;
  bsModalRef: BsModalRef;
  userInfo: any = {};
  inviteSubscription = new Subscription();
  groupEditSubscription = new Subscription();

  constructor(private router: Router,
    private modalService: BsModalService,
    private groupService: GroupService,
    private myProfileService: MyProfileService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.userInfo = this.sharedService.getDecodedToken();
    this.getUser();
  }

  getGroups() {
    this.groupService.getUserGroups().subscribe((response: any) => {
      this.groups = response;
      if (this.userInfo.man) {
        this.man = this.userInfo.man.split(',').map(Number);
      }
      if (this.groups.length > 0) {
        this.tempIndex = localStorage.getItem('voteFeedIndex');
        this.selectedIndex = parseInt(this.tempIndex);
        if (this.tempIndex == null || this.tempIndex == '0' || this.tempIndex == 'NaN') {
          // set selected group for feed list
          this.feedListComponent.selectedGroup = { ...this.selectedGroup }
          this.feedListComponent.onGetFeedList();
        }
        if (this.tempIndex) {
          this.setGroup(this.selectedIndex);
        }
      }
    });
  };

  //edit group
  onEditGroup(selectedGroupData: any) {
    let x = selectedGroupData;
    let copySelectedGroupData = { ...x };
    const initialState = {
      group: copySelectedGroupData,
    }
    this.bsModalRef = this.modalService.show(GroupCreateEditComponent, { initialState });
    this.groupEditSubscription = this.modalService.onHide.subscribe(data => {
      if (data == 'true') {
        this.getUser();
      }
      this.groupEditSubscription.unsubscribe();
    });
  };

  setGroup(index) {
    this.index = index;
    this.selectedGroup = this.groups[index];
    this.tempIndex = localStorage.setItem('voteFeedIndex', this.index.toString());
    this.groupMember();

    // set selected group for feed list
    this.feedListComponent.selectedGroup = { ...this.selectedGroup }
    this.feedListComponent.onGetFeedList();
  }

  getUser() {
    this.myProfileService.getUserProfile().subscribe((response: any) => {
      this.user = response;
      this.getGroups();
    })
  }

  //group members
  groupMember() {
    this.groupService.groupMembers(this.selectedGroup.id).subscribe((response: any) => {
      this.selectedGroupMember = response;
      this.setOrganizer();
    });
  }

  //other User Profile
  onOtherUserProfile(memberId) {
    let groupId = this.selectedGroup.id;
    this.router.navigate(['/main/otherUserProfile', groupId, memberId]);
  }

  setOrganizer() {
    this.managers = [];
    this.groupService.getGroupManagers(this.selectedGroup.id).subscribe((response: Array<string>) => {
      response.forEach(element => {
        let manager = this.selectedGroupMember.find(a => a.userName == element);
        if (manager) {
          this.managers.push(manager);
        }
      });
    })
  }

  inviteUser() {
    let groupId = this.selectedGroup.id;
    const initialState = {
      groupId: groupId
    }
    this.bsModalRef = this.modalService.show(InviteUserComponent, { initialState });
    this.inviteSubscription = this.modalService.onHide.subscribe(data => {
      // if (data == true) {
      // this.getInvites();
      //}
      this.inviteSubscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.inviteSubscription.unsubscribe();
  }

}
