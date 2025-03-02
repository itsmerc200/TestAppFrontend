import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  tests= [];

  constructor(private notification: NzNotificationService,
    private testService: TestService
  ){}


  ngOnInit(){
    this.getAllTests();
  }
  
  getAllTests(){
    this.testService.getAllTest().subscribe(res=>{

      this.tests = res;

    },error=>{

      this.notification
      .error(
        `ERROR`,
        `somthing went wrong!. Try Again`,
        { nzDuration: 5000 }
      )

    })  
  }

  getFormatedTime(time): string{
      const minutes = Math.floor(time/60);
      const seconds =   time % 60;
      return ` ${minutes} minutes ${seconds} seconds `;


  }

}



