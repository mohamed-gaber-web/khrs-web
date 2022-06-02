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

  constructor(private authService: AuthService, private successService: SuccessBoardService) { }

  ngOnInit() {
    this.userInfo = this.authService.getUser();
    this.isLoading = true;
    this.sub.push(
      this.successService.successBoardFn(0, 20)
      .subscribe(response => {
          console.log(response);
          this.isLoading = false;
          this.allDataSuccess = response['successBoards']['result'];
          // this.allDataSuccessLength = response['successBoards']['length'];
          this.allDataRatng = response['ratings'];
          console.log(this.allDataRatng.length);
        })
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(e => e.unsubscribe());
  }

}
