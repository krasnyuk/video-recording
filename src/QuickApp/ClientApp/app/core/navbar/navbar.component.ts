import {Component, OnInit} from '@angular/core';
import {AppTranslationService} from '../../services/app-translation.service';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.scss']
})

export class NavbarComponent implements OnInit {

    public languages: Array<any> = [
        {value: 'en', viewValue: 'English'},
        {value: 'pt', viewValue: 'Portugalian'},
    ];

    constructor(private translationService: AppTranslationService) {
    }

    ngOnInit() {
    }

    public languageChange(selectedLanguage:string): void {
        this.translationService.changeLanguage(selectedLanguage);
    }
}