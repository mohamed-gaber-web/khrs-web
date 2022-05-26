import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../shared/services/app.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  introVideo: any;
  getLang: string;
  subs: Subscription[] = [];
  @ViewChild('video') videoElement;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.getLang = localStorage.getItem('languageId');
    this.subs.push(
      this.appService.getVidoes('Intro', this.getLang)
      .subscribe((response) => {
        this.introVideo = response['result'].genericAttributeMediaTranslations[0];
      })
    )
   }

   ionViewWillLeave() {
    this.videoElement.nativeElement.pause()
    this.subs.forEach(el => {
      el.unsubscribe();
    })
  }

}
