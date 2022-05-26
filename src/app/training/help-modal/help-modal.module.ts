import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { HelpModalComponentRoutingModule } from "./help-modal-routing.module";
import { HelpModalComponent } from "./help-modal.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        HelpModalComponentRoutingModule,

    ],
    declarations: [HelpModalComponent]
  })
  export class HelpModalModule {}
  