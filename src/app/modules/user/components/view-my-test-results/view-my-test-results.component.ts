import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TestService } from '../../services/test.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-view-my-test-results',
  standalone: true,
  imports: [SharedModule, FormsModule], // Add FormsModule here
  templateUrl: './view-my-test-results.component.html',
  styleUrl: './view-my-test-results.component.css'
})
export class ViewMyTestResultsComponent {

  dataSet: any; // Original dataset of test results
  filteredDataSet: any; // Filtered dataset of test results
  searchText: string = ''; // Search input text

  constructor(private testService: TestService) {}

  ngOnInit() {
    this.getTestResults();
  }

  // Fetch test results from the service
  getTestResults() {
    this.testService.getMyTestResults().subscribe(
      (res) => {
        this.dataSet = res;
        this.filteredDataSet = res; // Initialize filteredDataSet with all test results
        console.log(this.dataSet);
      },
      (error) => {
        console.error('Error fetching test results:', error);
      }
    );
  }

  // Filter test results based on the search text
  filterTestResults() {
    if (!this.searchText) {
      this.filteredDataSet = this.dataSet; // If search text is empty, show all test results
    } else {
      this.filteredDataSet = this.dataSet.filter((data: any) =>
        data.testName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }
}