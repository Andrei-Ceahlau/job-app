import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasiniModalComponent } from './masini-modal.component';

describe('MasiniModalComponent', () => {
  let component: MasiniModalComponent;
  let fixture: ComponentFixture<MasiniModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasiniModalComponent]
    });
    fixture = TestBed.createComponent(MasiniModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
