import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { UserCreationComponent } from './user-creation.component'

describe('UserCreationComponent', () => {
  let component: UserCreationComponent
  let fixture: ComponentFixture<UserCreationComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserCreationComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
