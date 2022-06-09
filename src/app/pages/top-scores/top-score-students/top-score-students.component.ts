import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-score-students',
  templateUrl: './top-score-students.component.html',
  styleUrls: ['./top-score-students.component.scss'],
})
export class TopScoreStudentsComponent implements OnInit {

  @Input('topStudentData') studentsData: any;
  @Input('loading') isLoading: boolean;

  constructor() { }

  ngOnInit() {}

}
