import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminShopApp } from './admin-shop-app';

describe('AdminShopApp', () => {
  let component: AdminShopApp;
  let fixture: ComponentFixture<AdminShopApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminShopApp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShopApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
