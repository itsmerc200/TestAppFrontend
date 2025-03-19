import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  standalone: true,
  imports: [SharedModule, FormsModule],
  styleUrls: ['./edit-test.component.css']
})
export class EditTestComponent implements OnInit {
  testId: number;
  testDetails: any = null; // Initialize as null
  isLoading: boolean = false;
  isUpdating: boolean = false;
  isDataLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router,
    private notification: NzNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.testId = +this.route.snapshot.paramMap.get('id');
    console.log('Test ID:', this.testId); // Debug: Verify testId
    this.fetchTestDetails();
  }

  fetchTestDetails(): void {
    this.isLoading = true;
    this.adminService.getTestQuestions(this.testId).subscribe(
      (data) => {
        console.log('API Response:', data);
  
        if (data && data.testDTO) {
          // Extract testDTO
          this.testDetails = { ...data.testDTO };
  
          // Calculate time per question
          if (data.questions && data.questions.length > 0) {
            this.testDetails.time = data.testDTO.time / data.questions.length;
          }
  
          console.log('Updated testDetails:', this.testDetails);
        } else {
          console.warn('Invalid API response format');
        }
  
        this.isLoading = false;
        this.isDataLoaded = true;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching test details', error);
        this.notification.error('Error', 'Failed to fetch test details');
        this.isLoading = false;
      }
    );
  }
  
  

  onSubmit(): void {
    if (!this.testDetails.title || !this.testDetails.description || !this.testDetails.time) {
      this.notification.warning('Warning', 'Please fill all required fields');
      return;
    }

    this.isUpdating = true;
    this.adminService.updateTest(this.testId, this.testDetails).subscribe(
      (response) => {
        console.log('Test updated successfully', response);
        this.notification.success('Success', 'Test updated successfully');
        this.isUpdating = false;
        this.router.navigate(['/admin/dashboard']);
      },
      (error) => {
        console.error('Error updating test', error);
        this.notification.error('Error', 'Failed to update test');
        this.isUpdating = false;
      }
    );
  }
}