import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/shared/services/courses.service';
import { IRating } from './../../../../shared/models/rating.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-rating',
  templateUrl: './course-rating.component.html',
  styleUrls: ['./course-rating.component.scss'],
})
export class CourseRatingComponent implements OnInit {

  @Input() courseIdRate: number;
  rateObject: IRating;
  resultRating: any;
  subs: Subscription[] = [];

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit() {
    // console.log(this.courseIdRate)
    this.rateObject = {
      courseId: this.courseIdRate,
      rate:  0,
      comment: ''
    }
  }

  addUserCourserate() {
    this.subs.push(
       this.courseService.createRatingService(this.rateObject)
        .subscribe(response => {
          console.log(this.rateObject)
          console.log(response)
          this.resultRating = response['success'];
          if(this.resultRating === true) {
            this.router.navigateByUrl('/thanks-rating');
          }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

}
