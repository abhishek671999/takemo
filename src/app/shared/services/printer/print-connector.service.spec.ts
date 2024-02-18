import { TestBed } from '@angular/core/testing';

import { PrintConnectorService } from './print-connector.service';

describe('PrintConnectorService', () => {
  let service: PrintConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
