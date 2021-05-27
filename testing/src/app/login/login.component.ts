import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  message = '';

  constructor() {}

  ngOnInit(): void {}

  handleClick(): void {
    this.message = 'Du hast mich geklickt.';
  }
}
