import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { NavigationType } from '../models/navigation';
import { isDesktop } from './../config/appConfig';

@Injectable()
export class NavigationActions {
    private getHeaderConfig(page: Pages) {
        switch (page) {
            case Pages.MONITOR: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Monitoring Hours',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.CAMERA: {
                return {
                    showHeader: true,
                    showButton: true,
                    showBack: true,
                    showBackButton: true,
                    showList: true,
                    showTitle: 'Live Views',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.STATS: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Statistics',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.CAM_HEALTH: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Equipment Health',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.VIDEOPAGE: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Video',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.HOME: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: false,
                    showTitle: 'Home',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.POTENTIAL_LIST_MENU: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Pro-Vigil',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.CAMERA_LIST_MENU: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showList: true,
                    showBackButton: true,
                    showTitle: 'Pro-Vigil',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.ALARMS: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Planned Site Activity',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.EVENT_LIST: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Stats & Events',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.SETTING: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Settings',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.ABOUT_US: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Tips',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: false
                }
            }
            case Pages.PIN: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Settings',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.ARM_DISARM_INFO: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Armed Info',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.MANAGE_ALARMS: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Report a Problem',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.LOGIN: {
                return {
                    showHeader: false,
                    showButton: false,
                    showBack: false,
                    showBackButton: false,
                    showTitle: 'Pro-Vigil',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.NOTIFICATION_PAGE: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Notifications',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.BALANCE_DUE_PAGE: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Billing Information',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.ABOUT_US_PAGE: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'About Us',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: false
                }
            }
            case Pages.CAMERA_HD_VIEW_PAGE: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'View Live',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: false
                }
            }
            case Pages.EVENT_LOG: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Event Log',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.EVENT_LOG_DETAIL: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Event Log Detail',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.SITES_LIST: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: false,
                    showTitle: 'Sites List',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            case Pages.MASK_IMAGES: {
                return {
                    showHeader: true,
                    showButton: false,
                    showBack: true,
                    showBackButton: true,
                    showTitle: 'Live Views',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
            default: {
                return {
                    showHeader: false,
                    showButton: false,
                    showBack: false,
                    showBackButton: false,
                    showTitle: 'Pro-Vigil',
                    showImage: false,
                    showToolbarDesktop: false,
                    showToolbarMobile: true
                }
            }
        }

    }

//private pageNumber: number = isDesktop ? 1 : 2
private pageNumber: number = 2;

    static NAVIGATE_TO_PAGE = 'NAVIGATE_TO_PAGE';
    navigateToPage(page: Pages, clearHistory?: boolean, data?: any, prevPage?: number): Action {
        return {
            payload: {
                NavParams: data || {},
                Page: page,
                PageType: NavigationType.PAGE,
                clearHistory: clearHistory,
                replace: false,
                prevPage: prevPage ? prevPage : this.pageNumber,
                headerConfig: this.getHeaderConfig(page)
            },
            type: NavigationActions.NAVIGATE_TO_PAGE
        };
    }

    replacePage(page: Pages, data?: any): Action {
        return {
            payload: {
                NavParams: data || {},
                Page: page,
                PageType: NavigationType.PAGE,
                clearHistory: false,
                replace: true
            },
            type: NavigationActions.NAVIGATE_TO_PAGE
        };
    }

    static NAVIGATE_TO_DIALOG = 'NAVIGATE_TO_DIALOG';
    navigateToDialog(page: Pages, data?: any, onDismiss?: Function): Action {
        return {
            payload: {
                NavParams: data || {},
                Page: page,
                PageType: NavigationType.DIALOG,
                onDismiss: onDismiss
            },
            type: NavigationActions.NAVIGATE_TO_DIALOG
        };
    }

    static NAVIGATE_BACK = 'NAVIGATE_BACK';
    goBack(): Action {
        return {
            payload: {
                PageType: NavigationType.GO_BACK,
                // Page: page,
                // headerConfig: this.getHeaderConfig(page)
            },
            type: NavigationActions.NAVIGATE_BACK
        };
    }

    static SHOW_ERROR = 'SHOW_ERROR';
    showError(error: string, title?: string): Action {
        return {
            payload: {
                NavParams: {
                    error: error,
                    title: title
                },
                PageType: NavigationType.ERROR
            },
            type: NavigationActions.SHOW_ERROR
        };
    }

    static SHOW_INFO = 'SHOW_INFO';
    showInfo(message: string, title?: string, onDismiss?: Function): Action {
        return {
            payload: {
                NavParams: {
                    message: message,
                    title: title
                },
                PageType: NavigationType.INFO,
                onDismiss: onDismiss
            },
            type: NavigationActions.SHOW_INFO
        };
    }

}
export enum Pages {
    LOGIN , CAMERA, HOME , SIGNUP, ARM_DISARM_INFO,
    ONBOARD_SCAN_FILTER, ONBOARD_FILTER_READY, MONITOR,
    ONBOARD_CATEGORY, ONBOARD_MACHINE, ONBOARD_BRANCD,
    VIDEOPAGE, PLAY_VIDEO, POTENTIAL_LIST_MENU, CAMERA_LIST_MENU,
    STATS, SETTING, ABOUT_US, PIN, MANAGE_ALARMS, EVENT_LIST, ALARMS, PHONE, SETUP_PIN, NOTIFICATION_PAGE, BALANCE_DUE_PAGE, CAM_HEALTH, ABOUT_US_PAGE, CAMERA_HD_VIEW_PAGE,
    EVENT_LOG, EVENT_LOG_DETAIL, SITES_LIST, MASK_IMAGES
}
