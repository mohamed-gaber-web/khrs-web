import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/shared/services/app.service';

@Component({
  selector: 'app-course-intro-sound',
  templateUrl: './course-intro-sound.component.html',
  styleUrls: ['./course-intro-sound.component.scss'],
})
export class CourseIntroSoundComponent implements OnInit {

  courseAudio: string;
  getLang: string;
  sub: Subscription[] = []

  @Output() courseIntroSound: EventEmitter<any> = new EventEmitter();

  @Input() title: string;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.getLang = localStorage.getItem('languageId') || '2';
    this.sub.push(
      this.appService.getVidoes('Courses', this.getLang)
        .subscribe((response) => {
          this.courseAudio = response['result']?.genericAttributeMediaTranslations[0]?.mediaPath;
      })
    );
  }

  startAudio() {
    this.courseIntroSound.emit(this.courseAudio)
  }

  ngOnDestroy(): void {
    this.sub.forEach(el => {
      el.unsubscribe();
    })
  }

}
