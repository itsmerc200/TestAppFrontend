import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AdminService } from '../../../services/admin.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './create-test.component.html',
  styleUrl: './create-test.component.css'
})
export class CreateTestComponent {

  constructor(private fb: FormBuilder,
    private deviceService: AdminService,
    private notifications: NzNotificationService,
    private router: Router,

  ) { }
  testForm!: FormGroup;

  ngOnInit() {

    this.testForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, [Validators.required]],
      time: [null, [Validators.required]],
    })
  }

  submitForm(){
    if (this.testForm.valid) {
      this.deviceService.createTest(this.testForm.value).subscribe(res=>  {
        this.notifications.success('SUCCESS', `Test Creates Successfully.`, {nzDuration: 5000});

        this.router.navigateByUrl("/admin/dashboard");

      }, error=>{
        this.notifications.error('ERROR', `${error.error}`, {nzDuration: 5000});
      })      
    }
  }




}
