import React, { useState } from 'react';
import Button from './Button';

interface PrescriptionHandlerProps {
  onConfirm: (predictedLabel: string) => void; // Callback when the user confirms the prediction
  onClose: () => void; // Callback to close the modal
}

const PrescriptionHandler: React.FC<PrescriptionHandlerProps> = ({ onConfirm, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Store the uploaded file
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Store the preview URL for the uploaded image
  const [predictedLabel, setPredictedLabel] = useState<string | null>(null); // Store the predicted label
  const [loading, setLoading] = useState(false); // Loading state for recognition

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate a preview URL for the image
      setPredictedLabel(null); // Reset the predicted label when a new file is selected
    }
  };

  const handleRecognize = async () => {
    if (!selectedFile) {
      alert('Please upload a prescription image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/recognize', {
        method: 'POST',
        body: formData,
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to recognize handwriting.');
        return;
      }

      // Parse the JSON response
      const data = await response.json();
      if (!data || !data.predicted_label) {
        alert('No predicted label received from the server.');
        return;
      }

      setPredictedLabel(data.predicted_label); // Store the predicted label
    } catch (error) {
      console.error('Failed to recognize handwriting:', error);
      alert('Failed to recognize handwriting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (predictedLabel) {
      onConfirm(predictedLabel); // Pass the predicted label to the parent component
      onClose(); // Close the modal
    }
  };

  const handleReject = () => {
    setPredictedLabel(null); // Clear the predicted label
    onClose(); // Close the modal
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-lg max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-primary text-center">Upload Your Prescription</h3>
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Image Preview */}
        {previewUrl ? (
          <div className="w-64 h-64 border rounded-lg overflow-hidden bg-gray-100 shadow-inner">
            <img
              src={previewUrl}
              alt="Uploaded Prescription"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-64 h-64 border rounded-lg flex items-center justify-center bg-gray-50 text-gray-400 shadow-inner">
            <span className="text-sm">No Image Uploaded</span>
          </div>
        )}

        {/* Upload and Actions */}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            title="Upload a prescription image"
          />
          <div className="flex space-x-4">
            <Button
              onClick={handleRecognize}
              disabled={!selectedFile || loading}
              className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition"
            >
              {loading ? 'Recognizing...' : 'Recognize'}
            </Button>
            {predictedLabel && (
              <>
                <Button
                  onClick={handleConfirm}
                  variant="success"
                  className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
                >
                  Confirm
                </Button>
                <Button
                  onClick={handleReject}
                  variant="ghost"
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Reject
                </Button>
              </>
            )}
          </div>
          {predictedLabel && (
            <p className="mt-4 text-sm text-gray-700">
              <span className="font-semibold">Predicted Medicine:</span> {predictedLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHandler;