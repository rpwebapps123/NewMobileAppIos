import { animate, group, state, style, transition, trigger } from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        
        state('out', style({
            'bottom' : 'auto',  'top' : 'calc(56px)', 'opacity': '1', 'transition': 'all 0.3s ease-out'
        })),
        transition('in => out', [group([
            animate('400ms ease-in-out', style({
                'opacity': '1'
            })),
           
            animate('500ms ease-in-out', style({
                'visibility': 'visible','bottom' : 'auto',  'top' : 'calc(56px)', 'opacity': '1'
            }))
        ]
        )]) 
    ]),
]
