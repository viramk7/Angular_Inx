import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";


import { DashboardComponent } from "./dashboard.component";
import { DashboardRouting } from "./dashboard-routing.module";

@NgModule({
    declarations:[DashboardComponent],
    imports:[
        CommonModule,
        RouterModule,
        DashboardRouting
    ]
})
export class DashboardModule{}