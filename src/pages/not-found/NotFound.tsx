import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileQuestion, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'

export const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-md w-full">
        {/* Visual Icon with Pulse Animation */}
        <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-primary-200 rounded-full animate-ping opacity-20 duration-1000"></div>
          <div className="absolute inset-2 bg-primary-100 rounded-full flex items-center justify-center">
            <div className="bg-white p-4 rounded-full shadow-sm">
              <FileQuestion className="w-10 h-10 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-8xl font-bold text-primary-900 tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800">Page not found</h2>
          <p className="text-slate-500 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or you may have typed the URL incorrectly.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto shadow-lg shadow-primary-500/20"
          >
            <Home className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>

        {/* Footer Help */}
        <p className="text-xs text-slate-400 mt-8">
          Need help?{' '}
          <a href="#" className="text-primary-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}
