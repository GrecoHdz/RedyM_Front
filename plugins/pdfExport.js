// Importar solo en el cliente
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  // Solo ejecutar en el cliente
  if (process.client) {
    // Cargar jspdf y autotable dinámicamente
    return {
      provide: {
        pdf: {
          create: async () => {
            const { jsPDF } = await import('jspdf');
            await import('jspdf-autotable');
            return new jsPDF();
          }
        }
      }
    };
  }
});
