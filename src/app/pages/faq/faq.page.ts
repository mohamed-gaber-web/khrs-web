import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from 'src/app/shared/services/app.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  userInfo: any;
  panelOpenState = false;
  offset: number = 0;
  limit: number = 10;
  allFaq: any;
  isLoading = false;


  constructor(
    private authService: AuthService,
    public storageService: StorageService,
    private appServ: AppService, ) { }

  ngOnInit() {
    this.userInfo = this.authService.getUser();
    this.isLoading = true;
    this.appServ.getFaqPage(this.offset, this.limit)
    .subscribe(response => {
      this.isLoading = false;
      // console.log(response['result'][0].faqTranslations);
      this.allFaq = response['result'];
    })
  }

}
