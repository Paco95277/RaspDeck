import { TestBed } from '@angular/core/testing';

import { ActionRunner } from './action-runner';

describe('ActionRunner', () => {
  let service: ActionRunner;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionRunner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
