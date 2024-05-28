import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { UsersUploadComponent } from './users-upload.component'

describe('UsersUploadComponent', () => {
  let component: UsersUploadComponent
  let fixture: ComponentFixture<UsersUploadComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UsersUploadComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersUploadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
