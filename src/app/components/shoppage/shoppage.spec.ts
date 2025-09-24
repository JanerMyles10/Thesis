import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shoppage } from './shoppage';

describe('Shoppage', () => {
  let component: Shoppage;
  let fixture: ComponentFixture<Shoppage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shoppage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shoppage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
