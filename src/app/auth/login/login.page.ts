// import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, IonInput, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
// import { UserService } from '../../services/user.service';
// import firebase from 'firebase/compat/app';
import * as Rx from "rxjs";
import { CommonService } from '../../services/common.service';
// import { HelperService } from '../../services/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  error: any;
  form: any;
  errorMessage: any;
  userId: any;
  showPassword = false;
  isApiCallInProgress:boolean = false;;

  constructor(
    public fb: FormBuilder,
    public commonService: CommonService,
    private navController: NavController,
    private menuController: MenuController,
    // private loadingService: LoadingService,
    private platform: Platform,
    private authService: AuthService,
    // private userService: UserService,
    // private helperService: HelperService,
    // private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
  }

  login() {
    let that = this;
    if (this.isApiCallInProgress) {
      this.commonService.presentLoading();
      return;
    }
    this.isApiCallInProgress = true;
    this.commonService.presentLoading();
    this.commonService.login(this.form.value).then((resp: any) => {
      localStorage.setItem('jwt_token',resp.headers.get('jwt_token'))
      console.log("our RESP is",resp.headers.get('jwt_token'));
      console.log("our RESP is",resp);

      if (resp && resp.body.userId) {
        localStorage.setItem('userId', JSON.stringify(resp.body.userId))
        localStorage.setItem('type', resp.body.type)
        // localStorage.setItem('token',resp.Access_Token)
        this.authService.userLogin.next(resp.body)
        this.commonService.showToast("success", "Login Successful!")
        this.isApiCallInProgress = false;
        setTimeout(() => {
          that.commonService.loadingDismiss();
        }, 500);
      } else {
        this.commonService.showToast("error", "Invalid Username or Password!")
        this.isApiCallInProgress = false;
      }
    }, error => {
      this.commonService.loadingDismiss();
      this.isApiCallInProgress = false;
      this.commonService.showToast("error", error.error)
      console.log(error);
    })

  }

  showHidePassword() {
    let password;
      password = document.querySelector('#OldPassword');
      this.showPassword = !this.showPassword
    
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
  }

}