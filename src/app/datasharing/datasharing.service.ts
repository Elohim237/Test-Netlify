import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DatasharingService {

  private secretsSubject = new BehaviorSubject<any>(null);

  setSecrets(secrets: any) {
    this.secretsSubject.next(secrets);
  }

  getSecrets() {
    return this.secretsSubject.asObservable();
  }
}
