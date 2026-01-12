import React from 'react';
import { Link } from 'react-router-dom';
import { Squares2X2Icon, PencilSquareIcon } from '../components/icons';

const AppModifyPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Application Modification</h1>
        <p className="mt-2 text-slate-600">
          Modify core components of your public-facing application, such as stock recommendations and informational pages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/app-modify/services"
          className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">
              <Squares2X2Icon />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Manage Stocks</h2>
              <p className="mt-1 text-slate-500 text-sm">Add, edit, or remove stock recommendations, targets, and analysis.</p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/app-modify/about-us"
          className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 text-green-700 p-3 rounded-lg">
              <PencilSquareIcon />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Manage 'About Us' Page</h2>
              <p className="mt-1 text-slate-500 text-sm">Update the company description, images, and feature highlights on your homepage.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AppModifyPage;