import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { userCourse } from 'src/app/shared/models/userCourse';
import { CourseService } from 'src/app/shared/services/courses.service';
import { TestService } from 'src/app/shared/services/test.service';

import { AlertController } from '@ionic/angular';
import { ExersiceCountService } from 'src/app/training/exersice-count.service';
import { TrackingUserService } from 'src/app/shared/services/tracking-user.service';
import { IStartTracking } from 'src/app/shared/models/tracking.model';
import { LocationStrategy } from '@angular/common';


@Component({
  selector: 'app-choose-course-material',
  templateUrl: './choose-course-material.page.html',
  styleUrls: ['./choose-course-material.page.scss'],
})
export class ChooseCourseMaterialPage implements OnInit {

  userId: number;
  coursesName: any;
  courseId: any;
  subs: Subscription[] = [];
  userCourseDetails: userCourse[];
  CourseDetails: any;
  validCourse;
  isLoading: boolean = false;
  testActive: boolean;
  redOffset: any;
  offset: number;
  limit: number;
  isOpen:boolean = false;
  userType: any;
  btnDisabled: string = 'open';

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private trackingService: TrackingUserService,
    private testService: TestService,
    private locationStrategy: LocationStrategy
    ) { }

  ngOnInit() {
    
    this.isLoading = true;
    this.courseId = JSON.parse(this.route.snapshot.paramMap.get('courseId'));
    this.redOffset = this.route.snapshot.paramMap.get('testOffset');
    this.subs.push(
      this.courseService.getUserCoursesDetails(this.courseId)
      .subscribe(response => {
        console.log('course material name', response)
        this.isLoading = false;
        this.userCourseDetails = response['result'].userCourse;
        // get and send course name in exercise
        this.coursesName = response['result'].course['courseTranslations'][0].title;
        let startDate = new Date(this.userCourseDetails['startDate']);
        let endDate = new Date(this.userCourseDetails['endDate']);
         let date = endDate.getTime() - startDate.getTime();
        this.validCourse = date / (1000 * 3600 * 24);
      }),

      this.courseService.getCoursesDetails(this.courseId)
        .subscribe(response => {
        this.isLoading = false;
        this.CourseDetails = response['result'];
      })
    );

    this.userType = JSON.parse(localStorage.getItem('user')).role;
    // console.log(this.userType);
  }


  // ** Send course id to exercise page
  sendIdToExercisePage() {
    const courseId = this.courseId;
    localStorage.setItem('courseId', courseId);
    localStorage.setItem('courseName', this.coursesName);
    this.router.navigate(['/exercise', {courseId: this.courseId}])
  }

  // ** Send course id to final test page_event
  sendIdToFinalTestPage() {
    this.presentAlertConfirm();
    localStorage.setItem('courseName', this.coursesName);
  
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to start the test ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'start',
          handler: () => {
            // add request final test
            this.testService.startTest(this.courseId)
            .subscribe(response => {
              console.log(response)
              if(response['success'] === false) {
                console.log(response)
                this.btnDisabled = 'close';
              }
              this.router.navigate(['/exercise/test-course', {courseId: this.courseId}])
            })
          }
        }
      ]
    });

    await alert.present();
  }

  startAudio(x) { }

  // ** start tracking
  startTrackUser() {
    const startDate = new Date();
    console.log(this.courseId);
    const data: IStartTracking = {
      courseId: this.courseId,
      limit: 1,
      offset: 0,
      type: 0,
      startDate: startDate
    }
    this.trackingService.startTracking(data)
      .subscribe(response => {
        console.log(response);
      }, (error) => {
        console.log(error);

      }, () => {
        console.log('completed');

      })
  }

  getUserOffset(course_ID:number) {

  this.trackingService.getAllUser(0,10)
  .subscribe(r =>
    {
      // console.log("resssss",r['result']);
      r['result'].forEach(element => {
        if (element.courseId===course_ID){
          this.offset=element.offset
          // console.log('yes',this.offset)
        }
        else if (element.courseId!==course_ID){
          // console.log("no",this.offset)
        }
      })
    })
  }

  // ** open course rating component
  toggleModal() {this.isOpen = true;}

  closeModal() {
    this.isOpen = false;
  }

  openCourseDetails(ofst:number){
    this.router.navigate([`courses/course-material/${this.courseId}`, {ofst}])
  }

  ngOnDestroy() {this.subs.forEach(element => element.unsubscribe())}

}
