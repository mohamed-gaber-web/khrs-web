import { Injectable } from "@angular/core";
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})

export class UtilityService {

   audio = null;

  constructor(public toastController: ToastController) {
    this.audio = new Audio('../../../assets/iphone_ding.mp3');
  }

  ngOnInit() {
  }

  async successMessage(msg: string) {
    this.audio.load();
    this.audio.play();
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      cssClass:'success-msg',
      // color: 'success'
    });
    return toast.present();
  }

  async successText(msg: string) {
    this.audio.load();
    this.audio.play();
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      cssClass:'success-text',
      color: 'success'
    });
    return toast.present();
  }

  async errorMessage(msg: string) {
    this.audio.load();
    this.audio.play()
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      cssClass:'ion-error',
      // color: 'danger',
    });
    return toast.present();
  }

}
