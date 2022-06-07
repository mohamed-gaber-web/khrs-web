import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {

  @Input('successData') allSuccessData: any;
  @Input('isLoadingData') isLoading: boolean;

  constructor() { }

  ngOnInit() {}

}
