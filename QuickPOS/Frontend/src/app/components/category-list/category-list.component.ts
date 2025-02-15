import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PosServiceService } from 'src/app/service/pos-service.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];
  selectedCategory: any = {};
  isEditMode = false;
  isModalOpen = false;

  // Alert properties
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = ''; // 'success' | 'error'

  constructor(
    private cdr: ChangeDetectorRef,
    private categoryService: PosServiceService // Inject CategoryService
  ) {}

  ngOnInit(): void {
    this.getCategories(); // Fetch categories when the component loads
  }

  // Fetch all categories from the service
  getCategories() {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      (error) => {
        this.showAlertMessage('Error fetching categories.', 'error');
      }
    );
  }

  // Function to display alerts and auto-hide after 3 seconds
  showAlertMessage(message: string, type: string) {
    this.showAlert = true;
    this.alertMessage = message;
    this.alertType = type;

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
      this.showAlert = false;
      this.cdr.detectChanges(); // Trigger change detection
    }, 3000);
  }

  // Open modal to add a new category
  openAddCategoryModal() {
    this.isEditMode = false;
    this.selectedCategory = {}; // Clear selected category
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  // Open modal to edit an existing category
  editCategory(category: any) {
    this.isEditMode = true;
    this.selectedCategory = { ...category }; // Copy category to selectedCategory
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  // Save category (add or update)
  saveCategory() {
    if (this.isEditMode) {
      this.updateCategory(this.selectedCategory);
    } else {
      this.addCategory(this.selectedCategory);
    }
    this.closeModal();
  }

  // Add a new category
  addCategory(category: any) {
    this.categoryService.addCategory(category).subscribe(
      (data) => {
        this.categories.push(data); // Add the new category to the list
        this.showAlertMessage('Category added successfully!', 'success');
      },
      (error) => {
        this.showAlertMessage('Error adding category.', 'error');
      }
    );
  }

  // Update an existing category
  updateCategory(category: any) {
    this.categoryService.updateCategory(category.id, category).subscribe(
      () => {
        const index = this.categories.findIndex((cat) => cat.id === category.id);
        if (index !== -1) {
          this.categories[index] = { ...category }; // Update category in the list
        }
        this.showAlertMessage('Category updated successfully!', 'success');
      },
      (error) => {
        this.showAlertMessage('Error updating category.', 'error');
      }
    );
  }

  // Delete a category
  deleteCategory(categoryId: number) {
    this.categoryService.deleteCategory(categoryId).subscribe(
      () => {
        this.categories = this.categories.filter(cat => cat.id !== categoryId); // Remove category from the list
        this.showAlertMessage('Category deleted successfully!', 'success');
      },
      (error) => {
        this.showAlertMessage('Error deleting category.', 'error');
      }
    );
  }

  // Close the modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedCategory = {}; // Reset selected category when modal is closed
    this.cdr.detectChanges();
  }
}
