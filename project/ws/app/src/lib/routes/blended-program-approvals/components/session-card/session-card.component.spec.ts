import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { SessionCardComponent } from './session-card.component'

describe('SessionCardComponent', () => {
  let component: SessionCardComponent
  let fixture: ComponentFixture<SessionCardComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SessionCardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
