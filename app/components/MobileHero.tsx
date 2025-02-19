import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  thumbnail: string | null;
  slug: string;
  category?: {
    title: string;
  };
}

interface MobileHeroProps {
  posts: Post[];
}

const MobileHero: React.FC<MobileHeroProps> = ({ posts }) => {
  return (
    <div className="block lg:hidden relative h-full px-4 pt-8 pb-12">
      <div className="relative z-10 text-center">
        {/* Animated Circles */}
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-neutral-900 rounded-full opacity-5 animate-pulse"></div>
          <div className="absolute inset-2 bg-neutral-900 rounded-full opacity-5 animate-pulse delay-75"></div>
          <div className="absolute inset-4 bg-neutral-900 rounded-full opacity-5 animate-pulse delay-150"></div>
        </div>

        {/* Hero Content */}
        <h1 className="text-4xl font-bold text-neutral-900 mb-4 leading-tight">
          Dream Beyond <br/><span className="text-neutral-700">Limits</span>
        </h1>
        <p className="text-lg text-neutral-600 mb-8 leading-relaxed max-w-md mx-auto">
          Discover tips, insights, and practices to reclaim your nights and embrace tranquility.
        </p>

        {/* Mobile Posts Carousel */}
        <div className="relative w-full h-48 mb-8 overflow-hidden">
          <div className="absolute inset-0 flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {posts.map((post, index) => (
              <Link 
                key={`${post.id}-${index}`}
                href={`/posts/${post.slug}`}
                className="relative flex-none w-[280px] h-full snap-center first:pl-4 last:pr-4"
              >
                <div className="h-full bg-white rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-95 active:scale-90">
                  <div className="relative h-32">
                    <Image
                      src={post.thumbnail || '/placeholder.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciPjxzdG9wIHN0b3AtY29sb3I9IiNmNmY3ZjgiIG9mZnNldD0iMjAlIiAvPjxzdG9wIHN0b3AtY29sb3I9IiNlZGVlZjEiIG9mZnNldD0iNTAlIiAvPjxzdG9wIHN0b3AtY29sb3I9IiNmNmY3ZjgiIG9mZnNldD0iNzAlIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSIjZjZmN2Y4IiAvPjxyZWN0IGlkPSJyIiB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0idXJsKCNnKSIgLz48YW5pbWF0ZSB4bGluazpocmVmPSIjciIgYXR0cmlidXRlTmFtZT0ieCIgZnJvbT0iLTcwMCIgdG89IjcwMCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiICAvPjwvc3ZnPg=="
                    />
                    {post.category && (
                      <span className="absolute top-2 left-2 px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 text-xs font-medium rounded-full">
                        {post.category.title}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex flex-col gap-4 px-4">
          <Link
            href="/categories"
            className="w-full py-4 bg-neutral-900 text-white rounded-xl font-medium text-center hover:bg-neutral-800 active:scale-95 transform transition shadow-lg"
          >
            Explore Categories
          </Link>
          <Link
            href="/videos"
            className="w-full py-4 bg-white text-neutral-900 rounded-xl font-medium text-center hover:bg-neutral-50 active:scale-95 transform transition shadow-lg border border-neutral-200"
          >
            Watch Videos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileHero;