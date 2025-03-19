import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from '../services/admin.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  standalone: true,
  imports: [SharedModule],  
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  questionForm: FormGroup;
  questionId: number;
  testIdFromUrl: string = null;
  
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) {
    // This runs before everything else
    // Extract test ID directly from the URL
    const fullUrl = window.location.href;
    console.log('Full URL:', fullUrl);
    
    // Look for test ID in the current URL
    const urlTestIdMatch = fullUrl.match(/view-test\/(\d+)/);
    if (urlTestIdMatch && urlTestIdMatch[1]) {
      this.testIdFromUrl = urlTestIdMatch[1];
      console.log('Test ID extracted from URL path:', this.testIdFromUrl);
    }
    
    // Also check if it's in the referrer URL
    if (document.referrer) {
      console.log('Referrer URL:', document.referrer);
      const referrerTestIdMatch = document.referrer.match(/view-test\/(\d+)/);
      if (referrerTestIdMatch && referrerTestIdMatch[1]) {
        this.testIdFromUrl = referrerTestIdMatch[1];
        console.log('Test ID extracted from referrer URL:', this.testIdFromUrl);
      }
    }
  }

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      optionA: ['', Validators.required],
      optionB: ['', Validators.required],
      optionC: ['', Validators.required],
      optionD: ['', Validators.required],
      correctOption: ['', Validators.required] 
    });
  
    this.route.paramMap.subscribe(params => {
      this.questionId = +params.get('id'); // Convert to number
      console.log('Question ID:', this.questionId);
  
      if (this.questionId && !isNaN(this.questionId)) {
        this.loadQuestionData();
      } else {
        console.error('Invalid question ID:', this.questionId);
        this.message.error('Invalid question ID!', { nzDuration: 5000 });
      }
    });
  }
  
  loadQuestionData(): void {
    console.log(`Fetching question details for ID: ${this.questionId}`);
    
    this.adminService.getQuestionDetails(this.questionId).subscribe(
      (res: any) => {
        console.log('API Response:', res);
  
        if (res && Object.keys(res).length > 0) {
          this.questionForm.patchValue({
            questionText: res.questionText || '',
            optionA: res.optionA || '',
            optionB: res.optionB || '',
            optionC: res.optionC || '',
            optionD: res.optionD || '',
            correctOption: res.correctOption || '' 
          });
        } else {
          console.warn('Received empty response from API');
          this.message.error('No data found for the given question ID!', { nzDuration: 5000 });
        }
      },
      error => {
        console.error('Error fetching question details:', error);
        this.message.error('Failed to load question data!', { nzDuration: 5000 });
      }
    );
  }
  
  onSubmit(): void {
    if (this.questionForm.valid) {
      const updatedQuestion = this.questionForm.value;
      this.adminService.updateQuestion(this.questionId, updatedQuestion).subscribe({
        next: () => {
          this.message.success('Question updated successfully!', { nzDuration: 3000 });
          
          // Go back to the previous page (which should be the test view)
          if (this.testIdFromUrl) {
            console.log(`Navigating to specific test ID: ${this.testIdFromUrl}`);
            this.router.navigate(['/admin/view-test', this.testIdFromUrl]);
          } else {
            console.log('Going back to previous page');
            window.history.back();
          }
        },
        error: (error) => {
          console.error('Error updating question:', error);
          this.message.error('Failed to update question! Try Again.', { nzDuration: 5000 });
        }
      });
    }
  }
}