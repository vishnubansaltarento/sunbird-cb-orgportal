import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CreateAssigneeComponent } from './create-assignee.component'

describe('CreateAssigneeComponent', () => {
  let component: CreateAssigneeComponent
  let fixture: ComponentFixture<CreateAssigneeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAssigneeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssigneeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
