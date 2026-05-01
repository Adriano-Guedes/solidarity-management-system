// src/utils/dateFormat.ts

/**
 * Formata uma data ISO (string) para o padrão brasileiro (dd/MM/yyyy).
 * Se a data for inválida, retorna '-'.
 */
export function formatDateBR(dateStr?: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-BR");
}

/**
 * Formata uma data ISO (string) para o padrão brasileiro com hora (dd/MM/yyyy HH:mm).
 * Se a data for inválida, retorna '-'.
 */

export function formatDateTimeBR(dateStr?: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return (
    date.toLocaleDateString("pt-BR") +
    " " +
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

/**
 * Calcula a idade com base na data de nascimento.
 * Retorna a idade em anos ou '-' se a data for inválida ou não fornecida.
 */

export function calculateAge(birthDateStr?: string): string {
  if (!birthDateStr) return "-";
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return "-";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return `${age} anos`;
}
