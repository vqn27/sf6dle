import { Component } from '@angular/core';
import { Search } from './search/search'; 

@Component({
  selector: 'app-root',
  standalone: true, // The App component is also standalone
  imports: [Search], 
  template: `
    <main>
      <!-- The main searchable dropdown component -->
      <app-search></app-search>
    </main>
  `,
  styles: [`
    main { 
      padding: 20px; 
      font-family: 'Inter', sans-serif;
      background-color: #f0f2f5;
      min-height: 100vh;
    }
  `]
})
export class App {}
