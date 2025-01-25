import { TestBed } from '@angular/core/testing';

import { UserListPageService } from './user-list-page.service';

describe('UserListPageService', () => {
  let service: UserListPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserListPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
