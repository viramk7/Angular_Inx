import { NgModule } from "@angular/core";
import { ModalModule } from 'ngx-bootstrap';
import { NgxUploaderModule } from 'ngx-uploader';
import { MatSelectModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';
import { OrdinalPipe } from './pipes/ordinal.pipe'
import { VoteTypeCpmponent } from "./voteType.component/voteType.component";
import { CommonModule } from "@angular/common";
import { ConfirmationModalComponent } from "./confirmation-modal/confirmation.component";
import { Ng2CompleterModule } from "ng2-completer";
import {MatMenuModule} from '@angular/material/menu';
import { PopoverModule } from "ngx-popover";
import { FormsModule } from "@angular/forms";
import { TagInputModule } from 'ngx-chips';
import { SwiperModule } from 'angular2-useful-swiper';


@NgModule({
    declarations: [
        OrdinalPipe,
        VoteTypeCpmponent,
        ConfirmationModalComponent

    ],
    imports: [
        FormsModule,
        ModalModule.forRoot(),
        NgxUploaderModule,
        MatSelectModule,
        MatInputModule,
        CommonModule,
        Ng2CompleterModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        PopoverModule,
        TagInputModule,
        SwiperModule,
    ],
    exports: [
        OrdinalPipe,
        VoteTypeCpmponent,
        ModalModule,
        NgxUploaderModule,
        MatSelectModule,
        MatInputModule,
        Ng2CompleterModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        PopoverModule,
        TagInputModule,
        SwiperModule
    ],
    entryComponents: [ConfirmationModalComponent]
})
export class SharedModule { }