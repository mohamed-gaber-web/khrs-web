import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { PuzzleSoundTestComponent } from "./puzzle-sound-test.component";


@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [PuzzleSoundTestComponent],
    exports: [PuzzleSoundTestComponent]
  })
  export class PuzzleSoundTestModule {}
