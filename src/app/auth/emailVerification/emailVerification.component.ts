import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EmailVerificationModel } from "./emailVerification.model";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { SharedService } from "../../shared/shared.service";


@Component({
    templateUrl: "./emailVerification.component.html"
})
export class EmailVerificationComponent implements OnInit {
    verificationModel = new EmailVerificationModel();
    message: String;
    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private sharedService: SharedService) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.verificationModel.username = params["username"];
            this.verificationModel.token = params["token"];
            if (!this.verificationModel.username && !this.verificationModel.token) {
                this.message = "Link is corrupted!";
            } 
        })
        // this.verificationModel.userName = this.activatedRoute.snapshot.queryParamMap.get('username');
        // this.verificationModel.token = this.activatedRoute.snapshot.queryParamMap.get('token');
       
    }

    onVerify(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.verifyEmail(this.verificationModel).subscribe((response: any) => {
           this.sharedService.loggerSuccess("Your email address has been confirmed. Please login to continue.");
           this.router.navigate(['/home']);
        });

    }

}