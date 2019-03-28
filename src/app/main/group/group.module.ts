import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";



import { GroupManagmentComponent } from "./groupManagment/groupManagment.component";
import { ConfirmationModalComponent } from "../../shared/confirmation-modal/confirmation.component";
import { SharedModule } from "../../shared/shared.module";


const groupManagmentRoutes: Routes = [
    { path: '', component: GroupManagmentComponent }
];


@NgModule({
    declarations: [
        GroupManagmentComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(groupManagmentRoutes),
        
    ],
    entryComponents: [
        ConfirmationModalComponent
    ]
})
export class GroupModule { }
