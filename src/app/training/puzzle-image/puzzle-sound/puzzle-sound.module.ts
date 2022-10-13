import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { PuzzleSoundComponent } from "./puzzle-sound.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [PuzzleSoundComponent],
    exports: [PuzzleSoundComponent]
  })
  export class PuzzleSoundModule {}
