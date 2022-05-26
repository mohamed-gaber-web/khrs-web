import { HelpModalComponent } from './../help-modal/help-modal.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, NavController, ToastController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AudioElement } from 'src/app/shared/models/audioObject';
import { ExerciseItem } from 'src/app/shared/models/exerciseItem';
import { ExerciseService } from 'src/app/shared/services/exercise.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-multi-choice',
  templateUrl: './multi-choice.page.html',
  styleUrls: ['./multi-choice.page.scss'],
})
export class MultiChoicePage implements OnInit {
  audio = new Audio('../../../assets/iphone_ding.mp3');
  checkQuestion = true;
  userInfo: any;
  isLoading: boolean = false;
  exerciseItems: ExerciseItem[];
  lengthQuestion: number = 0;
  limit: number = 1;
  limitAnswer: number = 4;
  offsetAnswer: number = 0;
  currentIndex: number = 0;
  courseId: number;
  exerciseType: number;
  subs: Subscription[] = [];
  multiForm: FormGroup;
  resultAnswer: boolean = null;
  multiChoiceId: number;
  answerItems: any;
  loadedCharacter: {};
  ChooseAnswerId: number;
  resultAnswerItems: any;

  @ViewChild('slides') slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    scrollbar: true,
  };

  constructor(
    public toastController: ToastController,
    private storageService: StorageService,
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public navController: NavController,
    private router: Router,
    public modalController: ModalController,
  ) {}

  ngOnInit() {
    this.userInfo = this.storageService.getUser();

    // ** get courseId And exerciseId
    this.courseId = +this.route.snapshot.paramMap.get('courseId');
    this.exerciseType = +this.route.snapshot.paramMap.get('exerciseId');
    // ** get all items question
    this.getQuestionAndAnswerMultiChoice();
    // ** get all answers by multiChoiceId
    // this.getAnswersMultiChoice();

    this.buildMultiForm();
  }

  // ** get question from api
  getQuestionAndAnswerMultiChoice() {
    this.isLoading = true;
    this.subs.push(
      this.exerciseService
        .getCourseExercise(
          this.exerciseType,
          this.courseId,
          this.currentIndex,
          this.limit
        )
        .subscribe((questionAndAnswerItems) => {
          this.isLoading = false;
          this.exerciseItems = questionAndAnswerItems['result'];

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
          this.lengthQuestion = questionAndAnswerItems['length'];
          if (this.lengthQuestion == 0) {
            this.errorMessage(
              'There are no available questions in this exercise'
            );
            setTimeout(() => {
              this.navController.navigateRoot([
                '/exercise',
                { courseId: this.courseId },
              ]);
            }, 100);
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
    );
  }

  // ** Build Single Choice Form
  buildMultiForm() {
    this.multiForm = this.fb.group({
      answer: [null, Validators.compose([Validators.required])],
    });
  }

  // ** Get Current Index
  getCurrentIndex() {
    this.slides
      .getActiveIndex()
      .then((current) => (this.currentIndex = current));
  }
  // ** Move to Next slide
  slideNext(questionId, answerId) {
    this.subs.push(
      this.exerciseService
        .checkAnswerMultiChoise(questionId, answerId)
        .subscribe(async (response) => {
          this.resultAnswer = response['success'];
          if (this.resultAnswer === true) {
            // ** message and voice success
            this.currentIndex += 1;
            this.successMessage('the answer is correct');
            this.isLoading = true;
            this.stopAllAudios();
            this.multiForm.reset();
            this.getQuestionAndAnswerMultiChoice();
            this.slides.slideNext();

            if (this.currentIndex === this.lengthQuestion) {
              this.successMessage('Thanks for resolving questions');
              setTimeout(() => {
                this.navController.navigateRoot([
                  '/exercise',
                  { courseId: this.courseId },
                ]);
              }, 100);
            }
          } else if (this.resultAnswer === false) {
            // ** message and voice error
            this.errorMessage(
              'The answer is wrong and please choose correct answer'
            );
          }
        })
    );
  }

  async successMessage(msg: string) {
    this.audio.load();
    this.audio.play();
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      cssClass: 'ion-success',
      color: 'success',
    });
    toast.present();
  }

  async errorMessage(msg: string) {
    this.audio.load();
    this.audio.play();
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      cssClass: 'ion-error',
      color: 'danger',
    });
    toast.present();
  }

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

  slidePrev() {
    this.currentIndex -= 1;
    this.getQuestionAndAnswerMultiChoice();
    this.slides.slidePrev();

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: HelpModalComponent,
      componentProps: {
        "modalLink": "https://khrs-admin.sdex.online/assets/tutorials/single_choice_tutorial.mp4",
        "modalTitle": "Multi Choice Tutorial"
      }
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
