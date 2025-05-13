import { Component, computed, inject, OnDestroy } from '@angular/core';

// ======== imports material ============
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// ======================================
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../chat/models/user';
import { ChatStateService } from '../../../chat/services/chat-state.service';
import { LocalStorageService } from '../../../chat/services/local-storage.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  //=========[ INDEPENDENCY INJECTION ]=================

  private readonly formBuilder = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly stateService = inject(ChatStateService)
  private readonly destroy$ = new Subject<void>()
  private readonly router = inject(Router)
  private readonly localStorageService = inject(LocalStorageService)

  currentUser = computed(() => this.stateService.currentUser())
  errorMessage: any
  isLoading = false
  snackBar = inject(MatSnackBar)
 
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.maxLength(6)]]
  })
  
  onLogIn(): void {
    console.info('Init onLogIn');
    this.isLoading = true;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    if (email && password) {
      this.authService.logIn(email, password).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (user: User) => {
          this.localStorageService.setItem('token', user.token)
          this.stateService.setCurrentUser(user)
          //console.log('Utilisateur connecté avec succès: son status => ', user.status)
          //console.log('Utilisateur défini, navigation vers /chat:', user)
          this.isLoading = false
          this.router.navigate(['/chat']); 
          console.info('Fin onLogIn')
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Erreur lors de la connexion : ' + err.error, 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Erreur login:', err);
        }
      });
    } else {
      console.error('Formulaire non valid');
      this.isLoading = false;
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


  // ============[ Material fields ]===================
  hide = signal(true)
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
