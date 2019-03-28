import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CompleterService, CompleterData, CompleterItem, CtrCompleter } from 'ng2-completer';

import { AppConstant } from '../../../app.constant';
import { GroupModel } from '../../../models/group.model';
import { VoteService } from '../../myProfile/vote/vote.service';
import { VoteModel } from '../../../models/vote.model';
import { SharedService } from '../../../shared/shared.service';
import { GroupService } from '../../group/group.service';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-add-vote-feed',
  templateUrl: './add-vote-feed.component.html'
})
export class AddVoteFeedComponent implements OnInit {

  @Input() user = new UserModel();
  @Input() selectedGroup = new GroupModel();
  voteData = new VoteModel();
  public dataSymbol: CompleterData;
  selectedData: CompleterItem;

  voteTypes = [
    { value: 'strongBuyHold', viewVoteValue: 'Strong Buy', class1: 'strong_buy', class2: 'buy' },
    { value: 'strongDontBuySell', viewVoteValue: 'Strong Sell', class1: 'strong_sell', class2: 'sell' },
    { value: 'buyHold', viewVoteValue: 'Buy', class2: 'buy' },
    { value: 'dontBuySell', viewVoteValue: 'Sell', class2: 'sell'}
  ];

  constructor(private sharedService: SharedService,
    private voteService: VoteService,
    private completerService: CompleterService) { }

  ngOnInit() {
    this.voteData.type = 'buyHold';
    this.dataSymbol = this.completerService.remote(AppConstant.Base_URL + 'search/stocks/', 'symbol', 'symbol');    
  }

  //submit vote
  onSave(form: NgForm) {
    this.voteData.groupId = this.selectedGroup.id;
    this.voteService.addVote(this.voteData).subscribe((response: any) => {
      if (response == null) {
        this.sharedService.loggerSuccess("Vote added successfully");
        form.reset();
        this.voteData == null;
        this.voteData.exchange = null;
        this.voteData.name = null;
        this.voteData.type = null;
      }
    });
  };

  onSymbolSelected(selectedData) {
    this.selectedData = selectedData;
    if (selectedData) {    
      this.voteData.exchange = selectedData.originalObject.exchange;
      this.voteData.name = selectedData.originalObject.name;
    }
    else {
      this.voteData.exchange = null;
      this.voteData.name = null;
    }
  }

  //to select vote type
  onSelectVoteType(value: any) {
    this.voteData.type = value;
  };

  //to cancel vote type
  onCancelVoteType(temp) {
    this.voteData.type = temp;
  };

}
