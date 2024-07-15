import { Component, OnInit } from '@angular/core'
import { environment } from '../../../../../../../../../src/environments/environment'
import { ActivatedRoute } from '@angular/router'
import { OdcsService } from '../../services/odcs.service'

@Component({
  selector: 'ws-app-odcs-mapping',
  templateUrl: './odcs-mapping.component.html',
  styleUrls: ['./odcs-mapping.component.scss']
})
export class OdcsMappingComponent implements OnInit {
  environmentVal: any
  taxonomyConfig: any
  showTopSection = true
  odcConfig: any
  configSvc: any
  showLoader = false
  loaderMsg = ''

  constructor(
    private activateRoute: ActivatedRoute,
    private odcsSvc: OdcsService
  ) { }

  ngOnInit() {
    this.environmentVal = environment
    this.activateRoute.data.subscribe(data => {
      this.odcConfig = data.pageData.data
      this.taxonomyConfig = this.odcConfig.frameworkConfig
    })

    // to check whether organisation is already having fraworkid or we have initiate the process
    this.configSvc = this.activateRoute.snapshot.data['configService']
    console.log('this.configSvc', this.configSvc.orgReadData)
    if (this.configSvc.orgReadData && this.configSvc.orgReadData.frameworkid) {
      this.environmentVal.frameworkName = this.configSvc.orgReadData.frameworkid
    } else {
      this.showLoader = true
      this.loaderMsg = this.odcConfig.frameworkCreationMSg
      // this.initFramworkCreation()
      this.environmentVal.frameworkName = '1231231231_organisation_fw'
    }
  }

  // async initFramworkCreation() {
  //   try {
  //     await this.copyFrameworkCreate()
  //     await this.createOrgTerm()
  //     await this.publishFramework()
  //     await this.updateOrg()
  //     this.environmentVal.frameworkName = `designation_${this.configSvc.orgReadData.id}_fw`
  //     this.configSvc.updateOrgReadData(this.configSvc.orgReadData.id)
  //   } catch (error) {
  //     console.error('Error in executing Framwork Creation process:', error)
  //   }
  // }


  // copyFrameworkCreate() {
  //   return new Promise((resolve, reject) => {
  //     console.log('configSvc', this.configSvc.orgReadData)
  //     const req = {
  //       request:
  //       {
  //         framework:
  //         {
  //           name: `designation_${this.configSvc.orgReadData.id} fw`,
  //           description: `designation framework for ${this.configSvc.orgReadData.orgName}`,
  //           code: `designation_${this.configSvc.orgReadData.id}_fw`,
  //           owner: this.configSvc.orgReadData.id,
  //           type: 'k-12'
  //         }
  //       }
  //     }
  //     console.log('req ::', req)

  //     this.odcsSvc.copyFramework(req).subscribe(
  //       (res) => {
  //         console.log('Copy Framework result:', res)
  //         this.loaderMsg = 'Designation framework created successfully!'
  //         resolve(res)
  //       },
  //       (err) => {
  //         console.error('Copy Framework error:', err)
  //         reject(err)
  //       }
  //     )
  //   })
  // }

  // createOrgTerm() {
  //   this.loaderMsg = 'Creating the org'
  //   return new Promise((resolve, reject) => {
  //     const term: any = {
  //       code: this.odcsSvc.getUuid(),
  //       name: `${this.configSvc.orgReadData.orgName}`,
  //       description: ``,
  //       category: 'organisation',
  //       status: 'live',
  //       additionalProperties: {}
  //     }
  //     const requestBody = {
  //       request: {
  //         term: term
  //       }
  //     }
  //     const frameworkId = `designation_${this.configSvc.orgReadData.id}_fw`
  //     this.odcsSvc.createTerm(frameworkId, 'organisation', requestBody).subscribe(
  //       (res: any) => {
  //         console.log('createTerm result:', res)
  //         resolve(res)
  //       },
  //       (err) => {
  //         console.error('createTerm error:', err)
  //         reject(err)
  //       }
  //     )
  //   })
  // }

  // publishFramework() {
  //   return new Promise((resolve, reject) => {
  //     const framework = `designation_${this.configSvc.orgReadData.id}_fw`
  //     this.odcsSvc.publishFramework(framework).subscribe(
  //       (res) => {
  //         console.log('publishFramework result:', res)
  //         resolve(res)
  //       },
  //       (err) => {
  //         console.error('publishFramework error:', err)
  //         reject(err)
  //       }
  //     )
  //   })
  // }

  // updateOrg() {
  //   return new Promise((resolve, reject) => {
  //     const framework = `designation_${this.configSvc.orgReadData.id}_fw`
  //     const req = {
  //       request: {
  //         framworkid: framework
  //       }
  //     }
  //     this.odcsSvc.updateOrg(req).subscribe(
  //       (res) => {
  //         console.log('publishFramework result:', res)
  //         resolve(res)
  //       },
  //       (err) => {
  //         console.error('publishFramework error:', err)
  //         reject(err)
  //       }
  //     )
  //   })
  // }

}
