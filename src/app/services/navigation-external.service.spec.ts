import { TestBed } from '@angular/core/testing'

import { NavigationExternalService } from './navigation-external.service'

describe('NavigationExternalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: NavigationExternalService = TestBed.inject(NavigationExternalService)
    expect(service).toBeTruthy()
  })
})
