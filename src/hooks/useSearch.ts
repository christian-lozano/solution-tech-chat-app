'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchChats } from './useChat';
import { searchInText, normalizeSearchText, extractSearchSnippet } from '@/utils';
import { Chat, Message } from '@/types';
import { UI_CONFIG } from '@/lib/constants';

interface SearchResult {
  chat: Chat;
  matches: Array<{
    messageId: string;
    content: string;
    snippet: string;
    sender: 'user' | 'system';
    timestamp: Date;
  }>;
  score: number;
}

interface UseSearchOptions {
  debounceMs?: number;
  maxResults?: number;
  minQueryLength?: number;
}

/**
 * Hook para manejar búsqueda en chats con debouncing y filtrado local
 */
export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = UI_CONFIG.debounceDelay,
    maxResults = 20,
    minQueryLength = 2,
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced callback para actualizar la query
  const debouncedSetQuery = useDebouncedCallback(
    (value: string) => {
      setDebouncedQuery(value);
      setIsSearching(false);
    },
    debounceMs
  );

  // Actualizar query con debounce
  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setIsSearching(true);
    debouncedSetQuery(newQuery);
  }, [debouncedSetQuery]);

  // Query de React Query para búsqueda en servidor
  const {
    data: serverResults,
    isLoading: isServerLoading,
    error: serverError,
  } = useSearchChats(
    debouncedQuery,
    debouncedQuery.length >= minQueryLength
  );

  // Procesar resultados del servidor
  const processedResults = useMemo(() => {
    if (!serverResults?.results || debouncedQuery.length < minQueryLength) {
      return [];
    }

    return serverResults.results
      .map((result): SearchResult => {
        const matches = result.matches.map(match => ({
          messageId: match.messageId,
          content: match.content,
          snippet: extractSearchSnippet(match.content, debouncedQuery),
          sender: result.chat.messages.find(m => m.id === match.messageId)?.sender || 'user',
          timestamp: result.chat.messages.find(m => m.id === match.messageId)?.timestamp || new Date(),
        }));

        // Calcular score basado en número de coincidencias y relevancia
        const score = matches.length + (result.chat.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ? 2 : 0);

        return {
          chat: result.chat,
          matches,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }, [serverResults, debouncedQuery, minQueryLength, maxResults]);

  // Función para búsqueda local en una lista de chats
  const searchInChats = useCallback((chats: Chat[], searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim() || searchQuery.length < minQueryLength) {
      return [];
    }

    const normalizedQuery = normalizeSearchText(searchQuery);
    const results: SearchResult[] = [];

    chats.forEach(chat => {
      const matches: SearchResult['matches'] = [];
      let titleMatch = false;

      // Buscar en el título del chat
      if (searchInText(chat.title, searchQuery)) {
        titleMatch = true;
      }

      // Buscar en los mensajes
      chat.messages.forEach(message => {
        if (searchInText(message.content, searchQuery)) {
          matches.push({
            messageId: message.id,
            content: message.content,
            snippet: extractSearchSnippet(message.content, searchQuery),
            sender: message.sender,
            timestamp: message.timestamp,
          });
        }
      });

      // Si hay coincidencias, añadir a resultados
      if (matches.length > 0 || titleMatch) {
        const score = matches.length + (titleMatch ? 2 : 0);
        results.push({
          chat,
          matches,
          score,
        });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }, [minQueryLength, maxResults]);

  // Función para limpiar búsqueda
  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setIsSearching(false);
  }, []);

  // Función para resaltar texto en resultados
  const highlightText = useCallback((text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }, []);

  // Estado de carga combinado
  const isLoading = isSearching || isServerLoading;

  // Verificar si hay query activa
  const hasActiveSearch = debouncedQuery.length >= minQueryLength;

  // Estadísticas de búsqueda
  const searchStats = useMemo(() => {
    if (!hasActiveSearch) {
      return { totalResults: 0, totalMatches: 0 };
    }

    const totalResults = processedResults.length;
    const totalMatches = processedResults.reduce((sum, result) => sum + result.matches.length, 0);

    return { totalResults, totalMatches };
  }, [processedResults, hasActiveSearch]);

  return {
    // Estado de búsqueda
    query,
    debouncedQuery,
    isLoading,
    hasActiveSearch,
    
    // Resultados
    results: processedResults,
    error: serverError,
    stats: searchStats,
    
    // Acciones
    updateQuery,
    clearSearch,
    searchInChats,
    highlightText,
  };
}

/**
 * Hook simplificado para búsqueda rápida
 */
export function useQuickSearch(chats: Chat[]) {
  const [query, setQuery] = useState('');
  
  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) {
      return chats;
    }

    return chats.filter(chat => {
      // Buscar en título
      if (searchInText(chat.title, query)) {
        return true;
      }

      // Buscar en mensajes recientes (últimos 10)
      const recentMessages = chat.messages.slice(-10);
      return recentMessages.some(message => searchInText(message.content, query));
    });
  }, [chats, query]);

  return {
    query,
    setQuery,
    results,
    hasResults: results.length > 0,
    isEmpty: query.length >= 2 && results.length === 0,
  };
}