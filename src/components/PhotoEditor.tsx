import React, { useEffect, useRef, useState } from 'react';

interface PhotoEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

interface FilterOption {
  name: string;
  filter: string;
}

const FILTERS: FilterOption[] = [
  { name: 'Normal', filter: 'none' },
  { name: 'Grayscale', filter: 'grayscale(100%)' },
  { name: 'Sepia', filter: 'sepia(100%)' },
  { name: 'High Contrast', filter: 'contrast(150%)' },
  { name: 'Bright', filter: 'brightness(130%)' },
  { name: 'Vintage', filter: 'sepia(50%) brightness(95%) contrast(110%)' },
  { name: 'Cool', filter: 'saturate(120%) hue-rotate(20deg)' },
  { name: 'Warm', filter: 'saturate(120%) hue-rotate(-20deg)' },
];

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  imageUrl,
  onSave,
  onCancel,
}) => {
  console.log('PhotoEditor mounted with imageUrl:', imageUrl.substring(0, 50) + '...');
  
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(FILTERS[0]);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Create and load the image
    const img = new Image();
    imageRef.current = img;
    
    img.onload = () => {
      console.log('Image loaded successfully');
      setIsLoading(false);
      setError(null);
      applyEdits();
    };

    img.onerror = () => {
      console.error('Failed to load image');
      setIsLoading(false);
      setError('Failed to load image');
    };

    img.src = imageUrl;

    return () => {
      // Clean up
      if (imageRef.current) {
        imageRef.current.onload = null;
        imageRef.current.onerror = null;
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    // Apply edits whenever filters or adjustments change
    if (!isLoading && !error) {
      console.log('Applying edits with:', {
        filter: selectedFilter.name,
        brightness,
        contrast,
        saturation
      });
      applyEdits();
    }
  }, [selectedFilter, brightness, contrast, saturation]);

  const applyEdits = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) {
      console.error('Canvas or image ref not available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    try {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear previous content
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply filter and adjustments
      ctx.filter = `${selectedFilter.filter} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);
      setError(null);
      console.log('Edits applied successfully');
    } catch (err) {
      console.error('Error in applyEdits:', err);
      setError('Error applying edits');
    }
  };

  const handleSave = () => {
    console.log('Save button clicked');
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref not available');
      return;
    }

    try {
      // Compress the image before saving
      const editedImageUrl = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Image saved successfully');
      onSave(editedImageUrl);
    } catch (err) {
      console.error('Error in handleSave:', err);
      setError('Failed to save edited image');
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/50 p-4 flex items-center justify-between">
        <h2 className="text-white font-medium">Edit Photo</h2>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-white/80 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!!error || isLoading}
          >
            Save
          </button>
        </div>
      </div>

      {/* Image Preview */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-white">Loading image...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Controls */}
      <div className="bg-black/50 p-4 space-y-4">
        {/* Filters */}
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {FILTERS.map(filter => (
              <button
                key={filter.name}
                onClick={() => {
                  console.log('Filter selected:', filter.name);
                  setSelectedFilter(filter);
                }}
                className={`p-2 rounded-lg ${
                  selectedFilter.name === filter.name
                    ? 'bg-blue-600 text-white'
                    : 'text-white/80 hover:text-white'
                }`}
                disabled={!!error || isLoading}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Adjustments */}
        <div className="space-y-4">
          <div>
            <label className="text-white/80 text-sm block mb-2">
              Brightness: {brightness}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={e => setBrightness(Number(e.target.value))}
              className="w-full"
              disabled={!!error || isLoading}
            />
          </div>
          <div>
            <label className="text-white/80 text-sm block mb-2">
              Contrast: {contrast}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={e => setContrast(Number(e.target.value))}
              className="w-full"
              disabled={!!error || isLoading}
            />
          </div>
          <div>
            <label className="text-white/80 text-sm block mb-2">
              Saturation: {saturation}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={e => setSaturation(Number(e.target.value))}
              className="w-full"
              disabled={!!error || isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 