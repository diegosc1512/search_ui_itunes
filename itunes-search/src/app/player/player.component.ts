import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { PlayerService } from '../shared/player.service';
import { ChartComponent } from '@progress/kendo-angular-charts';
import { Track } from '../shared/models/track';

declare var window;

window.AudioContext = window.AudioContext || window.webkitAudioContext;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {
  @ViewChild('player') playerRef: any;
  @ViewChild('visualiser') chartRef: any;
  player: any;
  fftSize = 128;
  smoothingTimeConstant = 0.3;
  audioContext: AudioContext;
  audioSource: MediaElementAudioSourceNode;
  analyser: AnalyserNode;
  frequencyData: Uint8Array;
  timeDomainData: Uint8Array;
  data: Array<number>;
  cancel: any;
  constructor(private playerService: PlayerService, public ngZone: NgZone) {
    playerService.playTrack$.subscribe(track => {
      this.playTrack(track.trackCensoredName);
    });

    playerService.pauseTrack$.subscribe(() => {
      this.pauseTrack();
    });
  }

  ngOnInit() {
  
    this.player = this.playerRef.nativeElement;
    this.player.crossOrigin = 'anonymous';
    if (AudioContext) {
      this.audioContext = new AudioContext();
      this.audioSource = this.audioContext.createMediaElementSource(
        this.player
      );

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;

      this.audioSource.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);
    }
  }

  playTrack(previewUrl: string) {
    cancelAnimationFrame(this.cancel);

    this.player.src = previewUrl;
    this.player.play();

    if (AudioContext) {
      this.draw();
    }
  }
  draw() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.timeDomainData);

    this.data = Array.apply([], this.frequencyData);

    this.playerService.frequencyData(this.frequencyData);

    this.cancel = requestAnimationFrame(() => this.draw());
  }

  pauseTrack() {
    this.player.pause();
    cancelAnimationFrame(this.cancel);
  }

  playerEnded() {
    this.playerService.trackEnded();
    cancelAnimationFrame(this.cancel);
  }
}
