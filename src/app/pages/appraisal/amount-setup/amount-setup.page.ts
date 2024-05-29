import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AppraisalService } from 'src/app/services/appraisal.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-amount-setup',
  templateUrl: './amount-setup.page.html',
  styleUrls: ['./amount-setup.page.scss'],
})
export class AmountSetupPage implements OnInit {
  fetchDepartment: any;
  data1: any = localStorage.getItem('userId');
  fetchEmployee: any;
  amountForm: any;
  appraisalAmount: any;
  amount: any;
  constructor(
    private activated: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private appraisalService: AppraisalService,
    private toast: ToastController
  ) {
    this.amountForm = this.formBuilder.group({
      departmentId: ['', Validators.required],
      designation: [''],
      year: [''],
      excellentAmount: [''],
      veryGoodAmount: [''],
      goodAmount: [''],
      averageAmount: [''],
    });
  }
  ngOnInit() {
    this.getDepartment();
    this.showAppraisalAmount();
  }
  getDepartment() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.data1,
      employeeId: this.data1,
    };
    this.appraisalService.department(formData).then((data: any) => {
      this.fetchDepartment = data;
      // console.log("fetch",data);
    });
  }
  saveEmployeeAppraisalAmount() {
    // console.log(this.amountForm.value);
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.data1,
      employeeId: this.data1,
      departmentId: this.amountForm.value.departmentId,
      designation: this.amountForm.value.designation,
      year: this.amountForm.value.year,
      excellentAmount: this.amountForm.value.excellentAmount,
      vgoodAmount: this.amountForm.value.veryGoodAmount,
      goodAmount: this.amountForm.value.goodAmount,
      averageAmount: this.amountForm.value.averageAmount,
    };
    this.appraisalService
      .employeeAppraisalAmount(formData)
      .then((data: any) => {
        this.appraisalAmount = data;
        this.presentToast();
        this.amountForm.reset();
      });
  }
  showAppraisalAmount() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.data1,
      employeeId: this.data1,
    };
    console.log('data',formData);
    this.appraisalService.employeeAmountShow(formData).then((data: any) => {
      this.amount = data.message;
      // console.log('amount',data, this.amount);
    });
  }
  async presentToast() {
    const toast = await this.toast.create({
      message: 'Submitted successfully!',
      duration: 200,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }
  clearForm() {
    this.amountForm.reset();
  }
}
