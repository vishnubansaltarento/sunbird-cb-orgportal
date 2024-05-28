import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { InitialAvatarComponent } from './initial-avatar.component'

describe('InitialAvatarComponent', () => {
  let component: InitialAvatarComponent
  let fixture: ComponentFixture<InitialAvatarComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        InitialAvatarComponent,
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialAvatarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
