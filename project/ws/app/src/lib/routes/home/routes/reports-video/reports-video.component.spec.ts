import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ReportsVideoComponent } from './reports-video.component'

describe('ReportsVideoComponent', () => {
  let component: ReportsVideoComponent
  let fixture: ComponentFixture<ReportsVideoComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsVideoComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsVideoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
