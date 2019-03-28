import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { GroupModel } from '../../../models/group.model';
import { GroupService } from '../group.service';
import { SharedService } from '../../../shared/shared.service';


@Component({
  templateUrl: './groupCreateEdit.component.html'
})
export class GroupCreateEditComponent implements OnInit {

  group = new GroupModel();
  imageFile: any;
  imageData: any = {};
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  cropperSettings: CropperSettings;
  file: any;
  chooseFile: File;
  groupTypes = [
    { value: 'Other', viewGroupValue: 'Other', statement: ' ' },
    { value: 'FriendsAndFamily', viewGroupValue: 'Friends And Family', statement: 'Create a group for your friends and family to learn investing together.' },
    { value: 'InvestmentGroup', viewGroupValue: 'Investment Group', statement: 'After meeting, continue the discussion with your investment group online.' },
    { value: 'ExperimentLab', viewGroupValue: 'Experiment Lab', statement: 'Incubate new investment strategies and collaborate with your colleagues.' },
    { value: 'Competition', viewGroupValue: 'Competition', statement: 'Create competitions for the classroom or your organization.' },
    { value: 'Coworkers', viewGroupValue: 'Coworkers', statement: 'Create a group for your coworkers to talk stocks at the digital water cooler.' }
  ];
  selectedGroupType = 'Other'; //Default Other

  constructor(private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private groupService: GroupService,
    private sharedService: SharedService) {

  }

  ngOnInit() {
    this.setImageCanvas();
    if (!this.group.id) {
      this.setGroupVisibility('groupAdmin');
      this.setGroupInviteType('inviteOnly');
    }
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
    else {
      let elem = document.getElementById("custom-input");
      if (elem) {
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

  saveImage(groupId: number) {
    this.groupService.uploadGroupImage(groupId, this.file).subscribe((response: any) => {
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

  //create group
  onSave(form: NgForm) {
    //Verify image size
    if (this.imageData.image) {
      if (!this.validateImageSize()) {
        return false
      }
    }
    //Edit Group
    if (this.group.id) {
      //Save image
      this.imageData.image ? this.saveImage(this.group.id) : "";
      // var y = this.group;
      // var i = {...y}
      this.groupService.updateGroupProfile(this.group.id,this.group).subscribe((response: any) => {
        this.modalService.setDismissReason('true');
        this.sharedService.loggerSuccess('Group updated successfully');
        this.bsModalRef.hide();
      });
    }
    //Create Group
    else {
      this.groupService.createGroup(this.group).subscribe((response: any) => {
        if (response) {
          this.imageData.image ? this.saveImage(response.id) : "";
          this.modalService.setDismissReason('true');
          this.sharedService.loggerSuccess('Group created successfully');
          this.bsModalRef.hide();
        }
      });
    }
  }

  setGroupInviteType(inviteType: string) {
    this.group.groupInviteType = inviteType;
  }

  setGroupVisibility(membershipApprovalType: string) {
    this.group.membershipApprovalType = membershipApprovalType;
  }

  onClose() {
    this.bsModalRef.hide();
  }
}
