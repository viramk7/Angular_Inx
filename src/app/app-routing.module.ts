import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';


import { LandingPageComponent } from './landing-page/landing-page.component';
import { EmailVerificationComponent } from './auth/emailVerification/emailVerification.component';
import { MainComponent } from './main/main.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';


const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'home', component: LandingPageComponent },
    { path: 'verify', component: EmailVerificationComponent },
    { path: 'forgotpassword', component: ForgotPasswordComponent },
    { path: 'passwordreset', component: ResetPasswordComponent},
    {
        path: 'main', component: MainComponent,
        children: [
            // { path: '', redirectTo: 'voteFeed', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: './main/dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
            { path: 'myProfile', loadChildren: './main/myProfile/myProfile.module#MyProfileModule', canActivate: [AuthGuard]},
            { path: 'otherUserProfile/:groupId/:memberId', loadChildren: './main/otherUserProfile/otherUserProfile.module#OtherUserProfileModule', canActivate: [AuthGuard] },
            { path: 'groupManagment', loadChildren: './main/group/group.module#GroupModule', canActivate: [AuthGuard] },
            { path: 'voteFeed', loadChildren: './main/vote-feed/vote-feed.module#VoteFeedModule', canActivate: [AuthGuard] },
        ]
    }


];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });