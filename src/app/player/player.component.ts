import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Subscription, zip} from 'rxjs';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  styles: [`
    :host {
      display: inline-grid;
    }
  `]
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audio', {static: false, read: ElementRef})
  audioRef: ElementRef<HTMLAudioElement>;
  url: string;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const parentRouteParams = this.activatedRoute.parent.params
      .pipe(filter(params => params.bucket && params.prefix));
    const activeRouteParams = this.activatedRoute.params
      .pipe(filter(params => params.filename));

    this.subscription = zip(parentRouteParams, activeRouteParams)
      .pipe(map(([{bucket, prefix}, {filename}]) => ({bucket, prefix, filename})))
      .subscribe(({bucket, filename, prefix}) => {
        this.url = `https://${bucket}.s3.amazonaws.com/${prefix}${encodeURIComponent(filename)}`;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  basename(urlOrPath: string) {
    return urlOrPath.replace(/^.*\/([^/]+)$/, '$1');
  }

  play(event: Event) {
    // TODO: Do something when it start play...
  }

  isAudioFile(): boolean {
    // Liste des extensions de fichiers audio courantes
    let audioExtensions = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'];

    // Obtenir l'extension du fichier
    let extension = this.activatedRoute.snapshot.paramMap.get("filename").split('.').pop().toLowerCase();

    // Vérifier si l'extension est dans la liste
    return audioExtensions.includes(extension);
  }

}
