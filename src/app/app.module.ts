import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CookieLawModule } from 'angular2-cookie-law';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AppRouting } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { SharedService } from './shared/shared.service';
import { ErrorsHandlerService } from './shared/error-handler';
import { MainComponent } from './main/main.component';
import { AdblockerComponent } from './adblocker/adblocker.component';
import { CoreModule } from './core/core.module';
import { VoteService } from './main/myProfile/vote/vote.service';
import { ImageCropperModule } from 'ngx-img-cropper';
import { GroupCreateEditComponent } from './main/group/groupCreateEdit/groupCreateEdit.component';
import { EditProfileComponent } from './main/edit-profile/edit-profile.component';
import { InviteUserComponent } from './main/group/inviteUser/inviteUser.component';
import { JoinGroupComponent } from './main/group/join-group/join-group.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    MainComponent,
    GroupCreateEditComponent,
    AdblockerComponent,
    EditProfileComponent,
    InviteUserComponent,
    JoinGroupComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    AuthModule,
    AppRouting,
    RouterModule,
    BrowserModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    CoreModule,
    ToastrModule.forRoot(),
    MatSnackBarModule,
    CookieLawModule,
    ImageCropperModule
  ],
  entryComponents: [
    GroupCreateEditComponent,
    AdblockerComponent,
    EditProfileComponent,
    InviteUserComponent,
    JoinGroupComponent
  ],
  providers: [AuthService, SharedService,
    {
      provide: ErrorHandler,
      useClass: ErrorsHandlerService,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    VoteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
