import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
})
export class AuthHeaderComponent {
  @Input() title: string = 'Bienvenido de nuevo';

  @Input() subtitle: string = 'Inicia sesión en tu cuenta';

  @Input() showLogo: boolean = true;

  @Input() logoPath: string = 'assets/logos/logo-jadar.png';
}
