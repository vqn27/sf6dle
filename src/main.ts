import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
// If you needed global routing: import { provideRouter } from '@angular/router';

bootstrapApplication(App, {
  providers: [
    // This is where you would configure global services like HTTP client or Router
    provideHttpClient(),
    // ... other global providers
  ]
}).catch((err) => console.error(err));