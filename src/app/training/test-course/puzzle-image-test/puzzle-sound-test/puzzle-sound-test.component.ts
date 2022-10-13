import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Howl } from 'howler';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-puzzle-sound',
  templateUrl: './puzzle-sound-test.component.html',
  styleUrls: ['./puzzle-sound-test.component.scss'],
})
export class PuzzleSoundTestComponent implements OnInit {
  //howler
  player: Howl = null;
  isPlaying: boolean = false;
  voicePath: string;
  voicePathDanish: string;
  activeTrack: string;
  userInfo: any;
  imagePath: string;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    public authService: AuthService
  ) {

  }
  ngOnInit() {
    this.userInfo = this.authService.getUser();
    this.voicePath = this.navParams.data.voicePath;
    this.voicePathDanish = this.navParams.data.voicePathDanish;
    this.imagePath = this.navParams.data.imagePath;

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

  ngOnDestroy() {
    if (this.player) {
      this.player.stop();
    }
  }
}
