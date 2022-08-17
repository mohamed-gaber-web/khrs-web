import { ToastController } from '@ionic/angular';
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
  @Input('courseName') courseName: string;
  rateObject: IRating;
  resultRating: any;
  subs: Subscription[] = [];

  constructor(private courseService: CourseService, private router: Router, public toastController: ToastController) {}

  ngOnInit() {
    this.rateObject = {
      courseId: this.courseIdRate,
      rate:  0,
      comment: ''
    }
  }

  addUserCourserate() {
    this.subs.push(
       this.courseService.createRatingService(this.rateObject)
        .subscribe( async (response) => {
          console.log(this.rateObject)
          console.log(response)
          this.resultRating = response['success'];
          if(this.resultRating === true) {
            this.router.navigateByUrl('/thanks-rating');
          } else  {
            const errorMsg = response['arrayMessage'][0];
            var toast = await this.toastController.create({
              message: errorMsg,
              duration: 2000,
              color: 'danger',
            });
            toast.present();
          }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

}
