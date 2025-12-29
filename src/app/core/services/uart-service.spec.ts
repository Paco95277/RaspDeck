import { TestBed } from '@angular/core/testing';

import { UartService } from './uart-service';

describe('UartService', () => {
  let service: UartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
