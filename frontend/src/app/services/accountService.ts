import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountDetails } from '../model/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  backendHost: string = 'http://localhost:8085';

  constructor(private http: HttpClient) {}

  public getAccount(accountId: string, page: number, size: number): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(
      `${this.backendHost}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`
    );
  }

  public debit(accountId: string, amount: number, description: string) {
    return this.http.post(`${this.backendHost}/accounts/debit`, {
      accountId, amount, description
    });
  }

  public credit(accountId: string, amount: number, description: string) {
    return this.http.post(`${this.backendHost}/accounts/credit`, {
      accountId, amount, description
    });
  }

  public transfer(accountSource: string, accountDestination: string, amount: number, description: string) {
    return this.http.post(`${this.backendHost}/accounts/transfer`, {
      accountSource, accountDestination, amount, description
    });
  }

  public getCustomerAccounts(customerId: string): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.backendHost}/customers/${customerId}/accounts`);
  }

  public saveCurrentAccount(initialBalance: number, overDraft: number, customerId: string): Observable<any> {
    return this.http.post(`${this.backendHost}/accounts/current`, null, {
      params: { initialBalance, overDraft, customerId }
    });
  }

  public saveSavingAccount(initialBalance: number, interestRate: number, customerId: string): Observable<any> {
    return this.http.post(`${this.backendHost}/accounts/saving`, null, {
      params: { initialBalance, interestRate, customerId }
    });
  }
}
