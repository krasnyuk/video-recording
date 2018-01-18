import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as RecordRTC from 'recordrtc';

@Component({
    selector: 'video-player',
    templateUrl: 'video-player.component.html',
    styleUrls: ['video-player.component.scss']
})

export class VideoPlayerComponent implements OnInit, AfterViewInit {

    private stream: MediaStream;
    private recordRTC: any;

    @ViewChild('video') video;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.setInitialState();
    }

    private setInitialState(): void {
        let video: HTMLVideoElement = this.video.nativeElement;
        video.muted = false;
        video.controls = true;
        video.autoplay = false;
    }

    public toggleControls(): void {
        let video: HTMLVideoElement = this.video.nativeElement;
        video.muted = !video.muted;
        video.controls = !video.controls;
        video.autoplay = !video.autoplay;
    }

    public successCallback(stream: MediaStream): void {
        const options = {
            mimeType: 'video/webm\;codecs=vp8', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
            bitsPerSecond: 512000 // if this line is provided, skip above two
        };
        this.stream = stream;
        this.recordRTC = RecordRTC(stream, options);
        this.recordRTC.startRecording();
        let video: HTMLVideoElement = this.video.nativeElement;
        video.src = window.URL.createObjectURL(stream);
        this.toggleControls();
    }

    public errorCallback(): void {
        //handle error here
    }

    public processVideo(audioVideoWebMURL): void {
        let video: HTMLVideoElement = this.video.nativeElement;
        let recordRTC = this.recordRTC;
        video.src = audioVideoWebMURL;
        this.toggleControls();
        let recordedBlob = recordRTC.getBlob();
        recordRTC.getDataURL(function (dataURL) {
            // video.src = dataURL;
        });
    }

    public startRecording(): void {
        let mediaConstraints: MediaStreamConstraints = {
            video: {
                advanced: [{
                    width: 1920,
                    height: 1080,
                    aspectRatio: 1.77
                }]
            }, audio: true
        };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    public stopRecording(): void {
        let recordRTC = this.recordRTC;
        recordRTC.stopRecording(this.processVideo.bind(this));
        let stream = this.stream;
        stream.getAudioTracks().forEach(track => track.stop());
        stream.getVideoTracks().forEach(track => track.stop());
    }

    public download(): void {
        this.recordRTC.save('video.webm');
    }
}