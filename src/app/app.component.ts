import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { StorageService } from './shared/services/storage.service';
import { TranslateConfigService } from './translate-config.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private translateConfigService: TranslateConfigService,
    public storageService: StorageService,
    public toastController: ToastController,
    public authService: AuthService,
    private router: Router

  ) {
    this.updateAppLanguage();

  }

  systemLanguage:any;

  updateAppLanguage(){
    if(!localStorage.getItem('lang')){
      localStorage.setItem('lang', "en");
      this.systemLanguage = "en";
    }else{
     this.systemLanguage = localStorage.getItem('lang');
    }
    this.translateConfigService.setLanguage(this.systemLanguage);
  }

  async logout() {
    this.storageService.clearStorage();
    var toast = await this.toastController.create({
      message: 'You sign out successfully!',
      duration: 2000,
      color: 'success',
    });
    toast.present();
    this.router.navigateByUrl('/auth/sign-in')
  }
}
