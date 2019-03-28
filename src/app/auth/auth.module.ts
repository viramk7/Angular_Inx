import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";


import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { EmailVerificationComponent } from "./emailVerification/emailVerification.component";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
        EmailVerificationComponent,
        ResetPasswordComponent,
        ForgotPasswordComponent
    ],
    imports:[
        CommonModule,
        FormsModule
    ],
    exports: [
    ],
    entryComponents: [LoginComponent, SignupComponent],

})
export class AuthModule { }