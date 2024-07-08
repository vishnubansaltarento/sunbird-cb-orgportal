import { Component, OnInit } from '@angular/core'
import { OdcsService } from '../../services/odcs.service'

@Component({
  selector: 'ws-app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent implements OnInit {

  organisationsList: any = []
  selectedOrganisation: string = ''
  showLoader: boolean = true

  constructor(
    private odcsService: OdcsService
  ) { }

  ngOnInit() {
    this.getOrganisations()
  }

  getOrganisations() {
    this.odcsService.getFrameworkInfo().subscribe(res => {
      console.log('designations:', res)
    })
  }

}
