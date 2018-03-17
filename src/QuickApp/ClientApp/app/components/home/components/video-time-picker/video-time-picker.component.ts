import { Component } from '@angular/core';
import {VideoPlayerSettingsService} from '../../../../services/video-player-settings.service';


@Component({
    selector: 'app-video-time-picker',
    templateUrl: './video-time-picker.component.html',
    styleUrls: ['./video-time-picker.component.scss']
})
export class VideoTimePickerComponent {
    public selectedDuration: number | null;

    public timeConfig: Array<any> = [
        {
            caption: '1 minute',
            value: 60000
        },
        {
            caption: '3 minutes',
            value: 180000
        },
        {
            caption: 'Other',
            value: null
        }
    ];

    constructor(private videoPlayerSettingsService: VideoPlayerSettingsService) {
    }

    public onDurationChange() {
        this.videoPlayerSettingsService.setVideoDurationLimit(this.selectedDuration);
    }
}
