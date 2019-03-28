import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstant } from '../../app.constant';

@Injectable({
  providedIn: 'root'
})
export class InsightService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = AppConstant.Base_URL + 'insights/';
  }

  //get insight by group
  getInsight(groupId: number) {
    return this.http.get(this.url + groupId);
  }

  //get best votes
  getBestVotes(groupId, tradeStrategyId, stockSectorId) {
    return this.http.get(this.url + 'bestvotes/' + groupId + '/' + tradeStrategyId + '/' + stockSectorId);
  }

  //get gameId
  getGameId(gameTypeId: number) {
    return this.http.get(this.url + 'games/' + gameTypeId);
  }

  //get insight profile
  getInsightProfile(groupId: number, gameId: number) {
    return this.http.get(this.url + 'profile/' + groupId + '/' + gameId);
  }

  //return my votes table
  getMyVotes(data: any) {
    return this.http.post(this.url + 'myvotes', data);
  }

  // ***Other Users API***

  //get other user's insight data
  getOtherUserInsight(groupId: number, userId) {
    return this.http.get(this.url + 'otheruser/' + groupId + '/' + userId);
  }

  //get other user best votes
  getBestVotesOtherUser(groupId: number, data: any) {
    return this.http.post(this.url + 'bestvotes/otheruser/' + groupId, data);
  }

  //get other user insight profile data
  getOtherUserInsightProile(groupId: number, data) {
    return this.http.post(this.url + 'profile/otheruser/' + groupId, data);
  }

}