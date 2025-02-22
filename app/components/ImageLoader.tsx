'use client';

import Image from 'next/image';
import { shimmer, toBase64 } from '@/app/utils/imageUtils';

interface ImageLoaderProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export default function ImageLoader({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '100vw',
  className = '',
  priority = false,
}: ImageLoaderProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      className={className}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      priority={priority}
    />
  );
} 