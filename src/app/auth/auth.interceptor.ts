import { throwError } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { finalize, share, catchError, switchMap } from 'rxjs/operators';

import { AuthService } from "./auth.service";
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    isRefreshingToken: boolean = false;
    
    constructor(private router: Router,
        private authService: AuthService,
        private sharedService: SharedService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let getToken = this.authService.getToken();
        this.sharedService.showLoader();
        if (getToken != null) {
            let token = getToken === null ? '' : getToken;
            const copiedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
            return next.handle(copiedReq)
                .pipe(
                    catchError((err) => {
                        if (err instanceof HttpErrorResponse && err.status === 401 && !err.url.includes('auth/login')) {
                            return this.handle401Error(req, next);
                        }
                        else {
                            return throwError(err);
                        }
                    }),
                    // Log when response observable either completes or errors
                    finalize(() => {
                        this.sharedService.hideLoader();
                    })
                )
        }
        else {
            return next.handle(req).pipe(
                // Log when response observable either completes or errors
                finalize(() => {
                    this.sharedService.hideLoader();
                })
            );
        }
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        //-- Test if we are refreshing so we are not stuck in an infinite loop
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            let refresh = this.authService.refreshToken();

            return refresh.pipe(
                switchMap((tokenResp: any) => {
                    this.authService.setAuthToken(tokenResp);

                    //let access_token = ApplicationSettings.getString('access_token');
                    let headers = req.headers.set('Authorization', `Bearer ${tokenResp}`);
                    return next.handle(req.clone({ headers: headers }));
                }),
                catchError(error => {
                    //  ApplicationSettings.setBoolean("authenticated", false);
                    this.router.navigate(['/home']);
                    return throwError("");
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                })
            )
        }
        else {
            return next.handle(req);
        }
    }
}