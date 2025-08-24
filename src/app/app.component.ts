import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'teste-deploy';
  dogJson: string = '';

  constructor(private http: HttpClient) {
    this.fetchDogJson();
  }

  fetchDogJson() {
    this.http.get('https://dog.ceo/api/breeds/image/random').subscribe(
      (data) => {
        this.dogJson = JSON.stringify(data, null, 2);
      },
      (error) => {
        this.dogJson = 'Error fetching data';
      }
    );
  }
}
