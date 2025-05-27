import React, { useEffect, useRef, useState } from 'react';
import { PhotoEditor } from './PhotoEditor';
import { useImageOptimization } from '../hooks/useImageOptimization';
import type { PhotoCapture } from '../types';

interface CameraCaptureProps {
  onCapture: (photo: PhotoCapture) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { optimizeImage, isProcessing } = useImageOptimization();

  // Debug log for state changes
  useEffect(() => {
    console.log('State changed:', {
      isPreview,
      isEditing,
      hasCapturedImage: !!capturedImage,
      error
    });
  }, [isPreview, isEditing, capturedImage, error]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isFrontCamera]);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraReady(false);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !isCameraReady) return;

    try {
      setError(null);
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Flip horizontally if using front camera
      if (isFrontCamera) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // Optimize the captured image
      const optimizedDataUrl = await optimizeImage(dataUrl, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'image/webp'
      });

      console.log('Image captured successfully');
      setCapturedImage(optimizedDataUrl);
      setIsPreview(true);
      stopCamera();
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo. Please try again.');
    }
  };

  const handleRetake = () => {
    console.log('Retaking photo');
    setCapturedImage(null);
    setIsPreview(false);
    setError(null);
    startCamera();
  };

  const handleEdit = () => {
    console.log('Edit button clicked');
    console.log('Current state:', {
      isPreview,
      isEditing,
      hasCapturedImage: !!capturedImage
    });
    if (capturedImage) {
      console.log('Setting isEditing to true');
      setIsEditing(true);
      setIsPreview(false);
    }
  };

  const handleSaveEdit = async (editedImageUrl: string) => {
    try {
      console.log('Saving edited image');
      setError(null);
      // Optimize the edited image
      const optimizedDataUrl = await optimizeImage(editedImageUrl, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'image/webp'
      });

      setCapturedImage(optimizedDataUrl);
      setIsEditing(false);
      setIsPreview(true);
      console.log('Edit saved successfully');
    } catch (err) {
      console.error('Error saving edit:', err);
      setError('Failed to save edits. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    console.log('Canceling edit');
    setIsEditing(false);
    setIsPreview(true);
  };

  const handleAccept = () => {
    console.log('Accepting photo');
    if (capturedImage) {
      onCapture({ dataUrl: capturedImage });
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  console.log('Render state:', { isEditing, capturedImage, isPreview });

  // First, check if we're in editing mode
  if (isEditing) {
    console.log('Rendering PhotoEditor');
    // If we don't have a captured image, use a test image
    const imageToEdit = capturedImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    return (
      <PhotoEditor
        imageUrl={imageToEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  // Then check for errors
  if (error) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-600 text-white py-2 rounded-lg"
            >
              Close
            </button>
            <button
              onClick={startCamera}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Finally, render the main UI
  const renderPreview = () => {
    console.log('Rendering preview mode');
    return (
      <>
        <div className="flex-1 relative">
          <img
            src={capturedImage || ''}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white">Processing image...</div>
            </div>
          )}
        </div>
        <div className="p-4 bg-black/50 flex justify-between">
          <button
            onClick={handleRetake}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg"
            disabled={isProcessing}
          >
            Retake
          </button>
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            disabled={isProcessing}
          >
            Edit
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-green-600 text-white rounded-lg"
            disabled={isProcessing}
          >
            Accept
          </button>
        </div>
      </>
    );
  };

  const renderCamera = () => {
    console.log('Rendering camera mode');
    return (
      <>
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${
              isFrontCamera ? 'scale-x-[-1]' : ''
            }`}
          />
        </div>
        <div className="p-4 bg-black/50 flex justify-between">
          <button
            onClick={onCancel}
            className="p-4 text-white/80 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleCapture}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
            disabled={!isCameraReady || isProcessing}
          >
            <div className="w-12 h-12 rounded-full bg-white" />
          </button>
          <button
            onClick={toggleCamera}
            className="p-4 text-white/80 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {isPreview ? renderPreview() : renderCamera()}
    </div>
  );
}; 