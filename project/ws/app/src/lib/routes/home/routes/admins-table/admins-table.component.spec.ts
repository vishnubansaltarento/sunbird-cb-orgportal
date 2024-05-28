import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AdminsTableComponent } from './admins-table.component'

describe('AdminsTableComponent', () => {
  let component: AdminsTableComponent
  let fixture: ComponentFixture<AdminsTableComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminsTableComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
