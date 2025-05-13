import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'mad-connect',
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.css'
})
export class ConnectComponent {

}
