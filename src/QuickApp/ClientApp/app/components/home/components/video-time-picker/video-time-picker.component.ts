import { Component } from '@angular/core';


@Component({
    selector: 'app-video-time-picker',
    templateUrl: './video-time-picker.component.html',
    styleUrls: ['./video-time-picker.component.scss']
})
export class VideoTimePickerComponent {
    public selectedTime: string;

    public timeConfigs: Array<string> = [
        '1 minute',
        '2 minutes',
        'Other'
    ];

    constructor() {
    }
}
