import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {IonSlides, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AudioElement } from 'src/app/shared/models/audioObject';

import { ExerciseItem } from 'src/app/shared/models/exerciseItem';
import { ExerciseService } from 'src/app/shared/services/exercise.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ModalController } from '@ionic/angular';
import { HelpModalComponent } from '../help-modal/help-modal.component';

import { UtilityService } from './../../shared/services/utility.service';
@Component({
  selector: 'app-single-choice',
  templateUrl: './single-choice.page.html',
  styleUrls: ['./single-choice.page.scss'],
})
export class SingleChoicePage implements OnInit {

  subs: Subscription[] = [];
  audio;
  userInfo: any;
  exerciseItems: ExerciseItem[];
  exerciseType: number;
  courseId: number;
  singleForm: FormGroup;
  lengthQuestion: number = 0;
  offset: number = 0;
  currentIndex: number = 0;
  questionSelected: boolean = false;
  resultQuestion: any;
  isLoading: boolean = false;
  limit: number = 1;
  resultAnswer: boolean = null;
  finishedQuestion: boolean = false;

  @ViewChild('slides') slides: IonSlides;


  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    scrollbar: true,
  };


  singleFormErrors = {
    answer: '',
  };

  singleValidationMessages = {
    answer: {
      required: 'Password field is required',
    },
  };


  constructor(
    private storageService: StorageService,
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public navController: NavController,
    public modalController: ModalController,
    private utilityService: UtilityService,
    // private file: File
    ) { }

  ngOnInit() {

    // ** get info user from localstorage
    this.userInfo = this.storageService.getUser();
    this.courseId = +this.route.snapshot.paramMap.get('courseId');
    this.exerciseType = +this.route.snapshot.paramMap.get('exerciseId');

    //**  Single Form run
    this.buildSingleForm();

    // ** Get Question Data
    this.getQuestion();
    this.audio = new Audio('../../../assets/iphone_ding.mp3' );
  }

  // ** Get Question Data
  getQuestion() {
    this.isLoading = true;
    this.subs.push(
      this.exerciseService
        .getCourseExercise(this.exerciseType, this.courseId, this.currentIndex, this.limit)
        .subscribe(response => {
          // console.log(response);
          this.isLoading = false;
          this.exerciseItems = response['result'];
          // console.log('single page ', response)
          this.lengthQuestion = response['length'];
          if(this.lengthQuestion == 0){
            this.utilityService.successText("There are no available questions in this exercise");
            setTimeout(() => {
              this.navController.navigateRoot(['/exercise', {courseId: this.courseId}]);
            }, 300)
          }
          if(this.exerciseItems[0].singleChoiceTranslations[0].voicePath != null && this.exerciseItems[0].singleChoiceTranslations[0].voicePath != "" ){
            this.exerciseItems[0].audioElement = new AudioElement();
            this.exerciseItems[0].audioElement.status = false;
            var audio = new Audio(`${this.exerciseItems[0].singleChoiceTranslations[0].voicePath}`);
            this.exerciseItems[0].audioElement.audio = audio;
            this.exerciseItems[0].audioElement.audio.load();

          }
          if(this.exerciseItems[0].voiceDanishPath != null && this.exerciseItems[0].voiceDanishPath != "" ){
            this.exerciseItems[0].audioElementDanish = new AudioElement();
            this.exerciseItems[0].audioElementDanish.status = false;
            var audio = new Audio(`${this.exerciseItems[0].voiceDanishPath}`);
            this.exerciseItems[0].audioElementDanish.audio = audio;
            this.exerciseItems[0].audioElementDanish.audio.load();

          }
        })
    );
  }

  playAudio(type?:string,item?:any){
    // console.log(item)
    if(type == "native"){
      if(item.audioElementDanish?.status == true){
        item.audioElementDanish.audio.pause();
        item.audioElementDanish.status = false
      }
      if(item.audioElement.status == false){
        item.audioElement.audio.play();
        item.audioElement.status = true;
      }else{
        item.audioElement.audio.pause();
        item.audioElement.status = false;
      }
    }else{
      if(item.audioElementDanish.status == false){
        if(item.audioElement?.status == true){
          item.audioElement.audio.pause();
          item.audioElement.status = false
        }
        item.audioElementDanish.audio.play();
        item.audioElementDanish.status = true;
      }else{
        item.audioElementDanish.audio.pause();
        item.audioElementDanish.status = false;
      }
    }

  }

  // ** Validate Form Input
  validateSingleForm(isSubmitting = false) {
    for (const field of Object.keys(this.singleFormErrors)) {
      this.singleFormErrors[field] = '';

      const input = this.singleForm.get(field) as FormControl;
      if (input.invalid && (input.dirty || isSubmitting)) {
        for (const error of Object.keys(input.errors)) {
          this.singleFormErrors[field] = this.singleValidationMessages[field][
            error
          ];
        }
      }
    }
  }

  // ** Build Single Choice Form
  buildSingleForm() {

    this.singleForm = this.fb.group({
      answer: [null , Validators.compose([Validators.required])],
    })

    this.singleForm.valueChanges.subscribe((data) => this.validateSingleForm());
  }

  // ** Get Current Index
  getCurrentIndex () {
    this.slides.getActiveIndex().then(current => this.currentIndex = current);
  }

   // ** Move to Next slide
  slideNext(id, ...answer) {
      this.validateSingleForm(true);
      this.subs.push(
        this.exerciseService.checkAnswerSingleChoise(id, this.singleForm.value.answer)
        .subscribe(async(response) => {
          this.resultAnswer = response['success'];
          if(this.resultAnswer === true) {
            // message and voice success
            this.utilityService.successMessage("<img src='../../../assets/images/22.gif' />");
            if(this.exerciseItems[0].audioElement){
              this.exerciseItems[0].audioElement.audio.pause();
              this.exerciseItems[0].audioElement.audio = null;

            }
            if(this.exerciseItems[0].audioElementDanish){
              this.exerciseItems[0].audioElementDanish.audio.pause();
              this.exerciseItems[0].audioElementDanish.audio = null;

            }
            // ** check when finished question
            if((this.currentIndex + 1) === this.lengthQuestion) {
              setTimeout(() => {
                this.utilityService.successText('Thanks for resolving questions');
              }, 3000)
              this.finishedQuestion = true;
              return;
              }
              this.isLoading = true;
              this.singleForm.reset();
              this.currentIndex += 1;
              this.getQuestion();
              this.slides.slideNext();

          } else if(this.resultAnswer === false) {
            // message and voice error
            this.utilityService.errorMessage("<img src='../../../assets/images/wr.gif' />");
          }

          }
      )
      );
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: HelpModalComponent,
      componentProps: {
        "modalLink": "https://khrs-admin.sdex.online/assets/tutorials/single_choice_tutorial.mp4",
        "modalTitle": "Single Choice Tutorial"
      }
    });
    return await modal.present();
  }

  slidePrev() {
    this.currentIndex -= 1;
    this.getQuestion();
    this.slides.slidePrev();
  }

  // Finished question
  onFinished() {
    this.navController.navigateRoot(['/exercise', {courseId: this.courseId}]);
  }

  ngOnDestroy() {this.subs.forEach(sub => sub.unsubscribe())}

}
