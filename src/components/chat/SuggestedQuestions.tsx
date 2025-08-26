'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SuggestedQuestionsProps {
  onQuestionSelect: (question: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

// Preguntas simplificadas para prueba
const SIMPLE_QUESTIONS: readonly string[] = [
  '¿Cuál es la misión de SOLUTION TECH?',
  '¿Cómo puedo mejorar mi estrategia de marketing digital?',
  '¿Qué tecnologías recomiendan para mi empresa?',
  '¿Cómo puedo optimizar la gestión de mi equipo?',
  '¿Cuáles son las mejores prácticas de ciberseguridad?',
  '¿Cómo puedo implementar la transformación digital?',
];

export function SuggestedQuestions({ onQuestionSelect, disabled = false, compact = false }: SuggestedQuestionsProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleQuestionClick = (question: string) => {
    if (!disabled) {
      onQuestionSelect(question);
    }
  };

  // Versión compacta para móvil
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-900">
            💡 Preguntas rápidas
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SIMPLE_QUESTIONS.slice(0, 4).map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-auto p-2 text-left justify-start hover:bg-primary/5"
              onClick={() => handleQuestionClick(question)}
              disabled={disabled}
            >
              <span className="line-clamp-2">{question}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Versión simplificada para desktop
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-base font-semibold   mb-1">
          💡 Preguntas Sugeridas
        </h3>
        <p className="text-xs text-gray-600">
          Selecciona una pregunta para comenzar
        </p>
      </div>

      <div className="space-y-2">
        {SIMPLE_QUESTIONS.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="w-full justify-start text-left h-auto p-3 text-sm hover:bg-primary/5 border border-gray-200"
            onClick={() => handleQuestionClick(question)}
            disabled={disabled}
          >
            <span className="line-clamp-2">{question}</span>
          </Button>
        ))}
      </div>

      <div className="text-center pt-2">
        <Badge variant="outline" className="text-xs">
          💡 Escribe tu propia pregunta
        </Badge>
      </div>
    </div>
  );
}
