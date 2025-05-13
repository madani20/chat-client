import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mad-chat-logout',
  imports: [],
  templateUrl: './chat-logout.component.html',
  styleUrl: './chat-logout.component.css'
})
export class ChatLogoutComponent {

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)


  onLogOut() {
    this.authService.logOut()
    this.router.navigate(['/connect'])
  }

}
