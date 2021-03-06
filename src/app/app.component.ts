import {Component, OnInit} from '@angular/core';
import {CatalogService} from './catalog.service';
import {Book} from './book';
import {HttpErrorResponse} from '@angular/common/http';
import {CartItem} from './cartItem';
import {NgForm} from '@angular/forms';
import {OrderService} from './order.service';
import {response} from 'express';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'books-front-pk';
  public catalog: Book[];
  public cartItems: CartItem[] = [];

  constructor(private catalogService: CatalogService, private orderService: OrderService) {
  }

  public getCatalog(): void {
    this.catalogService.getCatalog().subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      (response: Book[]) => {
        console.log('Got book list:');
        console.log(response);
        this.catalog = response;
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }

  public addToCart(book: Book): void {
    const current: CartItem = this.cartItems.find(x => x.book.id === book.id);
    if (current) {
      current.quantity++;
    } else {
      this.cartItems.push({book, quantity: 1} as CartItem);
    }
    console.log('Cart is: ' + JSON.stringify(this.cartItems));
  }

  public countCartItems(): number {
    return this.cartItems
      .reduce((sum, current) => sum + current.quantity, 0);
  }

  public totalCartAmount(): number {
    return this.cartItems
      .reduce((sum, current) => sum + current.book.price * current.quantity, 0);
  }

  public clearCart(): void {
    this.cartItems = [];
  }

  ngOnInit(): void {
    this.getCatalog();
  }

  public onOpenModal(mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'cart') {
      button.setAttribute('data-target', '#cartModal');
    }
    if (mode === 'order') {
      button.setAttribute('data-target', '#orderModal');
    }
    container.appendChild(button);
    button.click();
  }

  public onOrderSubmit(orderForm: NgForm): void {
    document.getElementById('cancel-order-button').click();
    document.getElementById('close-cart-button').click();
    console.log('Received form: {}');
    console.log(orderForm);
    this.orderService.submitOrder(orderForm.value, this.cartItems)
      .subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        (response: any) => {
          console.log('Order submitted');
          this.clearCart();
        },
        (error: HttpErrorResponse) => {
          console.error(error.message);
        }
      );
  }
}
