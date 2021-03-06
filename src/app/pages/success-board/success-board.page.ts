import { Subscription } from 'rxjs';
import { SuccessBoardService } from './../../shared/services/success-board.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-success-board',
  templateUrl: './success-board.page.html',
  styleUrls: ['./success-board.page.scss'],
})
export class SuccessBoardPage implements OnInit {

  userInfo: any;
  allDataSuccess: any;
  allDataRatng: any;
  sub: Subscription[] = [];
  isLoading: boolean = false;
  allDataSuccessLength: number;
  reviewLength: number;

  constructor(private authService: AuthService, private successService: SuccessBoardService) { }

  ngOnInit() {
    this.userInfo = this.authService.getUser();
    this.isLoading = true;
    this.sub.push(
      this.successService.successBoardFn(0, 20)
      .subscribe(response => {
          this.isLoading = false;
          this.allDataSuccess = response['successBoards']['result'];
          this.allDataRatng = response['ratings'];
          this.allDataSuccessLength = response['successBoards']['length'];
          this.reviewLength = response['ratings'].length;
        })
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(e => e.unsubscribe());
  }

}
