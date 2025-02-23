import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [SharedModule ],
  templateUrl: './create-test.component.html',
  styleUrl: './create-test.component.css'
})
export class CreateTestComponent {

  constructor(private fb: FormBuilder){}
  testForm!: FormGroup;

  ngOnInit(){

    this.testForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, [Validators.required]],
      time: [null,[Validators.required]],
    })
  }
}
