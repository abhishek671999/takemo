import { TestBed } from '@angular/core/testing';

import { PwdrecoveryService } from './pwdrecovery.service';

describe('PwdrecoveryService', () => {
  let service: PwdrecoveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwdrecoveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
