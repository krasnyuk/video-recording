import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.scss']
})

export class NavbarComponent implements OnInit {

    public languages = [
        {value: 'EN', viewValue: 'English'},
        {value: 'PT', viewValue: 'Portugalian'},
    ];
    constructor() {
    }

    ngOnInit() {
    }
}