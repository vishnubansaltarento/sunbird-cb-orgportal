import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AddTimelineFormComponent } from './add-timeline-form.component'

describe('AddTimelineFormComponent', () => {
  let component: AddTimelineFormComponent
  let fixture: ComponentFixture<AddTimelineFormComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddTimelineFormComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelineFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
