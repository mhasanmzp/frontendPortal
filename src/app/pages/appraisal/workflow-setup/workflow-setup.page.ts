import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AppraisalService } from 'src/app/services/appraisal.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-workflow-setup',
  templateUrl: './workflow-setup.page.html',
  styleUrls: ['./workflow-setup.page.scss'],
})
export class WorkflowSetupPage implements OnInit {

  constructor(private router: Router,
    private authService: AuthService,
    private appraisalService: AppraisalService,
    private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
  }
  flowSetup(){
    this.router.navigate(['/approval-screen']);
  }
  amountSetup(){
    this.router.navigate(['/amount-setup']);
  }

}
