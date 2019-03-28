import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { VoteFeedComponent } from "./vote-feed.component";
import { SharedModule } from "../../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { AddVoteFeedComponent } from './add-vote-feed/add-vote-feed.component';
import { FeedListComponent } from "./feed-list/feed-list.component";


const voteFeedRoutes: Routes = [
    { path: '', component: VoteFeedComponent }
];

@NgModule({
    declarations: [
        VoteFeedComponent,
        AddVoteFeedComponent,
        FeedListComponent],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(voteFeedRoutes)
    ]
})
export class VoteFeedModule { }