import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPasseiosComponent } from './menu-passeios.component';

describe('MenuPasseiosComponent', () => {
  let component: MenuPasseiosComponent;
  let fixture: ComponentFixture<MenuPasseiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPasseiosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuPasseiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
