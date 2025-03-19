import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  createTest(testDto): Observable<any> {
    return this.http.post(BASIC_URL + `api/test`, testDto);
  }

  getAllTest(): Observable<any> {
    return this.http.get(BASIC_URL + `api/test`);
  }

  addQuestionInTest(questionDto): Observable<any> {
    return this.http.post(BASIC_URL + `api/test/question`, questionDto);
  }

  getTestQuestions(id:number): Observable<any> {
    return this.http.get(BASIC_URL + `api/test/${id}`);
  } 

  getTestResults(): Observable<any> {
    return this.http.get(BASIC_URL + `api/test/test-result`);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + `api/test/question/${id}`, { responseType: 'text' });
  }
  

  deleteTest(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + `api/test/${id}`, { responseType: 'text' }); 
  }
  
  uploadQuestions(testId: number, formData: FormData): Observable<any> {
    return this.http.post(BASIC_URL + `api/test/upload-questions/${testId}`, formData, { responseType: 'text' });
  }
  
  getQuestionDetails(questionId: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/test/question/${questionId}`);
  }

  updateTest(testId: number, testDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/test/${testId}`, testDto);
  }

  updateQuestion(questionId: number, questionDto: any): Observable<any> {
    console.log('Updating question with ID:', questionId, 'Data:', questionDto); // Debug log
    return this.http.put(`${BASIC_URL}api/test/question/${questionId}`, questionDto);
  }
  
  
}
