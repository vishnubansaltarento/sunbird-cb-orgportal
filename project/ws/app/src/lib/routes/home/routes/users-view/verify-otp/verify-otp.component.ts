import { Component, OnInit, Inject, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// import { HttpErrorResponse } from '@angular/common/http'
import { MatSnackBar } from '@angular/material'

import { Subject } from 'rxjs'
// import { takeUntil } from 'rxjs/operators'
/* tslint:disable */
import * as _ from 'lodash'


@Component({
  selector: 'ws-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {

  private destroySubject$ = new Subject()
  @ViewChild('timerDiv', { static: false }) timerDiv !: any
  @Output() resendOTP = new EventEmitter<string>()
  @Output() otpVerified = new EventEmitter<any>()
  timeLeft = 150
  interval: any
  showResendOTP = false
  otpEntered = ''

  constructor(
    public dialogRef: MatDialogRef<VerifyOtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matSnackbar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.startTimer()
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft = this.timeLeft - 1
        this.timerDiv.nativeElement.innerHTML = `${Math.floor(this.timeLeft / 60)}m: ${this.timeLeft % 60}s`
      } else {
        clearInterval(this.interval)
        this.showResendOTP = true
      }
    }, 1000)
  }

  handleCloseModal(): void {
    this.dialogRef.close(true)
  }

  handleResendOTP(): void {
    this.timeLeft = 150
    this.showResendOTP = !this.resendOTP
    this.startTimer()
    this.resendOTP.emit(this.data.type)
  }

  handleVerifyOTP(): void {

  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
    this.destroySubject$.unsubscribe()
  }
}
