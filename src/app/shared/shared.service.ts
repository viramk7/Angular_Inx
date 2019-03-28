import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';
import * as jwt_decode from "jwt-decode";
import adBlocker from 'just-detect-adblock';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AdblockerComponent } from "../adblocker/adblocker.component";

@Injectable()
export class SharedService {

    token: string;
    tokenInfo: any;
    bsModalRef: BsModalRef;
    
    constructor(private modalService: BsModalService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService) { }

    loggerSuccess(msg: string, timeOut = 1500) {
        this.toastr.success(msg, 'Success', { timeOut: timeOut, progressBar: true });
    }

    loggerInfo(msg: string, timeOut = 1500) {
        this.toastr.info(msg, 'Info', { timeOut: timeOut, progressBar: true });
    }

    loggerError(msg: string, timeOut = 1500) {
        this.toastr.error(msg, 'Error', { timeOut: timeOut, progressBar: true });
    }

    loggerWarning(msg: string, timeOut = 1500) {
        this.toastr.warning(msg, 'Warning', { timeOut: timeOut, progressBar: true });
    }

    showLoader() {
        this.spinner.show();
    }

    hideLoader() {
        this.spinner.hide();
    }

    closeMenu() {
        //Mobile
        let navbar = document.getElementById("navbar");
        if(navbar){
            navbar.classList.remove('in')
        }
    }

    detectAdBlock() {
        if (adBlocker.isDetected()) {
          // an adblocker is detected
          // alert("Add blocker is added");
          this.bsModalRef = this.modalService.show(AdblockerComponent, { class: 'modal-sm', backdrop: 'static' });
    
        }
      }

    // getDecodedAccessToken(token): any {
    //     try {
    //         console.log('decode',token);
    //         return jwt_decode(token);
    //     }
    //     catch (Error) {
    //         return null;
    //     }
    // }

    getDecodedToken() {
        this.token = localStorage.getItem('token');
        return jwt_decode(this.token);
    }

}