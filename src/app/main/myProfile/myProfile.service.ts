import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AppConstant } from '../../app.constant';
import { AcceptDeclineModel } from '../../models/acceptDecline.model';
import { UserModel } from '../../models/user.model';


@Injectable({
  providedIn: 'root'
})

export class MyProfileService {

  url: string;
  updateProfile = new Subject();

  constructor(private http: HttpClient) {
    this.url = AppConstant.Base_URL + 'profiles/';
  }

  updateProfileImage(imageUrl){
    this.updateProfile.next(imageUrl);
  }

  //get user profile
  getUserProfile() {
    return this.http.get(this.url + 'myprofile');
  }

  //upload/change user profile image
  userProfileImage(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.url + '/image', formData);
  }

  //update user's profile
  updateUserProfile(user: any) {
    return this.http.post(this.url + 'myprofile', user);
  }

  //returns badges specified user has earned
  getUserBadges(badges) {
    return this.http.post(this.url + 'badges', badges);
  }

  //get pending request
  getUserPendingRequest() {
    return this.http.get(this.url + 'mymembershipapplications');
  }

  //accept and decline request
  onRequestAcceptAndDecline(acceptDeclinedata) {
    return this.http.post(this.url + 'mymembershipapplications', acceptDeclinedata);
  }

}
