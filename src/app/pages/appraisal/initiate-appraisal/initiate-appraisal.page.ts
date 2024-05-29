import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AppraisalService } from 'src/app/services/appraisal.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-initiate-appraisal',
  templateUrl: './initiate-appraisal.page.html',
  styleUrls: ['./initiate-appraisal.page.scss'],
})
export class InitiateAppraisalPage implements OnInit {

  fetch: any;
  selectedEmployeeIds: number[] = [];
  fetchEmployee: any;
  sendEmployeeData: any;
  selectedDropdown: any;
  employeeForm: FormGroup;
  data1: any = localStorage.getItem('userId');
  departmentName: any;
  //  data: any;
  constructor(
    private activated: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private appraisalService: AppraisalService,
    private toast: ToastController
  ) {
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.fetchDepartment();
    // this.fetchEmp();
  }
  fetchDepartment() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.data1,
      employeeId: this.data1,
    };
    this.appraisalService.department(formData).then((data: any) => {
      this.fetch = data;
      // console.log("fetch",data);
    });
  }
  fetchEmp() {
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.data1,
      employeeId: this.data1,
      name: this.departmentName,
    };
    console.log('formdata', formData);
    this.appraisalService.employeeList(formData).then((data: any) => {
      console.log('employee data',data);
      this.fetchEmployee = data.map((employee) => ({
        ...employee,
        isSelected: false,
        disabled: employee.flag === 1,
      }));
    });
  }
  onSelectionChange(data)
  {
    this.departmentName=data.detail.value;
// console.log("selected name is",data,this.departmentName);
this.fetchEmp();
  }
  sendListOfEmployee() {
    const selectedEmployees = this.fetchEmployee.filter(
      (employee) => employee.isSelected
    );
    this.selectedEmployeeIds = selectedEmployees.map(
      (employee) => employee.employeeId
    );
    // this.appraisalService.showToast('success', "Submitted Successfully");
    const formData = {
      permissionName: 'Tasks',
      employeeIdMiddleware: this.data1,
      entries: selectedEmployees.map((employee) => ({
        employeeId: employee.employeeId,
        disabled: employee.disabled,
      })),
    };
    this.appraisalService.initiateEmployee(formData).then((res: any) => {
      this.sendEmployeeData = res;
      // console.log("data",res);
      this.presentToast();
      this.employeeForm.reset();
    });
  }
  async presentToast() {
    const toast = await this.toast.create({
      message: 'Submitted successfully!',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }
  // clearForm() {
  //   this.amountForm.reset();
  // }
}
