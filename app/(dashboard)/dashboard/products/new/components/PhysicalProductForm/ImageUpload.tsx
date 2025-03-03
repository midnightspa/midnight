'use client';

import React from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  thumbnailPreview: string | null;
  galleryPreviews: string[];
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveGalleryImage: (index: number) => void;
}

export default function ImageUpload({
  thumbnailPreview,
  galleryPreviews,
  onThumbnailChange,
  onGalleryChange,
  onRemoveGalleryImage,
}: ImageUploadProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Images</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
        <div className="mt-1 flex items-center space-x-4">
          {thumbnailPreview && (
            <div className="relative w-32 h-32">
              <Image
                src={thumbnailPreview}
                alt="Thumbnail preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span>Upload thumbnail</span>
            <input
              type="file"
              className="hidden"
              onChange={onThumbnailChange}
              accept="image/*"
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gallery</label>
        <div className="mt-1">
          <div className="flex flex-wrap gap-4">
            {galleryPreviews.map((preview, index) => (
              <div key={index} className="relative w-32 h-32">
                <Image
                  src={preview}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemoveGalleryImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <label className="cursor-pointer w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <input
                type="file"
                className="hidden"
                onChange={onGalleryChange}
                accept="image/*"
                multiple
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 