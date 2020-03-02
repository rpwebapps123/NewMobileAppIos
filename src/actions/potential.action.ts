import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { PotentialList } from '../models/user';

@Injectable()
export class PotentialActions {

    static POTENTIAL_LIST = 'POTENTIAL_LIST';
    savePotentailList(potentialList: Array<PotentialList>): Action {
        return {
            type: PotentialActions.POTENTIAL_LIST,
            payload: potentialList
        };
    }

    static ACTIVE_POTENTAIL = 'ACTIVE_POTENTAIL';
    activePotentail(potentialList: PotentialList): Action {
        return {
            type: PotentialActions.ACTIVE_POTENTAIL,
            payload: potentialList
        };
    }
    static UPDATE_POTENTIAL = 'UPDATE_POTENTIAL'
    updatePotential(payload: any): Action {
        return {
            type: PotentialActions.UPDATE_POTENTIAL,
            payload
        }
    }
    static GET_ACTIVE_POTENTIAL = 'GET_ACTIVE_POTENTIAL'
    getActivePotential(): Action {
        return {
            type: PotentialActions.GET_ACTIVE_POTENTIAL
        }
    }

}