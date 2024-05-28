import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { EventThumbnailComponent } from './event-thumbnail.component'

describe('ParticipantsComponent', () => {
  let component: EventThumbnailComponent
  let fixture: ComponentFixture<EventThumbnailComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventThumbnailComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EventThumbnailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
