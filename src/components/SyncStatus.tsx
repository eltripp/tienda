import { SyncStatus } from "@/hooks/useProducts";
import { CheckCircle, AlertCircle, RefreshCw, Clock } from "lucide-react";

interface SyncStatusProps {
  status: SyncStatus;
  message: string;
  lastSyncTime?: Date | null;
  onSync?: () => void;
}

export function SyncStatusDisplay({ status, message, lastSyncTime, onSync }: SyncStatusProps) {
  const formatLastSync = (date: Date | null) => {
    if (!date) return "Nunca";

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Hace un momento";
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case SyncStatus.SUCCESS:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case SyncStatus.ERROR:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case SyncStatus.SYNCING:
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case SyncStatus.SUCCESS:
        return "text-green-700 bg-green-50 border-green-200";
      case SyncStatus.ERROR:
        return "text-red-700 bg-red-50 border-red-200";
      case SyncStatus.SYNCING:
        return "text-blue-700 bg-blue-50 border-blue-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="flex-1">{message}</span>
      {lastSyncTime && (
        <span className="text-xs opacity-75">
          Última sincronización: {formatLastSync(lastSyncTime)}
        </span>
      )}
      {status !== SyncStatus.SYNCING && onSync && (
        <button
          onClick={onSync}
          className="ml-2 p-1 rounded hover:bg-white/50 transition-colors"
          title="Forzar sincronización"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
