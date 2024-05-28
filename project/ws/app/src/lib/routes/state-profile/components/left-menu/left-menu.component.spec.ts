import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { SetupLeftMenuComponent } from './left-menu.component'

describe('SetupLeftMenuComponent', () => {
  let component: SetupLeftMenuComponent
  let fixture: ComponentFixture<SetupLeftMenuComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SetupLeftMenuComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupLeftMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
