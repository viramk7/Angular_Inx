import { Component, Input } from "@angular/core";

@Component({
    selector: "app-vote-type",
    templateUrl: "./voteType.component.html"

})
export class VoteTypeCpmponent {
    @Input() voteTypeId;
    constructor() {

    }
}