import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
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
            bitsPerSecond: 512000
        };
        this.stream = stream;
        this.recordRTC = RecordRTC(stream, options);
        // start of recording video
        this.recordRTC.startRecording();
        this.isRecording = true;
        // showing video stream as html element
        let video: HTMLVideoElement = this.video.nativeElement;
        video.src = window.URL.createObjectURL(stream);
        // hiding video element controls while recording
        this.toggleControls();
    }

    public errorCallback(): void {
        // callback if user is not approved recording browser functions
    }

    public processVideo(audioVideoWebMURL): void {
        let video: HTMLVideoElement = this.video.nativeElement;
        // let recordRTC = this.recordRTC;
        // show recorded result in video html element
        video.src = audioVideoWebMURL;
        // show video controls
        this.toggleControls();
        let recordedBlob = this.recordRTC.getBlob();
        // let blob = new Blob([recordedBlob], {type: 'video/mp4'});
        // debugger;
        this.recordRTC.getDataURL(function (dataURL) {
            // video.src = dataURL;
        });
    }

    public startRecording(): void {
        // requesting approve for using camera and microphone
        navigator.mediaDevices.getUserMedia(this.mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
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