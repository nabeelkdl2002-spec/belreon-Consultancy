
import React from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { recentProjects } from '../constants';
import { Project } from '../types';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="New Client Inquiries" value="4" details="Awaiting initial contact" />
        <Card title="Active Projects" value="12" details="Projects currently in progress" />
        <Card title="Net Profit (This Month)" value="$21,750" details="Revenue minus expenses" valueClassName="text-green-600" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Project Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Client Name</th>
                <th scope="col" className="px-6 py-3">Service</th>
                <th scope="col" className="px-6 py-3">Assigned To</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project: Project, index: number) => (
                <tr key={index} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{project.clientName}</td>
                  <td className="px-6 py-4">{project.service}</td>
                  <td className="px-6 py-4">{project.assignedTo}</td>
                  <td className="px-6 py-4"><StatusBadge status={project.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
