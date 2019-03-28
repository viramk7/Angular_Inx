import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { GroupModel } from '../../../models/group.model';
import { GroupService } from '../group.service';
import { SharedService } from '../../../shared/shared.service';
import { AppConstant } from '../../../app.constant';


@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.component.html'
})
export class JoinGroupComponent implements OnInit {

  groupName = new GroupModel();
  public groupList: CompleterData;
  constructor(private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private groupService: GroupService,
    private completerService: CompleterService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.groupList = this.completerService.remote(AppConstant.Base_URL + 'search/groups/', 'name', 'name');
  }

  onClose() {
    this.bsModalRef.hide();
  }

  onSubmit(form: NgForm) {
    this.groupService.joinGroup(this.groupName.id).subscribe((response: any) => {
      this.modalService.setDismissReason("true");
      this.sharedService.loggerSuccess("Request sent to join group successfully");
      this.bsModalRef.hide();
    });
  }

  onGroupSelected(selectedData: CompleterItem) {
    if (selectedData) {
      this.groupName.id = selectedData.originalObject.id;
    }
    else {
      this.groupName.id = null;
    }
  }
}
