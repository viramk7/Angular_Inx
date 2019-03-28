import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { AppConstant } from '../../app.constant';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = AppConstant.Base_URL + 'groups';
  }

  //create group
  createGroup(group: any) {
    return this.http.post(this.url, group);
  }

  //user's groups
  getUserGroups() {
    return this.http.get(this.url);
  }

  //update group's profile(By group manager)
  updateGroupProfile(id: number, data: any) {
    return this.http.put(this.url + '/' + id, data);
  }

  //upload group image
  uploadGroupImage(id: number, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.url + '/' + id + '/image', formData);
  }

  //members in the group
  groupMembers(id: number) {
    return this.http.get(this.url + '/' + id + '/members');
  }

  //Get invite list by group id
  getGroupApplication(groupId) {
    return this.http.get(this.url + '/' + groupId + '/invitations');
  }

  //Kick user form group
  kickFromGroup(data) {
    return this.http.post(this.url + '/kick', data);
  }

  //invite group
  inviteGroups(inviteGroupData: any) {
    return this.http.post(this.url + '/invite', inviteGroupData);
  }

  //join group
  joinGroup(groupId: number) {
    return this.http.get(this.url + '/' + groupId + '/apply');
  }

  //collection of user profile metadata for group
  getUserProfiles(data) {
    return this.http.post(this.url + '/profiles', data);
  }

  groupApplication(acceptDeclinedata) {
    return this.http.post(this.url + '/application', acceptDeclinedata);
  }

  getGroupManagers(groupId) {
    return this.http.get(this.url + '/' + groupId + '/managers');
  }

}
