import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import * as RecordRTC from 'recordrtc';

enum RecorderState {
    recording = 'recording',
    paused = 'paused',
    stopped = 'stopped',
    inactive = 'inactive'
}

@Component({
    selector: 'video-player',
    templateUrl: 'video-player.component.html',
    styleUrls: ['video-player.component.scss']
})

export class VideoPlayerComponent implements OnInit, AfterViewInit {

    public isRecording: boolean = false;
    public isPaused: boolean = false;
    public showNewVideoButton: boolean = true;
    public showTimerCaption: boolean = false;
    public timerCaption: string = '';
    public recorderState: RecorderState;
    private timerCaptionsArray: Array<string> = ['3', '2', '1', 'Pitch!'];
    private stream: MediaStream;
    private recordRTC: any;
    private fileTitle: string = 'you-pitch-video';
    private fileExtension: string = 'mp4';
    private mediaConstraints: MediaStreamConstraints = {
        video: {
            advanced: [{
                width: 1920,
                height: 1080,
                aspectRatio: 1.77
            }]
        }, audio: true
    };

    @ViewChild('video') public video;
    public videoElement: HTMLVideoElement;

    constructor() {

    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        // reference to video html element
        this.videoElement = this.video.nativeElement;
        this.setInitialState();
    }

    private setInitialState(): void {
        this.videoElement.muted = false;
        this.videoElement.controls = false;
        this.videoElement.autoplay = false;
    }

    public toggleControls(): void {
        this.videoElement.muted = !this.videoElement.muted;
        this.videoElement.controls = !this.videoElement.controls;
        this.videoElement.autoplay = !this.videoElement.autoplay;
    }

    public successCallback(stream: MediaStream): void {
        this.showTimer().then(() => {
            const options = {
                mimeType: 'video/webm\;codecs=vp8', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
                bitsPerSecond: 512000
            };
            this.stream = stream;
            this.recordRTC = RecordRTC(stream, options);
            this.recordRTC.onStateChanged = this.onRecorderStateChanged.bind(this);
            // start of recording video
            this.recordRTC.startRecording();
            this.isRecording = true;
            this.showNewVideoButton = false;
            // showing video stream as html element
            this.videoElement.src = window.URL.createObjectURL(stream);
            // hiding video element controls while recording
            this.toggleControls();
        });
    }

    public onRecorderStateChanged(currentRecorderState: RecorderState): void {
        this.recorderState = currentRecorderState;
    }

    public errorCallback(error: any): void {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    }

    public processVideo(audioVideoWebMURL): void {
        // show recorded result in video html element
        this.videoElement.src = audioVideoWebMURL;
        this.videoElement.muted = false;
        // show video controls
        //this.toggleControls();
        let recordedBlob = this.recordRTC.getBlob();
        // let blob = new Blob([recordedBlob], {type: 'video/mp4'});
        this.recordRTC.getDataURL(function (dataURL) {
            // video.src = dataURL;
        });

    }

    public startRecording(): void {
        navigator.mediaDevices.getUserMedia(this.mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    public pauseRecording(): void {
        this.isPaused = true;
        this.recordRTC.pauseRecording();
        this.videoElement.pause();
    }

    public resumeRecording(): void {
        this.isPaused = false;
        this.recordRTC.resumeRecording();
        this.videoElement.play();
    }

    public onPauseToggle() {
        if (this.isRecording) {
            this.videoElement.paused ? this.pauseRecording() : this.resumeRecording();
        }
    }

    public stopRecording(): Promise<any> {
        return new Promise<any>((videoStopped) => {
            this.isPaused = false;
            // process video after stop recording
            if (this.recordRTC.state !== RecorderState.stopped) {
                this.recordRTC.stopRecording((data) => {
                    this.processVideo(data);
                    // stop streams
                    this.stream.getAudioTracks().forEach(track => track.stop());
                    this.stream.getVideoTracks().forEach(track => track.stop());
                    this.isRecording = false;
                    videoStopped();
                });
            } else {
                this.isRecording = false;
                videoStopped();
            }

        });
    }

    public resetRecording(): void {
        this.stopRecording().then(() => {
            this.recordRTC.reset();
            this.setInitialState();
            this.isPaused = false;
            this.isRecording = false;
            this.showNewVideoButton = true;
            this.videoElement.src = '';
            this.timerCaption = '';
        });
    }

    public watchVideo(): void {
        this.stopRecording().then(() => this.videoElement.play());
    }

    public downloadVideo(): void {
        this.stopRecording().then(() => this.recordRTC.save(this.fileTitle + '.' + this.fileExtension));
    }

    public showTimer(): Promise<any> {
        return new Promise<any>((timerIsShown) => {
            this.showTimerCaption = true;
            let index = 0;
            // 1 second interval
            const timerInterval = 1000;
            // save timer id to clear interval
            let timerId = setInterval(() => {
                if (index !== this.timerCaptionsArray.length) {
                    this.timerCaption = this.timerCaptionsArray[index++];
                } else {
                    clearInterval(timerId);
                    this.showTimerCaption = false;
                    timerIsShown();
                }
            }, timerInterval);
        });

    }
}