import { TestBed } from '@angular/core/testing';

import { ConnectComponentsService } from './connect-components.service';

describe('ConnectComponentsService', () => {
  let service: ConnectComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
