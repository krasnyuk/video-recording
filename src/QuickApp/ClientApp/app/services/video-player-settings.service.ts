import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class VideoPlayerSettingsService {
    private videoDurationSource = new Subject<number>();
    public videoDurations$ = this.videoDurationSource.asObservable();

    constructor() {
    }

    public setVideoDurationLimit(newDuration: number): void {
        this.videoDurationSource.next(newDuration);
    }
}