/**
 * Trunca un texto a una longitud específica
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Genera un título para el chat basado en el primer mensaje
 */
export function generateChatTitle(
  firstMessage: string,
  maxLength: number = 50
): string {
  // Limpiar el mensaje de espacios extra y saltos de línea
  const cleanMessage = firstMessage.trim().replace(/\s+/g, " ");

  // Si el mensaje es corto, usarlo completo
  if (cleanMessage.length <= maxLength) {
    return cleanMessage;
  }

  // Truncar en la última palabra completa que quepa
  const truncated = cleanMessage.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > maxLength * 0.7) {
    return truncated.slice(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
}

/**
 * Resalta texto que coincide con una búsqueda
 */
export function highlightSearchText(text: string, searchQuery: string): string {
  if (!searchQuery.trim()) return text;

  const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

/**
 * Escapa caracteres especiales para usar en regex
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Convierte texto a formato de búsqueda (minúsculas, sin acentos)
 */
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remover acentos
}

/**
 * Busca coincidencias en un texto
 */
export function searchInText(text: string, query: string): boolean {
  if (!query.trim()) return true;

  const normalizedText = normalizeSearchText(text);
  const normalizedQuery = normalizeSearchText(query);

  return normalizedText.includes(normalizedQuery);
}

/**
 * Extrae un snippet de texto alrededor de una coincidencia
 */
export function extractSearchSnippet(
  text: string,
  query: string,
  maxLength: number = 150
): string {
  if (!query.trim()) return truncateText(text, maxLength);

  const normalizedText = normalizeSearchText(text);
  const normalizedQuery = normalizeSearchText(query);
  const matchIndex = normalizedText.indexOf(normalizedQuery);

  if (matchIndex === -1) return truncateText(text, maxLength);

  // Calcular posición de inicio del snippet
  const halfLength = Math.floor(maxLength / 2);
  const start = Math.max(0, matchIndex - halfLength);
  const end = Math.min(text.length, start + maxLength);

  let snippet = text.slice(start, end);

  // Añadir puntos suspensivos si es necesario
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  return snippet;
}

/**
 * Sanitiza texto para prevenir XSS
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Convierte saltos de línea a elementos <br>
 */
export function textToHtml(text: string): string {
  return sanitizeText(text).replace(/\n/g, "<br>");
}

/**
 * Genera un ID único basado en texto
 */
export function generateIdFromText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}
