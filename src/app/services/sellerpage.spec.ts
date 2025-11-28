import { TestBed } from '@angular/core/testing';

import { Sellerpage } from '../components/sellerpage/sellerpage';

describe('Sellerpage', () => {
  let service: Sellerpage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sellerpage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
