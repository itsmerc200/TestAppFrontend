import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-test.component.html',
  styleUrl: './view-test.component.css'
})
export class ViewTestComponent {

  questions: any[]= [];
  testId:any;

  constructor(private adminService:AdminService,
    private activateRoute: ActivatedRoute
  ){}

  ngOnInit(){
    this.activateRoute.paramMap.subscribe(params => {

      this.testId = +params.get('id');

      this.adminService.getTestQuestions(this.testId).subscribe(res=>{
        this.questions = res.questions;
        console.log(this.questions);
      })

    })
  }

}
