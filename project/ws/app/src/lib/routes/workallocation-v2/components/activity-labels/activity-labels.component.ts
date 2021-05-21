import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { NSWatActivity } from '../../models/activity-wot.model'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
// import { debounceTime } from 'rxjs/operators'
import { inspect } from 'util'
import { AllocationService } from '../../../workallocation/services/allocation.service'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { WatStoreService } from '../../services/wat.store.service'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'ws-app-activity-labels',
  templateUrl: './activity-labels.component.html',
  styleUrls: ['./activity-labels.component.scss'],
})
export class ActivityLabelsComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe = new Subject<void>()
  labels: NSWatActivity.IActivity[] = []
  groups: NSWatActivity.IActivityGroup[] = []
  activeGroupIdx = 0
  untitedRole = 'Untited role'
  activityForm!: FormGroup
  userslist!: any[]
  canshowName = 1
  canshow = -1
  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private allocateSrvc: AllocationService,
    private watStore: WatStoreService,
    private snackBar: MatSnackBar,
  ) {
    this.evenPredicate = this.evenPredicate.bind(this)
  }

  get labelsList(): FormArray {
    return this.activityForm.get('labelsArray') as FormArray
  }

  get groupList(): FormArray {
    return this.activityForm.get('groupsArray') as FormArray
  }

  get groupActivityList(): FormArray {
    const lst = this.groupList.at(this.activeGroupIdx) as FormGroup
    const frmctrl = lst.get('activities') as FormArray
    return frmctrl
  }
  get getActivityForm() {
    return JSON.stringify(inspect(this.activityForm.controls.groupsArray.value))
  }

  ngOnInit(): void {
    this.activityForm = new FormGroup({})
    this.createForm()
    this.initListen()
  }
  initListen() {
    this.activityForm.controls['groupsArray'].valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async formValue => {
          this.watStore.setgetactivitiesGroup(formValue)
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy() {
    this.unsubscribe.next()
  }
  drop(event: CdkDragDrop<NSWatActivity.IActivity[]>) {
    if (event.previousContainer === event.container) {
      // tslint:disable
      moveItemInArray((this.activityForm.get('labelsArray') as FormArray)!.controls, event.previousIndex, event.currentIndex)
      moveItemInArray(this.activityForm.get('labelsArray')!.value, event.previousIndex, event.currentIndex)
      moveItemInArray(this.labelsList.controls, event.previousIndex, event.currentIndex)
      moveItemInArray(this.labelsList.value, event.previousIndex, event.currentIndex)
      // tslint:enable
      // this.changeDetector.detectChanges()
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex)
    }
  }

  dropgroup(event: CdkDragDrop<NSWatActivity.IActivity[]>, actualIdx: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.groupActivityList.controls, event.previousIndex, event.currentIndex)
      moveItemInArray(this.groupActivityList.value, event.previousIndex, event.currentIndex)
    } else {
      if (!event.item.data.activityDescription) {
        this.snackBar.open('Activity is required to drag', undefined, { duration: 2000 })
        return
      }
      const previousContainerIndex = parseInt(event.previousContainer.id.replace('groups_', ''), 10)
      const targetContainerIndex = parseInt(event.container.id.replace('groups_', ''), 10)
      // tslint:disable
      // console.log(actualIdx)
      const oldArray = (this.activityForm.get('groupsArray') as any)!.at(previousContainerIndex).get('activities')
      const newArray = (this.activityForm.get('groupsArray') as any)!.at(targetContainerIndex).get('activities')
      // tslint:enable
      transferArrayItem(oldArray.controls, newArray.controls, event.previousIndex, event.currentIndex)
      /**Please do not delete these methods : for testing Purpose */
      // this.addNewGroupActivityCustom(targetContainerIndex, newArray.value)
      // this.addNewGroupActivityCustom(previousContainerIndex, oldArray.value)
      // this.activityForm.reset()
      this.changeDetector.detectChanges()
      // console.log(this.watStore.getactivitiesGroup)

      // console.log(oldArray, newArray)
    }
    console.log(this.groupList.value)

    this.watStore.setgetactivitiesGroup(this.groupList.value)
  }
  // sortPredicate(index: number, item: CdkDrag<NSWatActivity.IActivity>) {
  //   return (index + 1) % 2 === item.data % 2
  // }
  /** Predicate function that only allows non empty to be dropped into a list. */
  evenPredicate(item: CdkDrag<NSWatActivity.IActivity>) {
    // return item.data % 2 === 0
    if (item.data) {
      return true
    }
    // this.snackBar.open('Activity is required to drag', undefined, { duration: 200 })
    return false
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return true
  }
  log(value: any) {
    if (value) {
      // console.log(value)
    }
  }
  setlabelsValues(val: any) {
    this.labelsList.patchValue(val)
  }
  setGroupValues(val: any) {
    this.groupList.patchValue(val)
  }
  setGroupActivityValues(val: any) {
    this.groupActivityList.patchValue(val)
  }

  addNewLabel() {
    const oldValue = this.labelsList
    const fg = this.formBuilder.group({
      activityName: '',
      activityDescription: '',
      assignedTo: '',
    })

    oldValue.push(fg)
    this.setlabelsValues([...oldValue.value])
    // this.changeDetector.detectChanges()

  }
  addNewGroup() {
    const oldValue = this.groupList
    const fg = this.formBuilder.group({
      activities: this.formBuilder.array([]),
      groupName: this.untitedRole,
      groupDescription: 'Role description',
    })
    const activits = fg.get('activities') as FormArray
    const fga = this.formBuilder.group({
      activityName: '',
      activityDescription: '',
      assignedTo: '',
    })
    activits.push(fga)
    fg.controls.activities.patchValue([...activits.value])
    oldValue.push(fg)
    this.setGroupValues([...oldValue.value])
    // to show hide Role name
    this.canshowName = this.groupList.length - 1
  }
  addNewGroupActivityCustom(idx: number, activities: NSWatActivity.IActivity[]) {
    if (idx >= 0) {
      // const oldValue = this.groupActivityList as FormArray
      const newForlAryList = this.formBuilder.array([])
      activities.forEach((ac: NSWatActivity.IActivity) => {
        const fga = this.formBuilder.group({
          activityName: ac.activityName,
          activityDescription: ac.activityDescription,
          assignedTo: ac.assignedTo,
        })
        newForlAryList.push(fga)
      })
      this.setGroupActivityValues([...newForlAryList!.value])
    }
  }
  addNewGroupActivity(idx: number) {
    if (idx >= 0) {
      const oldValue = this.groupActivityList as FormArray
      const fga = this.formBuilder.group({
        activityName: '',
        activityDescription: '',
        assignedTo: '',
      })
      oldValue.push(fga)
      this.setGroupActivityValues([...oldValue.value])
    }
  }
  enter(i: number) {
    this.activeGroupIdx = i
  }
  createForm() {
    this.activityForm = this.formBuilder.group({
      labelsArray: this.formBuilder.array([]),
      groupsArray: this.formBuilder.array([]),
    })
    // if (this.labels && this.labels.length) {
    //   this.labels.forEach((v: NSWatActivity.IActivity) => {
    //     if (v) {
    // this.createActivityControl({
    //   activityName: '',
    //   activityDescription: '',
    //   assignedTo: '',
    // })
    this.addNewGroup()
    // this.addNewGroupActivity(0)
    // this.createGroupControl({
    //   groupName: 'Untited role',
    //   groupDescription: 'Role description',
    //   activities: [{
    //     activityName: 'unmed',
    //     activityDescription: 'desc',
    //     assignedTo: ''
    //   }]
    // })
    //     }
    //   })
    // }
    // this.activityForm.valueChanges.pipe(debounceTime(100)).subscribe(() => {
    //   // this.value.emit(JSON.parse(JSON.stringify(this.qualityForm.value)))
    // })
  }
  createActivityControl(activityObj: NSWatActivity.IActivity) {
    const newControl = this.formBuilder.group({
      activityName: new FormControl(activityObj.activityName),
      activityDescription: new FormControl(activityObj.activityDescription),
      assignedTo: new FormControl(activityObj.assignedTo),
    })
    const optionsArr = this.activityForm.controls['labelsArray'] as FormArray
    optionsArr.push(newControl)
  }
  createGroupControl(activityObj: NSWatActivity.IActivityGroup) {
    const newControl = this.formBuilder.group({
      groupName: new FormControl(activityObj.groupName),
      groupDescription: new FormControl(activityObj.groupDescription),
      activities: this.createActivtyControl(activityObj.activities),
    })
    const optionsArr = this.activityForm.controls['groupsArray'] as FormArray
    optionsArr.push(newControl)
  }
  createActivtyControl(activityObj: NSWatActivity.IActivity[]) {
    return activityObj.map((v: NSWatActivity.IActivity) => {
      return this.formBuilder.array([{
        activityName: new FormControl(v.activityName),
        activityDescription: new FormControl(v.activityDescription),
        assignedTo: new FormControl(v.assignedTo),
      }])
    })
  }
  submitResult(qualityForm: any) {
    console.log(qualityForm)
  }
  public async filterUsers(value: string) {
    // if (value && value.length > 3) {
    const filterValue = value.toLowerCase()
    // tslint:disable-next-line: deprecation
    this.allocateSrvc.onSearchUser(filterValue).subscribe(res => {
      this.userslist = res.result.data
    })
    // } else {
    // this.userslist = []
    // }
  }
  show(idx: number) {
    this.canshow = idx
  }

  hide() {
    this.canshow = -1
  }
  showName(idx: number) {
    this.canshowName = idx
  }

  hideName() {
    this.canshowName = -1
  }
}
