/**
 * CartBoost Loader
 * Script principal de carga e inicialización de CartBoost para Tiendanube.
 *
 * Este script se ejecuta en el navegador del comercio y expone el objeto global
 * `window.CartBoost` para controlar la inicialización de la aplicación.
 *
 * @version 1.0.0
 * @author CartBoost Team
 * @license Proprietary
 */

(function (global) {
  'use strict';

  // Evitar múltiples inicializaciones
  if (global.CartBoost) {
    return;
  }

  /**
   * Objeto global de CartBoost.
   */
  const CartBoost = {
    /**
     * Versión del loader.
     */
    version: '1.0.0',

    /**
     * Estado de inicialización.
     * @private
     */
    _initialized: false,

    /**
     * Inicializa CartBoost.
     *
     * @param {Object} config Configuración de inicialización.
     * @returns {Object} Instancia de CartBoost.
     */
    init(config) {
      if (this._initialized) {
        return this;
      }

      if (!config || typeof config !== 'object') {
        throw new Error('[CartBoost] Configuración inválida.');
      }

      this._initialized = true;

      return this;
    },

    /**
     * Indica si CartBoost ya fue inicializado.
     *
     * @returns {boolean}
     */
    isInitialized() {
      return this._initialized;
    }
  };

  // Exponer objeto global protegido
  global.CartBoost = Object.freeze(CartBoost);

  // Esperar a que el DOM esté listo
  function onDOMReady() {
    // Punto de entrada para futuras versiones.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMReady, {
      once: true
    });
  } else {
    onDOMReady();
  }

})(window);
