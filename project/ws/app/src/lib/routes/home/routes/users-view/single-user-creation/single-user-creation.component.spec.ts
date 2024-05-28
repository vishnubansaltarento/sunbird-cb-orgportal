import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { SingleUserCreationComponent } from './single-user-creation.component'

describe('SingleUserCreationComponent', () => {
  let component: SingleUserCreationComponent
  let fixture: ComponentFixture<SingleUserCreationComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SingleUserCreationComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleUserCreationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
