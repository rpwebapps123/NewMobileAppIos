import { Action, ActionReducer } from '@ngrx/store';
import { PotentialActions } from '../actions/potential.action';
import { UserActions } from '../actions/user.actions';
import { PotentialList } from '../models/user';



export interface IPotentialState {
    list: Array<PotentialList>;
    activePotential: PotentialList;
}
const initiState: IPotentialState = {
    list: [],
    activePotential: {
        accountId: '',
        groupid: 0,
        installationId: '',
        numberOfCameras: 0,
        potentialId: '',
        siteName: '',
        surview: false,
        unitId: '',
        url: '',
        sfaccountId: '',
        timezone:""
    }
}
export const PotentialReducer: ActionReducer<IPotentialState> =
    (state: IPotentialState = initiState, action: Action) => {
        switch (action.type) {
            case PotentialActions.POTENTIAL_LIST:
                return Object.assign({}, state, {
                    list: action.payload
                });
            case PotentialActions.ACTIVE_POTENTAIL:
                return Object.assign({}, state, {
                    activePotential: action.payload
                });
            case UserActions.LOGOUT:
                return state = initiState;
            default:
                return state;
        };
    };