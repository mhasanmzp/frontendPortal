import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AssignInventoryItemPage } from 'src/app/modals/assign-inventory-item/assign-inventory-item.page';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  response: any;
  segment: any = 'items'
  historyDetails: any;
  historyErrorMsg: any;
  organisationId: any;
  uploadFile: any;
  sortColumn: any = ['itemType', 'companyBrand', 'ram', 'isReturn'];
  filterColumn: any = {};
  filterCol: any = [];
  filterr: any = [];
  columnSelect: any;
  response1: any = [];
  height: any = 0;
  historyDetailsReal: any;

  constructor(private router: Router, private commonService: CommonService, private authService: AuthService,
    public modalController: ModalController, private alertController: AlertController, private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.height = (window.innerHeight - 140) + 'px'
    // this.getAllInventoryDetails();
    // this.getInventoryHistory();
  }

  ionViewWillEnter() {
    this.getAllInventoryDetails();
    this.getInventoryHistory();
  }

  getAllInventoryDetails() {
    this.commonService.presentLoading();
    this.authService.userLogin.subscribe((resp: any) => {
      if (resp) {
        this.organisationId = resp.organisationId
        this.commonService.getInventoryDetails({ organisationId: resp.organisationId }).then((res: any) => {
          // console.log(res);
          if (res.msg) {
            this.commonService.showToast('error', res.msg)
          } else {
            this.filterCol = []
            this.response = res;
            this.response1 = res;

            ///Added by parul to group by column value

            for (let i = 0; i < this.sortColumn.length; i++) {
              let key = this.sortColumn[i]
              this.filterColumn[this.sortColumn[i]] = this.response.reduce((group, product) => {
                const key1 = product[key];
                group[key1] = group[key1] ?? [];
                group[key1].push(product);
                return group;
              }, {});
              if (this.filterColumn[this.sortColumn[i]] != null) {
                this.filterCol[key] = {}
                this.filterCol[key] = Object.keys(this.filterColumn[this.sortColumn[i]])
              }
            }
            // console.log("filetr",this.filterCol)
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
    })
  }

  addInventory() {
    this.router.navigateByUrl('/add-inventory')
  }

  updateItemInventory(data) {
    this.router.navigateByUrl('/add-inventory', { state: { itemDetail: data } });
  }

  async deleteItemInventory(id: any) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to delete this inventory details.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.commonService.deleteInventoryItem({ 'id': id }).then((res: any) => {
              // console.log(res);
              if (res) {
                this.commonService.showToast('success', res.msg);
                this.getAllInventoryDetails();
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }

  async assignItemInventory(data) {
    const popover = await this.modalController.create({
      component: AssignInventoryItemPage,
      cssClass: 'inventory-modal',
      showBackdrop: true,
      componentProps: { inventoryItem: data }
    });
    this.modalController.dismiss();
    await popover.present();
    popover.onDidDismiss().then(resp => {
      // console.log("fefre",resp )
      if (resp.data && resp.data.status == "update") {
        this.getAllInventoryDetails();
        this.getInventoryHistory();
      }
    })
  }

  getInventoryHistory() {
    this.commonService.presentLoading();
    this.authService.userLogin.subscribe((resp: any) => {
      if (resp) {
        this.commonService.getAssignItemDetail({ organisationId: resp.organisationId }).then((res: any) => {
          // console.log(res);
          if (res.msg) {
            this.historyErrorMsg = res.msg;
            // this.commonService.showToast('error',res.msg)
          } else {
            this.historyDetails = res.result;
            this.historyDetailsReal = res.result;
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
    })
  }

  downloadFormat() {
    window.location.assign("./assets/inventoryExcel.xlsx")
  }

  fileUpload(event) {
    this.uploadFile = event.target.firstChild.files[0];
  }

  uploadDetails() {
    if (this.uploadFile) {
      const formData = new FormData();
      formData.append('xlsx', this.uploadFile);
      formData.append('organisationId', this.organisationId)
      this.commonService.importInventory(formData).then((res: any) => {
        if (res.code == 1) {
          this.commonService.showToast("success", res.msg);
          this.getAllInventoryDetails();
          this.getInventoryHistory();
          this.uploadFile = ''
        } else {
          this.commonService.showToast("error", res.msg)
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
      this.commonService.showToast("error", "Please upload xlsx file")
    }
  }

  downloadDetails() {
    this.commonService.downloadInventory()
  }

  ///Added by Parul for applying filter

  filterChanged(ev) {
    this.filterr = [];
    this.columnSelect = ev;
    if (this.filterCol[ev] && ev != "isReturn") {
      this.filterCol[ev].forEach(element1 => {
        this.filterr.push({ label: element1, type: "checkbox", value: element1 })
      });
    }
    else if (ev == "isReturn") {
      this.filterCol[ev].forEach(element1 => {
        if (element1 == 0)
          this.filterr.push({ label: "Not Available", type: "checkbox", value: element1 })
        else if (element1 == 1)
          this.filterr.push({ label: "Available", type: "checkbox", value: element1 })
      });
    }
    this.presentAlertPrompt(this.filterr)
  }
  ///Added by parul to show radio button when select on filter icon
  async presentAlertPrompt(filter) {
    const alert = await this.alertController.create({
      inputs: filter,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Ok',
          handler: (data) => {

            if (this.columnSelect == "ram") {
              data = data.map(Number);
            }
            let filterData = [];
            this.response1.forEach(element => {
              if (data.includes(element[this.columnSelect])) {
                filterData.push(element)
              }
            });
            this.response = filterData
            // console.log(filterData)
          }
        }
      ]
    });
    await alert.present();
  }

  searchEmployee(event) {
    let searchTerm = event.target.value;
    this.historyDetails = searchTerm ? this.historyDetailsReal.filter(e => (e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || (e.employeeName).toUpperCase().includes(searchTerm.toUpperCase()) || (e.employeeName).includes(searchTerm))) : this.historyDetailsReal;
    // if(this.historyDetails.length<=0){
    //   this.commonService.showToast("error","User Not Found");
    //   this.historyDetails = this.historyDetailsReal
    // }
  }
}
