import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homeproducts } from './homeproducts';

describe('Homeproducts', () => {
  let component: Homeproducts;
  let fixture: ComponentFixture<Homeproducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homeproducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homeproducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
