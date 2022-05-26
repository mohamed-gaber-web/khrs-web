import { User } from './../shared/models/user';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

  @ViewChild('myTabs') tabs: IonTabs;
  activeTabName;
  userInfo: any;


constructor(public storageService: StorageService, public authService: AuthService) { }

ngOnInit() {
  this.userInfo = this.authService.getUser();
}



}
