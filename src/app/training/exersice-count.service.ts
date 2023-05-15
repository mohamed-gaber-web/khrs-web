import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ExerciseService } from '../shared/services/exercise.service';

@Injectable({
  providedIn: 'root'
})
export class ExersiceCountService {

  singleCount: any;
  multiCount: any;
  textCount: any;
  imageCount: any;

  constructor(private exerciseService: ExerciseService, private route: ActivatedRoute, private router: Router,) {
    this.getExerciseSingleCount();
    this.getExerciseMultiCount();
    this.getExerciseTextCount();
    this.getExerciseImageCount();
   }

  ngOnInit() {}

  getExerciseSingleCount() {
    const courseId = JSON.parse(localStorage.getItem('courseId'))
    return this.exerciseService.getCourseExercise(1, courseId, 0, 100);
  }

  getExerciseMultiCount() {
    const courseId = JSON.parse(localStorage.getItem('courseId'))
    return this.exerciseService.getCourseExercise(2, courseId, 0, 100);
  }

  getExerciseTextCount() {
    const courseId = JSON.parse(localStorage.getItem('courseId'))
    return this.exerciseService.getCourseExercise(3, courseId, 0, 100)
  }

  getExerciseImageCount() {
    const courseId = JSON.parse(localStorage.getItem('courseId'))
    return this.exerciseService.getCourseExercise(4, courseId, 0, 100)
  }


}
