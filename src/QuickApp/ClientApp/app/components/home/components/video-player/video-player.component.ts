import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import * as RecordRTC from 'recordrtc';

@Component({
    selector: 'video-player',
    templateUrl: 'video-player.component.html',
    styleUrls: ['video-player.component.scss']
})

export class VideoPlayerComponent implements OnInit, AfterViewInit {

    public isRecording: boolean = false;
    public isRecorded: boolean = false;
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
        const options = {
            mimeType: 'video/webm\;codecs=vp8', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
            bitsPerSecond: 512000
        };
        this.stream = stream;
        this.recordRTC = RecordRTC(stream, options);
        // start of recording video
        this.recordRTC.startRecording();
        this.isRecording = true;
        // showing video stream as html element
        this.videoElement.src = window.URL.createObjectURL(stream);
        // hiding video element controls while recording
        this.toggleControls();
    }

    public errorCallback(): void {
        // callback if user is not approved recording browser functions
    }

    public processVideo(audioVideoWebMURL): void {
        // let recordRTC = this.recordRTC;
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
        this.recordRTC.pauseRecording();
        this.videoElement.pause();
    }

    public resumeRecording(): void {
        this.recordRTC.resumeRecording();
        this.videoElement.play();
    }

    public onPauseToggle() {
        if (this.isRecording) {
            this.videoElement.paused ? this.pauseRecording() : this.resumeRecording();
        }
    }

    public stopRecording(): void {
        // process video after stop recording
        this.recordRTC.stopRecording(this.processVideo.bind(this));
        // stop streams
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream.getVideoTracks().forEach(track => track.stop());
        this.isRecording = false;
        this.isRecorded = true;
    }

    public downloadVideo(): void {
        this.recordRTC.save(this.fileTitle + '.' + this.fileExtension);
    }
}