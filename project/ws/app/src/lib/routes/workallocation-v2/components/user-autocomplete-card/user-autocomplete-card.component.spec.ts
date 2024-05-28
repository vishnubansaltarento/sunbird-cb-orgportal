import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { UserAutocompleteCardComponent } from './user-autocomplete-card.component'

describe('UserAutocompleteCardComponent', () => {
  let component: UserAutocompleteCardComponent
  let fixture: ComponentFixture<UserAutocompleteCardComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserAutocompleteCardComponent,
      ],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAutocompleteCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
