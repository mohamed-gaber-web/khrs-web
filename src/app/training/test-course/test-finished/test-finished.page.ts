import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-test-finished',
  templateUrl: './test-finished.page.html',
  styleUrls: ['./test-finished.page.scss'],
})
export class TestFinishedPage implements OnInit {

  userTestId: any;
  courseId: any;
  pageNumber: any;

  constructor(private testService: TestService, private router: Router) { }

  ngOnInit() {
  }

}
