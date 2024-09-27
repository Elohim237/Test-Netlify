import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SecretService } from 'src/secret/secret.service';
import { DatasharingService } from './datasharing/datasharing.service';
import { privateDecrypt } from 'crypto';
import { JSEncrypt } from 'jsencrypt';
import * as forge from 'node-forge';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  privateKey = `-----BEGIN RSA PRIVATE KEY-----
  MIIEowIBAAKCAQEA5ws4cvC0JR+sVbunTaeSquRw4Aq9h+SlEc/y0TnUqCh59bVn
  3gISeKGcLOwl7z+2EivbWZ6IBa56kK88j2zpNSgIPjB+XzAyQA45kHaeWtJqhE6V
  CEtbpijecvK80hvBxbuGQpWUs5grqRKhAskXtImIDnsrEf1m944RzZx9HbDwwqlj
  //YdU32TAsOqNq2cmyNcnX7GiENQwcXY/WAfTfpUxsmdyu6Q0g+V/P7HBLWvsUAF
  Kigp7UZ5plf2feLzinOz08qAqBO9frL8vJVXiMAqsrSwSGXo70nzO/QAKY2MXrR+
  Tut10fqL679Z3hTxEEl0qQmps6LyDuvDkn6xzwIDAQABAoIBAAmCaB4uLNjDHZG6
  k1LaTQQYB1LnvkNKNHnjAc7j8kFb+rqtO76WF6W7z4GRB3XgcAfLCR0xx2fZQmKT
  UKSXY/kNhVrut6GgimdU7o01BKS4uMYEG5UBNp8RJ/Uga1S7UokAt31YFyW8Y3E/
  1HBL6VwQT3d6t4KApOzj5EGyAvt//KO4tmI+QEg1xHKERt5BByVT3H0vwQMH7sZ+
  XQ+glWvR27QGhSlWb8FZx5fIUgUfYqcKDThC8cUtuKU3+IGDT7bDVBJdEfVKOoxZ
  K8fVjcIxWEiuxlwrgy3Mj3E8P9I+QcBky7g98D4Jbruo4pX2SG01KEd0wycD4Ehk
  SLtM6+ECgYEA+/fs4R28UN2NcsVnr4YAi5e8s4SHi79ulaZhUxuQjuOgGCSWHyFH
  6wX8TeUcSNTJNsxNKVK5GvrsrQrwSmwqYUEvneqHi4wrGIDyLYqgNvYcNCT/Gsqi
  YfVCwdGOXktflXUk+zfvmUbijOQy87yeoFsBZR8lB3m0fIHj7WtN8rECgYEA6r2W
  QQq/Vru1Vekgs8hkup1qBMW6movZecCJBziblsE9tyFuIQqu6iZbNPa7lMVTFlKJ
  ViB++wrsPLwlZZV8s7ldeqyCE9frUTXP+2vC+r+PK96GnswciP9A8vLh5aj8mERf
  Maz31FiFRimUf+cbeN0kxC6NKtYgGtVGv2VjDH8CgYB6xp34O4MNbEeGS0Zwsr0F
  SBS87LEXmVoLNZ1q352a4rOZ0AoOdSsUDECavC8CFh1NxFM89YAY83fsAc6AlSA5
  b4gCTMtrZguBzyMyqb/TyCyKBBUCOwbQ8K9sve2/aL7UltZES0dGytGNkYx6U8h/
  npiZa4mhkN4vZSNpBsZeoQKBgQCY1s4xFT1VzKwZ/suTI0QqmXnBF7kTDUGRW4Ic
  2Ie9lZ6IUVTyYJFY1ZaHGqsyB3S80QqosEndTNRaCyrSRI3IO0YZLJ8ZKnoGC2Ka
  0iRGvVkL+DxwwndF3+S7Ctd4gBnPTp0oq/VFJknIUCRnTuN9Q4e/0IuLu5V1wy3o
  Sqw+IwKBgGv/r/aLjkdyejwOkGOTxtHSeA464vvUcaf3FcuAB1MgDPxQNNUO5pVI
  Py5KoiobmUKJAllGPBzMtqqSk3J/YO2hKNWCpry3PMdLIvXIJRRZPNIcP4roy37s
  y6IlihEFTYp6rCOttA1+d6jmccpmiupfK40VUdyilp8tzwkjmG3u
  -----END RSA PRIVATE KEY-----
  `;

  secretsLoaded: boolean = false;
  logins: any[] = [];  // Initialisez la variable
  
  public constructor(private title: Title,private secretService: SecretService, private dataSharingService: DatasharingService) {
    this.title.setTitle(environment.title);
  }

  ngOnInit(): void {
  
    this.secretService.getSecret().subscribe((response) => {
      // Remplacer les valeurs d'environnement par les secrets obtenus du backend
      // Récupérer les secrets chiffrés depuis l'API
      console.log("response",response)
      const encryptedData = response.encryptedData;

      // Déchiffrer les secrets avec la clé privée
    
      const decryptedSecrets = this.decryptSecrets(encryptedData);

      // Mettre à jour les secrets dans `environment` après déchiffrement
      environment.accessKey = decryptedSecrets.accessKey;
      environment.secretKey = decryptedSecrets.secretKey;
      environment.username = decryptedSecrets.username;
      environment.password = decryptedSecrets.password;
      this.dataSharingService.setSecrets(decryptedSecrets);
      this.logins = environment.logins;
      console.log('Secrets chargés et déchiffrés:', decryptedSecrets);
      this.secretsLoaded = true; // Indique que les secrets sont ch

    }, (error) => {
      console.error('Erreur lors de la récupération des secrets:', error);
    });
  }

  // decryptSecrets(encryptedData: string): any {
  //   try {
  //     // Convertir les données chiffrées de base64 en Buffer
  //     const buffer = Buffer.from(encryptedData, 'base64');

  //     // Déchiffrer les données à l'aide de la clé privée
  //     const decrypted = privateDecrypt(
  //       {
  //         key: this.privateKey,
  //         passphrase: '',  // Si votre clé est protégée par un mot de passe, ajoutez-le ici
  //       },
  //       buffer
  //     );

  //     // Retourner les secrets déchiffrés sous forme d'objet JSON
  //     return JSON.parse(decrypted.toString());
  //   } catch (error) {
  //     console.error('Erreur lors du déchiffrement des secrets:', error);
  //     return null;
  //   }
  // }

  // decryptSecrets(encryptedData: string): any {
  //   try {
  //     const jsEncrypt = new JSEncrypt();
  //     jsEncrypt.setPrivateKey(this.privateKey);
  
  //     // Déchiffrer les données
  //     const decrypted = jsEncrypt.decrypt(encryptedData);
  
  //     if (!decrypted) {
  //       throw new Error('Le déchiffrement a échoué.');
  //     }
  
  //     return JSON.parse(decrypted);
  //   } catch (error) {
  //     console.error('Erreur lors du déchiffrement des secrets:', error);
  //     return null;
  //   }
  // }
  
  decryptSecrets(encryptedData: string): any {
    try {
      // Décode la chaîne chiffrée base64 en bytes
      const encryptedBytes = forge.util.decode64(encryptedData);

      // Convertir en un buffer utilisable par forge
      const encryptedBuffer = forge.util.createBuffer(encryptedBytes, 'raw');

      // Charger la clé privée
      const privateKey = forge.pki.privateKeyFromPem(this.privateKey);

      // Déchiffrer les données
      const decrypted = privateKey.decrypt(encryptedBuffer.getBytes(), 'RSA-OAEP');

      // Retourner les données déchiffrées en JSON (si nécessaire)
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Erreur lors du déchiffrement des secrets:', error);
      return null;
    }
  }

}
