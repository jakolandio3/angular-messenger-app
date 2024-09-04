import { TestBed } from '@angular/core/testing';

import { GroupFunctionsService } from './group-functions.service';

describe('GroupFunctionsService', () => {
  let service: GroupFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
