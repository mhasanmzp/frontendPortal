import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.page.html',
  styleUrls: ['./add-leave.page.scss'],
})
export class AddLeavePage implements OnInit {
  @Input() remainingLeave: any;

  leaveForm: FormGroup;
  image: any;
  totalDays: any;
  endDate: boolean = false;
  userId: any;
  employeeName: any;
  sumitAccess:boolean=false;

  constructor(private formBuilder: FormBuilder, public modalController: ModalController,
    private commonService: CommonService, private router: Router, private authService: AuthService) {

    this.leaveForm = this.formBuilder.group({
      leaveType: ['', Validators.required],
      sdate: ['', Validators.required],
      edate: ['', Validators.required],
      days: ['', Validators.required],
      upload: [''],
      reason: ['', Validators.required],
    });
  }

  get leaveType() { return this.leaveForm.get('leaveType') }
  get sdate() { return this.leaveForm.get('sdate') }
  get edate() { return this.leaveForm.get('edate') }
  get days() { return this.leaveForm.get('days') }
  get reason() { return this.leaveForm.get('reason') }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.days.setValue(0);
    this.getDays();
    console.log(this.remainingLeave)
  }

  close() {
    this.modalController.dismiss();
  }

  getDays() {
    this.commonService.presentLoading();
    this.commonService.getOneEmployee({ employeeId: this.userId }).then((res: any) => {
      console.log(res);
      this.employeeName = res['firstName'] + ' ' + res['lastName']
      this.commonService.loadingDismiss();
      let data = res[0].DOJ
      let firstDate = new Date(data),
        secondDate = new Date(),
        timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
      this.totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    }, error => {
      this.commonService.showToast('error', error.error.msg);
      if (error.error.statusCode == 401) {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/login')
      }
    })
  }

  dateDay(event) {
    if (this.leaveForm.value.leaveType == 'halfDay' || this.leaveForm.value.leaveType == 'halfDaySick' || this.leaveForm.value.leaveType == 'halfDayPaid') {
      this.days.setValue(0.5);
      this.edate.setValue(this.leaveForm.value.sdate)
      this.remainLeave2();
    } else {
      if (event == null) {
        this.days.setValue(0)
      }
      else if (this.leaveForm.value.sdate > this.leaveForm.value.edate) {
        // this.sdate.setValue(new Date().toISOString().slice(0, 10))
        // this.days.setValue(1);
        this.edate.setValue(this.leaveForm.value.sdate)
        console.log("start date is ",this.leaveForm.value.sdate)
        
      }
      else {
        let currentDate = new Date(this.leaveForm.value.sdate);
        let dateSent = new Date(this.leaveForm.value.edate);
        console.log("current date ",currentDate)
        console.log(Math.abs(Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24))) + 1);
        let diff = (Math.abs(Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24))) + 1);
        if (Number.isNaN(diff)) {
          this.days.setValue(0);
        } else {
          this.days.setValue(diff);
        }
        let formattedDate = new Date().toISOString().slice(0, 10);
        if(this.leaveForm.value.sdate<formattedDate){
          console.log("true");
          // this.commonService.showToast('error',"Please Select Current Date OR Future Date");
          this.sumitAccess=true;
         
        }
        else{
           console.log("false ");
           this.sumitAccess=false;
        }
        this.remainLeave();
      }
    }
  }

  remainLeave() {
    if (this.leaveForm.value.leaveType == 'sick' && this.remainingLeave.sick < this.days.value) {
      this.remainingLeave.sick == 0 ? this.commonService.showToast('warning', `You can not apply sick leave`) : this.commonService.showToast('warning', `You can only apply ${this.remainingLeave.sick} day sick leave`)
    } else if (this.leaveForm.value.leaveType == 'paid' && this.remainingLeave.paid < this.days.value) {
      this.remainingLeave.paid == 0 ? this.commonService.showToast('warning', `You can not apply paid/planned leave`) : this.commonService.showToast('warning', `You can only apply ${this.remainingLeave.paid} day paid/planned leave`)
    } else if (this.leaveForm.value.leaveType == 'WFH' && this.remainingLeave.wfh < this.days.value) {
      this.remainingLeave.wfh == 0 ? this.commonService.showToast('warning', `You can not apply WFH`) : this.commonService.showToast('warning', `You can only apply ${this.remainingLeave.wfh} day WFH`)
    }
  }
  remainLeave2() {
    if (this.leaveForm.value.leaveType == 'halfDaySick' && this.remainingLeave.sick < this.days.value) {
      this.remainingLeave.sick == 0 ? this.commonService.showToast('warning', `You can not apply sick leave`) : this.commonService.showToast('warning', `You can only apply ${this.remainingLeave.sick} day sick leave`)
    } else if (this.leaveForm.value.leaveType == 'halfDayPaid' && this.remainingLeave.paid < this.days.value) {
      this.remainingLeave.paid == 0 ? this.commonService.showToast('warning', `You can not apply paid/planned leave`) : this.commonService.showToast('warning', `You can only apply ${this.remainingLeave.paid} day paid/planned leave`)
    }
  }
  fileUpload(event) {
    this.image = event.target.firstChild.files[0];
    console.log(this.image)
  }

  leavetype(event) {
    let value = event.target.value;
    if (value == 'halfDay' || value == 'halfDaySick' || value == 'halfDayPaid') {
      this.days.setValue(0.5);
      this.edate.setValue(this.leaveForm.value.sdate)
      this.remainLeave2();
    } else {
      this.sdate.setValue(new Date().toISOString().slice(0, 10))
      this.days.setValue(1);
      this.edate.setValue(this.leaveForm.value.sdate)
      this.remainLeave()
    }
  }

  submit() {
    if ((this.leaveForm.value.days <= this.remainingLeave.wfh) && (this.leaveForm.value.leaveType == 'WFH')) {
      // console.log('Leave Applied')
      this.submitForm()
    }
    else if ((this.leaveForm.value.days <= this.remainingLeave.sick) && (this.leaveForm.value.leaveType == 'sick' || this.leaveForm.value.leaveType == 'halfDaySick')) {
      // console.log('Leave Applied')
      this.submitForm()
    }
    else if ((this.leaveForm.value.days <= this.remainingLeave.paid) && (this.leaveForm.value.leaveType == 'paid' || this.leaveForm.value.leaveType == 'halfDayPaid')) {
      // console.log('Leave Applied')
      this.submitForm()
    }
    else if (this.leaveForm.value.leaveType == 'LOP' || this.leaveForm.value.leaveType == 'halfDay') {
      // console.log('Leave Applied')
      this.submitForm()
    }
    else {
      // console.log('Not Applied')
      this.commonService.showToast('error', 'You can not apply leave.')
    }
  }

  submitForm() {
    if (this.leaveForm.value.days > 2 && this.leaveForm.value.leaveType == 'sick') {

      var fileToLoad = this.image;
      var fileReader = new FileReader();
      fileReader.addEventListener('load', (event: any) => {
        var srcData = event.target.result as string;

        console.log("this.authService.employeeName ", this.authService.employeeName);
        let formData = {
          'certificate': srcData,
          'leaveType': this.leaveForm.value.leaveType,
          'reason': this.leaveForm.value.reason,
          'days': this.leaveForm.value.days,
          'employeeId': this.authService.userId,
          'sdate': this.leaveForm.value.sdate,
          'edate': this.leaveForm.value.edate,
          'organisationId': this.authService.organisationId,
          'employeeName': this.authService.employeeName,
          'status': 'New'
        }
        this.commonService.applyLeave(formData).then((res: any) => {
          console.log(res);
          if (res) {
            this.close();
            this.router.navigateByUrl('/leaves');
          }
        }, error => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigateByUrl('/login')
          }
        })
      })
      fileReader.readAsDataURL(fileToLoad);
    }
    else {
      if (this.leaveForm.value.leaveType) {
        let formData = {
          'leaveType': this.leaveForm.value.leaveType,
          'reason': this.leaveForm.value.reason,
          'days': this.leaveForm.value.days,
          'employeeId': this.authService.userId,
          'sdate': this.leaveForm.value.sdate,
          'edate': this.leaveForm.value.edate,
          'organisationId': this.authService.organisationId,
          'employeeName': this.authService.employeeName,
          'status': 'New'
        }
        this.commonService.applyLeave(formData).then((res: any) => {
          console.log(res);
          if (res) {
            this.close();
            this.router.navigateByUrl('/leaves');
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
      else {
        this.commonService.showToast('error', 'Please select leave type.')
      }
    }
  }
}
