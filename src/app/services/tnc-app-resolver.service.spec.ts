import { TestBed } from '@angular/core/testing'

import { TncAppResolverService } from './tnc-app-resolver.service'

describe('TncAppResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: TncAppResolverService = TestBed.inject(TncAppResolverService)
    expect(service).toBeTruthy()
  })
})
