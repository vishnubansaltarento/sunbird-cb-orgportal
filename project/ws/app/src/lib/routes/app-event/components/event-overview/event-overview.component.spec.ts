import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { EventOverviewComponent } from './event-overview.component'

describe('EventOverviewComponent', () => {
  let component: EventOverviewComponent
  let fixture: ComponentFixture<EventOverviewComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventOverviewComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EventOverviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
