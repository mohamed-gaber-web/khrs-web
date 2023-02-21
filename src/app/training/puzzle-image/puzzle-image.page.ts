import { UtilityService } from './../../shared/services/utility.service';
import { PuzzleSoundComponent } from './puzzle-sound/puzzle-sound.component';
import { PuzzleImageTranslations } from './../../shared/models/puzzleImageTranslation';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonSlides,
  ModalController,
  NavController,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { StorageService } from 'src/app/shared/services/storage.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { ExerciseService } from 'src/app/shared/services/exercise.service';
import { Subscription } from 'rxjs';
import { Howl } from 'howler';
import { HelpModalComponent } from '../help-modal/help-modal.component';

@Component({
  selector: 'app-puzzle-image',
  templateUrl: './puzzle-image.page.html',
  styleUrls: ['./puzzle-image.page.scss'],
})
export class PuzzleImagePage implements OnInit {
  userInfo: any;
  courseId: number;
  exerciseType: number;
  questionAndAnswerItems: any;
  questionsArray: any[] = [];
  answersArray: any[] = [];
  nextButton: boolean = false;
  lengthQuestion: number = 0;
  //howler
  player: Howl = null;
  isPlaying: boolean = false;
  voicePath: string;
  voicePathDanish: string;
  activeTrack: string;
  courseName: string;

  subs: Subscription[] = [];
  isLoading: boolean = false;
  limit: number = 1;
  currentIndex: number = 0;
  audio = new Audio('../../../assets/iphone_ding.mp3');
  finishedQuestion: boolean = false;

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
    private exerciseService: ExerciseService,
    public popoverController: PopoverController,
    public modalController: ModalController,
    private utilityService: UtilityService,

  ) {}

  ngOnInit() {
    this.userInfo = this.storageService.getUser();
    this.courseName = localStorage.getItem('courseName');
    // ** get courseId And exerciseId
    this.courseId = +this.route.snapshot.paramMap.get('courseId');
    this.exerciseType = +this.route.snapshot.paramMap.get('exerciseId');

    this.getQuestionAndAnswer();

  }

  // ** get question and answer puzzle text
  getQuestionAndAnswer() {
    this.isLoading = true;
    this.questionsArray = [];
    this.answersArray = [];
    this.subs.push(
      this.exerciseService
        .getCourseExercise(
          this.exerciseType,
          this.courseId,
          this.currentIndex,
          this.limit
        )
        .subscribe((response) => {
          this.questionAndAnswerItems = response;
          this.lengthQuestion = response['length'];

          if(this.lengthQuestion ==0){
            this.utilityService.errorText("There are no available questions in this exercise");
            setTimeout(() => {
              this.navController.navigateRoot(['/exercise', {courseId: this.courseId}]);
            }, 100)
          }

          this.isLoading = false;

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
            qpz.voicePath=null;
            qpz.voicePathDanish=null;
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
            apz.voicePath =
              this.questionAndAnswerItems.puzzleImagesTranslation[
                index
              ].voicePath;
            apz.voicePathDanish =
              this.questionAndAnswerItems.puzzleImagesTranslation[
                index
              ].voicePathDanish;

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
    if (this.player) {
      this.player.stop();
    }
    var prevData=   event.previousContainer.data;
    var data =   event.container.data;
    var prevIndex =   event.previousIndex;
    var currIndex =   event.currentIndex;

    if (event.previousContainer === event.container) {
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

    this.exerciseService
      .checkAnswerPuzzleWithImage(arrayPuzzle)
      .subscribe((response) => {
        const isCorrect = response['result'].isCorrect;

        if (isCorrect === true) {
          this.utilityService.successMessage("<img src='../../../assets/images/22.gif' />");
          if (this.player) {
            this.player.stop();
          }

          // ** check when finished question
          if ((this.currentIndex + 1) === this.lengthQuestion) {
            setTimeout(() => {
              this.utilityService.successText('Thanks for resolving questions');
            }, 3000)
            this.finishedQuestion = true;
            return;
          }
          setTimeout(() => {
            this.currentIndex += 1;
            this.getQuestionAndAnswer();
            this.slides.slideNext();
          }, 2000)

        } else if (isCorrect === false) {
          this.utilityService.errorMessage("<img src='../../../assets/images/wr.gif' />");
        }
      });
  }

  async presentPopover(ev: any, item: any) {
    const popover = await this.popoverController.create({
      component: PuzzleSoundComponent,
      componentProps: {
        voicePath: item.voicePath,
        voicePathDanish: item.voicePathDanish,
        imagePath: item.imagePath,
      },
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
    });
    await popover.present();
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
      },
      onend: () => {},
    });
    this.player.play();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: HelpModalComponent,
      componentProps: {
        "modalLink": "https://khrs-admin.sdex.online/assets/tutorials/single_choice_tutorial.mp4",
        "modalTitle": "Puzzle Wiith Image Tutorial"
      }
    });
    return await modal.present();
  }

  slidePrev() {
    this.currentIndex -= 1;
    this.getQuestionAndAnswer();
    this.slides.slidePrev();
  }

  // ** when finished question
  onFinished() {
    this.navController.navigateRoot(['/exercise', {courseId: this.courseId}]);
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
    if (this.player) {
      this.player.stop();
    }
  }

}
