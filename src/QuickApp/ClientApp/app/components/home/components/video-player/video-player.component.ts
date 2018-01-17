import {AfterViewInit, Component, OnInit} from '@angular/core';
declare var videojs :any;

@Component({
    selector: 'video-player',
    templateUrl: 'video-player.component.html'
})

export class VideoPlayerComponent implements OnInit, AfterViewInit {

    public videoJSplayer :any;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        /*this.videoJSplayer = videojs(document.getElementById('myVideo'), {
            // video.js options
            controls: true,
            loop: false,
            fluid: false,
            width: 320,
            height: 240,
            plugins: {
                // videojs-record plugin options
                record: {
                    image: false,
                    audio: false,
                    video: true,
                    maxLength: 5,
                    debug: true
                }
            }
        });*/
    }
}