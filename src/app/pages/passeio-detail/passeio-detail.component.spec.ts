import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasseioDetailComponent } from './passeio-detail.component';

describe('PasseioDetailComponent', () => {
  let component: PasseioDetailComponent;
  let fixture: ComponentFixture<PasseioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasseioDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasseioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
