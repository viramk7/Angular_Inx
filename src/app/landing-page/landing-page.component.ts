import { Component, OnInit, OnDestroy } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Subscription } from "rxjs";
import { LoginComponent } from "../auth/login/login.component";
import { SignupComponent } from "../auth/signup/signup.component";
import { AuthService } from "../auth/auth.service";



@Component({
    templateUrl: "./landing-page.component.html"
})
export class LandingPageComponent implements OnInit, OnDestroy {
    bsModalRef: BsModalRef;
    loginSubscription = new Subscription();
    signUpSubscription = new Subscription();

    constructor(private modalService: BsModalService, private authService: AuthService) {

    }

    ngOnInit() {
        localStorage.clear();
    }

    onLogin() {

        this.bsModalRef = this.modalService.show(LoginComponent, { class: 'modal-md-sm' });
        this.loginSubscription = this.modalService.onHide.subscribe(data => {
            //To open login page if user already have account
            if (data && data != "backdrop-click") {
                let isGoToSignup = JSON.parse(data)['isNewAccount'];
                if (isGoToSignup) {
                    this.onSignUp();
                }
            }
            this.loginSubscription.unsubscribe();
        });
    }

    onSignUp() {
        this.bsModalRef = this.modalService.show(SignupComponent, { class: 'modal-md-sm' });
        this.signUpSubscription = this.modalService.onHide.subscribe(data => {
            //To open Signup if user clicks account already exist
            if (data) {
                let isGoToLogin = JSON.parse(data)['isAccountExist'];
                if (isGoToLogin) {
                    this.onLogin();
                }
            }
            this.signUpSubscription.unsubscribe();
        });
    }

    ngOnDestroy() {
        this.loginSubscription.unsubscribe();
        this.signUpSubscription.unsubscribe();
    }

    scrollToDescription(el) {
        el.scrollIntoView();
    }
}