import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { Ng2CompleterModule } from "ng2-completer";
import {MatSelectModule,MatInputModule} from '@angular/material';

import { MyProfileComponent } from "./myProfile.component";
import { SharedModule } from "../../shared/shared.module";
import { ConfirmationModalComponent } from "../../shared/confirmation-modal/confirmation.component";
import { AddVoteComponent } from "./vote/addVote.component";


const myProfileRoutes: Routes = [
    { path: '', component: MyProfileComponent }
];


@NgModule({
    declarations: [
        MyProfileComponent,
        AddVoteComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(myProfileRoutes),
        SharedModule
    ],
    entryComponents:[AddVoteComponent]
})
export class MyProfileModule { }