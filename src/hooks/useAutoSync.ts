import { useEffect, useRef } from "react";
import { useProducts } from "./useProducts";

// Configuración de sincronización automática
const AUTO_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutos en milisegundos
const USER_INACTIVITY_THRESHOLD = 2 * 60 * 1000; // 2 minutos de inactividad

export function useAutoSync(enabled: boolean = true) {
  const { syncStatus, syncWithDB, loadFromDB } = useProducts();
  const lastActivityTimeRef = useRef<number>(Date.now());
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Actualizar el tiempo de última actividad cuando el usuario interactúa
  useEffect(() => {
    const updateLastActivity = () => {
      lastActivityTimeRef.current = Date.now();
    };

    // Escuchar eventos de actividad del usuario
    window.addEventListener("mousemove", updateLastActivity);
    window.addEventListener("keydown", updateLastActivity);
    window.addEventListener("click", updateLastActivity);
    window.addEventListener("scroll", updateLastActivity);
    window.addEventListener("touchstart", updateLastActivity);

    return () => {
      window.removeEventListener("mousemove", updateLastActivity);
      window.removeEventListener("keydown", updateLastActivity);
      window.removeEventListener("click", updateLastActivity);
      window.removeEventListener("scroll", updateLastActivity);
      window.removeEventListener("touchstart", updateLastActivity);
    };
  }, []);

  // Configurar sincronización automática
  useEffect(() => {
    if (!enabled) return;

    // Limpiar intervalo existente si hay uno
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    // Función para verificar si el usuario está inactivo
    const isUserInactive = () => {
      return Date.now() - lastActivityTimeRef.current > USER_INACTIVITY_THRESHOLD;
    };

    // Configurar nuevo intervalo de sincronización
    syncIntervalRef.current = setInterval(() => {
      // Solo sincronizar si el usuario está inactivo para no interrumpir su trabajo
      if (isUserInactive() && syncStatus !== "syncing") {
        // Cargar desde la base de datos en lugar de sincronizar para evitar sobreescribir cambios locales
        loadFromDB();
      }
    }, AUTO_SYNC_INTERVAL);

    // Función de limpieza
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [enabled, syncStatus, loadFromDB]);

  // Sincronizar cuando la página obtiene el foco (el usuario vuelve a la pestaña)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && enabled && syncStatus !== "syncing") {
        // Si el usuario vuelve a la página, sincronizar para tener los datos más recientes
        loadFromDB();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, syncStatus, loadFromDB]);

  // Sincronizar cuando la conexión se restablece
  useEffect(() => {
    const handleOnline = () => {
      if (enabled && syncStatus !== "syncing") {
        // Cuando se restaura la conexión, sincronizar para asegurar consistencia
        syncWithDB();
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [enabled, syncStatus, syncWithDB]);
}
