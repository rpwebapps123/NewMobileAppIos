import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Config } from 'ionic-angular';
import { NavigationActions } from '../actions/navigation.actions';
import { Navigation } from '../models/navigation';


@Injectable()
export class NavigationEffects {

    constructor(
        private actions$: Actions,
        private config: Config
    ) {}

    doNavigation(payload: Navigation): void {
    }
    @Effect() navigateToPage$ = this.actions$
        .ofType(NavigationActions.NAVIGATE_TO_PAGE)
        .do(payload => this.doNavigation(payload))
        .ignoreElements();

    @Effect() navigateToDialog$ = this.actions$
        .ofType(NavigationActions.NAVIGATE_TO_DIALOG)
        .do(payload => this.doNavigation(payload))
        .ignoreElements();

    @Effect() navigateToError$ = this.actions$
        .ofType(NavigationActions.SHOW_ERROR)
        .do(payload => this.doNavigation(payload))
        .ignoreElements();

    @Effect() navigateToInfo$ = this.actions$
        .ofType(NavigationActions.SHOW_INFO)
        .do(payload => this.doNavigation(payload))
        .ignoreElements();

    @Effect() navigateBack$ = this.actions$
        .ofType(NavigationActions.NAVIGATE_BACK)
        .do(payload => this.doNavigation(payload))
        .ignoreElements();

}