import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-conveyance',
  templateUrl: './conveyance.page.html',
  styleUrls: ['./conveyance.page.scss'],
})
export class ConveyancePage implements OnInit {
  isModalOpen = false;
  isDisplayOpen = false;
  allConveyance: any;
  singleConveyanceData: any;
  visiblebutton: boolean = false;
  isApiCallInProgress: boolean = false;
  values = [
    {
      from: '',
      whereTo: '',
      vehicleType: '',
      travelDate: '',
      km: '',
      amount: '',
      comment: '',
      approvedAmount:'N/A'
    },
  ];

  constructor(
    public modalController: ModalController,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.fetchConveyance();
  }

  // field color based on status
  getStatusColor(status: string): { [key: string]: string } {
    switch (status.toLowerCase()) {
      case 'approved':
        return { color: 'green' };
      case 'new':
        return { color: 'blue' };
        case 'in-progress':
          return { color: 'orange' };
      case 'rejected':
        return { color: 'red' };
      default:
        return {}; // Default to no additional styles
    }
  }

  createConveyance() {
    this.isModalOpen = true;
  }
  hasDuplicateDate = (array) => {
    const ageMap = new Map();
    // debugger
    for (const person of array) {
      const { travelDate } = person;
      console.log('travelDate is', person);
      if (ageMap.has(travelDate)) {
        // If the age is already in the map, it's a duplicate
        return true;
      } else {
        // Otherwise, add the age to the map
        ageMap.set(travelDate, true);
      }
    }

    // No duplicate ages found
    return false;
  };
  onTravelDateChange() {
    // Handle the change event here
    const result = this.hasDuplicateDate(this.values);
    console.log('Travel date changed result is:', result);
    // Additional logic as needed
    if (result) {
      this.visiblebutton = true;
      this.commonService.showToast('error', 'Select Another Date');
    } else {
      this.visiblebutton = false;
    }
  }
  close() {
    console.log('close runs');
    this.values = [
      {
        from: '',
        whereTo: '',
        vehicleType: '',
        travelDate: '',
        km: '',
        amount: '',
        comment: '',
        approvedAmount:'N/A'
      },
    ];
    this.isModalOpen = false;
  }

  fetchConveyance() {
    this.commonService.presentLoading();

    let userId = +localStorage.getItem('userId');
    this.commonService
      .getConveyance({
        employeeId: userId,

        employeeIdMiddleware: userId,
        permissionName: 'Tasks',
      })
      .then(
        (res: any) => {
          console.log('response', res);
          res.map((item:any) => {
            if (item.isApprovedByReportingManager == 0) {
              item.isApprovedByReportingManager = 'false';
            } else {
              item.isApprovedByReportingManager = 'true';
            }

            if (item.isApprovedByAvp == 0) {
              item.isApprovedByAvp = 'false';
            } else {
              item.isApprovedByAvp = 'true';
            }
          });
          this.allConveyance = res;
        },
        (error) => {
          this.commonService.showToast('error', error.error.msg);
          if (error.error.statusCode == 401) {
            localStorage.clear();
            sessionStorage.clear();
          }
        }
      );
  }

  addValue(i) {
    this.values.push({
      from: '',
      whereTo: '',
      vehicleType: '',
      travelDate: '',
      km: '',
      amount: '',
      comment: '',
      approvedAmount:'N/A'
    });
    console.log(this.values);
  }
  removeValue(i) {
    if (i != 0) {
      this.values.splice(i, 1);
    }
    this.onTravelDateChange();
  }
  onSubmit() {
    let hasLoggedMessage = false;
    this.values.forEach((obj, index) => {
      // Iterate through the keys of each object
      Object.keys(obj).forEach((key) => {
        // Check if the value of the key is null or undefined
        if (obj[key] === '') {
          // Log the message only if it hasn't been logged before
          if (!hasLoggedMessage) {
            this.commonService.showToast(
              'error',
              'Please Fill the Mandatory Fields'
            );
            hasLoggedMessage = true; // Set the flag to true to indicate that the message has been logged
          }
        }
      });
    });

    // If no message has been logged, log a message indicating that all values are valid
    if (!hasLoggedMessage) {
      if (this.isApiCallInProgress) {
        this.commonService.presentLoading1();
        return;
      }
      this.isApiCallInProgress = true;
      this.commonService.presentLoading1();

      let userId = +localStorage.getItem('userId');

      let payload = {
        employeeId: userId,
        permissionName: 'Dashboard',
        employeeIdMiddleware: userId,
        travelData: this.values,
      };
      console.log('payload before submittingf', payload);

      this.commonService.createConveyance(payload).then((resp) => {
        this.isApiCallInProgress = false;
        this.close();
        this.fetchConveyance();
        this.commonService.showToast('success', 'Submit succesfully');
        this.commonService.loadingDismiss1();
      });
    }
  }

  // display Data
  displayData(data: any) {
    console.log(data);
    this.singleConveyanceData = data.travelData;
    this.isDisplayOpen = true;
  }

  displayClose() {
    this.isDisplayOpen = false;
  }
}
