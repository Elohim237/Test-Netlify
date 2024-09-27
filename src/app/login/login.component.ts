import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {
  LOCAL_KEY_LOGIN_INDEX,
  LOCAL_KEY_LOGIN_TYPE,
  LOCAL_KEY_REGION,
  LOGIN_TYPE,
} from '../constant';
import {environment} from "../../environments/environment";
import { DatasharingService } from '../datasharing/datasharing.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  msg: string; // Définit le type de la variable `msg`
  loginForm: any; // À définir si nécessaire
  logins: any[]; // Définit le type du tableau des logins
  secretsLoaded = false; // Vérifier si les secrets ont été chargés
  secrets: any = {};

  form = {
    type: localStorage[LOCAL_KEY_LOGIN_INDEX] || '0',
    username: '',
    password: '',
  };

  patterns = {};
  placeholders = {};

  constructor(
    private router: Router,
    private auth: AuthService,
    private datasharing: DatasharingService
  ) {}


  ngOnInit() {
    // Charger les secrets chiffrés depuis le backend via SecretService
    // S'abonner à DatasharingService pour attendre les secrets
    this.datasharing.getSecrets().subscribe((secrets) => {
      if (secrets) {
        this.secrets = secrets;
        environment.accessKey =  this.secrets.accessKey;
        environment.secretKey =  this.secrets.secretKey;
        environment.username =  this.secrets.username;
        environment.password =  this.secrets.password;
        this.secretsLoaded = true;
        console.log('Secrets chargés:', this.secrets);
      }
    });

    // Définir les patterns et placeholders pour la validation des formulaires
    this.patterns[LOGIN_TYPE.cognito] = ['^.*$', '^^.*$'];
    this.patterns[LOGIN_TYPE.accessKey] = [
      '^(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])$', // Pattern pour Access Key Id
      '^(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])$', // Pattern pour Secret Access Key
    ];
    this.placeholders[LOGIN_TYPE.cognito] = ['Username', 'Password'];
    this.placeholders[LOGIN_TYPE.accessKey] = ['Access Key Id', 'Secret Access Key'];
  }


  onSubmitLogin() {
    // S'assurer que les secrets sont chargés avant de procéder
    if (!this.secretsLoaded) {
      this.msg = "Les informations d'authentification ne sont pas encore disponibles..... Veuillez réessayer.";
      return;
    }

    // Récupérer les secrets déchiffrés
    const { accessKey, secretKey, username, password } = this.secrets;
    const { username: un, password: pw } = this.form;

    // Vérifier les informations de connexion (username et password)
    if (!(username === un && password === pw)) {
      this.msg = "Échec de l'authentification. Veuillez vérifier vos informations.";
      return;
    }

    // Si les informations sont correctes, effectuer la connexion
    const login = environment.logins[LOGIN_TYPE.accessKey];
    const bucketNames = environment.bucketNames;
    const S3_PREFIX = "s3/";

    localStorage[LOCAL_KEY_LOGIN_INDEX] = this.form.type;
    localStorage[LOCAL_KEY_LOGIN_TYPE] = login.type;
    localStorage[LOCAL_KEY_REGION] = login.region;
    // Effectuer la connexion via AuthService en utilisant les credentials déchiffrés
    this.auth.signIn(accessKey, secretKey, login).subscribe(
      result => {
        console.log('login');
        // As there is only one bucket now we redirect directly to this bucket on successful login and we remove sidebar layout component.
        this.router.navigate(['/' + S3_PREFIX + bucketNames[0]]);
      },
      error => {
        console.log(error);
        this.msg = error.message;
      }
    );
  }
}
