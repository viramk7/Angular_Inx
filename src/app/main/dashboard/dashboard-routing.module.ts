import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { ModuleWithProviders } from "@angular/core";

const dashboardRoutes: Routes = [
    { path: '', component: DashboardComponent }
];

export const DashboardRouting: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);