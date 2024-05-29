import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers-details',
  templateUrl: './customers-details.page.html',
  styleUrls: ['./customers-details.page.scss'],
})
export class CustomersDetailsPage implements OnInit {
  basic: FormGroup;
  customerDetail: any = [];
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public commonService: CommonService,) { }

  ngOnInit() {
    this.form();
    this.customerDetail = window.history.state.customerDetail;
    console.log(this.customerDetail);
    if (this.customerDetail) {
      this.basic.patchValue({
        firstName: this.customerDetail.firstName,
        lastName: this.customerDetail.lastName,
        companyName: this.customerDetail.companyName,
        phone: this.customerDetail.phone,
        website: this.customerDetail.website,
        gstNumber: this.customerDetail.gstNumber,
        portalAccess: this.customerDetail.portalAccess,
        email: this.customerDetail.email,
        password: this.customerDetail.password
      });
    }
    // else{
    //   this.router.navigateByUrl('/sales/customers')
    // }
  }

  form() {
    this.basic = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      companyName: [''],
      phone: [''],
      website: [''],
      gstNumber: [''],
      portalAccess: [true, Validators.required],
      email: ['', [Validators.pattern('[^ @]*@[^ @]*'), Validators.required]],
      password: ['']
    });
  }


  submitDetails() {
    console.log(this.basic)
    if (this.basic.invalid) {
      this.commonService.showToast('error', 'Please fill the correct details')
    } else {
      console.log(this.basic.value);
      this.commonService.createCustomer(this.basic.value).then((resp: any) => {
        this.commonService.showToast('success', 'New Customer Created Successfully!');
        this.router.navigate(['/sales/customers']);
        console.log(resp);
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    }
  }

  updateDetails() {
    console.log(this.basic)
    if (this.basic.invalid) {
      this.commonService.showToast('error', 'Please fill the correct details')
    } else {
      let formData = Object.assign(this.basic.value, { customerId: this.customerDetail.customerId });
      console.log(formData)
      this.commonService.updateCustomer(formData).then((resp: any) => {
        this.commonService.showToast('success', 'Customer Details Updated Successfully!');
        this.router.navigate(['/sales/customers']);
        console.log(resp);
      }, error => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login')
        }
      })
    }
  }
}
