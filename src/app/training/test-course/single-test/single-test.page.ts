import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AudioElement } from 'src/app/shared/models/audioObject';
import { ExerciseItem } from 'src/app/shared/models/exerciseItem';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-single-test',
  templateUrl: './single-test.page.html',
  styleUrls: ['./single-test.page.scss'],
})
export class SingleTestPage implements OnInit {

  singleForm: FormGroup;
  courseId: number;
  questionType: number;
  testId: number;
  allTestData: any;
  lengthItems: number;
  isLoading: boolean = false;
  userTestId: number;
  subs: Subscription[] = [];
  exerciseItems: ExerciseItem[];
  userInfo: any;


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

singleFormErrors = {answer: ''};
singleValidationMessages = {
    answer: {
      required: 'Please check answer',
    },
};

  constructor(
    public toastController: ToastController,
    private testService: TestService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public navController: NavController,
    private router: Router,
    private storageService: StorageService
  ) { }

ngOnInit() {
  this.buildSingleForm();
  this.courseId = +this.route.snapshot.paramMap.get('courseId');
  this.getTestType();
  this.userInfo = this.storageService.getUser();
}

// ** get test type
getTestType() {
  this.isLoading = true;
  this.singleForm.reset();
  this.testService.getTestType(this.courseId, this.pageNumber)
  .subscribe(response => {
    console.log(response)
    this.isLoading = false;
    this.questionType = response['questionType'];
    this.testId = response['testId'];
    this.lengthItems = response['length'];
    this.exerciseItems = [response['singleChoice']];

    if(this.questionType !== 1) {
      // parent
      const obj = {
        pageNumber: this.pageNumber,
        questionType: this.questionType
      }
      this.questionData.emit(obj)
    }
    this.allTestData = response;

      // Sound
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
      // Sound
  })
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
      answer: [true , Validators.compose([Validators.required])],
    })
    this.singleForm.valueChanges.subscribe((data) => this.validateSingleForm());
}

// ** Move to Next slide
slideNext(answerId) {

  const singleChoiceData = {
    singleChoiceAnswerId: answerId,
    answer: this.singleForm.value.answer
  }

  if(this.questionType === 1) {

    this.testService.sendAnswerTesting({
      testId:this.testId,
      questionType: this.questionType,
      singleChoiceAnswer: singleChoiceData,
      multiChoiceAnswer: null,
      puzzleWithTextAnswers: null, puzzleWithImageAnswers: null})
      .subscribe(response => {
      // !! this issue here *************************** userTestId
      this.userTestId = response['result'].userTestId;
        this.pageNumber += 1;
         // Stop Sound When next
          if(this.exerciseItems[0].audioElement){
            this.exerciseItems[0].audioElement.audio.pause();
            this.exerciseItems[0].audioElement.audio = null;

          }
          if(this.exerciseItems[0].audioElementDanish){
            this.exerciseItems[0].audioElementDanish.audio.pause();
            this.exerciseItems[0].audioElementDanish.audio = null;
          }

        // ** check last question
        if(this.lengthItems === this.pageNumber) { // length item = 5 // page numer = 5
          console.log('this is last number');
          localStorage.setItem('userTestId', JSON.stringify(this.userTestId))
          localStorage.setItem('courseId', JSON.stringify(this.courseId))
          localStorage.setItem('pageNumber', JSON.stringify(this.pageNumber))
          return;
          // this.router.navigate(['/exercise/finished-test', {userTestId: this.userTestId}]);
        }
        this.getTestType();
        this.slides.slideNext();
      })
  }

}

slidePrev() {
    this.pageNumber -= 1;
    this.getTestType();
    this.slides.slidePrev();
}

finishSlidePrev() {
    this.pageNumber -= 1;
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

finishedTest() {
    this.testService.finishedTest(this.userTestId)
    .subscribe(response => {
      localStorage.removeItem('courseId')
      localStorage.removeItem('pageNumber')
      this.router.navigate(['/courses/tabs/my-courses']);
    })
}

  // Play Sound
  playAudio(type?:string,item?:any){
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

  ngOnDestroy() {
    this.subs.forEach(e => {
      e.unsubscribe();
    })
  }

}
