import { OnInit, Component } from "@angular/core";
import { Router } from '@angular/router';


import { UserModel } from "../../models/user.model";
import { AuthService } from "../auth.service";
import { SharedService } from "../../shared/shared.service";

@Component({
    templateUrl: "./forgot-password.component.html"
})
export class ForgotPasswordComponent implements OnInit {
    userEmail = new UserModel();
    constructor(private router: Router,
        private authService: AuthService,
        private sharedService: SharedService) { }
    ngOnInit() { }

    onForgotPassword() {
        this.authService.forgotPassword(this.userEmail).subscribe((response: any) => {
            if (response.status == 200) {
                this.sharedService.loggerSuccess("Password recovery email sent");
            }
            else {
                this.sharedService.loggerError("Something wrong in sending email");
            }

        });
    }

    onCancel(){
        this.router.navigate(['/home']);
    }
}