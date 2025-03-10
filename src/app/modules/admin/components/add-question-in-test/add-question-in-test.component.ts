import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-question-in-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-question-in-test.component.html',
  styleUrl: './add-question-in-test.component.css'
})
export class AddQuestionInTestComponent {

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notification: NzNotificationService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  id: number | null;
  questionForm!: FormGroup;
  selectedFile: File | null = null;

  ngOnInit() {
    this.questionForm = this.fb.group({
      questionText: [null, [Validators.required]],
      optionA: [null, [Validators.required]],
      optionB: [null, [Validators.required]],
      optionC: [null, [Validators.required]],
      optionD: [null, [Validators.required]],
      correctOption: [null, [Validators.required]],
    });

    this.id = this.activateRoute.snapshot.params["id"];
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadQuestions() {
    if (!this.selectedFile) {
      this.notification.error('ERROR', 'Please select a file first!', { nzDuration: 5000 });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.adminService.uploadQuestions(this.id!, formData).subscribe(
      (res) => {
        this.notification.success('SUCCESS', 'Questions uploaded successfully!', { nzDuration: 5000 });
        this.router.navigateByUrl("/admin/dashboard");
      },
      (error) => {
        this.notification.error('ERROR', error.error, { nzDuration: 5000 });
      }
    );
  }

  submitForm() {
    if (this.questionForm.invalid) {
      this.notification.error('ERROR', 'Please fill all required fields!', { nzDuration: 5000 });
      return;
    }

    const questionDto = this.questionForm.value;
    questionDto.id = this.id;

    this.adminService.addQuestionInTest(questionDto).subscribe(
      (res) => {
        this.notification.success('SUCCESS', 'Question Created Successfully.', { nzDuration: 5000 });
        this.router.navigateByUrl("/admin/dashboard");
      },
      (error) => {
        this.notification.error('ERROR', error.error, { nzDuration: 5000 });
      }
    );
  }
}