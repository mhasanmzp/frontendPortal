import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-create-conveyance',
  templateUrl: './create-conveyance.page.html',
  styleUrls: ['./create-conveyance.page.scss'],
})
export class CreateConveyancePage implements OnInit {
  createForm!: FormGroup;
  price: number;
  distance: number;
  flag: number = 1;

  values = [{ firstname: '', lastname: '' }];

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      from: ['', Validators.required],
      whereto: ['', Validators.required],
      vehicle: ['', Validators.required],
      distance: ['', Validators.required],
      date: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
    });

    this.price = 100;
    this.distance = 10;
  }

  close() {
    this.modalController.dismiss();
  }

  onSubmit(data: any) {
    if (this.createForm.valid) {
      console.log(data);
      this.commonService.presentLoading();

      let userId = +localStorage.getItem('userId');

      // let formData = new FormData();
      // formData['from'] = data.from;
      // formData['whereTo'] = data.whereto;
      // formData['vehicle'] = data.vehicle;
      // formData['distance'] = data.distance;
      // formData['date'] = data.date;
      // formData['price'] = data.price;
      // formData['comment'] = data.comment;
      // console.log('payload before submittingf', formData);

      let payload = {
        employeeId: userId,
        from: data.from,
        whereTo: data.whereto,
        vehicleType: data.vehicle,
        km: data.distance,
        comment: data.comment,
        permissionName: 'Tasks',
        employeeIdMiddleware: userId,
        amount: data.price,
        date: data.date,
      };
      console.log('payload before submittingf', payload);

      this.commonService.createConveyance(payload).then((resp) => {
        this.close();
        this.commonService.showToast('success', 'Submit succesfully');
        // subject behaviour to fetch updated data
        this.commonService.setConveyance(this.flag);
      });
    } else {
      this.commonService.showToast('error', 'Please fill all required fields');
    }
  }

  //
  removeValue(i) {
    if (i != 0) {
      this.values.splice(i, 1);
    }
  }
  addValue(i) {
    this.values.push({ firstname: '', lastname: '' });
    console.log(this.values);
  }
}
