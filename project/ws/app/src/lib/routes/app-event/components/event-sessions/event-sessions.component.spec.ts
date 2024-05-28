import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { EventSessionsComponent } from './event-sessions.component'

describe('EventSessionsComponent', () => {
  let component: EventSessionsComponent
  let fixture: ComponentFixture<EventSessionsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventSessionsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSessionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
