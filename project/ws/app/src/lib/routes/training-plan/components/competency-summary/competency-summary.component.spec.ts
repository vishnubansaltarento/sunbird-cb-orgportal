import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CompetencySummaryComponent } from './competency-summary.component'

describe('CompetencySummaryComponent', () => {
  let component: CompetencySummaryComponent
  let fixture: ComponentFixture<CompetencySummaryComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencySummaryComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencySummaryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
