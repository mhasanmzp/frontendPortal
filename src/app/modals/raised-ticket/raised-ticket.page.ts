import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raised-ticket',
  templateUrl: './raised-ticket.page.html',
  styleUrls: ['./raised-ticket.page.scss'],
})
export class RaisedTicketPage implements OnInit {
  ticketForm: FormGroup;
  image: any;
  employeeName: any;
  userId: any;
  allTicketData: any;
  commentArray: any = [];
  @Input() ticketData: any;
  enabled: boolean = false;
  isApiCallInProgress:boolean=false;


  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private router: Router,
    public commonService: CommonService
  ) {
    this.ticketForm = this.formBuilder.group({
      category: ['', Validators.required],
      upload: [''],
      comments: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.employeeName = localStorage.getItem('employeeName');
    this.userId = localStorage.getItem('userId');
    console.log(this.userId);
    console.log('input', this.ticketData);
    this.commentArray = this.ticketData.getComments;

    if (this.ticketData) {
      this.ticketForm.value.category = this.ticketData.ticket_category;
      this.ticketForm.value.comments = this.ticketData.description;
    }
    this.ticketForm.patchValue({
      category: this.ticketData.ticket_category,
      comments: this.ticketData.description,
    });

    // to disable update button based on status
    if (this.ticketData.status == 'Completed') {
      this.enabled = !this.enabled;
    }

  }

  close() {
    this.modalController.dismiss();
  }

  fileUpload(event) {
    this.image = event.target.firstChild.files[0];
    console.log(this.image);
  }

  // submit(flag){

  //   let formData = new FormData();
  //   formData.append('ticket_category',this.ticketForm.value.category)
  //   formData.append('attachment',this.ticketForm.value.upload)
  //   formData.append('description',this.ticketForm.value.comments)
  //   formData.append('employeeId',this.userId)
  //   formData.append('comments','')
  //   formData.append('assigned','')
  //   // formData.append('employeeName',this.employeeName)
  //   formData.append('status',flag)
  //   formData['ticket_category'] = this.ticketForm.value.category
  //   formData['attachment'] = this.ticketForm.value.upload
  //   formData['description'] = this.ticketForm.value.comments
  //   formData['employeeId'] = this.userId
  //   formData['comments'] = ''
  //   formData['assigned'] = ''
  //   // formData['employeeName'] = this.employeeName
  //   formData['status'] = flag

  //   this.commonService.saveGrievance(formData).then((resp=>{
  //     this.close()
  //   }))
  // }

  submit(flag: number) {
   
      if (this.isApiCallInProgress) {
        this.commonService.presentLoading();
        return;
      }
      this.isApiCallInProgress = true;
    this.commonService.presentLoading();

    let userId = +localStorage.getItem('userId');

    let formData = new FormData();
    formData['ticket_category'] = this.ticketForm.value.category;
    formData['attachment'] = this.ticketForm.value.upload;
    formData['description'] = this.ticketForm.value.comments;
    formData['employeeId'] = userId;
    formData['comments'] = '';
    formData['assigned'] = '';
    formData['status'] = flag;
    formData['ticketId'] = this.ticketData.ticketId;
    console.log('payload before submittingf', formData);
    this.commonService.saveGrievance(formData).then((resp) => {
      this.isApiCallInProgress = false;
      this.close();
      this.commonService.showToast('success', "Submit succesfully");
      this.getAllTicketData();
    });
  }

  addComment() {
    // debugger;
    this.commonService.presentLoading();

    let userId = +localStorage.getItem('userId');
    if (typeof this.ticketData.getComments == 'string') {
      this.ticketData.getComments = [];
    }
    if (this.ticketData.more_comment) {
      this.ticketData.getComments.push({
        empId: userId,
        comment: this.ticketData.more_comment,
        empName: this.ticketData.employeeName,
      });
    }
    this.ticketData.comments = this.ticketData.getComments;
    this.ticketData.comments == '';
    console.log('input', this.ticketData);

    this.commonService.updateTicketData(this.ticketData).then(
      (resp) => {
        this.commonService.showToast('success', 'Data Updated Successfully');

        this.close();
        this.getAllTicketData();
      },
      (error) => {
        this.commonService.showToast('error', error.error);
      }
    );
  }

  // this function is used to get the number of tickets for particular manager to pass in notification inside dashboard
  getAllTicketData() {
    this.commonService.presentLoading();

    let userId = +localStorage.getItem('userId');

    this.commonService.getAllGrievance({ employeeId: userId }).then(
      (res: any) => {
        console.table('response', res);
        this.allTicketData = res.length;
        this.allTicketData = res.filter((item) => {
          return item.status === 'New';
        }).length;
        this.commonService.setTicket(this.allTicketData);
      },
      (error) => {
        this.commonService.showToast('error', error.error.msg);
        if (error.error.statusCode == 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
        }
      }
    );
  }
}
