import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-cmf-page',
  templateUrl: './cmf-page.component.html',
  styleUrls: ['./cmf-page.component.scss'],
})
export class CmfPageComponent implements OnInit {
  fetchdata: any[] = [];
  isModalOpen = false;
  leavedetails: any;
  cmfForm: FormGroup;
  changeForm: FormGroup;
  changeReviewForm: FormGroup;
  changeForwardForm: FormGroup;
  singleCmfData: any;
  isDisplayOpen = false;
  projectList: any[] = [];
  userId: any;
  inputValue: string = "Ashish Sharma";


  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private commonservice: CommonService,
    private projectservice: ProjectService
  ) {
    this.cmfForm = this.fb.group({
      projectName: ['', Validators.required],
      clientLocation: ['', Validators.required],
      requestedBy: ['', Validators.required],
      department: ['', Validators.required],
      contact: ['', Validators.required],
      requestType: ['', Validators.required],
      priority: ['', Validators.required],
      changeDesc: ['', Validators.required],
      benefit: ['', Validators.required],
      painArea: ['', Validators.required],
      userBenefited: ['', Validators.required],
      costTime: ['', Validators.required],
      category: ['', Validators.required],
      resolutionType: ['', Validators.required],
      resolution: ['', Validators.required],
      recommendation: ['', Validators.required],
      analysis: ['', Validators.required, Validators.pattern['0']],
      testing: ['', Validators.required, Validators.pattern['0']],
      total: ['', Validators.required, Validators.pattern['00']],
    });

    // change Form
    this.changeForm = this.fb.group({
      status: ['', Validators.required],
    });

    // for reviewer
    this.changeReviewForm = this.fb.group({
      frwForReview: ['', Validators.required],
      status: ['', Validators.required],
    });
    // for dforwardto
    this.changeForwardForm = this.fb.group({
      fwdForApproval: ['354 Ashish Sharma'],
      status: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.fetchCmf();
    this.fetchProjectList();
    this.userId = +localStorage.getItem('userId');

    this.cmfForm.get('analysis').valueChanges.subscribe((value) => {
      this.updateField3();
    });

    this.cmfForm.get('testing').valueChanges.subscribe((value) => {
      this.updateField3();
    });
  }


  onInputChange(event: any) {
    // Reset the value whenever the user tries to change it
    event.target.value = this.inputValue;
  }
  isManagerAllowed(id: number) {
    if (id === 354) {
      return true;
    }
  }
  // this function is updating the value of total hours based on analysis and testing hours
  updateField3() {
    // debugger;
    const field1Value = parseFloat(this.cmfForm.get('analysis').value);
    const field2Value = parseFloat(this.cmfForm.get('testing').value);

    if (!isNaN(field1Value) && isNaN(field2Value)) {
      // Case 1: If only field1 has a value
      this.cmfForm.get('total').setValue(field1Value);
    } else if (isNaN(field1Value) && !isNaN(field2Value)) {
      // Case 2: If only field2 has a value
      this.cmfForm.get('total').setValue(field2Value);
    } else if (!isNaN(field1Value) && !isNaN(field2Value)) {
      // Case 3: If both field1 and field2 have values, update field3 with the sum
      this.cmfForm.get('total').setValue(field1Value + field2Value);
    } else {
      // Reset field3 if none of the above conditions is met
      this.cmfForm.get('total').setValue(null);
    }
  }

  fetchCmf() {
    this.commonservice.presentLoading1();
    
    this.authservice.fetchCmfData().then(
      (res: any) => {
        this.fetchdata = res.data;
        this.commonservice.loadingDismiss1();
      },
      (error) => {
        this.commonservice.showToast('error', error.error.msg);

        this.commonservice.loadingDismiss1();
      }
    );
  }

  getStatusColor(status: string) {
    console.log(status);
    switch (status) {
      case 'Approved':
        return { color: 'green' };
      case 'New':
        return { color: 'blue' };
      case 'In Progress':
        return { color: 'orange' };
      case 'Testing':
        return { color: 'purple' };
      case 'Released':
        return { color: 'grey' };
      case 'Rejected':
        return { color: 'red' };
      default:
        return {}; // Default to no additional styles
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.cmfForm.reset();
  }

  fetchProjectList() {
    // this.commonservice.presentLoading1();
    let formData = {
      organisationId: this.authservice.organisationId,
    };
    this.projectservice.fetchAllProjects(formData).then(
      (resp: any) => {
        this.projectList = resp;
        console.log('fetchAllProjects', this.projectList);

        // this.commonservice.loadingDismiss1();
      },
      (error) => {
        this.commonservice.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          // localStorage.clear();
          // sessionStorage.clear();
          this.commonservice.loadingDismiss1();
        }
      }
    );
  }
  onSubmit() {
    this.commonservice.presentLoading1();
    if (this.cmfForm.valid) {
      const formData = this.cmfForm.value;
      console.log('formdata', formData);
      this.authservice.cmfdata(formData).then(
        (res: any) => {
          console.log(res, 'data CMF');
          this.commonservice.showToast('success', 'Submit succesfully');
          this.fetchCmf();
          this.isModalOpen = false;
          this.commonservice.loadingDismiss1();
        },
        (error) => {
          this.commonservice.showToast('error', error.error.msg);
          console.log('something went wrong');
          this.isModalOpen = false;
          this.commonservice.loadingDismiss1();
        }
      );
    }
  }

  displayData(data: any) {
    console.log(data);
    this.singleCmfData = data;

    this.isDisplayOpen = true;
  }

  displayClose() {
    this.isDisplayOpen = false;
    this.changeForm.reset();
  }

  onChangeSubmit() {
    this.commonservice.presentLoading1();
    if (this.changeForm.valid) {
      const formData = this.changeForm.value;
      formData['crNo'] = this.singleCmfData.crNo;
      console.log('formdata', formData);
      this.authservice.cmfdata(formData).then(
        (res: any) => {
          console.log(res, 'data CMF');
          this.commonservice.showToast(
            'success',
            'Record Updated Successfully'
          );
          this.fetchCmf();
          this.changeForm.reset();
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        },
        (error) => {
          this.commonservice.showToast('error', error.error.msg);
          console.log('something went wrong');
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        }
      );
    }
  }
  onChangeReviewSubmit()
  {
    this.commonservice.presentLoading1();
    if (this.changeReviewForm.valid) {
      const formData = this.changeReviewForm.value;
      formData['crNo'] = this.singleCmfData.crNo;
      console.log('formdata', formData);
      this.authservice.cmfdata(formData).then(
        (res: any) => {
          console.log(res, 'data CMF');
          this.commonservice.showToast(
            'success',
            'Record Updated Successfully'
          );
          this.fetchCmf();
          this.changeReviewForm.reset();
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        },
        (error) => {
          this.commonservice.showToast('error', error.error.msg);
          console.log('something went wrong');
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        }
      );
    }
  }
  onChangeForwardSubmit()
  {
    this.commonservice.presentLoading1();

    if (this.changeForwardForm.valid) {
      const formData = this.changeForwardForm.value;
      formData['crNo'] = this.singleCmfData.crNo;
      console.log('formdata', formData);
      this.authservice.cmfdata(formData).then(
        (res: any) => {
          console.log(res, 'data CMF');
          this.commonservice.showToast(
            'success',
            'Record Updated Successfully'
          );
          this.fetchCmf();
          // this.changeReviewForm.reset();
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        },
        (error) => {
          this.commonservice.showToast('error', error.error.msg);
          console.log('something went wrong');
          this.isDisplayOpen = false;
          this.commonservice.loadingDismiss1();
        }
      );
    }
  }
}
