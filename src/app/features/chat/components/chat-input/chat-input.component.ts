import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'mad-chat-input',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './chat-input.component.html',
    styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {

  private readonly formBuilder = inject(FormBuilder)
  messageToSend = output<string>()
  typing = output<void>()

  //-------  Message saisi via le formulaire  -------------------/

  messageForm = this.formBuilder.group({
    content: ['', [Validators.required,
    Validators.minLength(2),
    Validators.maxLength(1000),
    Validators.pattern(/^[a-zA-Z0-9À-ÿ\s.,!?;:()'"“”‘’]*$/)
    ]
    ]
  })

  //----------------------------------------------------------------/

  toSendMessage() {
    if (this.messageForm.valid) {
      const content = this.messageForm.get('content')?.value ?? ''
      this.messageToSend.emit((content))
      this.messageForm.reset() // Réinitialisation après émission
    }
  }
  
  onTyping(): void {
    this.typing.emit()
    }
  
}




