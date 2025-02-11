import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {  // Implement OnInit interface

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {}

  validateForm!: FormGroup;

  ngOnInit(): void {  // Corrected ngOninit to ngOnInit
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      name: [null, [Validators.required]],
    });
  }

  submitForm(): void {  // Corrected submitform to submitForm
    // Your form submission logic here
  }
}
