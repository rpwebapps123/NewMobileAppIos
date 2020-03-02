export interface Navigation {
    Page: any;
    NavParams: any;
    PageType: NavigationType;
    NavCtrl: any;
    clearHistory: boolean,
    replace: boolean
    onDismiss: Function,
    headerConfig:any,
    prevPage:number
}

export enum NavigationType {
    PAGE, DIALOG, GO_BACK, ERROR, INFO
}
