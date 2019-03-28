import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';



import { AdblockerComponent } from './adblocker/adblocker.component';
import { SharedService } from './shared/shared.service';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    private sharedService: SharedService,
    private router: Router) {

  }


  ngOnInit() {
  }

  //for adblocker check
  detectAdBlock() {
    if(!this.router.url.includes('/main/')){
      this.sharedService.detectAdBlock();
    }
  }

  //for closing menu
  closeMenu() {
    this.sharedService.closeMenu();
  }
}
