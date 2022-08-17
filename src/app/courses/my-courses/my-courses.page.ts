import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScrollContent, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { imagesBaseUrl } from 'src/app/api.constants';
import { AudioElement } from 'src/app/shared/models/audioObject';
import { Course } from 'src/app/shared/models/course';
import { MyCourse } from 'src/app/shared/models/myCourse';
import { CourseService } from 'src/app/shared/services/courses.service';
import { TestService } from 'src/app/shared/services/test.service';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LoadingController } from '@ionic/angular';
import { Howl } from 'howler';
import { AppService } from 'src/app/shared/services/app.service';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.page.html',
  styleUrls: ['./my-courses.page.scss'],
})
export class MyCoursesPage implements OnInit, OnDestroy {
  offset: number = 0;
  totalLength: number;
  sub: Subscription[] = [];
  public myCourses: Array<MyCourse> = [];
  isLoading = false;
  pdfFile: any;
  player: Howl = null;
  isPlaying: boolean = false;
  getLang = localStorage.getItem('languageId');
  courseAudio: string;
  titlePage: string = 'My courses';

  constructor(
    private route: Router,
    private courseService: CourseService,
    private testService: TestService,
    private fileOpener: FileOpener,
    private platform: Platform,
    private loadingController: LoadingController,
    private appService:AppService

  ) {}

  ngOnInit() {
    this.appService.getVidoes('Courses', this.getLang).subscribe((response) => {
      this.courseAudio = response['result']?.genericAttributeMediaTranslations[0]?.mediaPath || '2';
    })
    this.getUserCourses();
  }


  getUserCourses() {
    this.isLoading = true;
    this.sub.push(
      this.courseService
        .getUserCourses('', this.offset)
        .pipe(
          map((response) => {
            // console.log(response);
            Object.entries(response);
            this.isLoading = false;
            this.totalLength = response['length'];
            return response['result'];
          })
        )
        .subscribe((res) => {
          if (this.myCourses.length == 0) {
            res.forEach((element:MyCourse) => {

              if (element.course.imagePath) {
                element.course.imagePath = `${element.course.imagePath}`;
              }
              if (element.course.courseTranslations[0]?.introVoicePath) {
                element.course.courseTranslations[0].introVoicePath = `${element.course.courseTranslations[0].introVoicePath}`;
              }
              element.course.audioElement = new AudioElement();
              element.course.audioElement.status = false;
            });
            this.myCourses = res;
          } else {
            res.forEach((element) => {
              if (element.course.imagePath) {
                element.course.imagePath = `${element.course.imagePath}`;
              }
              if (element.course.courseTranslations[0]?.introVoicePath) {
                element.course.courseTranslations[0].introVoicePath = `${element.course.courseTranslations[0].introVoicePath}`;
              }
              element.course.audioElement = new AudioElement();
              element.course.audioElement.status = false;

              this.myCourses.push(element);
            });
          }
          this.offset++;
        })
    );
  }

  loadData(event) {
    if(this.myCourses.length < this.totalLength){
      setTimeout(() => {
        this.getUserCourses();
        event.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.myCourses.length == 1000) {
          event.target.disabled = true;
        }
      }, 500);
    }else{
      event.target.disabled = true;

    }

  }

  playIntroHTML(course:Course){
    // this.nativeAudio.preloadSimple(`intro${course.id}`, `${course.courseTranslations[0].introVoicePath}`).then(onSuccess, onError);
    // this.nativeAudio.play(`intro${course.id}`).then(onSuccess, onError);
    if(course.audioElement.status == false){
      //stop all
      this.myCourses.forEach((element:MyCourse,index) => {
        if(element.course.audioElement.audio != null){
          element.course.audioElement.audio.pause();
          element.course.audioElement.status = false;
          //TODO destroy
        }else{
          //TODO destroy
        }

    });
    if(course.audioElement.audio && course.audioElement.audio.paused){
      course.audioElement.audio.play();
    }else{
      var audio = new Audio(`${course.courseTranslations[0].introVoicePath}`);
      course.audioElement.audio = audio;
      course.audioElement.audio.load();
      course.audioElement.audio.play();
    }
    course.audioElement.status = true;


    }else{
      //stop the the live one
      if(course.audioElement.audio != null){
        course.audioElement.audio.pause();
        course.audioElement.status = false;
        //TODO destroy
      }else{
        //TODO destroy
      }
    }

  }

  // ** go to choose course material
  goToChooseCourseMaterial(courseId: number, userId) {
    this.route.navigate(['courses/tabs/choose-course-material', { courseId, userId }]);
  }


  downloadCertificate(courseId) {
    this.isLoading = true;
    this.testService.getCertificate(courseId)
    .subscribe((response: Blob) => {
      console.log(response);
      this.isLoading = false;
      if(this.platform.is('mobileweb')) {

        this.pdfFile = new Blob([response], {type: 'application/pdf'});

        var downloadURL = window.URL.createObjectURL(response);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "Certificate.pdf";
        link.click();
      } else if(this.platform.is('android')) {
        File.writeFile(
          File.externalRootDirectory + "/Download",
          courseId + "Certificate.pdf",
          new Blob([response]),
          {
            replace: true,
          }
        );
        this.fileOpener.open(File.externalRootDirectory + "/Download/" + courseId + "Certificate.pdf", 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
      } else {
        this.pdfFile = new Blob([response], {type: 'application/pdf'});

        var downloadURL = window.URL.createObjectURL(response);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "Certificate.pdf";
        link.click();

      }

      this.pdfFile = new Blob([response], {type: 'application/pdf'});

      var downloadURL = window.URL.createObjectURL(response);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "Certificate.pdf";
      link.click();
    });
  }

  // ** Create Refresh whrn scroll down
  doRefresh(event) {
    this.offset=0;
    this.myCourses=[];
    console.log('Begin async operation');
    this.getUserCourses();
    event.target.complete();
    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   event.target.complete();
    // }, 2000);
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
  ngOnDestroy() {

    this.sub.forEach(e => {
      e.unsubscribe();
    })
  }
  ionViewDidLeave():void{
    if (this.player) {
      this.player.stop();
    }
    this.myCourses.forEach((element) => {
      if (element.course.audioElement) {
        if (element.course.audioElement.status == true) {
          element.course.audioElement.audio.pause();
          element.course.audioElement.status = false;
        }
      }
    });
  }
}
