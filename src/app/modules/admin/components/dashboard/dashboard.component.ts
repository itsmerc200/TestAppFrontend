import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminService } from '../../services/admin.service';
import { min } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  test = [];

  constructor(private notification: NzNotificationService,
    private testService: AdminService 
  ){}

  ngOnInit(){
    this.getAllTests();
  }

  getAllTests(){
    this.testService.getAllTest().subscribe(res=>{

      this.test = res;

    },error=>{

      this.notification
      .error(
        `ERROR`,
        `somthing went wrong!. Try Again`,
        { nzDuration: 5000 }
      )

    })  
  }

  deleteTest(testId: number) {
    if (confirm('Are you sure you want to delete this test?')) {
      this.testService.deleteTest(testId).subscribe({
        next: () => {
          this.test = this.test.filter(t => t.id !== testId);
          this.notification.success('SUCCESS', 'Test deleted successfully!', { nzDuration: 3000 });
        },
        error: (error) => {
          console.error('Deletion error:', error);
          this.notification.error('ERROR', 'Failed to delete test! Try Again.', { nzDuration: 5000 });
        }
      });
    }
  }
  
  

  getFormatedTime(time): string{
      const minutes = Math.floor(time/60);
      const seconds =   time % 60;
      return ` ${minutes} minutes ${seconds} seconds `;


  }

  

}
