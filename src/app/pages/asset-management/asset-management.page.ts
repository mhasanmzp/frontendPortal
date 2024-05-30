// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-asset-management',
//   templateUrl: './asset-management.page.html',
//   styleUrls: ['./asset-management.page.scss'],
// })
// export class AssetManagementPage implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { Component } from '@angular/core';

@Component({
  selector: 'app-asset-management',
  templateUrl: './asset-management.page.html',
  styleUrls: ['./asset-management.page.scss'],
})
export class AssetManagementPage {
  segment = 'GRN';

  segmentChanged(event: any) {
    this.segment = event.detail.value;
  }
}
