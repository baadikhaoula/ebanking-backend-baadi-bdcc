import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customerService';
import { catchError, Observable, map, throwError } from 'rxjs';
import { Customer } from '../model/customer.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup: FormGroup | undefined;
  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router : Router,
  ) {}
  ngOnInit() {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(''),
    });
    this.customers = this.customerService.getCustomers().pipe(
      catchError((error) => {
        this.errorMessage = error.message;
        return throwError(error);
      }),
    );
  }

  protected handleSearchCustomers() {
    let keyword=this.searchFormGroup?.value.keyword;
    this.customers = this.customerService.searchCustomers(keyword).pipe(
      catchError((error) => {
        this.errorMessage = error.message;
        return throwError(error);
      }),
    );
  }
  handleDeleteCustomer(c: Customer){
    let conf = confirm("Are you sure ?")
    if (!conf) return;
    this.customerService.deleteCustomer(c.id).subscribe({
      next : (resp) => {
        this.customers=this.customers.pipe(
          map(data=>{
            let index=data.indexOf(c);
            data.slice(index,1);
            return data;
          })
        );
      },
      error : err => {
        console.log(err);
      }
    })
  }
  handleCustomerAccounts(c : Customer){
    this.router.navigate(['customer-accounts',c.id],{
      state : { customer : c }
    });
  }
}
