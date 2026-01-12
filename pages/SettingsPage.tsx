
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

const ToggleSwitch: React.FC<{
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-700">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${
        enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);


const SettingsPage: React.FC = () => {
    const { companyName, setCompanyName, companyLogo, setCompanyLogo, theme, setTheme } = useAuth();

    const [name, setName] = useState(companyName);
    const [logo, setLogo] = useState(companyLogo);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setCompanyName(name);
        setCompanyLogo(logo);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-8">
            <Card title="Company Profile">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-slate-600 mb-2">Company Name</label>
                        <input
                            id="companyName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="companyLogo" className="block text-sm font-medium text-slate-600 mb-2">Company Logo URL</label>
                        <input
                            id="companyLogo"
                            type="text"
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                            className="w-full px-4 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <p className="block text-sm font-medium text-slate-600 mb-2">Logo Preview</p>
                        <div className="p-4 border border-dashed border-slate-300 rounded-lg flex justify-center items-center h-40">
                            <img src={logo} alt="Logo Preview" className="max-h-full max-w-full" />
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Application Settings">
                <div className="space-y-6">
                    {/* Appearance Section */}
                    <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">Appearance</h4>
                        <ToggleSwitch 
                            label="Enable Dark Mode"
                            enabled={theme === 'dark'}
                            onChange={(enabled) => setTheme(enabled ? 'dark' : 'light')}
                        />
                    </div>

                     {/* Localization Section */}
                    <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">Localization & Region</h4>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="language" className="block text-sm font-medium text-slate-600 mb-2">Language</label>
                                <select id="language" className="w-full px-4 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                    <option>English (United States)</option>
                                    <option>Español (España)</option>
                                    <option>Français (France)</option>
                                    <option>Deutsch (Deutschland)</option>
                                    <option>中文 (简体)</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="dateFormat" className="block text-sm font-medium text-slate-600 mb-2">Date Format</label>
                                <select id="dateFormat" className="w-full px-4 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                    <option>MM/DD/YYYY</option>
                                    <option>DD/MM/YYYY</option>
                                    <option>YYYY-MM-DD</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="timeFormat" className="block text-sm font-medium text-slate-600 mb-2">Time Format</label>
                                <select id="timeFormat" className="w-full px-4 py-2 border bg-white text-slate-900 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                    <option>12-hour</option>
                                    <option>24-hour</option>
                                </select>
                            </div>
                        </div>
                    </div>

                     {/* Notifications Section */}
                    <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">Notifications</h4>
                         <ToggleSwitch 
                            label="Enable App Notifications"
                            enabled={true}
                            onChange={() => {}} // Placeholder
                        />
                    </div>
                </div>
            </Card>

            <div className="flex justify-end items-center">
                {saved && <span className="text-green-600 mr-4 transition-opacity duration-300">Settings saved successfully!</span>}
                <button
                    onClick={handleSave}
                    className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
