import { Component, OnDestroy, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-col' },
  /* tslint:enable */
})
export class UsersViewComponent implements OnInit, OnDestroy {
  constructor() { }

  ngOnInit() { }

  ngOnDestroy() { }
}