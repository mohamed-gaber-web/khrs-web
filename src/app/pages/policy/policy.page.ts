import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from 'src/app/shared/services/app.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.page.html',
  styleUrls: ['./policy.page.scss'],
})
export class PolicyPage implements OnInit {

  userInfo: any;
  policyData: any;
  isLoading = false;

  constructor(
    private authService: AuthService,
    public storageService: StorageService,
    private appServ: AppService, ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userInfo = this.authService.getUser();
    this.appServ.getPolicyPage().subscribe(response => {
      this.isLoading = false;
      this.policyData = response['result']['policyTranslations']
      console.log(response['result']['policyTranslations'])
    })
  }

}
