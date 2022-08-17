import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-course-status',
  templateUrl: './user-course-status.page.html',
  styleUrls: ['./user-course-status.page.scss'],
})
export class UserCourseStatusPage implements OnInit {

userDataList: any;
userDataLength: number;
isLoading: boolean = false;
sub: Subscription[] = [];
userInfo: any;

  constructor(private authService: AuthService, private route: Router) { }

  ngOnInit() {
    this.userInfo = this.authService.getUser();
    this.getProfileDataList(); // *** get user course status
  }

  // *** get user course status
  getProfileDataList() {
    this.isLoading = true;
    this.sub.push(this.authService.getProfileDataList()
      .subscribe(response => {
        // console.log(response);
        this.isLoading = false;
        this.userDataList = response['result'];
        this.userDataLength = response['length'];
      })
    )
  }

  courseDetails(courseId: number, userId) {
    this.route.navigate(['courses/tabs/choose-course-material', { courseId, userId }]);
  }

  ngOnDestroy() {
    this.sub.forEach(s => {
      s.unsubscribe();
    })
  }

}
