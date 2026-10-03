export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 animate-pulse">
            <path d="M12 14c-1.65 0-3-1.35-3-3V5c0-1.65 1.35-3 3-3s3 1.35 3 3v6c0 1.65-1.35 3-3 3Z" />
            <path d="M19 14v-4a7 7 0 0 0-14 0v4" />
            <path d="M12 19c-5 0-8-2-9-5.5m18 0c-1 3.5-4 5.5-9 5.5Z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500">Loading Dental Manager...</p>
      </div>
    </div>
  );
}
