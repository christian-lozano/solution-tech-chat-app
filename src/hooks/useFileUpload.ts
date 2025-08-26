'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@/lib/api';
import { validateFileRequirements, getFileType, formatFileSize } from '@/utils';
import { AttachedFile } from '@/types';

interface FileUploadState {
  files: File[];
  previews: Array<{
    file: File;
    url: string;
    type: 'image' | 'video' | 'document';
  }>;
  errors: string[];
  isUploading: boolean;
}

interface UseFileUploadOptions {
  maxFiles?: number;
  onUploadSuccess?: (file: AttachedFile) => void;
  onUploadError?: (error: string) => void;
}

/**
 * Hook para manejar la subida y gestión de archivos
 */
export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { maxFiles = 5, onUploadSuccess, onUploadError } = options;

  const [state, setState] = useState<FileUploadState>({
    files: [],
    previews: [],
    errors: [],
    isUploading: false,
  });

  // Mutation para subir archivos
  const uploadMutation = useMutation({
    mutationFn: ({ file, chatId }: { file: File; chatId: string }) => 
      uploadFile(file, chatId),
    onSuccess: (data) => {
      onUploadSuccess?.(data.file);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Error subiendo archivo';
      onUploadError?.(errorMessage);
      addError(errorMessage);
    },
  });

  // Función para añadir errores
  const addError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      errors: [...prev.errors, error],
    }));
  }, []);

  // Función para limpiar errores
  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: [],
    }));
  }, []);

  // Función para validar y añadir archivos
  const addFiles = useCallback((newFiles: FileList | File[]) => {
    clearErrors();
    
    const filesArray = Array.from(newFiles);
    const validFiles: File[] = [];
    const newPreviews: Array<{
      file: File;
      url: string;
      type: 'image' | 'video' | 'document';
    }> = [];

    // Verificar límite de archivos
    if (state.files.length + filesArray.length > maxFiles) {
      addError(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }

    // Validar cada archivo
    filesArray.forEach(file => {
      const validation = validateFileRequirements(file);
      
      if (!validation.isValid) {
        addError(`${file.name}: ${validation.error}`);
        return;
      }

      try {
        const fileType = getFileType(file.type);
        validFiles.push(file);

        // Crear preview para imágenes
        if (fileType === 'image') {
          const url = URL.createObjectURL(file);
          newPreviews.push({ file, url, type: fileType });
        } else {
          newPreviews.push({ 
            file, 
            url: '', 
            type: fileType 
          });
        }
      } catch (error) {
        addError(`${file.name}: Tipo de archivo no soportado`);
      }
    });

    // Actualizar estado con archivos válidos
    if (validFiles.length > 0) {
      setState(prev => ({
        ...prev,
        files: [...prev.files, ...validFiles],
        previews: [...prev.previews, ...newPreviews],
      }));
    }
  }, [state.files.length, maxFiles, addError, clearErrors]);

  // Función para remover archivo
  const removeFile = useCallback((fileToRemove: File) => {
    setState(prev => {
      // Liberar URL de preview si existe
      const preview = prev.previews.find(p => p.file === fileToRemove);
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }

      return {
        ...prev,
        files: prev.files.filter(file => file !== fileToRemove),
        previews: prev.previews.filter(p => p.file !== fileToRemove),
      };
    });
  }, []);

  // Función para limpiar todos los archivos
  const clearFiles = useCallback(() => {
    // Liberar todas las URLs de preview
    state.previews.forEach(preview => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    });

    setState({
      files: [],
      previews: [],
      errors: [],
      isUploading: false,
    });
  }, [state.previews]);

  // Función para subir archivos
  const uploadFiles = useCallback(async (chatId: string) => {
    if (state.files.length === 0) return [];

    setState(prev => ({ ...prev, isUploading: true }));
    
    try {
      const uploadPromises = state.files.map(file => 
        uploadMutation.mutateAsync({ file, chatId })
      );
      
      const results = await Promise.all(uploadPromises);
      
      // Limpiar archivos después de subir exitosamente
      clearFiles();
      
      return results.map(result => result.file);
    } catch (error) {
      console.error('Error subiendo archivos:', error);
      return [];
    } finally {
      setState(prev => ({ ...prev, isUploading: false }));
    }
  }, [state.files, uploadMutation, clearFiles]);

  // Función para obtener información de archivos
  const getFilesInfo = useCallback(() => {
    const totalSize = state.files.reduce((sum, file) => sum + file.size, 0);
    const fileTypes = state.files.map(file => getFileType(file.type));
    
    return {
      count: state.files.length,
      totalSize,
      totalSizeFormatted: formatFileSize(totalSize),
      types: [...new Set(fileTypes)],
    };
  }, [state.files]);

  // Limpiar URLs al desmontar
  useState(() => {
    return () => {
      state.previews.forEach(preview => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  });

  return {
    files: state.files,
    previews: state.previews,
    errors: state.errors,
    isUploading: state.isUploading || uploadMutation.isPending,
    addFiles,
    removeFile,
    clearFiles,
    clearErrors,
    uploadFiles,
    getFilesInfo,
  };
}