import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-thanks-page',
  templateUrl: './thanks-page.component.html',
  styleUrls: ['./thanks-page.component.scss'],
})
export class ThanksPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  sendToMyCourses() {
    this.router.navigate(['/courses/tabs/my-courses'])
  }

}
