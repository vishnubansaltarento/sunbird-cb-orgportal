import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { NominateUsersDialogComponent } from './nominate-users-dialog.component'

describe('NominateUsersDialogComponent', () => {
  let component: NominateUsersDialogComponent
  let fixture: ComponentFixture<NominateUsersDialogComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NominateUsersDialogComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NominateUsersDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
