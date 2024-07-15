import { Component, OnInit } from '@angular/core'
import { DesignationsService } from '../../services/designations.service'
import { MatDialog, PageEvent } from '@angular/material'
import { FormControl } from '@angular/forms'
import { delay } from 'rxjs/operators'
import { SelectedDesignationPopupComponent } from '../../dialog-boxes/selected-designation-popup/selected-designation-popup.component'
import { forkJoin } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-import-designation',
  templateUrl: './import-designation.component.html',
  styleUrls: ['./import-designation.component.scss']
})
export class ImportDesignationComponent implements OnInit {

  searchControl = new FormControl();
  igotDesignationsList: any = []
  filteredIgotDesignationsList: any = []
  selectedDesignationsList: any = []
  orgDesignationsList: any = []
  pageSize = 20
  startIndex = 0
  lastIndex = 20

  constructor(
    private designationsService: DesignationsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadDesignations()
    this.valudChangeSubscribers()
  }

  loadDesignations() {
    this.designationsService.getDesignations({}).subscribe(
      (data: any) => {
        this.igotDesignationsList = data
        this.getFilteredDesignationList()
      },
      (_err: any) => {
      })
  }

  valudChangeSubscribers() {
    if (this.searchControl) {
      this.searchControl.valueChanges.pipe(delay(500)).subscribe((value: string) => {
        this.getFilteredDesignationList(value)
      })
    }
  }

  getFilteredDesignationList(key?: string) {
    if (key) {
      this.filteredIgotDesignationsList = this.igotDesignationsList
        .filter((designation: any) =>
          designation.name.toLowerCase().includes(key.toLowerCase()))
    } else {
      this.filteredIgotDesignationsList = this.igotDesignationsList
    }
  }

  selectDesignation(checked: Boolean, id: number) {
    const index = this.igotDesignationsList.findIndex((e: any) => e.id === id)
    const designation = this.igotDesignationsList[index]
    if (checked) {
      designation['selected'] = true
      this.selectedDesignationsList.push(designation)
      this.igotDesignationsList.splice(index, 1)
      this.igotDesignationsList.unshift(designation)
      this.getFilteredDesignationList(this.searchControl.value)
    } else {
      this.removeDesignation([designation])
    }
  }



  get selctedDesignationsCount() {
    return this.selectedDesignationsList.length
  }

  removeDesignation(designationToRemoveList: any[]) {
    designationToRemoveList.forEach((designationToRemove: any) => {
      this.selectedDesignationsList = this.selectedDesignationsList
        .filter((selectedDesignation: any) => selectedDesignation.id !== designationToRemove.id)

      const igotListIndex = this.igotDesignationsList
        .findIndex((designation: any) => designation.id === designationToRemove.id)
      if (igotListIndex >= 0) {
        const designation = this.igotDesignationsList[igotListIndex]
        designation['selected'] = false
        this.igotDesignationsList.splice(igotListIndex, 1)
        this.igotDesignationsList.splice(this.selctedDesignationsCount, 0, designation)
      }
    })
    this.getFilteredDesignationList(this.searchControl.value)

  }

  openPreviewPoup() {
    const dialogData = JSON.parse(JSON.stringify(this.selectedDesignationsList))
    const dialogRef = this.dialog.open(SelectedDesignationPopupComponent, {
      disableClose: true,
      data: dialogData,
      autoFocus: false,
      width: '90%',
    })
    dialogRef.afterClosed().subscribe((res: any[]) => {
      if (res && res.length > 0) {
        this.selectedDesignationsList
        this.removeDesignation(res)
      }
    })
  }

  onChangePage(pe: PageEvent) {
    this.startIndex = pe.pageIndex * pe.pageSize
    this.lastIndex = (pe.pageIndex + 1) * pe.pageSize
  }

  importDesignations() {
    if (this.selctedDesignationsCount) {
      const framework = 'organisation_fw'
      const category = 'organisation_fw'
      const importRequest: any = []
      this.selectedDesignationsList((selectedDesignation: any) => {
        const formBody = {
          "request": {
            "term": {
              "name": selectedDesignation.name,
              "code": selectedDesignation.name,
              "refId": selectedDesignation.id,
              "refType": "Testing Schema Update For Creating Term"
            }
          }
        }
        importRequest.push(this.designationsService.importDesigantion(framework, category, formBody))
      })

      forkJoin(importRequest).subscribe({
        next: response => {
          console.log(response)
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
          console.log(errorMessage)
        }
      })
    }
  }

}
