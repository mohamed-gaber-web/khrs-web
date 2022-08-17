import { CourseService } from 'src/app/shared/services/courses.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-top-user-score',
  templateUrl: './top-user-score.component.html',
  styleUrls: ['./top-user-score.component.scss'],
})
export class TopUserScoreComponent implements OnInit {

  // @Input('topStudentData') studentsData: any
  topStudents: any;
  topStudent: any;
  obj: any;

  constructor(public courseService: CourseService) { }

  ngOnInit() {
    this.courseService.getTopScores()
      .subscribe((response) => {
        this.topStudents = response['result']['topStudents'];
        this.topStudent = this.topStudents.slice(0, 3)
       this.obj = Object.assign({}, this.topStudent); // {0:"a", 1:"b", 2:"c"}
        console.log('3 values', this.obj)
      });
  }

}
