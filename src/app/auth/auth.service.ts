import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { AppConstant } from '../app.constant';
import { EmailVerificationModel } from './emailVerification/emailVerification.model';
import { Observable } from 'rxjs';
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthService {

    // token: string;
    url: string;
    constructor(private http: HttpClient) {
        this.url = AppConstant.Base_URL + 'auth/';
    }

    //Register User
    userSignup(userData: UserModel) {
        return this.http.post(this.url + 'register', userData);
    }

    //login user 
    userLogin(userData: UserModel) {
        return this.http.post(this.url + 'login', userData, { observe: 'response' });
    }

    //forgot password
    forgotPassword(userEmail: UserModel) {
        return this.http.post(this.url + 'forgotpassword', userEmail);
    }

    //reset password
    resetPassword(user: any) {
        user.token = encodeURIComponent(user.token);
        return this.http.post(this.url + `password/reset?token=${user.token}`, user);
    }

    verifyEmail(verificationData: EmailVerificationModel) {
        verificationData.token = encodeURIComponent(verificationData.token);
        return this.http.post(this.url + `verifyemail?username=${verificationData.username}&token=${verificationData.token}`, null)
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isAuthenticated() {
        let token = this.getToken();
        return token != null;
    }

    setAuthAndRefreshToken(authToken: string, refreshToken: string) {
        localStorage.setItem('token', authToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    setAuthToken(token) {
        localStorage.setItem('token', token);
    }

    refreshToken(): Observable<Object> {
        /*
            The call that goes in here will use the existing refresh token to call
            a method on the oAuth server (usually called refreshToken) to get a new
            authorization token for the API calls.
        */
        let token = localStorage.getItem('token');
        let refresh_token = localStorage.getItem('refreshToken');
        var data = jwt_decode(token);
        return this.http.post(this.url + `refresh`, { username: data.un, refreshToken: refresh_token });
    }
}
