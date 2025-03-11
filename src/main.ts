import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
 
// Definir global para evitar errores en el navegador
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
};
 
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));