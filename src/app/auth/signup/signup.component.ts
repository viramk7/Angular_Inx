import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

import { UserModel } from "../../models/user.model";
import { AuthService } from "../auth.service";
import { SharedService } from "../../shared/shared.service";

@Component({
    templateUrl: "./signup.component.html"
})
export class SignupComponent implements OnInit {
    userData: UserModel;
    temp: any;
    confirmPassword: String;
    @ViewChild('f') signupForm: NgForm;

    trimming_fn(x) {
        return x ? x.replace(/^\s+|\s+$/gm, '') : '';
    };

    constructor(private bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private authService: AuthService,
        private router: Router,
        private sharedService: SharedService) {
    }


    ngOnInit() {
        this.userData = new UserModel();
    }

    onSignUp(form: NgForm) {
        this.authService.userSignup(form.value).subscribe((response: any) => {
            if (response) {
                this.sharedService.loggerSuccess("User registered successfully, please check email and click on verification link to verify account");
                var data = { isAccountExist: false };
                this.bsModalRef.hide();
            }
            else {
                this.sharedService.loggerError("Error in creating user");
            }
        });
      
    }
    onClose() {
        this.bsModalRef.hide();
    }

    onExistAccount() {
        var data = { isAccountExist: true };
        this.modalService.setDismissReason(JSON.stringify(data));
        this.bsModalRef.hide();
    }


}