import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../model/customer.model';
import { AccountService } from '../services/accountService';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-accounts',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-accounts.html',
  styleUrl: './customer-accounts.css',
})
export class CustomerAccounts implements OnInit {
  customerId!: string;
  customer!: Customer;
  accounts$!: Observable<Array<any>>;
  newAccountFormGroup!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.customer = history.state['customer'];
    this.accounts$ = this.accountService.getCustomerAccounts(this.customerId);
    this.newAccountFormGroup = this.fb.group({
      accountType: this.fb.control('CURRENT'),
      initialBalance: this.fb.control(0),
      overDraft: this.fb.control(0),
      interestRate: this.fb.control(0)
    });
  }

  handleAccountDetails(accountId: string) {
    this.router.navigate(['accounts'], {
      queryParams: { accountId: accountId }
    });
  }

  handleSaveAccount() {
    let accountType = this.newAccountFormGroup.value.accountType;
    let initialBalance = this.newAccountFormGroup.value.initialBalance;

    if (accountType === 'CURRENT') {
      let overDraft = this.newAccountFormGroup.value.overDraft;
      this.accountService.saveCurrentAccount(initialBalance, overDraft, this.customerId).subscribe({
        next: () => {
          alert('Compte courant créé avec succès !');
          this.accounts$ = this.accountService.getCustomerAccounts(this.customerId);
          this.newAccountFormGroup.reset({ accountType: 'CURRENT' });
        },
        error: (err: any) => { alert('Erreur : ' + err.message); }
      });
    } else {
      let interestRate = this.newAccountFormGroup.value.interestRate;
      this.accountService.saveSavingAccount(initialBalance, interestRate, this.customerId).subscribe({
        next: () => {
          alert('Compte épargne créé avec succès !');
          this.accounts$ = this.accountService.getCustomerAccounts(this.customerId);
          this.newAccountFormGroup.reset({ accountType: 'CURRENT' });
        },
        error: (err: any) => { alert('Erreur : ' + err.message); }
      });
    }
  }
}
