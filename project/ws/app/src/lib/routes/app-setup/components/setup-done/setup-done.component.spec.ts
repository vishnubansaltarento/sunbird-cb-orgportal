import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { SetupDoneComponent } from './setup-done.component'

describe('SetupDoneComponent', () => {
  let component: SetupDoneComponent
  let fixture: ComponentFixture<SetupDoneComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SetupDoneComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupDoneComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
