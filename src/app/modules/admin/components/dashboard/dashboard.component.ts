import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, FormsModule], // Add FormsModule here
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  test = []; // Original list of tests
  filteredTests = []; // Filtered list of tests
  paginatedTests = []; // Tests to display on the current page
  searchText: string = ''; // Search input text
  currentPage: number = 1; // Current page number
  pageSize: number = 5; // Number of tests per page

  constructor(
    private notification: NzNotificationService,
    private testService: AdminService
  ) {}

  ngOnInit() {
    this.getAllTests();
  }

  // Fetch all tests from the service
  getAllTests() {
    this.testService.getAllTest().subscribe(
      (res) => {
        this.test = res;
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
      this.filteredTests = this.test; // If search text is empty, show all tests
    } else {
      this.filteredTests = this.test.filter(test =>
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

  // Delete a test
  deleteTest(testId: number) {
    if (confirm('Are you sure you want to delete this test?')) {
      this.testService.deleteTest(testId).subscribe({
        next: () => {
          this.test = this.test.filter(t => t.id !== testId);
          this.filteredTests = this.filteredTests.filter(t => t.id !== testId); // Update filteredTests
          this.updatePaginatedTests(); // Update paginated tests
          this.notification.success('SUCCESS', 'Test deleted successfully!', { nzDuration: 3000 });
        },
        error: (error) => {
          console.error('Deletion error:', error);
          this.notification.error('ERROR', 'Failed to delete test! Try Again.', { nzDuration: 5000 });
        }
      });
    }
  }

  // Format time into minutes and seconds
  getFormatedTime(time): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return ` ${minutes} minutes ${seconds} seconds `;
  }
}