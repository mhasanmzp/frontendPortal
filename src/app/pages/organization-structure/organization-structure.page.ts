import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3'

@Component({
  selector: 'app-organization-structure',
  templateUrl: './organization-structure.page.html',
  styleUrls: ['./organization-structure.page.scss'],
})
export class OrganizationStructurePage implements OnInit {
  data: any;
  constructor() { }

  ngOnInit(): void {
    d3.csv(
      'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv'
    ).then((item:any) => {
      // console.log(item)
      this.data = item;
      // let prevIndex = 0;
      // setInterval((d:any) => {
      //   item[prevIndex]._highlighted = false;
      //   let index = Math.floor(Math.random() * 10);
      //   prevIndex = index;
      //   item[index]._centered = true;
      //   item[index]._expanded = true;
      //   item[index]._highlighted = true;
      //   this.data = Object.assign([], item);
      // }, 1000);
    });
  }

  // nodes: any = [
  //   {
  //     name: 'Sundar Pichai',
  //     cssClass: 'ngx-org-ceo',
  //     image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //     title: '(Chief Executive Officer)',
  //     childs: [
  //       {
  //         name: 'Thomas Kurian',
  //         cssClass: 'ngx-org-ceo',
  //         image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //         title: '(CEO, Google Cloud)',
  //       },
  //       {
  //         name: 'Susan Wojcicki',
  //         cssClass: 'ngx-org-ceo',
  //         image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //         title: '(CEO, YouTube)',
  //         childs: [
  //           {
  //             name: 'Beau Avril',
  //             cssClass: 'ngx-org-head',
  //             image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //             title: '(Global Head of Business Operations)',
  //             childs: []
  //           },
  //           {
  //             name: 'Tara Walpert Levy',
  //             cssClass: 'ngx-org-vp',
  //             image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //             title: '(VP, Agency and Brand Solutions)',
  //             childs: [
  //               {
  //                 name: 'Beau Avril',
  //                 cssClass: 'ngx-org-head',
  //                 image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //                 title: '(Global Head of Business Operations)',
  //                 childs: []
  //               },
  //               {
  //                 name: 'Ariel Bardin',
  //                 cssClass: 'ngx-org-vp',
  //                 image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //                 title: '(VP, Product Management)',
  //                 childs: []
  //               },
  //             ]
  //           },
  //           {
  //             name: 'Beau Avril',
  //             cssClass: 'ngx-org-head',
  //             image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //             title: '(Global Head of Business Operations)',
  //             childs: []
  //           },
  //           {
  //             name: 'Ariel Bardin',
  //             cssClass: 'ngx-org-vp',
  //             image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //             title: '(VP, Product Management)',
  //             childs: []
  //           },
  //           {
  //             name: 'Beau Avril',
  //             cssClass: 'ngx-org-head',
  //             image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //             title: '(Global Head of Business Operations)',
  //             childs: []
  //           }
  //         ]
  //       },
  //       {
  //         name: 'Jeff Dean',
  //         cssClass: 'ngx-org-head',
  //         image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //         title: '(Head of Artificial Intelligence)',
  //         childs: [
  //           {
  //             name: 'David Feinberg',
  //             cssClass: 'ngx-org-ceo',
  //             image: 'https://raw.githubusercontent.com/mumincelal/ngx-org-chart/3a4bc9ebf0abd988deacf892ab6f118cb6419b66/src/assets/node.svg',
  //             title: '(CEO, Google Health)',
  //             childs: []
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ];

  // test(event:any){
  //   console.log(event)
  // }

}
