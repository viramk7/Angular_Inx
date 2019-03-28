import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatMenuModule,MatIconModule} from '@angular/material';
import { RouterModule,Routes } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { HeaderMainComponent } from './header/header-main.component';

@NgModule({
    imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule,
        RouterModule
    ],
    declarations: [
        FooterComponent,
        HeaderMainComponent
    ],
    exports: [
        FooterComponent,
        HeaderMainComponent,
        MatMenuModule,
        MatIconModule
    ]
})
export class CoreModule{

}