import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-passeios',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu-passeios.component.html',
  styleUrl: './menu-passeios.component.css'
})
export class MenuPasseiosComponent {
  //TODO: Refactor to use Excursion model instead of Passeio/Viagem
  //TODO: Update logic to handle both 'tour' and 'trip' types via Excursion.type

}
