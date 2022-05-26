import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TopHeaderDesktopComponent } from './top-header-desktop.component';

describe('TopHeaderDesktopComponent', () => {
  let component: TopHeaderDesktopComponent;
  let fixture: ComponentFixture<TopHeaderDesktopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TopHeaderDesktopComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TopHeaderDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
