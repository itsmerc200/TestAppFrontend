import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TestService } from '../../services/test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './take-test.component.html',
  styleUrl: './take-test.component.css'
})
export class TakeTestComponent {

  questions: any[]= [];  
  testId:any;

  selectedAnswer:{[Key:number]: string} = {};

  constructor(private testService: TestService,
    private activateRoute: ActivatedRoute,
    private message: NzMessageService,
    private router: Router
  ){}


  ngOnInit(){
    this.activateRoute.paramMap.subscribe(params => {

      this.testId = +params.get('id');

      this.testService.getTestQuestions(this.testId).subscribe(res=>{
        this.questions = res.questions;
        console.log(this.questions);
      })

    })
  }

  onAnswerChange(questionId:number, selectedOption:string){
    this.selectedAnswer[questionId]= selectedOption
    console.log(this.selectedAnswer);
  }

}
