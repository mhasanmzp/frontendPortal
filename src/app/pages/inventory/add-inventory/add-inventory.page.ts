import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.page.html',
  styleUrls: ['./add-inventory.page.scss'],
})
export class AddInventoryPage implements OnInit {
  inventoryForm: FormGroup;
  status = [
    { value: 'working', name: 'Working' },
    { value: 'notWorking', name: 'Not Working' },
    { value: 'repair', name: 'Repairing' }
  ]
  organizationId: any;
  inventoryItemDetails: any;
  showAdminPassword = false;
  showSystemPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private commonService: CommonService,
    private router: Router) { }

  ngOnInit() {
    this.authService.userLogin.subscribe((resp: any) => {
      this.organizationId = resp.organisationId;
    })

    this.form();

    this.inventoryItemDetails = window.history.state.itemDetail;
    console.log('details', this.inventoryItemDetails)
    if (this.inventoryItemDetails) {
      this.itemType.setValue(this.inventoryItemDetails.itemType);
      this.companyBrand.setValue(this.inventoryItemDetails.companyBrand);
      this.serialnumber.setValue(this.inventoryItemDetails.serialnumber);
      this.modelNumber.setValue(this.inventoryItemDetails.modelNumber);
      this.hostName.setValue(this.inventoryItemDetails.hostName);
      this.dateofpurchase.setValue(this.inventoryItemDetails.dateofpurchase);
      this.orderNumber.setValue(this.inventoryItemDetails.orderNumber);
      this.dateofIssue.setValue(this.inventoryItemDetails.dateofIssue);
      this.ram.setValue(this.inventoryItemDetails.ram);
      this.systemPassword.setValue(this.inventoryItemDetails.systemPassword);
      this.uniqueId.setValue(this.inventoryItemDetails.uniqueId);
      this.accessories.setValue(this.inventoryItemDetails.accessories);
      this.warrantyPeriod.setValue(this.inventoryItemDetails.warrantyPeriod);
      this.workingStatus.setValue(this.inventoryItemDetails.workingStatus);
      this.adminPassword.setValue(this.inventoryItemDetails.adminPassword);
      this.isReturn.setValue(this.inventoryItemDetails.isReturn);
      this.pin.setValue(this.inventoryItemDetails.pin);
    }
  }

  form() {
    this.inventoryForm = this.fb.group({
      itemType: ['', Validators.required],
      companyBrand: ['', Validators.required],
      serialnumber: ['', Validators.required],
      modelNumber: ['', Validators.required],
      hostName: ['', Validators.required],
      dateofpurchase: ['', Validators.required],
      orderNumber: ['', Validators.required],
      dateofIssue: ['', Validators.required],
      ram: ['', Validators.required],
      systemPassword: ['', Validators.required],
      uniqueId: ['', Validators.required],
      accessories: ['', Validators.required],
      warrantyPeriod: ['', Validators.required],
      workingStatus: ['', Validators.required],
      adminPassword: ['', Validators.required],
      isReturn: ['', Validators.required],
      pin: ['', Validators.required]
    })
  }

  get itemType() { return this.inventoryForm.get('itemType') }
  get companyBrand() { return this.inventoryForm.get('companyBrand') }
  get serialnumber() { return this.inventoryForm.get('serialnumber') }
  get modelNumber() { return this.inventoryForm.get('modelNumber') }
  get hostName() { return this.inventoryForm.get('hostName') }
  get dateofpurchase() { return this.inventoryForm.get('dateofpurchase') }
  get orderNumber() { return this.inventoryForm.get('orderNumber') }
  get dateofIssue() { return this.inventoryForm.get('dateofIssue') }
  get ram() { return this.inventoryForm.get('ram') }
  get systemPassword() { return this.inventoryForm.get('systemPassword') }
  get uniqueId() { return this.inventoryForm.get('uniqueId') }
  get accessories() { return this.inventoryForm.get('accessories') }
  get warrantyPeriod() { return this.inventoryForm.get('warrantyPeriod') }
  get workingStatus() { return this.inventoryForm.get('workingStatus') }
  get adminPassword() { return this.inventoryForm.get('adminPassword') }
  get isReturn() { return this.inventoryForm.get('isReturn') }
  get pin() { return this.inventoryForm.get('pin') }

  addInventory() {
    this.inventoryForm.value.organisationId = this.organizationId
    console.log(this.inventoryForm.value)

    this.commonService.createInventory(this.inventoryForm.value).then((res: any) => {
      console.log(res);
      if (res.msg) {
        this.commonService.showToast('error', res.msg)
      } else {
        this.commonService.showToast('success', 'Item created successfully!')
        this.router.navigate(['/inventory'])
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

  updateInventoryItem() {
    this.inventoryForm.value.organisationId = this.organizationId;
    this.inventoryForm.value.id = this.inventoryItemDetails.id;

    console.log(this.inventoryForm.value)
    this.commonService.updateInventoryItem(this.inventoryForm.value).then((res: any) => {
      console.log(res);
      // if(res.msg){
      //   this.commonService.showToast('error',res.msg);
      // }else{
      this.commonService.showToast('success', 'Item updated successfully!')
      this.router.navigate(['/inventory'])
      // }
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  showHidePassword(data) {
    let password;
    if (data == 'admin') {
      password = document.querySelector('#AdminPassword');
      this.showAdminPassword = !this.showAdminPassword
    } else {
      password = document.querySelector('#SystemPassword');
      this.showSystemPassword = !this.showSystemPassword
    }

    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
  }

}
