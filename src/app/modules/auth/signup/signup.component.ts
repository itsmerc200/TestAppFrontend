import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]], // Email is required and must be valid
      password: [null, [Validators.required, Validators.minLength(4)]], // Password must be at least 4 characters long
      name: [null, [Validators.required, Validators.minLength(2)]] // Name is required and must be at least 2 characters long
    });
  }

  submitForm() {
    if (this.validateForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.markFormGroupTouched(this.validateForm);
      return;
    }

    this.authService.register(this.validateForm.value).subscribe(
      (res) => {
        this.message.success('Registration successful!', { nzDuration: 4000 });
        this.router.navigateByUrl('/login');
      },
      (error) => {
        this.message.error(`${error.error}`, { nzDuration: 5000 });
      }
    );
  }

  /**
   * Marks all controls in a form group as touched to trigger validation messages.
   * @param formGroup The form group to mark as touched.
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}