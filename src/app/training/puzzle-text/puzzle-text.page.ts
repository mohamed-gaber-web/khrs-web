import { UtilityService } from './../../shared/services/utility.service';
import { PuzzleTextTranslations } from './../../shared/models/puzzleTextTranslations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides, ModalController, NavController, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/shared/services/storage.service';
import {CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { ExerciseService } from 'src/app/shared/services/exercise.service';
import { Subscription } from 'rxjs';
import { AudioElement } from 'src/app/shared/models/audioObject';
import { HelpModalComponent } from '../help-modal/help-modal.component';


@Component({
  selector: 'app-puzzle-text',
  templateUrl: './puzzle-text.page.html',
  styleUrls: ['./puzzle-text.page.scss'],
})
export class PuzzleTextPage implements OnInit {

  userInfo: any;
  courseId: number;
  exerciseType: number;
  questionAndAnswerItems: any;
  questions:PuzzleTextTranslations[];
  questionsArray:any[]=[];
  answersArray:any[]=[];
  answers:PuzzleTextTranslations[];
  nextButton: boolean = false;
  data: any;
  lengthQuestion: number = 0;

  resultAnswerItems: any;
  subs: Subscription[] = [];
  isLoading: boolean = false;
  limit: number = 1;
  currentIndex: number = 0;
  audio = new Audio('../../../assets/iphone_ding.mp3' );

  @ViewChild('slides') slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    scrollbar: true,
    onlyExternal: false,
    noSwipingClass: 'swiper-no-swiping',
  };

  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    public navController: NavController,
    private exerciseService: ExerciseService,
    public modalController: ModalController,
    private utilityService: UtilityService,



  ) { }

  ngOnInit() {
    this.userInfo = this.storageService.getUser();

    // ** get courseId And exerciseId
    this.courseId = +this.route.snapshot.paramMap.get('courseId');
    this.exerciseType = +this.route.snapshot.paramMap.get('exerciseId');

    this.getQuestionAndAnswer();
  }

  // ** get question and answer puzzle text
  getQuestionAndAnswer() {
    this.isLoading = true;
    this.questionsArray =[];
    this.answersArray=[];
    this.subs.push(
      this.exerciseService.getCourseExercise
      (this.exerciseType, this.courseId, this.currentIndex, this.limit)
      .subscribe(response => {
        this.questionAndAnswerItems = response;
        this.lengthQuestion = response['length'];
        if(this.lengthQuestion ==0){
          this.utilityService.errorMessage("There are no available questions in this exercise");
          setTimeout(() => {
            this.navController.navigateRoot(['/exercise', {courseId: this.courseId}]);
          }, 100)
        }
        this.isLoading = false;
        //Questions
       for (let index = 0; index < this.questionAndAnswerItems.puzzleText.length; index++) {
         let arr = [];
         let qpz : PuzzleTextTranslations = new PuzzleTextTranslations();
         qpz.id = this.questionAndAnswerItems.puzzleText[index].id;
         qpz.text = this.questionAndAnswerItems.puzzleText[index].text;
         qpz.type = "question";
         qpz.flag = "../../../assets/icon/da.png";
         qpz.disabled = true;
         qpz.voicePath = this.questionAndAnswerItems.puzzleText[index].voicePath;
         if(this.questionAndAnswerItems.puzzleText[index].voicePath != null && this.questionAndAnswerItems.puzzleText[index].voicePath != "" ){
          qpz.audioElement = new AudioElement();
          qpz.audioElement.status = false;
          var audio = new Audio(`${qpz.voicePath}`);
          qpz.audioElement.audio = audio;
          qpz.audioElement.audio.load();

        }
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
        apz.flag = this.userInfo.languageIcon;
        apz.disabled = false;
        apz.voicePath = this.questionAndAnswerItems.puzzleTextTranslations[index].voicePath;
        if(this.questionAndAnswerItems.puzzleTextTranslations[index].voicePath != null && this.questionAndAnswerItems.puzzleTextTranslations[index].voicePath != "" ){
          apz.audioElement = new AudioElement();
          apz.audioElement.status = false;
          var audio = new Audio(`${apz.voicePath}`);
          apz.audioElement.audio = audio;
          apz.audioElement.audio.load();

        }
        this.answersArray.push(apz);
      }

      })
    );
  }

  // ** Get Current Index
  getCurrentIndex() {
    this.slides
      .getActiveIndex()
      .then((current) => (this.currentIndex = current));
  }

  // ** Drop Function
  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
        // console.log('move');
      }
    else {
        var prevData=   event.previousContainer.data;
        var data =   event.container.data;
        var prevIndex =   event.previousIndex;
        var currIndex =   event.currentIndex;
      if(event.container.data.length == 1){
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

      // console.log(event.container.data);

    }

    if(this.answersArray.length === 0) {
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

  this.exerciseService.checkAnswerPuzzleWithText
  (arrayPuzzle)
  .subscribe(response => {
    const isCorrect = response['result'].isCorrect;

    if(isCorrect === true) {
      this.utilityService.successMessage("<img src='../../../assets/images/22.gif' />");
      this.stopAllAudios();
      setTimeout(() => {
        this.currentIndex += 1;
        this.getQuestionAndAnswer();
        this.slides.slideNext();
      }, 3000)

      if(this.currentIndex === this.lengthQuestion) {
        this.utilityService.successMessage('Thanks for resolving questions');
        setTimeout(() => {
          this.navController.navigateRoot(['/exercise', {courseId: this.courseId}]);
        }, 100)
      }


    } else if(isCorrect === false) {
      this.utilityService.errorMessage("<img src='../../../assets/images/wr.gif' />");
    }
  })

  }


  playAudio(item:any){
  this.stopAllAudios(item);
  if(item.audioElement.status == false){
    item.audioElement.audio.play();
    item.audioElement.status = true;
  }else{
    item.audioElement.audio.pause();
    item.audioElement.status = false;
  }
  }

  stopAllAudios(item?:any){
  this.questionsArray.forEach(element => {
    element.forEach(element2 => {
      if (element2.audioElement && element2.audioElement.status == true && element2 != item) {
        element2.audioElement.audio.pause();
        element2.audioElement.status = false;
      }
    });

  });
  this.answersArray.forEach(element => {
    if (element.audioElement && element.audioElement.status == true && element != item) {
      element.audioElement.audio.pause();
      element.audioElement.status = false;
    }
  });
  }

  async presentModal() {
  const modal = await this.modalController.create({
    component: HelpModalComponent,
    componentProps: {
      "modalLink": "https://khrs-admin.sdex.online/assets/tutorials/single_choice_tutorial.mp4",
      "modalTitle": "Puzzle Wiith Text Tutorial"
    }
  });
  return await modal.present();
  }

  slidePrev() {
  this.currentIndex -= 1;
  this.getQuestionAndAnswer();
  this.slides.slidePrev();
  }

  ngOnDestroy() {
  this.subs.forEach((sub) => {
    sub.unsubscribe();
  });
  }

}
// function debuge() {
//   throw new Error('Function not implemented.');
// }

