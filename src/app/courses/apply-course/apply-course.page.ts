import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CourseService } from 'src/app/shared/services/courses.service';

@Component({
  selector: 'app-apply-course',
  templateUrl: './apply-course.page.html',
  styleUrls: ['./apply-course.page.scss'],
})
export class ApplyCoursePage implements OnInit {

  applyForm: FormGroup;
  id: any;
  courseDetails: any;
  itemDuration: number;
  toDate: number;
  subs: Subscription[] = [];

  applyFormErrors = {
    startDate: '',
  };

  applyValidationMessages = {
    startDate: {
      required: this.translate.instant('fromDate'),
    }
  };

  constructor(
    private router: Router,
    private courseService: CourseService,
    public formBuilder: FormBuilder,
    private translate:TranslateService,
    public route: ActivatedRoute,
    public toastController: ToastController,
    ) { }

  ngOnInit() {

    // ** Register Fields
    this.applyForm = this.formBuilder.group({
      'startDate': [new Date(), Validators.required],
    });

    this.applyForm.valueChanges.subscribe((data) => this.validateApplyForm());

    // ** Get id From Details course page
    this.id = JSON.parse(this.route.snapshot.paramMap.get("id"));
    this.courseService.getCoursesDetails(this.id).subscribe(response => {
      this.courseDetails = response['result'];
    })

  }

  validateApplyForm(isSubmitting = false) {
    for (const field of Object.keys(this.applyFormErrors)) {
      this.applyFormErrors[field] = '';

      const input = this.applyForm.get(field) as FormControl;
      if (input.invalid && (input.dirty || isSubmitting)) {
        for (const error of Object.keys(input.errors)) {
          this.applyFormErrors[field] = this.applyValidationMessages[field][
            error
          ];
        }
      }
    }
  }

  // ** send data { startDate, courseId }
  createCourseApply() {
    this.subs.push(
      this.courseService.createCourseApply({...this.applyForm.value, courseId: this.id}).subscribe(async (response) => {
        if(response['arrayMessage'] === null) {
          var toast = await this.toastController.create({
            message: 'Thanks for apply course!',
            duration: 2000,
            color: 'success',
          });
          toast.present();
          this.router.navigate(['/courses/tabs/my-courses']);
        } else {
          var toast = await this.toastController.create({
            message: 'Exist error',
            duration: 2000,
            color: 'danger',
          });
          toast.present();
        }
      })
    );
  }

  // ** update value end date when choose start date
  updateValue(e) {
    const fromDateValue = new Date(e.value);
    this.toDate = fromDateValue.setDate(fromDateValue.getDate() + this.courseDetails.duration);
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
