// src/app/models/menu.model.ts

// Enum para las categorías de menú
// export enum MenuCategory {
//   Clasica = 0,
//   Express = 1,
//   Veggie = 2,
//   Especial = 3
// }

// Interfaz para el modelo Menu
// Esta interfaz representa la estructura de tus clases 'Menu' y 'DailyMenuItem' en el backend,
// ya que comparten las mismas propiedades relevantes.
export interface Menu {
  id: number;
  name: string; // La propiedad 'name' que causaba el error
  category: string;
  dailyMenuId?: number | null; // Hacerlo opcional o null si no siempre está asociado
}

// Interfaz para el modelo DailyMenu
export interface DailyMenu {
  id: number;
  date: string; // Las fechas se suelen manejar como strings ISO en JSON
  items: Menu[]; // <-- ¡Asegurarnos de que sea un array de 'Menu'!
}