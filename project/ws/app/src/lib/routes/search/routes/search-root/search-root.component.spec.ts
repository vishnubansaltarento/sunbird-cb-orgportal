import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { SearchRootComponent } from './search-root.component'

describe('SearchRootComponent', () => {
  let component: SearchRootComponent
  let fixture: ComponentFixture<SearchRootComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchRootComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRootComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
