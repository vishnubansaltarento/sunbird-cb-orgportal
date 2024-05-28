import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PreviewPlanComponent } from './preview-plan.component'

describe('PreviewPlanComponent', () => {
  let component: PreviewPlanComponent
  let fixture: ComponentFixture<PreviewPlanComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewPlanComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPlanComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
