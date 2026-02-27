import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { AvatarService } from '../../services/avatar.service';
import { ExcursionService } from '../../services/excursion.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    const avatarStub = {
      avatarUrl$: new BehaviorSubject<string | undefined>(undefined),
      emoji$: new BehaviorSubject<string>('👤'),
      syncWithStoredUser: jasmine.createSpy('syncWithStoredUser')
    };

    const excursionStub = {
      getExcursions: jasmine.createSpy('getExcursions').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
      providers: [
        { provide: AvatarService, useValue: avatarStub },
        { provide: ExcursionService, useValue: excursionStub }
      ]
    })
    .compileComponents();
    
    localStorage.removeItem('user');
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
