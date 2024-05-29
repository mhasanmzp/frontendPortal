import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-project-sprint-details',
  templateUrl: './project-sprint-details.page.html',
  styleUrls: ['./project-sprint-details.page.scss'],
})
export class ProjectSprintDetailsPage implements OnInit {
  @Input() sprint: any;
  @Input() projectMembers: any;
  // @Input() projectId: any;
  @Input() teamBoardColumns: any;


  constructor( public modalController: ModalController, private commonService: CommonService) { }

  ngOnInit() {
    // console.log("this.item ", this.sprint)
    // console.log(this.projectMembers)
    // console.log(this.teamBoardColumns)
  }

  ionViewWillLeave(){
    this.modalController.dismiss();
  }

  close() {
    this.modalController.dismiss();
  }
}
