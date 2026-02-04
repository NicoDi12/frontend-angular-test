import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'; // -> Esto funcionara cuando instales la libreria de sweelalert

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  // Configuraciones comunes de botones
  private customClassConfig = {
    // Botón principal de confirmación (amarillo/azul)
    confirmButton: 'bg-linear-to-b from-[#1e293b] to-[#111827] text-yellow-300 font-bold py-2 px-4 rounded-xl shadow-md',
    // Botón de cancelación (gris)
    cancelButton: 'px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-xl shadow-md hover:bg-gray-300 transition',
    // Otras clases para la estructura
    actions: 'flex gap-4 justify-center mt-4',
    title: 'text-lg font-semibold mb-2',
  };

  /**
   * Método privado genérico para encapsular la configuración base.
   * Se agrega 'allowOutsideClick: false' para prevenir el cierre al hacer clic fuera.
   */
  private fire(options: {
    title: string;
    text: string;
    icon: SweetAlertIcon;
    showCancelButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      ...options,
      allowOutsideClick: false,
      buttonsStyling: false,
      customClass: {
        confirmButton: this.customClassConfig.confirmButton,
        cancelButton: this.customClassConfig.cancelButton,
        actions: this.customClassConfig.actions,
        title: this.customClassConfig.title,
      }
    });
  }

  /**
   * Muestra un mensaje de éxito.
   */
  showSuccess(title: string, text: string): Promise<SweetAlertResult<any>> {
    return this.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  /**
   * Muestra un mensaje de error.
   */
  showError(title: string, text: string): Promise<SweetAlertResult<any>> {
    return this.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Cerrar'
    });
  }

  /**
   * Muestra un mensaje de advertencia o informativo.
   */
  showWarning(title: string, text: string): Promise<SweetAlertResult<any>> {
    return this.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'Ok'
    });
  }


  /**
   * Muestra un modal de confirmación con botones Sí/Cancelar.
   */
  confirmAction(
    title: string,
    text: string = 'Esta acción no se puede deshacer.'
  ): Promise<SweetAlertResult<any>> {
    return this.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });
  }


  /**
   * Muestra un modal de carga simple.
   * Nota: Este ya tenía 'allowOutsideClick: false'.
   */
  showLoading(title: string = 'Cargando...') {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Cierra cualquier modal de SweetAlert abierto.
   */
  close() {
    Swal.close();
  }
}
