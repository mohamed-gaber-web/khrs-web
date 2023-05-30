import { Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, NavController, ToastController } from '@ionic/angular';
import { TestService } from 'src/app/shared/services/test.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ExerciseItem } from 'src/app/shared/models/exerciseItem';
import { AudioElement } from 'src/app/shared/models/audioObject';


@Component({
  selector: 'app-multi-test',
  templateUrl: './multi-test.page.html',
  styleUrls: ['./multi-test.page.scss'],
})
export class MultiTestPage implements OnInit {

  multiForm: FormGroup;
  exerciseItems: ExerciseItem[];
  resultAnswerItems: any;
  courseId: number;
  questionType: number;
  allTestData: any;
  testId: number;
  lengthItems: number;
  isLoading: boolean = false;
  userTestId: number;
  sub: Subscription[] = [];
  userInfo: any
  @Input('pageNumber') pageNumber;
  @Output() questionData = new EventEmitter<any>();

  disablePrevBtn = true;
  disableNextBtn = false;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    scrollbar: true,
  };

  @ViewChild('slides') slides: IonSlides;

  constructor(
    private testService: TestService,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public navController: NavController,
    private router: Router,
    private navCtrl: NavController,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.buildMultiForm();
    this.courseId = +this.route.snapshot.paramMap.get('courseId');
    this.getTestType();
    this.userInfo = this.storageService.getUser();

  }

  // ** get test type
  getTestType() {
    this.isLoading = true;
    this.multiForm.reset();
    this.testService.getTestType(this.courseId, this.pageNumber)
    .subscribe(response => {
      this.isLoading = false;
      this.questionType = response['questionType'];
      this.testId = response['testId'];
      this.lengthItems = response['length'];
      if(this.questionType !== 2) {
        // parent
        const obj = {
          pageNumber: this.pageNumber,
          questionType: this.questionType
        }
        this.questionData.emit(obj)
      }
      this.allTestData = response;

      // ** Sound
      this.exerciseItems = [response['multiChoice']];

      this.exerciseItems.map((answerItems) => {
        this.resultAnswerItems = answerItems['multiChoiceAnswers'];
      });
      if (
        this.exerciseItems[0].multiChoiceTranslations[0].voicePath !=
          null &&
        this.exerciseItems[0].multiChoiceTranslations[0].voicePath != ''
      ) {
        this.exerciseItems[0].audioElement = new AudioElement();
        this.exerciseItems[0].audioElement.status = false;
        var audio = new Audio(
          `${this.exerciseItems[0].multiChoiceTranslations[0].voicePath}`
        );
        this.exerciseItems[0].audioElement.audio = audio;
        this.exerciseItems[0].audioElement.audio.load();
      }
      this.resultAnswerItems.forEach((element) => {
        element.audioElement = new AudioElement();
        element.audioElement.status = false;
        if (
          element.multiChoiceAnswerTranslations[0].voicePath != null &&
          element.multiChoiceAnswerTranslations[0].voicePath != ''
        ) {
          element.audioElement.id = element.id;
          element.audioElement.audio = new Audio(
            `${element.multiChoiceAnswerTranslations[0].voicePath}`
          );
          element.audioElement.audio.load();
        } else {
          element.audioElement.audio = null;
        }
        if(this.exerciseItems[0].voiceDanishPath != null && this.exerciseItems[0].voiceDanishPath != "" ){
          this.exerciseItems[0].audioElementDanish = new AudioElement();
          this.exerciseItems[0].audioElementDanish.status = false;
          var audio = new Audio(`${this.exerciseItems[0].voiceDanishPath}`);
          this.exerciseItems[0].audioElementDanish.audio = audio;
          this.exerciseItems[0].audioElementDanish.audio.load();

        }
      });

    })
  }

  // ** Build Single Choice Form
  buildMultiForm() {
    this.multiForm = this.fb.group({
      answer: [true, Validators.compose([Validators.required])],
    });
  }

  // ** Move to Next slide
  slideNext(quetionId) {

    const multiChoiceData = {
      multiChoiceQuestionId: quetionId,
      multiChoiceAnswerId: this.multiForm.value.answer
    }

    this.testService.sendAnswerTesting({
      testId:this.testId,
      questionType: 2,
      singleChoiceAnswer: null,
      multiChoiceAnswer: multiChoiceData,
      puzzleWithTextAnswers: null,
      puzzleWithImageAnswers: null})
      .subscribe(response => {
        console.log(response)
        this.userTestId = response['result'].userTestId;
        this.pageNumber += 1;

        // ** Stop sound when next slide
        this.stopAllAudios();

        // ** check last question
        if(this.lengthItems === this.pageNumber) { // length item = 5 // page numer = 5
          localStorage.setItem('userTestId', JSON.stringify(this.userTestId))
          localStorage.setItem('courseId', JSON.stringify(this.courseId))
          localStorage.setItem('pageNumber', JSON.stringify(this.pageNumber))
          return;
        }
        this.getTestType();
        this.slides.slideNext();
      })

  }

  slidePrev() {
    this.pageNumber -= 1;
    this.getTestType();
    this.slides.slidePrev();
  }

  ScapeSlidePrev() {
    this.pageNumber += 1;
    if(this.lengthItems === this.pageNumber) { // length item = 5 // page numer = 5
      console.log('this is last number');
      localStorage.setItem('userTestId', JSON.stringify(this.userTestId))
      localStorage.setItem('courseId', JSON.stringify(this.courseId))
      localStorage.setItem('pageNumber', JSON.stringify(this.pageNumber))
      return;
    }
    this.getTestType();
    this.slides.slideNext();
  }

  finishSlidePrev() {
    this.pageNumber -= 1;
    // this.getTestType();
    // this.slides.slidePrev();
  }

  finishedTest() {
    this.testService.finishedTest(this.userTestId)
    .subscribe(response => {
      localStorage.removeItem('courseId')
      localStorage.removeItem('pageNumber')
      // this.router.navigate(['/courses/tabs/my-courses']);
      this.navCtrl.navigateForward('/courses/tabs/my-courses')
    })
  }


  // Sound
  playAudio(answer: any, type: number,langType?:string) {
    // playing question sound
    if (type == 1) {
      //stoping answer voices
      this.stopAnswerVoices();
      if(langType == "native"){
        if(this.exerciseItems[0].audioElementDanish?.status == true){
          this.exerciseItems[0].audioElementDanish.audio.pause();
          this.exerciseItems[0].audioElementDanish.status = false
        }
        if(this.exerciseItems[0].audioElement.status == false){
          this.exerciseItems[0].audioElement.audio.play();
          this.exerciseItems[0].audioElement.status = true;
        }else{
          this.exerciseItems[0].audioElement.audio.pause();
          this.exerciseItems[0].audioElement.status = false;
        }
      }else{
        if(this.exerciseItems[0].audioElementDanish.status == false){
          if(this.exerciseItems[0].audioElement?.status == true){
            this.exerciseItems[0].audioElement.audio.pause();
            this.exerciseItems[0].audioElement.status = false
          }
          this.exerciseItems[0].audioElementDanish.audio.play();
          this.exerciseItems[0].audioElementDanish.status = true;
        }else{
          this.exerciseItems[0].audioElementDanish.audio.pause();
          this.exerciseItems[0].audioElementDanish.status = false;
        }
      }
    } else {
      this.stopQuestionVoice();
      this.stopAnswerVoices(answer);
      var audioElement = answer.audioElement;
      if (audioElement) {
        if (audioElement.status == false) {
          audioElement.audio.play();
          answer.audioElement.status = true;
        } else {
          audioElement.audio.pause();
          answer.audioElement.status = false;
        }
      }
    }
  }

  stopAllAudios() {
    this.stopQuestionVoice();
    this.stopAnswerVoices();
  }

  stopAnswerVoices(answer?: any) {
    if (answer) {
      this.resultAnswerItems
        .filter((c) => c.id != answer.id)
        .forEach((element) => {
          if (element.audioElement) {
            if (element.audioElement.status == true) {
              element.audioElement.audio.pause();
              element.audioElement.status = false;
            }
          }
        });
    } else {
      this.resultAnswerItems.forEach((element) => {
        if (element.audioElement) {
          if (element.audioElement.status == true) {
            element.audioElement.audio.pause();
            element.audioElement.status = false;
          }
        }
      });
    }
  }

  stopQuestionVoice() {
    //Stoping Voice of question
    if (this.exerciseItems[0].audioElement) {
      this.exerciseItems[0].audioElement.audio.pause();
      this.exerciseItems[0].audioElement.status = false;
    }
  }

  ngOnDestroy() {
    this.sub.forEach(e => {
      e.unsubscribe();
    })
  }

}
