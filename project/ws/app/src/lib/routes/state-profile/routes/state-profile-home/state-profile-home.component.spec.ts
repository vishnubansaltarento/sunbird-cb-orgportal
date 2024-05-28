import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { StateProfileHomeComponent } from './state-profile-home.component'

describe('StateProfileHomeComponent', () => {
  let component: StateProfileHomeComponent
  let fixture: ComponentFixture<StateProfileHomeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StateProfileHomeComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StateProfileHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
