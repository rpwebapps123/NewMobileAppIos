import { Injectable } from '@angular/core';
import delay from 'lodash/delay';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoadingService {
    loading: any;
    _loadingObserver: any;
    count = 0;
    silent = false;
    scheduledHide: number;
    lastAlertTime : number;
    private lastSchedulerId:number;

    constructor() {
        this.loading = Observable.create(observer => {
            this._loadingObserver = observer;
        });
        setInterval(()=>{

        },)
    }

    toggleLoadingIndicator(name): void {
        if (this._loadingObserver) {
            this._loadingObserver.next(name);
        }
    }

    silentLoader(silent: boolean): void {
        this.silent = silent;
    }

    showLoader(): void {
        if (!this.silent) {
            if (this.scheduledHide) {
                clearTimeout(this.scheduledHide);
            }
            this.toggleLoadingIndicator(true);
        }
    }

    hideLoader(): void {
        try{
            this.scheduledHide = delay(() => {
                this.toggleLoadingIndicator(false);
            }, 0);
        } catch(e){
            console.log(e);
        }
    }
}
