import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'
// tslint:disable
import _ from 'lodash'
import { environment } from '../../../../../../../../src/environments/environment'
/* tslint:enable */

const API_END_POINTS = {
  COPY_FRAMEWORK: `/api/framework/v1/copy/${environment.ODCSMasterFramework}`,
  CREATE_TERM: (frameworkId: string, categoryId: string) =>
    `apis/proxies/v8/framework/v1/term/create?framework=${frameworkId}&category=${categoryId}`,
  PUBLISH_FRAMEWORK: (frameworkName: string) =>
    `apis/proxies/v8/framework/v1/publish/${frameworkName}`,
  UPDATE_ORG: '/apis/proxies/v8/org/v1/update'
}

@Injectable({
  providedIn: 'root'
})
export class OdcsService {

  list = new Map<string, any>()

  constructor(
    private http: HttpClient
  ) { }

  getUuid() {
    return uuidv4()
  }

  copyFramework(request: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.COPY_FRAMEWORK}`, request).pipe(map(res => _.get(res, 'result.response')))
  }

  createTerm(frameworkId: string, categoryId: string, requestBody: any) {
    return this.http.post(`${API_END_POINTS.CREATE_TERM(
      frameworkId,
      categoryId,
    )}`, requestBody)
  }

  publishFramework(frameworkName: string) {
    return this.http.post(`${API_END_POINTS.PUBLISH_FRAMEWORK(frameworkName)}`, {})
  }

  updateOrg(request: any) {
    return this.http.patch(`${API_END_POINTS.UPDATE_ORG}`, request)
  }

}
