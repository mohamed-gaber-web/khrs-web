import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { StorageService } from '../shared/services/storage.service';

import { NavController } from '@ionic/angular';
import { ExersiceCountService } from './exersice-count.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit {

  userInfo: any;
  courseId: number;
  audio = new Audio('../../../assets/iphone_ding.mp3');
  singleExerciseCount: number;
  multiExerciseCount: number;
  textExerciseCount: number;
  imageExerciseCount: number;

  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    public toastController: ToastController,
    public navController: NavController,
    public exerciseCountService: ExersiceCountService,

  ) {}

  chooseTraining = [
    {
      img: '../../assets/icon/puzzle.png',
      name: 'Puzzle image',
      url: '/exercise/puzzle-image',
      exerciseId: 4,
      courseId: JSON.parse(this.route.snapshot.paramMap.get('courseId')),
    },
    {
      img: '../../assets/icon/abc-block.png',
      name: 'Puzzle text',
      url: '/exercise/puzzle-text',
      exerciseId: 3,
      courseId: JSON.parse(this.route.snapshot.paramMap.get('courseId')),
    },
    {
      img: '../../assets/icon/notepad.png',
      name: 'Single choice',
      url: '/exercise/single-choice',
      exerciseId: 1,
      courseId: JSON.parse(this.route.snapshot.paramMap.get('courseId')),
    },
    {
      img: '../../assets/icon/checklist.png',
      name: 'Multi choice',
      url: '/exercise/multi-choice',
      exerciseId: 2,
      courseId: JSON.parse(this.route.snapshot.paramMap.get('courseId')),
    }
  ];

  ngOnInit() {
    this.userInfo = this.storageService.getUser();
    if(!this.route.snapshot.paramMap.get('courseId')){
      this.router.navigate(["courses/tabs/my-courses"]);
    }
    this.getSingleExerciseCount();
    this.getMultiExerciseCount();
    this.getTextExerciseCount();
    this.getImageExerciseCount();
  }

  goToCatExercise(url, exerciseId, courseId) {
    this.router.navigate([url, {exerciseId, courseId}]);
  }

  async errorMessage(msg: string) {
    this.audio.play();
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      cssClass:'ion-error',
      color: 'danger',
    });
    toast.present();
  }

  getSingleExerciseCount() {
    this.exerciseCountService.getExerciseSingleCount().subscribe(response => {
      // console.log('count single ', response);
      this.singleExerciseCount = response['length'];
    })
  }

  getMultiExerciseCount() {
    this.exerciseCountService.getExerciseMultiCount().subscribe(response => {
      this.multiExerciseCount = response['length'];
    })
  }

  getTextExerciseCount() {
    this.exerciseCountService.getExerciseTextCount().subscribe(response => {
      // console.log('count single ', response);
      this.textExerciseCount = response['length'];
    })
  }

  getImageExerciseCount() {
    this.exerciseCountService.getExerciseImageCount().subscribe(response => {
      // console.log('count single ', response);
      this.imageExerciseCount = response['length'];
    })
  }


  ngOnDestroy(): void {}

}


