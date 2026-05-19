import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountDetails } from '../model/account.model';
import { AccountService } from '../services/accountService'
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accounts',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {
  accountFormGroup!: FormGroup;
  operationFormGroup!: FormGroup;
  account$!: Observable<AccountDetails>;
  currentPage: number = 0;
  pageSize: number = 5;
  errorMessage!: string;

  constructor(private fb: FormBuilder, private accountService: AccountService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.accountFormGroup = this.fb.group({ accountId: this.fb.control('') });
    this.operationFormGroup = this.fb.group({
      operationType: this.fb.control('DEBIT'),
      amount: this.fb.control(0),
      description: this.fb.control(''),
      accountDestination: this.fb.control(''),
    });
    this.route.queryParams.subscribe(params => {
      if (params['accountId']) {
        this.accountFormGroup.setValue({ accountId: params['accountId'] });
        this.handleSearchAccount();
      }
    });
  }

  handleSearchAccount() {
    let accountId = this.accountFormGroup.value.accountId;
    this.account$ = this.accountService.getAccount(accountId, this.currentPage, this.pageSize);
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleSaveOperation() {
    let accountId = this.accountFormGroup.value.accountId;
    let operationType = this.operationFormGroup.value.operationType;
    let amount = this.operationFormGroup.value.amount;
    let description = this.operationFormGroup.value.description;
    let accountDestination = this.operationFormGroup.value.accountDestination;

    if (operationType === 'DEBIT') {
      this.accountService.debit(accountId, amount, description).subscribe({
        next: () => {
          alert('Débit effectué avec succès !');
          this.handleSearchAccount();
          this.operationFormGroup.reset({ operationType: 'DEBIT' });
        },
        error: (err: any) => alert('Erreur : ' + err.message),
      });
    } else if (operationType === 'CREDIT') {
      this.accountService.credit(accountId, amount, description).subscribe({
        next: () => {
          alert('Crédit effectué avec succès !');
          this.handleSearchAccount();
          this.operationFormGroup.reset({ operationType: 'DEBIT' });
        },
        error: (err: any) => alert('Erreur : ' + err.message),
      });
    } else if (operationType === 'TRANSFER') {
      this.accountService.transfer(accountId, accountDestination, amount, description).subscribe({
        next: () => {
          alert('Virement effectué avec succès !');
          this.handleSearchAccount();
          this.operationFormGroup.reset({ operationType: 'DEBIT' });
        },
        error: (err: any) => alert('Erreur : ' + err.message),
      });
    }
  }
}
