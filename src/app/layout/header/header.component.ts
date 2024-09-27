import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';
import {
  LOCAL_KEY_BUCKETS,
  LOCAL_KEY_LOGIN_TYPE,
  LOCAL_KEY_USERNAME,
  LOGIN_TYPE,
  SUPER_ADMIN_USERNAME
} from 'src/app/constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  oldPassword;
  newPassword;
  confirmPassword;
  msg;
  pmodal;
  bucket;

  constructor(private auth: AuthService, private title: Title) {
  }

  ngOnInit() {
    this.bucket = localStorage[LOCAL_KEY_BUCKETS]
  }

  logout() {
    this.auth.signOut();
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.msg = "Password confirmation doesn't match the password";
      return;
    }

    this.auth
      .changePassword(this.oldPassword, this.newPassword)
      .then(d => {
        this.close();
      })
      .catch(e => {
        this.msg = e.message;
      });
  }

  pass() {
    return localStorage[LOCAL_KEY_LOGIN_TYPE] === LOGIN_TYPE.cognito;
  }

  close() {
    this.pmodal = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.msg = '';
  }

  isSuperAdmin(): boolean {
    return SUPER_ADMIN_USERNAME === localStorage[LOCAL_KEY_USERNAME];
  }
}
