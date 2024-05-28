import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { FilterDisplayComponent } from './filter-display.component'

describe('FilterDisplayComponent', () => {
  let component: FilterDisplayComponent
  let fixture: ComponentFixture<FilterDisplayComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDisplayComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDisplayComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
