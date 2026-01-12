import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { AboutUsContent, AboutUsIcon, AboutUsFeature } from '../types';
import { TrashIcon, ArrowLeftIcon } from '../components/icons';
import Modal from '../components/Modal';
import { Link } from 'react-router-dom';

const availableIcons: AboutUsIcon[] = ['LightbulbIcon', 'UsersIcon', 'BriefcaseIcon', 'ChartPieIcon', 'BanknotesIcon', 'Cog6ToothIcon', 'CalculatorIcon', 'DatabaseIcon', 'Squares2X2Icon'];

const AdvertisementManagerPage: React.FC = () => {
  const { aboutUsContent, updateAboutUsContent, deleteAboutUsFeature } = useAuth();
  const [formData, setFormData] = useState<AboutUsContent>(aboutUsContent);
  const [saved, setSaved] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<AboutUsFeature | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    // Sync local state if global state changes (e.g., a feature is restored from trash)
    setFormData(aboutUsContent);
  }, [aboutUsContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      features: prev.features.map(feature => {
        if (feature.id === id) {
          // Create a new feature object with the updated value
          return { ...feature, [name]: name === 'icon' ? (value as AboutUsIcon) : value };
        }
        return feature;
      })
    }));
  };
  
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);
      const files = Array.from(e.target.files);
      try {
        const base64strings = await Promise.all(files.map(convertFileToBase64));
        setFormData(prev => ({
          ...prev,
          mainImages: [...prev.mainImages, ...base64strings]
        }));
      } catch (error) {
        console.error("Error converting files to base64", error);
        alert("There was an error uploading the images. Please try again.");
      } finally {
        setIsUploading(false);
        // Reset file input value to allow re-uploading the same file
        e.target.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        mainImages: prev.mainImages.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        { id: Date.now(), icon: 'LightbulbIcon', title: '', description: '', isDeleted: false }
      ]
    }));
  };

  const handleRemoveFeature = (feature: AboutUsFeature) => {
    setFeatureToDelete(feature);
  };

  const confirmRemoveFeature = () => {
    if (featureToDelete) {
        deleteAboutUsFeature(featureToDelete.id);
        setFeatureToDelete(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutUsContent(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <Link 
        to="/admin/app-modify" 
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors -mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to App Modify
      </Link>
      <Card title="Manage 'About Us' Section">
        <p className="text-sm text-slate-500 -mt-2 mb-6">
          Edit the content that appears in the "About Us" section on your public homepage.
        </p>
        <form onSubmit={handleSave} className="space-y-8">
          {/* Main Content Section */}
          <div className="p-4 border border-slate-200 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Main Content</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="heading" className="block text-sm font-medium text-slate-600 mb-1">Heading</label>
                <input type="text" id="heading" name="heading" value={formData.heading} onChange={handleInputChange} className="form-input" />
              </div>
              <div>
                <label htmlFor="paragraph" className="block text-sm font-medium text-slate-600 mb-1">Paragraph</label>
                <textarea id="paragraph" name="paragraph" rows={5} value={formData.paragraph} onChange={handleInputChange} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Carousel Images</label>
                
                {/* Preview Grid */}
                {formData.mainImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {formData.mainImages.map((imageSrc, index) => (
                        <div key={index} className="relative group aspect-square">
                        <img src={imageSrc} alt={`Carousel image ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
                            <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="text-white bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100"
                            aria-label="Remove Image"
                            >
                            <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                )}

                {/* Upload Control */}
                <div>
                <label htmlFor="image-upload" className="relative cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center w-full transition-colors">
                    {isUploading ? (
                        <span>Uploading...</span>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>Upload Images</span>
                        </>
                    )}
                </label>
                <input 
                    id="image-upload"
                    type="file" 
                    multiple 
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload} 
                    className="hidden" 
                    disabled={isUploading}
                />
                <p className="text-xs text-slate-500 mt-2">You can select multiple images. PNG, JPG, or WEBP formats are accepted.</p>
                </div>
            </div>
            </div>
          </div>
          
          {/* Features Section */}
           <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Feature Blocks</h3>
              <div className="space-y-6">
                {formData.features.filter(f => !f.isDeleted).map((feature, index) => (
                    <div key={feature.id} className="p-3 bg-slate-50 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                           <h4 className="font-semibold text-slate-600">Feature {index + 1}</h4>
                           <button type="button" onClick={() => handleRemoveFeature(feature)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100" aria-label="Remove feature">
                                <TrashIcon className="w-5 h-5" />
                           </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label htmlFor={`feature_icon_${feature.id}`} className="block text-xs font-medium text-slate-500 mb-1">Icon</label>
                                <select id={`feature_icon_${feature.id}`} name="icon" value={feature.icon} onChange={(e) => handleFeatureChange(feature.id, e)} className="form-input">
                                    {availableIcons.map(iconName => (
                                        <option key={iconName} value={iconName}>{iconName.replace('Icon', '')}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor={`feature_title_${feature.id}`} className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                                <input type="text" id={`feature_title_${feature.id}`} name="title" value={feature.title} onChange={(e) => handleFeatureChange(feature.id, e)} className="form-input" />
                            </div>
                            <div>
                                <label htmlFor={`feature_desc_${feature.id}`} className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                                <textarea id={`feature_desc_${feature.id}`} name="description" rows={3} value={feature.description} onChange={(e) => handleFeatureChange(feature.id, e)} className="form-input" />
                            </div>
                        </div>
                    </div>
                ))}
              </div>
              <div className="mt-6">
                <button type="button" onClick={handleAddFeature} className="w-full py-2 px-4 border-2 border-dashed border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors">
                    + Add New Feature
                </button>
              </div>
           </div>

          <div className="flex justify-end items-center mt-6">
            {saved && <span className="text-green-600 mr-4 transition-opacity duration-300">Content saved successfully!</span>}
            <button type="submit" className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </Card>

      {featureToDelete && (
        <Modal title="Confirm Deletion" onClose={() => setFeatureToDelete(null)}>
            <div className="text-center">
                <p className="text-slate-600 text-lg">
                    Are you sure you want to move the feature <span className="font-bold text-slate-800">"{featureToDelete.title}"</span> to the trash?
                </p>
                <p className="text-sm text-slate-500 mt-2">You can restore it later from the Trash page.</p>
                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={() => setFeatureToDelete(null)} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors">
                        Cancel
                    </button>
                    <button onClick={confirmRemoveFeature} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Move to Trash
                    </button>
                </div>
            </div>
        </Modal>
      )}

      <style>{`
      .form-input {
        width: 100%;
        background-color: white;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
      }
      .form-input:focus, .form-input:focus-visible {
        outline: none !important;
        box-shadow: none !important;
        border-color: #9ca3af;
      }
      .dark .form-input {
        background-color: #334155 !important;
        color: #f1f5f9 !important;
        border-color: #475569 !important;
      }
      `}</style>
    </div>
  );
};

export default AdvertisementManagerPage;