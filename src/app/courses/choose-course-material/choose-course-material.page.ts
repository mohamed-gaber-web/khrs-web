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
import { ExerciseService } from 'src/app/shared/services/exercise.service';


@Component({
  selector: 'app-choose-course-material',
  templateUrl: './choose-course-material.page.html',
  styleUrls: ['./choose-course-material.page.scss'],
})
export class ChooseCourseMaterialPage implements OnInit {

  userId: number;
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

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private trackingService: TrackingUserService,
    private exerciseService: ExerciseService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.courseId = JSON.parse(this.route.snapshot.paramMap.get('courseId'));
    this.redOffset = this.route.snapshot.paramMap.get('testOffset');
    this.subs.push(
      this.courseService.getUserCoursesDetails(this.courseId)
      .subscribe(response => {
        this.isLoading = false;
        this.userCourseDetails = response['result'].userCourse;
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
  }

  // ** Send course id to exercise page
  sendIdToExercisePage() {
    const courseId = this.courseId;
    localStorage.setItem('courseId', courseId);
    this.router.navigate(['/exercise', {courseId: this.courseId}])
  }

  // ** Send course id to final test page_event
  sendIdToFinalTestPage() {
   this.presentAlertConfirm();
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
          }
        }, {
          text: 'start',
          handler: () => {
            this.exerciseService.startCourseTest(this.courseId).subscribe(response => {
              if(response['success'] === true) {
                this.router.navigate(['/exercise/test-course', {courseId: this.courseId}])
              } else {
                return;
              }
            })
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() {
    this.subs.forEach(element => element.unsubscribe())
  }

  startAudio(x) { }

  // ** start tracking this function used in amDoneToday
  // startTrackUser() {
  //   const startDate = new Date();
  //   const data: IStartTracking = {
  //     courseId: this.courseId,
  //     limit: 1,
  //     offset: 0,
  //     type: 0,
  //     startDate: startDate
  //   }
  //   this.trackingService.startTracking(data)
  //     .subscribe(response => {
  //     }, (error) => {
  //     }, () => {

  //     })
  // }

// getUserOffset(course_ID:number) {
//   this.trackingService.getAllUser(0,10)
//   .subscribe(r =>
//     {
//       r['result'].forEach(element => {
//         if (element.courseId===course_ID){
//           this.offset=element.offset
//         }
//         else if (element.courseId!==course_ID){
//         }
//       })
//     })
// }

  // ** open course rating component
  toggleModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  openCourseDetails(ofst:number){
    this.router.navigate([`courses/course-material/${this.courseId}`, {ofst}])
  }

}
