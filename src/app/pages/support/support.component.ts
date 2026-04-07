import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {

  redirectToPayment(): void {
    console.log('[SupportComponent] - redirectToPayment: Redirecting to payment');
    
    //TODO padronizar com o botão de pagamento
    const paymentLink = 'https://chat.whatsapp.com/FI1cUBEV1rM7cVl9pBHSKS';
    if (paymentLink) {
      window.open(paymentLink, '_blank');
    } else {
      alert('Link de pagamento não configurado. Por favor, contate o administrador.');
    }
  }
}
