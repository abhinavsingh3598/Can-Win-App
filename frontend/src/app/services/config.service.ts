import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ConfigService {
    private config: any;

    constructor(private http: HttpClient) {}

    loadConfig(): Observable<any> {
        if (this.config) {
            // if config is already loaded, return it
            return of(this.config);
        } else {
            // else load the config from the json file
            return this.http.get('/assets/config.json').pipe(
                tap(config => {
                    this.config = config;
                })
            );
        }
    }

    get(key: string): any {
      return this.config ? this.config[key] : null;
  }
  
}
