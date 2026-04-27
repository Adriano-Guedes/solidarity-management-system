// src/utils/dateFormat.ts

/**
 * Formata uma data ISO (string) para o padrão brasileiro (dd/MM/yyyy).
 * Se a data for inválida, retorna '-'.
 */
export function formatDateBR(dateStr?: string): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR');
}

/**
 * Formata data e hora para o padrão brasileiro (dd/MM/yyyy HH:mm).
 */
export function formatDateTimeBR(dateStr?: string): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
