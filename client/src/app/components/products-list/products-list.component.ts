import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  products?: Product[];
  currentProduct: Product = {};
  currentIndex = -1;
  name = '';
  showProductDetail: boolean = false;
  isLoading: boolean = false;
  isAuthenticated: boolean = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.retrieveProducts();
    this.authService.user.subscribe((user: User | null) => {
      this.isAuthenticated = !!user;
      console.log(this.isAuthenticated);
    });
  }

  retrieveProducts(): void {
    this.isLoading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        console.log(data);
        this.isLoading = false;
      },
      error: (e) => console.error(e),
    });
  }

  refreshList(): void {
    this.retrieveProducts();
    this.currentProduct = {};
    this.currentIndex = -1;
  }

  setActiveProduct(product: Product, index: number): void {
    this.currentProduct = product;
    this.currentIndex = index;
    this.toggleDetailedProductView();
  }

  toggleDetailedProductView() {
    this.showProductDetail = !this.showProductDetail;
    console.log(this.showProductDetail);
  }

  removeAllProducts(): void {
    this.productService.deleteAll().subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e),
    });
  }

  searchName(): void {
    this.currentProduct = {};
    this.currentIndex = -1;

    this.productService.findByName(this.name).subscribe({
      next: (data: Product[] | undefined) => {
        this.products = data;
        console.log(data);
      },
      error: (e: any) => console.error(e),
    });
  }
}
