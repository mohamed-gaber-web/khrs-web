import { Component, OnInit } from '@angular/core';

import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-puzzle-image-zoom',
  templateUrl: './puzzle-image-zoom.component.html',
  styleUrls: ['./puzzle-image-zoom.component.scss'],
})
export class PuzzleImageZoomComponent implements OnInit {

  imagePath: string

  constructor(private navParams: NavParams) { }

  ngOnInit() {
    this.imagePath = this.navParams.data.imagePath;
  }

}
