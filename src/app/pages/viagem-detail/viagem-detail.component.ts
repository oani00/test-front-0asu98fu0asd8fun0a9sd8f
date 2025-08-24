import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Excursion } from '../../models/excursion';
import { CommonModule } from '@angular/common';
import { ExcursionService } from '../../services/excursion.service';


@Component({
  selector: 'app-viagem-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viagem-detail.component.html',
  styleUrl: './viagem-detail.component.css'
})
export class ViagemDetailComponent implements OnInit {
  viagem: Excursion | undefined;

  constructor(private route: ActivatedRoute
    , 
    private excursionService: 
    ExcursionService 
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.excursionService.getExcursionById(id).subscribe(data => {
        this.viagem = data;
      });
    } 
  }
}
