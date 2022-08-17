import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-finished-test',
  templateUrl: './finished-test.page.html',
  styleUrls: ['./finished-test.page.scss'],
})
export class FinishedTestPage implements OnInit {

  userTestId: any;
  courseId: any;
  pageNumber: any;

  constructor(private testService: TestService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userTestId = this.route.snapshot.paramMap.get('userTestId');
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    this.pageNumber = this.route.snapshot.paramMap.get('offset');

  }

  finishedTest() {
    this.testService.finishedTest(this.userTestId)
    .subscribe(response => {
      console.log('final test', this.userTestId, response)
      localStorage.setItem('testId', this.userTestId);
      this.router.navigate(['/courses/tabs/my-courses']);
      console.log(response);
    })
  }

  prev() {
    this.testService.getTestType(this.courseId, this.pageNumber-1)
    .subscribe(response => {
      if(response) {
        this.router.navigate(['/exercise/test-course', {courseId: this.courseId}]);
      }
    })
  }
}
