import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, FileText, Image, Archive } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  acceptedTypes = ['.pdf', '.txt', '.docx', '.doc', '.md'],
  maxSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileValidation(files[0]);
    }
  }, []);

  const handleFileValidation = (file: File) => {
    setError('');
    
    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Please upload a valid file type: ${acceptedTypes.join(', ')}`);
      return;
    }

    setUploadedFile(file);
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileValidation(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-400" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-400" />;
      case 'txt':
      case 'md':
        return <File className="w-8 h-8 text-gray-400" />;
      default:
        return <Archive className="w-8 h-8 text-purple-400" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!uploadedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 backdrop-blur-sm ${
            dragActive
              ? 'border-cyan-400 bg-cyan-900/20 shadow-lg shadow-cyan-500/25'
              : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleInputChange}
            accept={acceptedTypes.join(',')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Upload Your Document
              </h3>
              <p className="text-gray-300 text-lg mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-sm text-gray-400">
                Supports: {acceptedTypes.join(', ')} (Max {Math.round(maxSize / (1024 * 1024))}MB)
              </p>
            </div>

            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl text-lg">
              Choose File
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-900/30 border border-green-500/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-green-800/50 rounded-xl">
                {getFileIcon(uploadedFile.name)}
              </div>
              <div>
                <h4 className="font-semibold text-green-300 text-xl">{uploadedFile.name}</h4>
                <p className="text-green-200 mt-1">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI analysis
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-3 hover:bg-green-800/50 rounded-xl transition-colors text-green-400 hover:text-green-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-900/30 border border-red-500/50 rounded-xl p-6 flex items-start space-x-4 backdrop-blur-sm">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-semibold">Upload Error</p>
            <p className="text-red-200 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;