import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BlogsCardComponent } from './blogs-card.component'

describe('BlogsCardComponent', () => {
  let component: BlogsCardComponent
  let fixture: ComponentFixture<BlogsCardComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BlogsCardComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogsCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
