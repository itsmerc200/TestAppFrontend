import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-view-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-test.component.html',
  styleUrl: './view-test.component.css'
})
export class ViewTestComponent {
  questions: any[] = [];
  testId: any;

  constructor(
    private adminService: AdminService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(params => {
      this.testId = +params.get('id');
      this.loadQuestions();
    });
  }

  // Load Questions for the Test
  loadQuestions() {
    this.adminService.getTestQuestions(this.testId).subscribe(
      res => {
        this.questions = res.questions;
        console.log(this.questions);
      },
      error => console.error('Error fetching questions:', error)
    );
  }

  deleteQuestion(questionId: number) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.adminService.deleteQuestion(questionId).subscribe({
        next: () => {
          this.questions = this.questions.filter(q => q.id !== questionId);
          this.message.success('Question deleted successfully!', { nzDuration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting question:', error);
          this.message.error('Failed to delete question! Try Again.', { nzDuration: 5000 });
        }
      });
    }
  }
  

}