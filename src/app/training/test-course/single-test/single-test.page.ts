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
  exerciseItems: any;
  courseId: number;
  questionType: number;
  testId: number;
  allTestData: any;
  lengthItems: number;
  isLoading: boolean = false;
  userTestId: number;
  subs: Subscription[] = [];
  userInfo: any;
  statusVoice: boolean = false;
  statusVoiceDanish: boolean = false;
  audioVoice: HTMLAudioElement;
  audioVoiceDanish: HTMLAudioElement;


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
    this.userInfo = this.storageService.getUser();
    this.buildSingleForm();
    this.courseId = +this.route.snapshot.paramMap.get('courseId');
    this.getTestType();
  }

// ** get test type
getTestType() {
  this.isLoading = true;
  this.singleForm.reset();
  this.testService.getTestType(this.courseId, this.pageNumber)
  .subscribe(response => {
    // console.log('test single page', response);
    this.isLoading = false;
    // this.exerciseItems = response;
    // console.log(this.exerciseItems)
    this.questionType = response['questionType'];
    this.testId = response['testId'];
    this.lengthItems = response['length'];

    // check question type
    if(this.questionType !== 1) {
      // parent
      const obj = {
        pageNumber: this.pageNumber,
        questionType: this.questionType
      }
      this.questionData.emit(obj)
    }
    
    this.allTestData = response['singleChoice'];
    // console.log(this.allTestData)
    // Sound Code
    if(this.allTestData['singleChoiceTranslations'][0].voicePath != null && this.allTestData['singleChoiceTranslations'][0].voicePath ){  
      this.statusVoice = false;
      var audio = new Audio(`${this.allTestData['singleChoiceTranslations'][0].voicePath}`);
      this.audioVoice = audio;
      this.audioVoice.load();
    }

    if(this.allTestData.voiceDanishPath != null && this.allTestData.voiceDanishPath ){
      this.statusVoiceDanish = false;
      var audio = new Audio(`${this.allTestData.voiceDanishPath}`);
      this.audioVoiceDanish = audio;
      this.audioVoiceDanish.load();
    }
    // Sound Code
  })
}


playAudio(type?:string,item?:any){

  // console.log('voice play', item)
  if(type == "native"){
    if(this.statusVoiceDanish == true){
      this.audioVoiceDanish.pause();
      this.statusVoiceDanish = false;
    }
    if(this.statusVoice == false){
      this.audioVoice.play();
      this.statusVoice = true;
    }else{
      this.audioVoice.pause();
      this.statusVoice = false;
    }
  }else{
    if(this.statusVoiceDanish == false){
      if(this.statusVoice == true){
        this.audioVoice.pause();
        this.statusVoiceDanish = false;
      }
      this.audioVoiceDanish.play();
      this.statusVoiceDanish = true;
    }else{
      this.audioVoiceDanish.pause();
      this.statusVoiceDanish = false;
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
      console.log("from single test", response);

      // Sound with next 
      if(this.audioVoice){
        this.audioVoice.pause();
        this.audioVoice = null;

      }
      if(this.audioVoiceDanish){
        this.audioVoiceDanish.pause();
        this.audioVoiceDanish = null;

      }

      // !! this issue here *************************** userTestId
      this.userTestId = response['result'].userTestId;
      
        this.pageNumber += 1;
        // ** check last question
        if(this.lengthItems === this.pageNumber) { // length item = 5 // page numer = 5
          // console.log('this is last number');
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

// ** scape questions
ScapeSlidePrev() {
  this.pageNumber += 1;
  if(this.lengthItems === this.pageNumber) { // length item = 5 // page numer = 5
    // console.log('this is last number');
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
      console.log(response)
      localStorage.removeItem('courseId')
      localStorage.removeItem('pageNumber')
      this.router.navigate(['/courses/tabs/my-courses']);
    })
}

ngOnDestroy() {this.subs.forEach(e => e.unsubscribe())

}

}
