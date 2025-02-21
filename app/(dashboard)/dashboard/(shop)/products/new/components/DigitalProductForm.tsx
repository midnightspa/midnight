'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProductBundle from './ProductBundle';
import { toast } from 'sonner';

interface Category {
  id: string;
  title: string;
}

interface Bundle {
  title: string;
  description: string;
  price: number;
  thumbnail: string | File | null;
  file?: File;
}

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

export default function DigitalProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [digitalFile, setDigitalFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<MediaFile | null>(null);
  const [gallery, setGallery] = useState<MediaFile[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/dashboard/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      setThumbnail({
        file,
        preview: URL.createObjectURL(file),
        type
      });
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' as const : 'video' as const
      }));
      setGallery([...gallery, ...newFiles]);
    }
  };

  const handleDigitalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDigitalFile(e.target.files[0]);
    }
  };

  const removeGalleryItem = (index: number) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    setGallery(newGallery);
  };

  const handleBundleAdd = (bundle: Bundle) => {
    setBundles([...bundles, bundle]);
  };

  const removeBundle = (index: number) => {
    setBundles(bundles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append('type', 'DIGITAL');
      
      if (digitalFile) {
        formData.append('digitalFile', digitalFile);
      }

      if (thumbnail) {
        formData.append('thumbnail', thumbnail.file);
      }

      gallery.forEach((item, index) => {
        formData.append(`gallery[${index}]`, item.file);
      });

      // Add bundles to form data with their files
      bundles.forEach((bundle, index) => {
        formData.append(`bundles[${index}][title]`, bundle.title);
        formData.append(`bundles[${index}][description]`, bundle.description);
        formData.append(`bundles[${index}][price]`, bundle.price.toString());
        if (bundle.thumbnail) {
          if (bundle.thumbnail instanceof File) {
            formData.append(`bundles[${index}][thumbnail]`, bundle.thumbnail);
          } else if (typeof bundle.thumbnail === 'string') {
            // If it's a URL string, create a new Blob and append it
            fetch(bundle.thumbnail)
              .then(res => res.blob())
              .then(blob => {
                formData.append(`bundles[${index}][thumbnail]`, blob, `bundle-${index}-thumbnail.jpg`);
              });
          }
        }
        if (bundle.file) {
          formData.append(`bundles[${index}][file]`, bundle.file);
        }
      });

      const response = await fetch('/api/dashboard/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      toast.success('Product created successfully');
      router.push('/dashboard/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      if (thumbnail) URL.revokeObjectURL(thumbnail.preview);
      gallery.forEach(item => URL.revokeObjectURL(item.preview));
    };
  }, [thumbnail, gallery]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="categoryId"
              id="categoryId"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Media</h2>
          
          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
            <div className="mt-1 flex items-center space-x-4">
              {thumbnail && (
                <div className="relative w-32 h-32">
                  {thumbnail.type === 'image' ? (
                    <Image
                      src={thumbnail.preview}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={thumbnail.preview}
                      className="w-full h-full rounded-lg object-cover"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setThumbnail(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span>Upload thumbnail</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleThumbnailChange}
                  accept="image/*,video/*"
                />
              </label>
            </div>
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gallery</label>
            <div className="mt-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {gallery.map((item, index) => (
                  <div key={index} className="relative aspect-square">
                    {item.type === 'image' ? (
                      <Image
                        src={item.preview}
                        alt={`Gallery item ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={item.preview}
                        className="w-full h-full rounded-lg object-cover"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add to gallery</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleGalleryChange}
                  accept="image/*,video/*"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Pricing</h2>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                step="0.01"
                className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Digital File */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Digital File</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload File
            </label>
            <input
              type="file"
              onChange={handleDigitalFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.mp3,.wav"
            />
            {digitalFile && (
              <p className="mt-2 text-sm text-gray-500">
                Selected file: {digitalFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Bundles */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Product Bundles</h2>
            <ProductBundle onBundleAdd={handleBundleAdd} products={[]} />
          </div>

          <div className="mt-4 space-y-4">
            {bundles.map((bundle, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {bundle.thumbnail && typeof bundle.thumbnail === 'string' && (
                    <div className="relative w-20 h-20">
                      <Image
                        src={bundle.thumbnail}
                        alt={bundle.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{bundle.title}</h3>
                    <p className="text-sm text-gray-500">{bundle.description}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      ${bundle.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeBundle(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </form>
  );
} 