import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage implements OnInit {
  post: any = {};
  quillConfig = {
    //toolbar: '.toolbar',
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button

        ['link', 'image', 'video']
      ],

    },
    "emoji-toolbar": false,
    "emoji-textarea": false,
    "emoji-shortname": false,
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            console.log("enter");
            return true;
          }
        }
      }
    }
  }
  user: any = {};

  constructor(
    public modalCtrl: ModalController,
    private commonService: CommonService,
    private authService: AuthService, private router: Router,
    private dashboardService: DashboardService,
    private projectService: ProjectService,
  ) { }

  ngOnInit() {
    this.authService.userLogin.subscribe((resp: any) => {
      if (resp && Object.keys(resp).length > 0) {
        this.user = resp
      }
    })
  }

  createPost() {
    if (this.post.postDescription) {
      this.commonService.presentLoading();
      this.dashboardService.createPost(this.post).then((resp: any) => {
        this.post.postId = resp.postId;
        this.post.createdAt = resp.createdAt;
        this.post.likes = [];
        this.post.firstName = this.user.firstName
        this.post.lastName = this.user.lastName
        this.post.image = this.user.image
        this.commonService.showToast("success", "New Post Created!");
        this.commonService.loadingDismiss();
        this.modalCtrl.dismiss({ post: this.post });
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
      this.commonService.showToast('error', 'Please fill valid input')
    }
  }



}
