import { Component, OnInit, EventEmitter, Output, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { Subscription } from "rxjs";

import { SharedService } from "../../shared/shared.service";
import { MyProfileService } from "../../main/myProfile/myProfile.service";
import { UserModel } from "../../models/user.model";
import { AuthService } from '../../auth/auth.service';


@Component({
    selector: 'app-header-main',
    templateUrl: "./header-main.component.html"
})
export class HeaderMainComponent implements OnInit, OnDestroy {
    userInfo: any = {};
    // user = new UserModel();
    user = new UserModel();
    isMenuOpen: boolean = false;
    updatedImageSubscription = new Subscription();
    profileImageUrl: string;
    constructor(private router: Router,
        private sharedService: SharedService,
        private myProfileService: MyProfileService,
        private authService: AuthService) {
    }


    ngOnInit() {
        this.userInfo = this.sharedService.getDecodedToken();        
        this.updatedImageSubscription = this.myProfileService.updateProfile.subscribe((imageUrl: string) => {
            this.user.imageUrlMedium = imageUrl;
        })
        this.onUserProfile();
    }

    //user profile for userImage
    onUserProfile() {
        this.myProfileService.getUserProfile().subscribe((response: any) => {
            this.user = response;
        });
    }

    onLogout() {
        localStorage.clear();
        this.router.navigate(['/home']);
    }

    onGroupManagment() {
        this.router.navigate(['/main/groupManagment']);
    }

    onMyProfile() {
        this.router.navigate(['/main/myProfile']);
    }

    onVoteFeed() {
        this.router.navigate(['/main/voteFeed']);
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        $('.menu').toggle();
    }

    ngOnDestroy() {
        this.updatedImageSubscription.unsubscribe();
    }
}