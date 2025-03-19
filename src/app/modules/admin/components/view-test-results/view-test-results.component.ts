import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-view-test-results',
  standalone: true,
  imports: [SharedModule, FormsModule], // Add FormsModule here
  templateUrl: './view-test-results.component.html',
  styleUrl: './view-test-results.component.css'
})
export class ViewTestResultsComponent {

  resultsData: any; // Original dataset of test results
  filteredResultsData: any; // Filtered dataset of test results
  searchText: string = ''; // Search input text

  constructor(private testService: AdminService) {}

  ngOnInit() {
    this.getTestResults();
  }

  // Fetch test results from the service
  getTestResults() {
    this.testService.getTestResults().subscribe(
      (res) => {
        this.resultsData = res;
        this.filteredResultsData = res; // Initialize filteredResultsData with all test results
        console.log(this.resultsData);
      },
      (error) => {
        console.error('Error fetching test results:', error);
      }
    );
  }

  // Filter results based on the search text (test name or user name)
  filterResults() {
    if (!this.searchText) {
      this.filteredResultsData = this.resultsData; // If search text is empty, show all results
    } else {
      const searchTextLower = this.searchText.toLowerCase();
      this.filteredResultsData = this.resultsData.filter((data: any) =>
        data.testName.toLowerCase().includes(searchTextLower) ||
        data.userName.toLowerCase().includes(searchTextLower)
      );
    }
  }
}