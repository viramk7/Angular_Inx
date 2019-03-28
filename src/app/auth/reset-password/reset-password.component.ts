import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  user: any = {};
  token: string;
  message: String;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(param => {
      this.token = param['token'];
      if (!this.token) {
        this.message = "Link is corrupted!";
      } 
    });
  }


  onResetPassword(form: NgForm) {
    this.user = {
      userName: form.value.userName,
      password: form.value.password,
      token: this.token,
      confirmPassword: form.value.confirmPassword
    }
    
    this.authService.resetPassword(this.user).subscribe((res: any)=>{
        this.sharedService.loggerSuccess("Password updated successfully. Please login to continue.");
        this.router.navigate(['/home']);
    }); 
  }

}
