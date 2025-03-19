import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TestService } from '../../services/test.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, FormsModule], // Add FormsModule here
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  tests = []; // Original list of tests
  filteredTests = []; // Filtered list of tests
  paginatedTests = []; // Tests to display on the current page
  searchText: string = ''; // Search input text
  currentPage: number = 1; // Current page number
  pageSize: number = 5; // Number of tests per page (set to 5)

  constructor(
    private notification: NzNotificationService,
    private testService: TestService
  ) {}

  ngOnInit() {
    this.getAllTests();
  }

  // Fetch all tests from the service
  getAllTests() {
    this.testService.getAllTest().subscribe(
      (res) => {
        this.tests = res;
        this.filteredTests = res; // Initialize filteredTests with all tests
        this.updatePaginatedTests(); // Update paginated tests
      },
      (error) => {
        this.notification.error(
          `ERROR`,
          `Something went wrong! Try Again.`,
          { nzDuration: 5000 }
        );
      }
    );
  }

  // Filter tests based on the search text
  filterTests() {
    if (!this.searchText) {
      this.filteredTests = this.tests; // If search text is empty, show all tests
    } else {
      this.filteredTests = this.tests.filter(test =>
        test.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    this.currentPage = 1; // Reset to the first page after filtering
    this.updatePaginatedTests(); // Update paginated tests
  }

  // Update the paginatedTests array based on the current page and page size
  updatePaginatedTests() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTests = this.filteredTests.slice(startIndex, endIndex);
  }

  // Handle page change event
  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedTests();
  }

  // Format time into minutes and seconds
  getFormatedTime(time): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return ` ${minutes} minutes ${seconds} seconds `;
  }
}