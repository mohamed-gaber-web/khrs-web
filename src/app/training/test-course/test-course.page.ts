import { LocationStrategy } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, NavController, ToastController } from '@ionic/angular';
import { CdTimerComponent } from 'angular-cd-timer';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TestService } from 'src/app/shared/services/test.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Component({
  selector: 'app-test-course',
  templateUrl: './test-course.page.html',
  styleUrls: ['./test-course.page.scss'],
})

export class TestCoursePage implements OnInit {

  userInfo: any;
  courseId: number;
  questionType: number;
  allTestData: any;
  pageNumber: number = 0;
  counterStart: number = 0;
  finishedTime: boolean= false;
  message: string = '';
  durationTest: number;
  updateQuestionType: number;
  activeTest: boolean;
  redQuestionType: any;
  redOffset: number;
  activeCourse: boolean;
  courseName: string;
  messageTest: string = '';

  @Output() slideData = new EventEmitter<any>();
  @ViewChild( 'basicTimer', { static: false } ) cdTimer : CdTimerComponent;

  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    public toastController: ToastController,
    public navController: NavController,
    private testService: TestService,
    private utilityService: UtilityService,
    private locationStrategy: LocationStrategy

  ) { }

  ngOnInit() {
    // close back arrow window when enter test
    this.preventBackButton()
    this.userInfo = this.storageService.getUser();
    this.courseName = localStorage.getItem('courseName');

    this.courseId = +this.route.snapshot.paramMap.get('courseId');
    this.redOffset = +JSON.parse(this.route.snapshot.paramMap.get('testOffset'));
    this.activeCourse = JSON.parse(this.route.snapshot.paramMap.get('activeCourse'));

    this.getTestType();
    // this.updateQuestionType = +JSON.parse(localStorage.getItem('testQuestionType'));
    // this.activeTest = JSON.parse(localStorage.getItem('activeTest'));
  }

  // close back arrow window when enter test
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
      window.history.forward()
    })
  }

  // ** get test type
  getTestType() {
    if(this.activeCourse == true) {
      this.testService.getTestType(this.courseId, this.redOffset)
      .subscribe(response => {
        this.questionType = response['questionType'];
        this.allTestData = response;

      })
    } else {

      this.testService.getTestType(this.courseId, this.pageNumber)
      .subscribe(response => {

        if(response['success'] === false) {
          this.utilityService.errorText(response['arrayMessage'][0])
          this.router.navigate(['courses/tabs/choose-course-material', {courseId: this.courseId}]);
        }


        if (response['questionType'] == 0) {
          this.router.navigate(['courses/tabs/my-courses']);
        }

        this.questionType = response['questionType'];
        this.allTestData = response;
        // debugger;
      })

    }
  }

  getQuestionData(event) {
    this.questionType = event.questionType;
    this.pageNumber = event.pageNumber;
  }

  finishedTimer() {
    this.message = 'timer is finished';
    setTimeout(() => {
      this.router.navigate(['/courses/tabs/my-courses'])
    }, 4000)
  }

}
