export interface FormModalState {
    // Estado del modal (si está visible o no)
    showModal: boolean;
  
    // Lista de entradas del formulario (almacena los datos de la tabla)
    formEntries: { id: number; question: string; type: string }[];
  
    // Identificador del siguiente formulario
    nextId: number;
  
    // Título del formulario
    formTitle: string;
  }
  