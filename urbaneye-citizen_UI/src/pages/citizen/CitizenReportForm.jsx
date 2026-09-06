import React, { useState } from 'react';
import { Camera, Video, MapPin, Clock, AlignLeft, Send, Loader2, AlertTriangle } from 'lucide-react';
import FileUploadCard from '../../components/FileUploadCard';
import MetadataField from '../../components/MetadataField';
import SuccessCard from '../../components/SuccessCard';

export default function CitizenReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [description, setDescription] = useState('');

  const autoLocation = "College Road, Kolkata";
  const autoTime = "30 Aug 2026, 12:11 PM";

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('analyzing');

    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 flex items-start justify-center font-sans">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-slate-800 border-b border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-amber-500"/>
            Report a Civic Issue
          </h2>
          <p className="text-slate-400 mt-2">
            Upload evidence and let URBANEYE's AI verify and route your report instantly.
          </p>
        </div>

        <div className="p-6 md:p-8">
          {submitStatus === 'success' ? (
            <SuccessCard onReset={() => { setSubmitStatus('idle'); setDescription(''); }} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <FileUploadCard colorClass="text-blue-400" icon={Camera} subtitle="JPEG, PNG up to 10MB" title="Evidence Photos (1-3 required)"/>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-blue-400"/>
                  Short Description
                </label>
                <textarea 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Large pothole near the college gate causing traffic slowdowns..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetadataField icon={MapPin} label="Detected Location" value={autoLocation}/>
                <MetadataField icon={Clock} label="Captured Time" value={autoTime}/>
              </div>

              <FileUploadCard colorClass="text-purple-400" icon={Video} subtitle="Short video for complex issues like waterlogging" title="Video Evidence (Optional)"/>

              <div className="pt-4 border-t border-slate-800">
                <button 
                  type="submit" 
                  disabled={isSubmitting || submitStatus === 'analyzing'}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitStatus === 'analyzing' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin"/>
                      AI Verifying Evidence...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5"/>
                      Submit Report to URBANEYE
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
