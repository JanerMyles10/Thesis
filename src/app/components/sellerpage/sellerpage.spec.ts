import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sellerpage } from './sellerpage';

describe('Sellerpage', () => {
  let component: Sellerpage;
  let fixture: ComponentFixture<Sellerpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sellerpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sellerpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
