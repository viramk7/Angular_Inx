import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";
import { NgForm } from "@angular/forms";
import { CompleterService, CompleterData, CompleterItem, CtrCompleter } from 'ng2-completer';

import { VoteService } from "./vote.service";
import { VoteModel } from "../../../models/vote.model";
import { SharedService } from "../../../shared/shared.service";
import { GroupModel } from "../../../models/group.model";
import { AppConstant } from "../../../app.constant";

@Component({
  templateUrl: './addVote.component.html'
})
export class AddVoteComponent implements OnInit {
  voteData = new VoteModel();
  groupId: number;
  selectedSymbol: string;
  public dataSymbol: CompleterData;
  // protected dataExchange: CompleterData;
  protected searchStr: string;

  voteTypes = [
    { value: 'buyHold', viewVoteValue: 'Buy/Hold' },
    { value: 'dontBuySell', viewVoteValue: 'Dont Buy/Sell' },
    { value: 'strongBuyHold', viewVoteValue: 'Strong Buy/Hold' },
    { value: 'strongDontBuySell', viewVoteValue: 'Strong Dont Buy/Sell' }
  ];

  constructor(private bsModalRef: BsModalRef,
    private voteService: VoteService,
    private sharedService: SharedService,
    private completerService: CompleterService) {

  }

  ngOnInit() {
    this.dataSymbol = this.completerService.remote(AppConstant.Base_URL + 'search/stocks/', 'symbol,exchange,name', 'symbol,exchange,name');
  }

  onSave(form: NgForm) {
    this.voteData.groupId = this.groupId;
    this.voteService.addVote(this.voteData).subscribe((response: any) => {
      this.sharedService.loggerSuccess("Vote added successfully");
      // this.voteData=response;
      this.bsModalRef.hide();
    });
  }

  onSymbolSelected(selectedData: CompleterItem) {
    if (selectedData) {
      this.voteData.exchange = selectedData.originalObject.exchange;
    } else {
      this.voteData.exchange = null;
    }
  }

  onClose() {
    this.bsModalRef.hide();
  }
}