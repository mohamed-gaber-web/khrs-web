import { CheckUserTest } from './../../shared/models/chekTestUser';
import { Component, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { imagesBaseUrl } from 'src/app/api.constants';
import { Course } from 'src/app/shared/models/course';
import { CourseService } from 'src/app/shared/services/courses.service';
import { AudioElement } from 'src/app/shared/models/audioObject';
import { TestService } from 'src/app/shared/services/test.service';
import { Howl } from 'howler';
import { AppService } from 'src/app/shared/services/app.service';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.page.html',
  styleUrls: ['./all-courses.page.scss'],
})
export class AllCoursesPage implements OnInit {
  private offset: number;
  private totalLength: number;
  sub: Subscription[] = [];
  public courses: Array<Course> = [];
  isLoading = false;
  userTest: CheckUserTest;
  courseId;
  player: Howl = null;
  isPlaying: boolean = false;
  courseAudio:string;
  getLang: string;
  titleAll: string = 'All courses';

  constructor(
    private route: Router,
    private navCtrl: NavController,
    private courseService: CourseService,
    private platform: Platform,
    private testService: TestService,
    private appService:AppService
  ) {}

  ngOnInit() {
    // this.getLang = localStorage.getItem('languageId');
    // this.appService.getVidoes('Courses', this.getLang).subscribe((response) => {
    //   this.courseAudio = response['result']?.genericAttributeMediaTranslations[0]?.mediaPath;
    // })
    this.offset = 0;
    this.getCourses();

    this.testService.checkUserTest()
    .subscribe(response => {
      if(response['isActive'] === true) {
        this.route.navigate(['/exercise/test-course',
        {courseId: response['courseId'], testOffset: response['testApi'].offset, activeCourse: response['isActive']}]);
      } else {
        return;
      }
    })
  }

  getCourse(id: number) {
    this.navCtrl.navigateBack(`/courses/tabs/${id}`);
  }

  // ** get all courses
  public getCourses() {

    this.isLoading = true;
    this.sub.push(
      this.courseService
        .getAllCourses('', this.offset)
        .pipe(
          map((response) => {
            Object.entries(response);
            this.isLoading = false;
            this.totalLength = response['length'];
            return response['result'];
          })
        )
        .subscribe((res) => {
          if (this.courses.length == 0) {
            res.forEach((element) => {

              if (element.imagePath) {
                element.imagePath = `${element.imagePath}`;
              }
              if (element.courseTranslations[0]?.introVoicePath) {
                element.courseTranslations[0].introVoicePath = `${element.courseTranslations[0].introVoicePath}`;
              }

              element.audioElement = new AudioElement();
              element.audioElement.status = false;
            });
            this.courses = res;
          } else {
            res.forEach((element) => {
              if (element.imagePath) {
                element.imagePath = `${element.imagePath}`;
              }
              if (element.courseTranslations[0].introVoicePath) {
                element.courseTranslations[0].introVoicePath = `${element.courseTranslations[0].introVoicePath}`;
              }
              element.audioElement = new AudioElement();
              element.audioElement.status = false;

              this.courses.push(element);
            });
          }
          this.offset++;
        })
    );
  }

  loadData(event) {
    if (this.courses.length < this.totalLength) {
      setTimeout(() => {
        this.getCourses();
        // console.log('Done');
        event.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.courses.length == 1000) {
          event.target.disabled = true;
        }
      }, 500);
    } else {
      event.target.disabled = true;
    }
  }

  playIntroHTML(course: Course) { // course: Course
    if (course.audioElement.status == false) {
      //stop all
      this.courses.forEach((element: Course, index) => {
        if (element.audioElement.audio != null) {
          element.audioElement.audio.pause();
          element.audioElement.status = false;
          //TODO destroy
        } else {
          //TODO destroy
        }
      });
      if (course.audioElement.audio && course.audioElement.audio.paused) {
        course.audioElement.audio.play();
      } else {
        var audio = new Audio(`${course.courseTranslations[0].introVoicePath}`);
        course.audioElement.audio = audio;
        course.audioElement.audio.load();
        course.audioElement.audio.play();
      }
      course.audioElement.status = true;
    } else {
      //stop the the live one
      if (course.audioElement.audio != null) {
        course.audioElement.audio.pause();
        course.audioElement.status = false;
        //TODO destroy
      } else {
        //TODO destroy
      }
    }
  }

  startAudio(voicePath: string) {
    if (this.player && this.isPlaying == true) {
      this.player.stop();
      this.isPlaying = false;
    }else{
      this.player = new Howl({
        html5: true,
        src: voicePath,
        onplay: () => {
          this.isPlaying = true;
        },
        onend: () => {
          this.isPlaying = false;
        },
      });
      this.player.play();

    }

  }

  ionViewDidLeave():void{
    if (this.player) {
      this.player.stop();
    }
    this.courses.forEach((element) => {
      if (element.audioElement) {
        if (element.audioElement.status == true) {
          element.audioElement.audio.pause();
          element.audioElement.status = false;
        }
      }
    });
  }
}

function onSuccess() {
  throw new Error('Function not implemented.');
}
function onError() {
  alert('error');
}



