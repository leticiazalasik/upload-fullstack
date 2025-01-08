// src/App.tsx
import React from 'react';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Sistema de Upload
        </h1>
        <FileUpload />
      </div>
    </div>
  );
};

export default App;