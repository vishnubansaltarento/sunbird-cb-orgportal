import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { MyDashboardHomeComponent } from './my-dashboard-home.component'

describe('MyDashboardHomeComponent', () => {
  let component: MyDashboardHomeComponent
  let fixture: ComponentFixture<MyDashboardHomeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyDashboardHomeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDashboardHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
