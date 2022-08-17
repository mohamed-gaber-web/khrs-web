import { map } from 'rxjs/operators';
import { CourseService } from 'src/app/shared/services/courses.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { shareReplay } from 'rxjs/operators';

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
    this.courseService.getTopScores().pipe(
      map((res: any) =>
      {
        this.allTopStudents = Object.values(res['result']['topStudents'])
        this.allTopCourses = Object.values(res['result']['topCourses'])
        this.allTopExams = Object.values(res['result']['topTests'])
      }
      ),
      shareReplay()
      )
    .subscribe(
      //() => console.log(),
      //(err) => console.log(err),
      () => {this.isLoading = false}
    )
  }

  ngOnDestroy() {
    this.sub.forEach(e => e.unsubscribe());
  }

}
