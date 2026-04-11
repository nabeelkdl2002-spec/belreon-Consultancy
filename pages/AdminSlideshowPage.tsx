import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SlideshowImage } from '../types';
import { PhotoIcon, TrashIcon, PencilSquareIcon, PlusIcon, ArrowPathIcon } from '../components/icons';

const SlideshowForm: React.FC<{ 
  image?: SlideshowImage; 
  onClose: () => void; 
}> = ({ image, onClose }) => {
  const { addSlideshowImage, updateSlideshowImage } = useAuth();
  const [url, setUrl] = useState(image?.url || '');
  const [title, setTitle] = useState(image?.title || '');
  const [subtitle, setSubtitle] = useState(image?.subtitle || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (image) {
      updateSlideshowImage({ ...image, url, title, subtitle });
    } else {
      addSlideshowImage({ url, title, subtitle });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">{image ? 'Edit Slideshow Image' : 'Add New Slide'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Slide Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-blue-400 transition-colors relative group">
              {url ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm shadow-xl">
                      Change Image
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-slate-300" />
                  <div className="flex text-sm text-slate-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-bold text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl">
                  <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Slide Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
              placeholder="e.g. Expert Financial Advisory"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Slide Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
              placeholder="e.g. Navigate your business growth with clarity."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url}
              className="flex-1 px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {image ? 'Save Changes' : 'Add Slide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminSlideshowPage: React.FC = () => {
  const { slideshowImages, deleteSlideshowImage, restoreSlideshowImage, permanentlyDeleteSlideshowImage } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<SlideshowImage | undefined>();
  const [showDeleted, setShowDeleted] = useState(false);

  const activeImages = slideshowImages.filter(img => !img.isDeleted);
  const deletedImages = slideshowImages.filter(img => img.isDeleted);

  const handleEdit = (image: SlideshowImage) => {
    setEditingImage(image);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingImage(undefined);
  };

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Slides</h2>
            <p className="text-slate-500 text-sm">Upload, edit, or remove images from your homepage slideshow.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
                showDeleted 
                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showDeleted ? 'View Active Slides' : 'View Deleted Slides'}
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200"
            >
              <PlusIcon className="w-5 h-5" />
              Add New Slide
            </button>
          </div>
        </div>

        {isFormOpen && <SlideshowForm image={editingImage} onClose={handleCloseForm} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showDeleted ? deletedImages : activeImages).map((image) => (
            <div key={image.id} className={`bg-white rounded-2xl border ${image.isDeleted ? 'border-amber-200 opacity-75' : 'border-slate-100'} overflow-hidden shadow-sm hover:shadow-md transition-all group`}>
              <div className="aspect-video relative overflow-hidden">
                <img src={image.url} alt={image.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-tight">{image.title || 'Untitled Slide'}</h3>
                  <p className="text-slate-300 text-xs mt-1 italic">{image.subtitle || 'No subtitle'}</p>
                </div>
                {!image.isDeleted && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(image)}
                      className="p-2 bg-white/90 backdrop-blur text-blue-600 rounded-lg hover:bg-white transition-colors shadow-lg"
                      title="Edit Slide"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteSlideshowImage(image.id)}
                      className="p-2 bg-white/90 backdrop-blur text-red-600 rounded-lg hover:bg-white transition-colors shadow-lg"
                      title="Delete Slide"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              {image.isDeleted && (
                <div className="p-4 bg-amber-50 flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Deleted Slide</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => restoreSlideshowImage(image.id)}
                      className="text-xs font-black text-blue-700 hover:underline"
                    >
                      RESTORE
                    </button>
                    <button
                      onClick={() => permanentlyDeleteSlideshowImage(image.id)}
                      className="text-xs font-black text-red-700 hover:underline"
                    >
                      PERMANENT DELETE
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(showDeleted ? deletedImages : activeImages).length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <PhotoIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-slate-900 font-bold text-lg">No slides found</h3>
              <p className="text-slate-500 text-sm">
                {showDeleted ? 'Your trash is empty.' : 'Start by adding your first hero slide.'}
              </p>
            </div>
          )}
        </div>
      </div>
  );
};

export default AdminSlideshowPage;
