import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminShopManagement } from './admin-shop-management';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('AdminShopManagement', () => {
  let component: AdminShopManagement;
  let fixture: ComponentFixture<AdminShopManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        AdminShopManagement
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), 
        provideRouter([]) 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShopManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});