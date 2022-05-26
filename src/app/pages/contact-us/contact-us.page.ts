import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  userInfo: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userInfo = this.authService.getUser();
  }

}
