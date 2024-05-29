import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-assign-inventory-item',
  templateUrl: './assign-inventory-item.page.html',
  styleUrls: ['./assign-inventory-item.page.scss'],
})
export class AssignInventoryItemPage implements OnInit {

  @Input() inventoryItem: any;
  inventoryKeyValue: any = [];
  assignEmail: any;
  itemHistory: any;
  historyErrorMsg: any;

  constructor(public modalController: ModalController, private commonService: CommonService, private router:Router) { }

  ngOnInit() {
    console.log(this.inventoryItem);
    let keys = Object.keys(this.inventoryItem);
    let value = Object.values(this.inventoryItem);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === 'id' || keys[i] === 'createdAt' || keys[i] === 'updatedAt' || keys[i] === 'organisationId') { }
      else {
        this.inventoryKeyValue.push({ 'keys': keys[i], 'values': value[i] })
      }
    }

    this.getItemHistory();
  }

  close() {
    this.modalController.dismiss({ status: "update" });
  }

  getItemHistory() {
    this.commonService.getAssignItemDetail({ 'itemTypeId': this.inventoryItem.id }).then((res: any) => {
      console.log(res);
      if (res.msg) {
        this.historyErrorMsg = res.msg;
        // this.commonService.showToast('error',res.msg)
      } else {
        this.itemHistory = res.result;
        this.historyErrorMsg = '';
      }
    }, error => {
      this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
    })
  }

  assignItem() {
    if (this.assignEmail) {
      let form = {
        'itemTypeId': this.inventoryItem.id,
        'email': this.assignEmail,
        'organisationId': this.inventoryItem.organisationId
      }
      this.commonService.assignInventoryItem(form).then((res: any) => {
        console.log(res)
        if (res.code == 1) {
          this.commonService.showToast('success', res.msg)
          this.getItemHistory();
          // this.close();
        } else {
          this.commonService.showToast('error', res['msg'])
        }
      }, error => {
        this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
      })
    } else {
      this.commonService.showToast('error', 'Please fill email-id for assigning item!')
    }

  }
}
