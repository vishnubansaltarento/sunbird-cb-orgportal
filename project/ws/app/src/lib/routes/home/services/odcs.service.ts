import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

const API_END_POINTS = {
  ORGANISATION_FW: '/apis/proxies/v8/framework/v1/read/organisation_fw',
}

@Injectable({
  providedIn: 'root'
})
export class OdcsService {

  list = new Map<string, any>()

  constructor(
    private http: HttpClient
  ) { }

  getFrameworkInfo(): Observable<any> {
    return this.http.get(`${API_END_POINTS.ORGANISATION_FW}`, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.formateData(response)
      }),
    )
  }

  formateData(response: any) {
    (response.result.framework.categories).forEach((a: any) => {
      this.list.set(a.code, {
        code: a.code,
        identifier: a.identifier,
        index: a.index,
        name: a.name,
        selected: a.selected,
        status: a.status,
        description: a.description,
        translations: a.translations,
        category: a.category,
        associations: a.associations,
        // config: this.getConfig(a.code),
        children: (a.terms || []).map((c: any) => {
          const associations = c.associations || []
          if (associations.length > 0) {
            Object.assign(c, { children: associations })
          }
          return c
        })
      })
    })

    const allCategories: any = []
    this.list.forEach((a: any) => {
      allCategories.push({
        code: a.code,
        identifier: a.identifier,
        index: a.index,
        name: a.name,
        status: a.status,
        description: a.description,
        translations: a.translations,
      })
    })
    // this.categoriesHash.next(allCategories)

  }

  // getConfig(code: string) {
  //   let categoryConfig: any
  //   if (this.rootConfig && this.rootConfig[0]) {
  //     this.rootConfig.forEach((config: any, index: number) => {
  //       if (this.frameworkId == config.frameworkId) {
  //         categoryConfig = config.config.find((obj: any) => obj.category == code)
  //       }
  //     })
  //   }
  //   return categoryConfig
  // }
}
