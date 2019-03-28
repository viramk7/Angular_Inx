import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";


@Component({
    templateUrl: "./confirmation.component.html"
})
export class ConfirmationModalComponent implements OnInit {
    title: string;
    isShowInput: boolean = false;
    reason: string;
    constructor(public bsModalRef: BsModalRef,
        private modalService: BsModalService) {

    }

    ngOnInit() {

    }

    acceptRecord() {
        if (this.isShowInput) {
            let data = {
                isAction: true,
                reason: this.reason
            }
            this.modalService.setDismissReason(JSON.stringify(data));
        }
        else {
            this.modalService.setDismissReason("true")
        }
        this.bsModalRef.hide()
    }

    cancel() {
        this.modalService.setDismissReason("false")
        this.bsModalRef.hide();
    }
}