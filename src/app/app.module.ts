import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { AlertService } from './alert/alert.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { S3Component } from './s3/s3.component';
import { S3SidebarComponent } from './s3/sidebar/sidebar.component';
import { PlayerComponent } from './player/player.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, LoginComponent, NotFoundComponent, S3Component, S3SidebarComponent, PlayerComponent],
  imports: [BrowserModule, AppRoutingModule, ClarityModule, LayoutModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, HttpClientModule],
  providers: [AlertService, Title, PlayerComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
