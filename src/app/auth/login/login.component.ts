import { OnInit, Component } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { UserModel } from "../../models/user.model";
import { AuthService } from "../auth.service";
import { SharedService } from "../../shared/shared.service";

@Component({
    templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {

    token: string;
    refreshToken: string;
    userData = new UserModel();
    userInfo: any = {};

    constructor(private bsModalRef: BsModalRef,
        private router: Router,
        private authService: AuthService,
        private sharedService: SharedService,
        private modalService: BsModalService, ) { }

    ngOnInit() {
    }

    trimming_fn(x) {
        return x ? x.replace(/^\s+|\s+$/gm, '') : '';
    };
    //for login
    onLogin(form: NgForm) {
        this.authService.userLogin(this.userData).subscribe((response: any) => {
            if (response.status == 200) {
                this.refreshToken = response.body.refreshToken;
                this.token = response.body.token;
                this.authService.setAuthAndRefreshToken(this.token, this.refreshToken);
                this.userInfo = this.sharedService.getDecodedToken();
                if (this.userInfo.mem != null) {
                    this.router.navigate(['/main/voteFeed']);
                } else {
                    this.router.navigate(['/main/myProfile']);
                }
                this.bsModalRef.hide();
            }
            else {
                this.sharedService.loggerError("Error in login");
            }
        });
    }

    onNewAccount() {
        var data = { isNewAccount: true };
        this.modalService.setDismissReason(JSON.stringify(data));
        this.bsModalRef.hide();
    }

    onClose() {
        this.bsModalRef.hide();
    }

    onForgotPassword() {
        this.bsModalRef.hide();
        this.router.navigate(['/forgotpassword']);
    }
}