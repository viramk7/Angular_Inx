import { Component } from "@angular/core";
import { NgForm, FormControl } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

import { GroupService } from "../group.service";
import { InviteModel } from "../../../models/invite.model";
import { SharedService } from "../../../shared/shared.service";


@Component({
    templateUrl: './inviteUser.component.html'
})
export class InviteUserComponent {
    invitation: any = {};
    emailList: Array<{ id: number, email: string }> = [];
    groupId: InviteModel;
    regexp: RegExp = /[\s,;]+/;
    constructor(private bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private groupService: GroupService,
        private sharedService: SharedService) {

    }

    // validation for email tag-input
    public validators = [this.must_be_email];
    public errorMessages = {
        'must_be_email': 'Enter valid email address!'
    };
    private must_be_email(control: FormControl) {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { "must_be_email": true };
        }
        return null;
    }



    onSave(form: NgForm) {
        let email = this.emailList.map(a => a['value']);
        this.invitation = {
            groupId: this.groupId,
            emails: email
        }
        this.groupService.inviteGroups(this.invitation).subscribe((response: any) => {
            this.sharedService.loggerSuccess("Invitation sent successfully!");
            this.modalService.setDismissReason('true');
            this.bsModalRef.hide();
        });
    }

    onClose() {
        this.modalService.setDismissReason('false');
        this.bsModalRef.hide();
    }
}