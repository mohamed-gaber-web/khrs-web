import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-top-score-courses',
  templateUrl: './top-score-courses.component.html',
  styleUrls: ['./top-score-courses.component.scss'],
})
export class TopScoreCoursesComponent implements OnInit {

  @Input('topCoursesData') courseData: any;
  @Input('loading') isLoading: boolean;

  constructor() { }

  ngOnInit() {}

}
