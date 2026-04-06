import React from 'react';
import { Table, CheckCircle2 } from 'lucide-react';

const fieldsData = [
  { id: 1, name: 'First Name', type: 'Text', required: true, example: 'John' },
  { id: 2, name: 'Last Name', type: 'Text', required: true, example: 'Doe' },
  { id: 3, name: 'Email', type: 'Email', required: true, example: 'john.doe@example.com' },
  { id: 4, name: 'Phone', type: 'Phone', required: true, example: '+1 555-0198' },
  { id: 5, name: 'Address Line 1', type: 'Text', required: false, example: '123 Fitness St' },
  { id: 6, name: 'City', type: 'Text', required: false, example: 'Austin' },
  { id: 7, name: 'State', type: 'Text', required: false, example: 'TX' },
  { id: 8, name: 'Zip Code', type: 'Text', required: false, example: '78701' },
  { id: 9, name: 'Country', type: 'Text', required: false, example: 'USA' },
  { id: 10, name: 'Date of Birth', type: 'Date', required: false, example: '1990-05-15' },
  { id: 11, name: 'Gender', type: 'Text', required: false, example: 'Male' },
  { id: 12, name: 'Emergency Contact Name', type: 'Text', required: false, example: 'Jane Doe' },
  { id: 13, name: 'Emergency Contact Phone', type: 'Phone', required: false, example: '+1 555-0199' },
  { id: 14, name: 'Mindbody ID', type: 'Text', required: true, example: 'MB-10045' },
  { id: 15, name: 'Membership Status', type: 'Text', required: true, example: 'Active' },
  { id: 16, name: 'Membership Type', type: 'Text', required: false, example: 'Unlimited Monthly' },
  { id: 17, name: 'Contract Start Date', type: 'Date', required: false, example: '2023-01-01' },
  { id: 18, name: 'Contract End Date', type: 'Date', required: false, example: '2024-01-01' },
  { id: 19, name: 'Total Visits', type: 'Number', required: false, example: '42' },
  { id: 20, name: 'Last Visit Date', type: 'Date', required: false, example: '2023-10-25' },
  { id: 21, name: 'Home Studio', type: 'Text', required: false, example: 'Downtown Austin' },
  { id: 22, name: 'Waiver Signed', type: 'Boolean', required: true, example: 'True' },
  { id: 23, name: 'Marketing Opt-In', type: 'Boolean', required: true, example: 'True' },
  { id: 24, name: 'Lead Source', type: 'Text', required: false, example: 'Instagram Ad' },
  { id: 25, name: 'Notes', type: 'Text', required: false, example: 'Prefers morning classes' },
  { id: 26, name: 'Tags', type: 'Text', required: false, example: 'VIP, Morning-Crew' },
];

export default function FieldsTable() {
  return (
    <div className="max-w-6xl mx-auto pb-20 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Table className="text-[#188bf6]" size={28} />
            26 Fields Mapping Table
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Complete list of all 26 fields required for the Mindbody to GoHighLevel synchronization, including demo data.
          </p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 font-medium shadow-sm">
          <CheckCircle2 size={14} />
          Mapping Verified
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
              <tr>
                <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 w-16 text-center">#</th>
                <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Field Name</th>
                <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 w-32">Data Type</th>
                <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 w-32 text-center">Required</th>
                <th className="p-4 font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Demo Data (Example)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {fieldsData.map((field, idx) => (
                <tr key={field.id} className={`transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/10 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/30 dark:bg-gray-800/50'}`}>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center font-mono">{field.id}</td>
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-100">{field.name}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      {field.type}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {field.required ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-50/50 dark:bg-gray-900/30 rounded-r-lg">
                    {field.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
