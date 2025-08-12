import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login'
import { RegisterComponent } from './auth/register/register'
import { DashboardComponent } from './dashboard/dashboard'; // <-- Importa el DashboardComponent
import { authGuard } from './auth/auth-guard'; // <-- Importa tu authGuard
import { MenuListComponent } from './features/menu-management/menu-list/menu-list.component'; // <-- Importa el MenuListComponent
import { MenuFormComponent } from './features/menu-management/menu-form/menu-form.component'; // ¡Importa este!
import { MenuUploadComponent } from './features/menu-management/menu-upload/menu-upload.component'; // ¡Importa este!
//import { roleGuard } from './auth/role.guard'; // ¡Vamos a necesitar este nuevo guard!
import { UserMenuSelectionComponent } from './features/user-selection/user-menu-selection/user-menu-selection.component'; // ¡Importa este!
import { UserSelectionsSummaryComponent } from './features/user-selection/user-selections-summary/user-selections-summary.component'; // Importa el nuevo componente de resumen de selecciones
import { ReportsComponent } from './features/reports/reports.component'; // Importa el nuevo componente de reportes

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'menus', // Ruta para el listado de menús
  //   component: MenuListComponent,
  //   canActivate: [authGuard] // Protege también esta ruta
  // },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },// <-- ¡AÑADE ESTA LÍNEA para proteger la ruta! // <-- Añade la ruta del dashboard
  { path: 'menus', // <-- Esta es la URL a la que debes navegar
    component: MenuListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'menus/add', // Ruta para agregar un nuevo menú
    component: MenuFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'menus/edit/:id', // Ruta para editar un menú existente (con ID en la URL)
    component: MenuFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'menus/upload', // Nueva ruta para subir archivos
    component: MenuUploadComponent,
    canActivate: [authGuard], // Protegida por auth y por rol (admin)
    //data: { roles: ['Admin'] } // Datos para el roleGuard: solo 'Admin'
  },
  {
    path: 'select-menu', // Nueva ruta para que los usuarios hagan su selección
    component: UserMenuSelectionComponent,
    canActivate: [authGuard] // Todos los usuarios autenticados pueden seleccionar
  },
  // --- ¡AÑADE ESTA NUEVA RUTA! ---
  { path: 'user-selections-summary', component: UserSelectionsSummaryComponent, canActivate: [authGuard] }, // Ruta para ver las selecciones de usuario
  // --- ¡AÑADE ESTA NUEVA RUTA! ---
  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] }, // Nueva ruta para ver reportes, protegida por authGuard
  // --- FIN DE NUEVA RUTA ---
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Cambia esto para redirigir al dashboard por defecto
  { path: '**', redirectTo: '/dashboard' } // Manejo de rutas no encontradas
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', redirectTo: '/login' }
  // He cambiado la redirección por defecto de /login a /dashboard. Si no estás logueado, el authGuard te redirigirá a /login de todas formas, pero si sí lo estás, irás directamente al dashboard.
];
