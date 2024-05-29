import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ProjectService } from 'src/app/services/project.service';
import {CommonService} from '../../services/common.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-epic-details',
  templateUrl: './project-epic-details.page.html',
  styleUrls: ['./project-epic-details.page.scss'],
})
export class ProjectEpicDetailsPage implements OnInit {
  @Input() epic: any;
  @Input() projectMembers: any;
  showField: boolean = false;

  constructor(private alertController: AlertController,private router:Router,
    public modalController: ModalController,private projectService:ProjectService, private commonService: CommonService
  ) { }

  ngOnInit() {
    console.log(this.epic)
    console.log(this.projectMembers)
    let userId = localStorage.getItem('userId');

    this.projectMembers.forEach(element => {
      if (element.type == 'Manager' && element.employeeId == userId) {
        console.log("Manager")
        this.showField = true
      }
    });
  }

  //added by ritika
  async deleteEpic() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'You want to delete this epic. All stories and tasks inside this epic will be deleted as well.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.projectService.deleteProjectEpics({'id':this.epic.id}).then((res:any)=>{
              if(res.status == true){
                this.modalController.dismiss({ item: this.epic.id, action: 'delete'});
              }
            },error=>{
              this.commonService.showToast('error', error.error.msg);
              if (error.error.statusCode == 401) {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigateByUrl('/login')
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }

  taskNameUpdated(event:any){}

  close(){
    this.modalController.dismiss();
  }

  getAssigneeDetails(epic, data){
    let user = this.projectMembers.filter(e => e.employeeId == epic.assignee);
    if(user.length > 0)
    return user[0][data] || ''
     else
     return ''
  }

  getReporterDetails(epic, data){
    let user = this.projectMembers.filter(e => e.employeeId == epic.reporter);
    if(user.length > 0)
    return user[0][data] || ''
     else
     return ''
  }

}
