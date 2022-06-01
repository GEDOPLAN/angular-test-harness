import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  destroy$ = new Subject();

  form = new FormGroup({
    textInput: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  form2 = new FormGroup({
    textInput: new FormControl(''),
    checkboxInput: new FormControl({value: '', disabled: true})
  })

  someLogic(){
    console.log('click');
  }

  ngOnInit() {
    let textInput = this.form2.controls['textInput'];
    let checkboxInput = this.form2.controls['checkboxInput'];

    textInput.valueChanges.pipe(takeUntil(this.destroy$)).subscribe( () => {
      if(textInput.value){
        checkboxInput.enable({emitEvent:false});
      } else {
        checkboxInput.patchValue(false);
        checkboxInput.disable({emitEvent:false});
      }
    })

    checkboxInput.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.someLogic());
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
