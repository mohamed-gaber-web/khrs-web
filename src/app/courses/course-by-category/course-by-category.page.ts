import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { CourseService } from 'src/app/shared/services/courses.service';

import { Howl } from 'howler';
import { Course } from 'src/app/shared/models/course';


@Component({
  selector: 'app-course-by-category',
  templateUrl: './course-by-category.page.html',
  styleUrls: ['./course-by-category.page.scss'],
})
export class CourseByCategoryPage implements OnInit {

  sub: Subscription[] = [];
  isLoading: boolean = false;
  coursesByCategory: any;
  userInfo: any;
  courseCategoryLength: number;
  public courses: Array<Course> = [];

  player: Howl = null;
  isPlaying: boolean = false;
  courseAudio:string;

  constructor(private courseService: CourseService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.userInfo = this.authService.getUser();
    this.isLoading = true;
    this.sub.push(
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.courseService.getCoursesByCategories(0, 10, +params.get('categoryId')))
          ).subscribe(response => {
            console.log(response);              
            this.isLoading = false;
            this.coursesByCategory = response['result'];
            this.courseCategoryLength = response['length'];

      }),
  
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(el => {
      el.unsubscribe();
    })    
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
