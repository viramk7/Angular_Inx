import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import adBlocker from 'just-detect-adblock';

@Component({
  selector: 'app-adblocker',
  templateUrl: './adblocker.component.html'
})
export class AdblockerComponent implements OnInit {

  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit() {
    
  }

  onClose() {
    this.bsModalRef.hide();
  }
}
