import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { OtherUserProfileComponent } from "./otherUserProfile.component";
import { SharedModule } from '../../shared/shared.module';



const OtherUserProfileRoutes:Routes=[
    {path:'',component:OtherUserProfileComponent}
];
@NgModule({
    declarations:[
        OtherUserProfileComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        RouterModule.forChild(OtherUserProfileRoutes),
        SharedModule
    ]
})
export class OtherUserProfileModule{

}