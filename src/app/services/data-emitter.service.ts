import { Injectable, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'

@Injectable()

export class DataEmitterService {
  public emitter: EventEmitter<any> = new EventEmitter();
  private data: any = {};

  constructor(private router:Router) { }

  navigateToDomain(domain): void {
    //this.router.navigate(['/login']);
    this.router.navigate(['domain',domain.id]);
  }

  setData(key, value): void {
    this.data[key] = value;
    this.emitter.emit(this.data);
  }

  getData(key) {
    return this.data[key];
  }
}
