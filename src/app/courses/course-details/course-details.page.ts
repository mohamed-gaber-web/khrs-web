import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CourseService } from 'src/app/shared/services/courses.service';

import { Platform } from '@ionic/angular';
import { TestService } from 'src/app/shared/services/test.service';
import { Howl } from 'howler';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.page.html',
  styleUrls: ['./course-details.page.scss'],
})
export class CourseDetailsPage implements OnInit {

  courseDetails: any;
  subs: Subscription[] = [];
  isLoading = false;
  // userTestId: number = JSON.parse(localStorage.getItem('// userTestId'));
  courseId:number;
  player: Howl = null;
  isPlaying: boolean = false;
  pdfFile: any;


  constructor(
    private router: Router,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private testService: TestService,
    private fileOpener: FileOpener,
    private platform: Platform

    ) { }

  ngOnInit() {

  // ** Get course details
  this.isLoading = true;
  this.subs.push(
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
          this.courseService.getCoursesDetails(+params.get('courseId')))
          ).subscribe(response => {
          // console.log('course details', response);
          this.isLoading = false;
          this.courseDetails = response['result'];
    })

  );
  }

  // ** send id to apply course page
  sendData(event, id) {
    this.router.navigate(['courses/tabs/apply-course', {id}])
  }

  // ** Download Certificate
downloadCertificate() {
  this.testService.getCertificate(this.courseDetails.id)
  .subscribe((response: Blob) => {
    this.isLoading = false;
    if(this.platform.is('mobileweb')) {

      this.pdfFile = new Blob([response], {type: 'application/pdf'});

      var downloadURL = window.URL.createObjectURL(response);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "Certificate.pdf";
      link.click();
    } else if(this.platform.is('android')) {
      File.writeFile(
        File.externalRootDirectory + "/Download",
        this.courseDetails.id + "Certificate.pdf",
        new Blob([response]),
        {
          replace: true,
        }
      );
      this.fileOpener.open(File.externalRootDirectory + "/Download/" + this.courseDetails.id + "Certificate.pdf", 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    } else {
      this.pdfFile = new Blob([response], {type: 'application/pdf'});

      var downloadURL = window.URL.createObjectURL(response);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "Certificate.pdf";
      link.click();

    }

  });
}

startAudio(voicePath: string) {
  if (this.player && this.isPlaying == true) {
    this.player.stop();
    this.isPlaying = false;
  }else{
    this.player = new Howl({
      html5: true,
      src: voicePath,
      onplay: () => {

        this.isPlaying = true;
      },
      onend: () => {
        this.isPlaying = false;
      },
    });
    this.player.play();

  }

}
ionViewDidLeave():void{
  if (this.player) {
    this.player.stop();
  }
}

ngOnDestroy(): void {
  if (this.isPlaying) {
    this.player.stop();
  }
  this.subs.forEach((element) => {
    element.unsubscribe();
  })
}

}
