import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials: any;
  signupData: any;

  login() {
    throw new Error('Method not implemented.');
  }

  signup() {
    throw new Error('Method not implemented.');
  }

  constructor() {}

  ngOnInit(): void {}
}
