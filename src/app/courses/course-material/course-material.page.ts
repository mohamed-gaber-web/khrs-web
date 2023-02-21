import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CourseService } from 'src/app/shared/services/courses.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { IonRange, IonSlides } from '@ionic/angular';
import { Howl } from 'howler';
import { AppService } from 'src/app/shared/services/app.service';
import { TrackingUserService } from 'src/app/shared/services/tracking-user.service';

import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-course-material',
  templateUrl: './course-material.page.html',
  styleUrls: ['./course-material.page.scss'],
})
export class CourseMaterialPage implements OnInit {

  courseDetails: any;
  player: Howl = null;
  progress: number = 0;
  isPlaying: boolean = false;
  subs: Subscription[] = [];
  isLoading = false;
  courseMaterial: any;
  userInfo: any;
  disablePrevBtn = true;
  disableNextBtn = false;
  activeTrack: string;
  introVideo: any;
  getLang;
  offset: number = 0;
  limit: number = 1;
  materialCourseLength: number = 0;
  @ViewChild('slides') slides: IonSlides;
  @ViewChild('range', { static: false }) range: IonRange;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    scrollbar: true,
  };

  constructor(
    private router: Router,
    private courseService: CourseService,
    private route: ActivatedRoute,
    public storageService: StorageService,
    public authService: AuthService,
    private appService: AppService,
    private trackingService: TrackingUserService,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // ** user info
    this.userInfo = this.authService.getUser();
    this.getMaterialCourse();
    // * get query params [ offset ]
    this.activatedRoute.queryParams
    .subscribe(params => {
      this.offset = +params['offset'] | 0;
    })
  }

  // ** Get material courses
  getMaterialCourse() {
    this.isLoading = true;
    this.subs.push(
      this.route.paramMap
        .pipe(
          switchMap((params: ParamMap) =>
            this.courseService.getCourseMaterial(+params.get('courseId'), this.offset, this.limit)
          )
        )
        .subscribe((response) => {
          this.isLoading = false;
          this.courseMaterial = response['result'];
          this.materialCourseLength = response['length'];
          this.limit = response['limit'];
        })
    );
  }

  // ** Move to Next slide
  async slideNext() {
    if (this.player) {
      this.activeTrack = null;
      this.player.unload();
      this.player = null;
    }
    this.offset += 1; // get one request when add next
    this.getMaterialCourse();
    this.slides.slideNext();

    if(this.offset === this.materialCourseLength) {
      var toast = await this.toastController.create({
      message: 'Material pages is finished !',
      duration: 3000,
      color: 'success',
      });
      toast.present();
      this.router.navigate(['/courses/tabs/my-courses']);
    }
  }

  // **  previous slide
  slidePrev() {
    if (this.player) {
      this.activeTrack = null;
      this.player.unload();
      this.player = null;
    }
    this.offset -= 1;
    this.getMaterialCourse();
    this.slides.slidePrev();
  }

  startAudio(voicePath: string) {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      html5: true,
      src: voicePath,
      onplay: () => {
        this.activeTrack = voicePath;
        this.isPlaying = true;
        this.updateProgress();
      },
      onend: () => {},
    });
    this.player.play();
  }

  toogleAudio(pause) {
    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  seek() {
    if(this.player){
      let newValue = +this.range.value;
      let duration = this.player.duration();
      this.player.seek(duration * (newValue / 100));
    }

  }

  updateProgress() {
    if(this.player){
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }
  }

  // *** Am done today
  amDoneToday() {
    if(this.offset === 0) {
      return;
    }
    const endDate = new Date();
    this.subs.push(
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.trackingService.endTracking({
        courseId: +params.get('courseId'),
        limit: 1,
        offset: this.offset,
        type: 0,
        endDate
      })
      )).subscribe(async (response) => {
      console.log('am done today', response);
        if (response['success'] === true) {
          // localStorage.setItem('courseMaterialOffset', JSON.stringify(this.offset))
          const toast = await this.toastController.create({
            message: `You paused at page ${ this.offset }` ,
            duration: 4000,
            position: 'top',
            color: 'success',
          });
          toast.present();
      }
    })
    );
  }
  startFromZero() {
      // this.offset = 0;
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: { offset: 0 },
          queryParamsHandling: 'merge'
        });
      this.slides.slideTo(0)
    }

  ngOnDestroy(): void {
    this.subs.forEach((element) => {
      element.unsubscribe();
    });
  }

  doCheck() {
    let prom1 = this.slides.isBeginning();
    let prom2 = this.slides.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? (this.disablePrevBtn = true) : (this.disablePrevBtn = false);
      data[1] ? (this.disableNextBtn = true) : (this.disableNextBtn = false);
    });
  }
}
