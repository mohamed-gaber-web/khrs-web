import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, NavController, PopoverController, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TestService } from 'src/app/shared/services/test.service';
import { Subscription } from 'rxjs';
import { PuzzleImageTranslations } from 'src/app/shared/models/puzzleImageTranslation';
import { PuzzleImageZoomComponent } from './puzzle-image-zoom/puzzle-image-zoom.component';

@Component({
  selector: 'app-puzzle-image-test',
  templateUrl: './puzzle-image-test.page.html',
  styleUrls: ['./puzzle-image-test.page.scss'],
})
export class PuzzleImageTestPage implements OnInit {

  userInfo: any;
  courseId: number;
  questionType: number;
  testId: number;
  exerciseType: number;
  questionItems: any;
  answerItems: any;
  questionsArray: any[] = [];
  answersArray: any[] = [];
  nextButton: boolean = false;
  lengthItems: number = 0;
  questionAndAnswerItems: any;
  userTestId: number;

  @Input('pageNumber') pageNumber;
  @Output() questionData = new EventEmitter<any>();

  subs: Subscription[] = [];
  isLoading: boolean = false;
  limit: number = 1;
  currentIndex: number = 0;
  audio = new Audio('../../../assets/iphone_ding.mp3');

  @ViewChild('slides') slides: IonSlides;
  @ViewChild('image') image: ElementRef;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    scrollbar: true,
    loop: false,
    noSwipingClass: 'swiper-no-swiping',
  };

  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    public toastController: ToastController,
    public navController: NavController,
    private testService: TestService,
    public popoverController: PopoverController,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.courseId = +this.route.snapshot.paramMap.get('courseId');
    this.getQuestionAndAnswer();
  }

// ** get question and answer puzzle image
getQuestionAndAnswer() {
  this.isLoading = true;
  this.questionsArray = [];
  this.answersArray = [];
  this.subs.push(
    this.testService
      .getTestType(
        this.courseId,
        this.pageNumber
      )
      .subscribe((response) => {
        this.isLoading = false;
        // console.log('puzzle image response', response)
        this.questionType = response['questionType'];
        this.testId = response['testId'];
        this.lengthItems = response['length'];
        if(this.questionType !== 4) {
          // parent
          const obj = {
            pageNumber: this.pageNumber,
            questionType: this.questionType
          }
          this.questionData.emit(obj)
        }
        this.questionAndAnswerItems = response['puzzleImages'];

          //Questions
          for (
            let index = 0;
            index < this.questionAndAnswerItems.puzzleImages.length;
            index++
          ) {
            let arr = [];
            let qpz: PuzzleImageTranslations = new PuzzleImageTranslations();
            qpz.id = this.questionAndAnswerItems.puzzleImages[index].id;
            qpz.imagePath =
              this.questionAndAnswerItems.puzzleImages[index].imagePath;
            qpz.guidId =
              this.questionAndAnswerItems.puzzleImages[index].imageGuidId;
            qpz.type = 'question';
            qpz.keyword = null;
            qpz.disabled = true;
            arr.push(qpz);
            this.questionsArray.push(arr);
          }

          //Answers
          for (
            let index = 0;
            index < this.questionAndAnswerItems.puzzleImagesTranslation.length;
            index++
          ) {
            let arr = [];
            let apz: PuzzleImageTranslations = new PuzzleImageTranslations();
            apz.id =
              this.questionAndAnswerItems.puzzleImagesTranslation[index].id;
            apz.keywordId =
            this.questionAndAnswerItems.puzzleImagesTranslation[index].keywordId;
            apz.keyword =
              this.questionAndAnswerItems.puzzleImagesTranslation[
                index
              ].keyword;
            apz.guidId =
              this.questionAndAnswerItems.puzzleImagesTranslation[
                index
              ].imageGuidId;
            apz.type = 'answer';
            apz.disabled = false;

            this.answersArray.push(apz);
          }
      })
  );
}

// ** Drop Function
drop(event: CdkDragDrop<any>) {
  var prevData=   event.previousContainer.data;
  var data =   event.container.data;
  var prevIndex =   event.previousIndex;
  var currIndex =   event.currentIndex;

  if (event.previousContainer === event.container) {
    console.log("same")
    moveItemInArray(data, prevIndex, this.currentIndex);

  } else {

    if (event.container.data.length == 1) {
      transferArrayItem(
        prevData,
        data,
        prevIndex,
        1
      );
    }else{
      if(data[0].type=="question" && prevData[0].type == "question"){
        transferArrayItem(
          prevData,
          data,
          1,
          2
        );
        transferArrayItem(
          data,
          prevData,
          1,
          1
        );
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
  this.questionsArray.forEach((values) => {
    arrayPuzzle.push({
      puzzleWithImageQuestionId: values[0].id,
      imageGuid: values[0].guidId,
      wordId: values[1].keywordId,
    });
  });

  this.testService.sendAnswerTesting(
      {
        testId: this.testId,
        questionType: this.questionType,
        singleChoiceAnswer: null,
        multiChoiceAnswer: null,
        puzzleWithTextAnswers: null,
        puzzleWithImageAnswers: arrayPuzzle
      }
    )
    .subscribe((response) => {
      console.log(response)
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
    });
}

slidePrev() {

  this.pageNumber -= 1;
  this.getQuestionAndAnswer();
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
  this.getQuestionAndAnswer();
  this.slides.slideNext();
}

finishSlidePrev() {
  this.pageNumber -= 1;
}

// ** when to zoom image
async presentPopover(ev: any, item: any) {
  const popover = await this.popoverController.create({
    component: PuzzleImageZoomComponent,
    componentProps: {
      imagePath: item.imagePath,
    },
    cssClass: 'my-custom-class',
    event: ev,
    translucent: true,
  });
  await popover.present();
}

finishedTest() {
  this.testService.finishedTest(this.userTestId)
  .subscribe(response => {
    console.log(response)
    localStorage.removeItem('courseId')
    localStorage.removeItem('pageNumber')
    // this.router.navigate(['/courses/tabs/my-courses']).then(() => {
    //   window.location.reload();
    // });
    // this.navCtrl.navigateRoot('/courses/tabs/my-courses').then(() => {
    //   window.location.reload();
    //    });
    // this.router.navigateByUrl('/courses/tabs/my-courses', { skipLocationChange: true });
    // this.navCtrl.navigateRoot('/courses/tabs/my-courses')
    this.router.navigate(['/courses/tabs/my-courses'])

  })
}



ngOnDestroy() {
  this.subs.forEach(e => {
    e.unsubscribe();
  })
}

}
