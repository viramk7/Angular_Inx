import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
  }

  //for adblocker check
  detectAdBlock() {
    this.sharedService.detectAdBlock();
  }

  //for closing menu
  closeMenu() {
    this.sharedService.closeMenu();
  }

}
