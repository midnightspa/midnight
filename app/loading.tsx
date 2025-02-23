export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">
        <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
        <div className="mt-4 h-8 w-64 bg-gray-200 rounded"></div>
        <div className="mt-2 h-4 w-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
} 