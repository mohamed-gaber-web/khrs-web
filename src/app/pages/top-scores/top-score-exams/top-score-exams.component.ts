import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-top-score-exams',
  templateUrl: './top-score-exams.component.html',
  styleUrls: ['./top-score-exams.component.scss'],
})
export class TopScoreExamsComponent implements OnInit {

  @Input('topExamsData') examsData: any;
  @Input('loading') isLoading: boolean;

  constructor() { }

  ngOnInit() {}

}
