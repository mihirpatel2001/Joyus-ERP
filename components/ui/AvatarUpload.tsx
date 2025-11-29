import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Camera, Upload, X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './Button';
import { Slider } from './Slider';
import getCroppedImg, { PixelCrop } from '../../utils/cropImage';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onSave: (base64Image: string) => void;
  name: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatarUrl, onSave, name }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsModalOpen(true);
      setZoom(1);
    }
  };

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result as string), false);
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: PixelCrop) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
      if (croppedImage) {
        onSave(croppedImage);
        setIsModalOpen(false);
        setImageSrc(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, onSave]);

  const handleClose = () => {
    setIsModalOpen(false);
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="relative inline-block group">
        <img 
          src={currentAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`} 
          alt="Profile" 
          className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-50 mx-auto shadow-md"
        />
        <button 
          onClick={triggerFileSelect}
          className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 group-hover:scale-110"
          title="Update Photo"
        >
          <Camera className="w-5 h-5" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={onFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {/* Crop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Edit Photo</h3>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cropper Container */}
            <div className="relative w-full h-[400px] bg-slate-900">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} // Square aspect ratio like Instagram
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  showGrid={true}
                />
              )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-white space-y-6">
              <div className="flex items-center gap-4">
                <ZoomOut className="w-5 h-5 text-slate-400" />
                <Slider 
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(val) => setZoom(val)}
                />
                <ZoomIn className="w-5 h-5 text-slate-400" />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={showCroppedImage}>
                  <Check className="w-4 h-4 mr-2" /> Save Photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};