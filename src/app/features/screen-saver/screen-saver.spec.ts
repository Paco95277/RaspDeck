import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenSaver } from './screen-saver';

describe('ScreenSaver', () => {
  let component: ScreenSaver;
  let fixture: ComponentFixture<ScreenSaver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenSaver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenSaver);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
