import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Route, Router } from '@angular/router';
import { UserStorageService } from '../services/user-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router,
  ) { }

  validateForm!: FormGroup;

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  submitForm() {
    this.authService.login(this.validateForm.value).subscribe(
      res => {


        this.message.success('Login successful!', { nzDuration: 5000 });

          const user = {
            id : res.id,
            role: res.role
          }

          UserStorageService.saveUser(user);
        console.log(res);

      },


      error => {
        this.message.error(
          `Wrong Email or Password!`,
          { nzDuration: 5000 }
        );
      }
    );
  }
}
