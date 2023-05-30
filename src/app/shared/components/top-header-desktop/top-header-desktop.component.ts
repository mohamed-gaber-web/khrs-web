import { Subscription } from 'rxjs';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { StorageService } from '../../services/storage.service';
import { TrackingUserService } from '../../services/tracking-user.service';

@Component({
  selector: 'app-top-header-desktop',
  templateUrl: './top-header-desktop.component.html',
  styleUrls: ['./top-header-desktop.component.scss'],
})
export class TopHeaderDesktopComponent implements OnInit {

  userInfo: any;
  toggle: boolean = false;
  listNotifi: any;
  notifiCount: number = 0;
  sub: Subscription[] = [];

  constructor(
    public authService: AuthService,
    public storageService: StorageService,
    public toastController: ToastController,
    private router: Router,
    private trackingService: TrackingUserService,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.userInfo = this.authService.getUser();
    // this.getUserAmDoneToday();
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

  // * getUserAmDoneToday
  // getUserAmDoneToday() {
  //   this.sub.push(
  //     this.trackingService.getAllUser(0, 10)
  //     .subscribe(response => {
  //     this.listNotifi = response['result'];
  //     this.notifiCount = response['length'];
  //     })
  //   );
  // }


  onToggleColorTheme(event) {
    if(event.detail.checked) {
      this.renderer.setAttribute(document.body, 'color-theme', 'dark');
    } else {
      this.renderer.setAttribute(document.body, 'color-theme', 'light');
    }
  }

  // * open and hide modal notification
  toggleModal() {
    this.toggle = !this.toggle;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }


}
