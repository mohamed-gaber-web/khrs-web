import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-top-menu-mobile',
  templateUrl: './top-menu-mobile.component.html',
  styleUrls: ['./top-menu-mobile.component.scss'],
})
export class TopMenuMobileComponent implements OnInit {

  userInfo: any;

  constructor(private authService: AuthService, private renderer: Renderer2) { }

  ngOnInit() {
    this.userInfo = this.authService.getUser();
  }

  onToggleColorTheme(event) {
    if(event.detail.checked) {
      // document.body.setAttribute('color-theme', 'dark');
      this.renderer.setAttribute(document.body, 'color-theme', 'dark');
    } else {
      // document.body.setAttribute('color-theme', 'light');
      this.renderer.setAttribute(document.body, 'color-theme', 'light');
    }
  }

}
