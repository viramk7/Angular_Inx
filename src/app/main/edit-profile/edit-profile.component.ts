import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { UserModel } from '../../models/user.model';
import { SharedService } from '../../shared/shared.service';
import { MyProfileService } from '../myProfile/myProfile.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit {

  user = new UserModel();
  imageFile: any;
  imageData: any = {};
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  cropperSettings: CropperSettings;
  file: any;
  chooseFile: File;

  constructor(private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private sharedService: SharedService,
    private myProfileService: MyProfileService) { }

  ngOnInit() {
    this.setImageCanvas();
    // console.log(this.user);
  }

  setImageCanvas() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.canvasWidth = 150;
    this.cropperSettings.canvasHeight = 150;
  }

  fileChangeListener($event) {
    var image: any = new Image();
    this.chooseFile = $event.target.files[0];
    if (this.chooseFile.type == 'image/jpeg' || this.chooseFile.type == 'image/png' || this.chooseFile.type == 'image/gif') {
      this.imageFile = $event.target.files[0];
      var myReader: FileReader = new FileReader();
      var that = this;
      myReader.onloadend = (loadEvent: any) => {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);
      };
      myReader.readAsDataURL(this.chooseFile);
    }
    else{
      let elem = document.getElementById("custom-input");
      if(elem){
        elem["value"] = ""
      }
      this.sharedService.loggerError('Please choose file with extension jpg, jpeg, png or gif');
    }
  }

  dataURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/png'
    });
  }

  validateImageSize(): boolean {
    var blob = this.dataURItoBlob(this.imageData.image);
    this.file = new File([blob],
      this.imageFile.name,
      {
        type: this.imageFile.type,
        lastModified: Date.now()
      });
    if (this.file.size >= 150000) {
      this.sharedService.loggerError('Image must be less than 150 Kb');
      return false
    }
    else {
      return true;
    }
  }

  saveImage() {
    this.myProfileService.userProfileImage(this.file).subscribe((response: any) => {
      this.modalService.setDismissReason('true');
      this.sharedService.loggerSuccess('Image uploaded successfully');
      this.bsModalRef.hide();
    });
  }


  //create group
  onSave(form: NgForm) {
    //Verify image size
    if (this.imageData.image) {
      if (!this.validateImageSize()) {
        return false
      }
    }
    //Edit User
    if (this.user.id) {
      //Save image
      this.imageData.image ? this.saveImage() : "";
    }
  }

  onClose() {
    this.bsModalRef.hide();
  }

}
