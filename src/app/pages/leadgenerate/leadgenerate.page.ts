import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-leadgenerate',
  templateUrl: './leadgenerate.page.html',
  styleUrls: ['./leadgenerate.page.scss'],
})
export class LeadgeneratePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  selectedProject: string = 'select Project';
  selectedSegment: string = 'buttons';
  formData: any = {};
  isModalOpen = false;
  isDisplayOpen = false;
  clientOnboard: FormGroup;
  clientData : any[] =[];
  


  isFormSubmitted: boolean = false;
  


  constructor(private fb: FormBuilder, private commonservice: CommonService,private authservice:AuthService) {
    this.clientOnboard = this.fb.group({
      fullName: ['', [Validators.required]],
      title: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      emailAddress: ['', [Validators.required,Validators.email]],
      phoneNo: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      companySize: ['', [Validators.required]],
      location: ['', [Validators.required]],
      websiteUrl: ['', [Validators.required]],
      clientHearAboutProducts: ['', [Validators.required]],
      startDateAndTimeline: ['', [Validators.required]],
      projectDescription: [''],
      decisionMakesContactDetails: [''],
      preferedCommunicationChannel: [''],
      followUpPreference: [''],
      additionalComment: [''],
      approved :[false],
      employeeIdMiddleware: ['144'],
      permissionName: ['Dashboard']
    })
  }


  ngOnInit() {
    this.fetchData();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');

  }

  confirm() {
    this.modal.dismiss();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }

  fetchData(){
    this.authservice.fetchleadGenerate().then((res: any)=>{    
        this.clientData = res.data;
        
        console.log(this.clientData,"fetchdata")
    })
    
  }


  submitForm() {
    console.log(this.clientOnboard, "clientonboard")
    const formData = this.clientOnboard.value;
    
    console.log(this.clientOnboard, "clientonboard")

    this.authservice.leadgenerateCreate(formData).then((res: any) => {
      console.log(res, "succes1")
      
      this.commonservice.showToast('success', "Client Onboard Succesfully");
      this.fetchData();
     
      this.formData.reset;
      this.cancel();
      this.isFormSubmitted = true;
    }, error => {
      this.commonservice.showToast('error', "Something  went wrong");
    })
    console.log(formData, "succes onboard")
  }

}
