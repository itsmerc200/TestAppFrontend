import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TestService } from '../../services/test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserStorageService } from '../../../auth/services/user-storage.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './take-test.component.html',
  styleUrl: './take-test.component.css'
})
export class TakeTestComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  testId: any;
  selectedAnswers: { [key: number]: string } = {};
  timeRemaining: number = 0;
  interval: any;
  isSubmitted: boolean = false; // 🛑 Prevents multiple submissions
  isComponentActive: boolean = true; // 🛑 Tracks if the component is still active
  modalRef: any; // 🛑 Store the modal reference

  constructor(
    private testService: TestService,
    private activateRoute: ActivatedRoute,
    private message: NzMessageService,
    private router: Router,
    private modal: NzModalService
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
        if (this.isComponentActive && !this.isSubmitted) {
          this.finalizeSubmission(); // ✅ Force submit when timer ends
        }
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
  
    const totalQuestions = this.questions.length;
    const answeredQuestions = Object.keys(this.selectedAnswers).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;
  
    // Open NG-ZORRO Modal
    this.modalRef = this.modal.confirm({
      nzTitle: 'Confirm Submission',
      nzContent: `You have answered <b>${answeredQuestions}</b> out of <b>${totalQuestions}</b> questions.<br>
                  <b>${unansweredQuestions}</b> questions are unanswered.<br><br>
                  Are you sure you want to submit?`,
      nzOkText: 'Submit',
      nzCancelText: 'Cancel',
      nzOnOk: () => this.finalizeSubmission(), // ✅ Submit if confirmed
      nzOnCancel: () => console.log('Submission cancelled') // ❌ Cancel button
    });
  
    // 🛑 Check if the timer ends while modal is open
    setTimeout(() => {
      if (this.timeRemaining <= 0 && !this.isSubmitted) {
        this.modalRef.destroy(); // 🔥 Close modal forcefully
        this.finalizeSubmission(); // ✅ Force submit test
      }
    }, 100); // 🔥 Small delay to ensure it checks right after the timer ends
  }
  
  finalizeSubmission() {
    if (this.isSubmitted) return; // 🛑 Prevent duplicate submission
    this.isSubmitted = true; // ✅ Mark as submitted
    this.clearTimer(); // ✅ Stop the timer

    // Close the modal if it is open
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  
    const answerList = Object.keys(this.selectedAnswers).map(questionId => ({
      questionId: +questionId,
      selectedOption: this.selectedAnswers[questionId] || null // Allow empty answers
    }));
  
    const data = {
      testId: this.testId,
      userId: UserStorageService.getUser().id,
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

  ngOnDestroy() {
    this.isComponentActive = false; // 🛑 Mark component as inactive
    this.clearTimer(); // 🛑 Clear the timer when the component is destroyed
  }
}