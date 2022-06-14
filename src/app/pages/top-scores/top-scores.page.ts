import { CourseService } from 'src/app/shared/services/courses.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-scores',
  templateUrl: './top-scores.page.html',
  styleUrls: ['./top-scores.page.scss'],
})
export class TopScoresPage implements OnInit {

  sub: Subscription[] = [];
  allTopStudents: any;
  allTopCourses: any;
  allTopExams: any;
  isLoading: boolean = false;

  constructor(public courseService: CourseService) { }

  ngOnInit() {
    // ** get top scores data
    this.isLoading = true;
    this.courseService.getTopScores()
    .subscribe(response => {
    this.isLoading = false;
      // console.log('top scores', response);
      this.allTopStudents = response['result']['topStudents'];
      this.allTopCourses = response['result']['topCourses'];
      this.allTopExams = response['result']['topTests'];
    })
  }

  ngOnDestroy() {
    this.sub.forEach(e => e.unsubscribe());
  }

}
