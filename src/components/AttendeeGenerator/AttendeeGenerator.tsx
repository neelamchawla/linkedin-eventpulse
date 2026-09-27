import React from 'react';
import { AttendeeBanner } from './AttendeeBanner';
import { InputStudio } from './InputStudio';
import { LinkedInPreview } from './LinkedInPreview';

export const AttendeeGenerator: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Event Banner */}
      <AttendeeBanner />

      {/* 2-Column Split Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Studio (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <InputStudio />
        </div>

        {/* Right Column: Sticky Live Preview & Action Bar (6 Cols) */}
        <div className="lg:col-span-6">
          <LinkedInPreview />
        </div>
      </div>
    </div>
  );
};
