import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { LoadingService } from '../../services/loader.service';

@Component({
    selector: 'loading-indicator',
    templateUrl: 'loadingIndicator.html',
    // template: "",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingIndicator {
    private isLoading = false;
    private subscription: any;
    private loader: any = false;
    constructor(
        public loadingService: LoadingService,
        public loadingCtrl: LoadingController,
        private ref: ChangeDetectorRef) { }

    showOrHideLoadingIndicator(loading) {
        if (this.isLoading === loading) {
            return;
        }
        this.isLoading = loading;
        if (this.isLoading) this.playLoadingAnimation();
        else this.stopLoadingAnimation();
    }

    playLoadingAnimation() {
        this.loader = this.loadingCtrl.create({
            content: '',
            showBackdrop: true,
            // dismissOnPageChange: true
            duration: 10000
        });

        this.loader.present();
        setTimeout(() => {
            try {
                this.stopLoadingAnimation();
            } catch (e) {

            }
        }, 10000);
    }
    stopLoadingAnimation() {
        setTimeout(() => {
            try {
                this.loader.dismiss();
            } catch (e) { }

        }, 1000);
    }
    ngOnInit() {
        this.subscription = this.loadingService.loading.
            subscribe(loading => {
                this.showOrHideLoadingIndicator(loading);
                this.ref.detectChanges();
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}