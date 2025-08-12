// src/app/models/user-selection.model.ts

// Modelo para enviar una nueva selección de menú por parte del usuario
export interface UserSelectionRequest {
  userId: number;   // Asume que el backend requiere el ID del usuario
  // CAMBIO CLAVE: Ahora se envía dailyMenuId en lugar de menuId
  dailyMenuId: number; // El ID del DailyMenu al que pertenece la selección

  // La fecha se deduce del DailyMenuId en el backend,
  // pero si tu backend aún la espera, la mantendríamos.
  // Basado en UserMenuSelection, no veo 'Date' como campo directo para el POST,
  // sino que viene via DailyMenuId. Si el backend aún la pide, la añadiríamos.
  // Por ahora, la quitamos si no es explícitamente un campo de UserMenuSelection en C#.
  // date: string; // <-- Comentada/Eliminada si no la necesita el backend directamente en UserSelection

  // ¡NUEVO CAMPO! La fecha y hora de la selección
  selectionDateTime: string; // Se enviará como ISO string (ej. '2025-06-21T09:30:00Z')

  // Propiedades existentes (confirmadas)
  observation: string;     // Coincide, y es 'string'
  selectedCategory: string; // Coincide, y se enviará el nombre del enum como 'string'
}

// Modelo para la respuesta del backend después de una selección (opcional)
// Modelo para la respuesta del backend (sin cambios si ya funcionaba)
export interface UserSelectionResponse {
  id: number;
  userId: number;
  dailyMenuId: number;
  selectionDateTime: string;
  // Otros campos que tu backend devuelva
  // ¡Añade estas nuevas propiedades requeridas por el backend!
  observation: string; // O el tipo de dato que corresponda en C# (probablemente string)
  selectedCategory: string; // Puede ser string o el nombre del enum
  isActive: boolean; // Ej. "Confirmado", "Cancelado"
    // Puede que el backend devuelva también nombres de usuario y menú si los mapea
  menuName?: string;
  userName?: string;  
}