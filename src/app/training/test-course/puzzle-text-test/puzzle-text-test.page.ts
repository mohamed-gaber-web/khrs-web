import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PuzzleTextTranslations } from 'src/app/shared/models/puzzleTextTranslations';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-puzzle-text-test',
  templateUrl: './puzzle-text-test.page.html',
  styleUrls: ['./puzzle-text-test.page.scss'],
})
export class PuzzleTextTestPage implements OnInit {

  userInfo: any;
  courseId: number;
  lengthItems: number;
  questionType: number;
  testId: number;
  exerciseType: number;
  questionAndAnswerItems: any;
  questions:PuzzleTextTranslations[];
  questionsArray:any[]=[];
  answersArray:any[]=[];
  answers:PuzzleTextTranslations[];
  nextButton: boolean = false;
  lengthQuestion: number = 0;
  isLoading: boolean = false;
  userTestId: number;

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

  resultAnswerItems: any;
  subs: Subscription[] = [];

  constructor(
    private testService: TestService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.courseId = +this.route.snapshot.paramMap.get('courseId');
    this.getQuestionAndAnswer();
  }

    // ** get question and answer puzzle text
getQuestionAndAnswer() {
  this.isLoading = true;
  this.questionsArray =[];
  this.answersArray=[];
  this.subs.push(
    this.testService
    .getTestType
    (this.courseId, this.pageNumber)
    .subscribe(response => {
      this.isLoading = false;
      console.log('puzzle with text', response);
      this.questionType = response['questionType'];
      this.testId = response['testId'];
      this.lengthItems = response['length'];
      if(this.questionType !== 3) {
        // parent
        const obj = {
          pageNumber: this.pageNumber,
          questionType: this.questionType
        }
        this.questionData.emit(obj)
      }
      this.questionAndAnswerItems = response['puzzleText'];
      //Questions
      for (let index = 0; index < this.questionAndAnswerItems.puzzleText.length; index++) {
        let arr = [];
        let qpz : PuzzleTextTranslations = new PuzzleTextTranslations();
        qpz.id = this.questionAndAnswerItems.puzzleText[index].id;
        qpz.text = this.questionAndAnswerItems.puzzleText[index].text;
        qpz.type = "question";
        qpz.disabled = true;

        arr.push(qpz);
        this.questionsArray.push(arr);
      }

      //Answers
      for (let index = 0; index < this.questionAndAnswerItems.puzzleTextTranslations.length; index++) {
      let arr = [];
      let apz : PuzzleTextTranslations  = new PuzzleTextTranslations();
      apz.id = this.questionAndAnswerItems.puzzleTextTranslations[index].id;
      apz.text = this.questionAndAnswerItems.puzzleTextTranslations[index].text;
      apz.type = "answer";
      apz.disabled = false;
      this.answersArray.push(apz);
    }

    })
  );
}


// ** Drop Function
drop(event: CdkDragDrop<any>) {
  if (event.previousContainer === event.container) {}
  else {
      var prevData=   event.previousContainer.data;
      var data =   event.container.data;
      var prevIndex =   event.previousIndex;
      var currIndex =   event.currentIndex;
    if(event.container.data.length == 1){
      transferArrayItem( prevData, data, prevIndex,1);
    }else{
      if(data[0].type=="question" && prevData[0].type == "question"){
        transferArrayItem(prevData, data, 1, 2);
        transferArrayItem(data, prevData, 1, 1);
      }
    }

  }

  if (this.answersArray.length === 0) {
    this.nextButton = true;
  } else {
    this.nextButton = false;
  }

}

// ** Move to Next slide
slideNext() {

// ** get check
let arrayPuzzle: any = [];

this.questionsArray.forEach(values => {
  arrayPuzzle.push({
    puzzleWithTextId: values[0].id,
    keyword: values[0].text,
    translationKeyword: values[1].text
  })
})

this.testService.sendAnswerTesting({
  testId:this.testId,
  questionType: this.questionType,
  singleChoiceAnswer: null,
  multiChoiceAnswer: null,
  puzzleWithTextAnswers: arrayPuzzle,
  puzzleWithImageAnswers: null})
  .subscribe(response => {
    this.userTestId = response['result'].userTestId;
    this.pageNumber += 1;
    // ** check last question
    if(this.lengthItems === this.pageNumber) { // length item = 5 // page numer = 5
      console.log('this is last number');
      localStorage.setItem('userTestId', JSON.stringify(this.userTestId))
      localStorage.setItem('courseId', JSON.stringify(this.courseId))
      localStorage.setItem('pageNumber', JSON.stringify(this.pageNumber))
      // this.navController.navigateForward('test-course/finished-test');
      // this.router.navigate(['/exercise/finished-test',
      // {userTestId: this.userTestId, courseId: this.courseId, offset: this.pageNumber}]);
      return;
    }
    this.getQuestionAndAnswer();
    this.slides.slideNext();
  })

}

slidePrev() {
  this.pageNumber -= 1;
  this.getQuestionAndAnswer();
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
  this.getQuestionAndAnswer();
  this.slides.slideNext();
}

finishedTest() {
  this.testService.finishedTest(this.userTestId)
  .subscribe(response => {
    localStorage.removeItem('courseId')
    localStorage.removeItem('pageNumber')
    this.router.navigate(['/courses/tabs/my-courses']);
    console.log(response);
  })
}


  ngOnDestroy() {
    this.subs.forEach(e => {
      e.unsubscribe();
    })
  }

}
