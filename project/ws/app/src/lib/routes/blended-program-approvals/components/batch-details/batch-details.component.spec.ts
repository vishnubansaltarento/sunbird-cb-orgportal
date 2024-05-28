import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BatchDetailsComponent } from './batch-details.component'

describe('BatchDetailsComponent', () => {
  let component: BatchDetailsComponent
  let fixture: ComponentFixture<BatchDetailsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BatchDetailsComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
