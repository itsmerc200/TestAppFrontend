import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TestService } from '../../services/test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserStorageService } from '../../../auth/services/user-storage.service';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './take-test.component.html',
  styleUrl: './take-test.component.css'
})
export class TakeTestComponent {
  questions: any[] = [];
  testId: any;
  selectedAnswers: { [key: number]: string } = {};
  timeRemaining: number = 0;
  interval: any;
  isSubmitted: boolean = false; // 🛑 Prevents multiple submissions

  constructor(
    private testService: TestService,
    private activateRoute: ActivatedRoute,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(params => {
      this.testId = +params.get('id');

      this.testService.getTestQuestions(this.testId).subscribe(res => {
        this.questions = res.questions;
        console.log(this.questions);

        this.timeRemaining = res.testDTO.time || 0;
        this.startTimer();
      });
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.clearTimer();
        this.submitAnswers();
      }
    }, 1000);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onAnswerChange(questionId: number, selectedOption: string) {
    this.selectedAnswers[questionId] = selectedOption;
    console.log(this.selectedAnswers);
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  submitAnswers() {
    if (this.isSubmitted) return; // 🛑 Prevent duplicate submission
    this.isSubmitted = true; // ✅ Mark as submitted
    this.clearTimer(); // ✅ Stop the timer

    const answerList = Object.keys(this.selectedAnswers).map(questionId => ({
      questionId: +questionId,
      selectedOption: this.selectedAnswers[questionId] || null // Allow empty answers
    }));

    const data = {
      testId: this.testId,
      userId: UserStorageService.getUser().id, // ✅ Fixed user ID retrieval
      responses: answerList
    };

    this.testService.submitTest(data).subscribe(
      res => {
        this.message.success('Test Submitted successfully', { nzDuration: 4000 });
        this.router.navigateByUrl("/user/view-test-results");
      },
      error => {
        this.message.error(`Error: ${error.error}`, { nzDuration: 4000 });
      }
    );
  }
}
