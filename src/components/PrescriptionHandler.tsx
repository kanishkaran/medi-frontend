import React, { useState } from 'react';
import Button from './Button';

interface PrescriptionHandlerProps {
  onConfirm: (predictedLabel: string) => void; // Callback when the user confirms the prediction
}

const PrescriptionHandler: React.FC<PrescriptionHandlerProps> = ({ onConfirm }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Store the uploaded file
  const [predictedLabel, setPredictedLabel] = useState<string | null>(null); // Store the predicted label
  const [loading, setLoading] = useState(false); // Loading state for recognition

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
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
      setPredictedLabel(null); // Clear the predicted label
      setSelectedFile(null); // Clear the selected file
    }
  };

  const handleReject = () => {
    setPredictedLabel(null); // Clear the predicted label
  };

  return (
    <div className="p-4 border rounded-lg bg-secondary/10">
      <h3 className="text-lg font-bold mb-4">Upload Prescription</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
        title="Upload a prescription image"
      />
      <div className="flex space-x-4">
        <Button onClick={handleRecognize} disabled={!selectedFile || loading}>
          {loading ? 'Recognizing...' : 'Recognize'}
        </Button>
        {predictedLabel && (
          <>
            <p className="text-sm">Predicted Medicine: {predictedLabel}</p>
            <Button onClick={handleConfirm}>Confirm</Button>
            <Button variant="ghost" onClick={handleReject}>
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PrescriptionHandler;