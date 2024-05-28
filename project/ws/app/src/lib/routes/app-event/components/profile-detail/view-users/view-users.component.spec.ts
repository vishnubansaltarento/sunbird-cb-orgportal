import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ViewUsersComponent } from './view-users.component'

describe('ViewUsersComponent', () => {
  let component: ViewUsersComponent
  let fixture: ComponentFixture<ViewUsersComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUsersComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUsersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
