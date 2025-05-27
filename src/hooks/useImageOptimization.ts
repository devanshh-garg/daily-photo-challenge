import { useState } from 'react';

interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: string;
}

export const useImageOptimization = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const optimizeImage = async (
    dataUrl: string,
    options: OptimizationOptions = {}
  ): Promise<string> => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'image/webp'
    } = options;

    setIsProcessing(true);

    try {
      // Create an image to load the data URL
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      // Create a canvas for the resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      // Draw and resize the image
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP if supported, otherwise fall back to JPEG
      let outputFormat = format;
      if (format === 'image/webp' && !canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
        outputFormat = 'image/jpeg';
      }

      // Get the optimized data URL
      const optimizedDataUrl = canvas.toDataURL(outputFormat, quality);

      return optimizedDataUrl;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    optimizeImage,
    isProcessing
  };
};

// Helper function to check WebP support
const isWebPSupported = (): boolean => {
  const canvas = document.createElement('canvas');
  if (!canvas.getContext) return false;
  
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
}; 