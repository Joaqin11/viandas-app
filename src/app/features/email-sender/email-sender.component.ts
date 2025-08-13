// src/app/features/email-sender/email-sender.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmailService } from '../../services/email';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-sender',
  imports: [CommonModule,ReactiveFormsModule], // Importa ReactiveFormsModule para usar formularios reactivos],
  templateUrl: './email-sender.component.html',
  styleUrls: ['./email-sender.component.scss']
})
export class EmailSenderComponent implements OnInit {
  // Solución: Usa el operador '!' para decirle a TypeScript que será inicializada en ngOnInit
  emailForm!: FormGroup; 
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService
  ) { }

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      subject: ['', Validators.required],
      body: ['', Validators.required],
      sendToAllUsers: [true],
      toEmails: [''] // Cambio a una cadena para el textarea
    });
  }

  onSubmit(): void {
    if (this.emailForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = this.emailForm.value;

    // Si sendToAllUsers es true, `toEmails` debe ser un array vacío
    if (formData.sendToAllUsers) {
      formData.toEmails = [];
    } else {
      // Convierte la cadena de correos separados por comas en un array
      formData.toEmails = formData.toEmails.split(',').map((email: string) => email.trim());
    }
    
    this.emailService.sendCustomEmail(formData).subscribe({
      // Captura el valor de la respuesta (response)
      next: (response) => {
        // Asigna el texto de la respuesta directamente al mensaje de éxito
        this.successMessage = response; 
        this.loading = false;
        this.emailForm.reset({ sendToAllUsers: true, toEmails: '' });
      },
      error: (err) => {
        this.errorMessage = 'Error al enviar el correo.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}