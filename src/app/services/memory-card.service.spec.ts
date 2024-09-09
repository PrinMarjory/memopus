import { TestBed } from '@angular/core/testing';

import { MemoryCardService } from './memory-card.service';

describe('MemoryCardService', () => {
  let service: MemoryCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
