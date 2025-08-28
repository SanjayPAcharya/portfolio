import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';

type Contact = {
  id?: string | number;
  name: string;
  email: string;
  phone: string;
  description: string;
  updatedAt?: string;
};

export default function ContactsList() {
  const { get, loading, error } = useApi<Contact[]>();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await get('contacts');
        const sorted = [...(result || [])].sort((a, b) => {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bTime - aTime;
        });
        setContacts(sorted);
      } catch {
        // handled by hook error state
      }
    })();
  }, []);

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Contacts</h2>
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm divide-y">
            {contacts.map((c, idx) => (
              <div key={(c.id ?? idx).toString()} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{c.name}</p>
                    <p className="text-sm text-gray-600">{c.email} • {c.phone}</p>
                  </div>
                  {c.updatedAt && (
                    <p className="text-xs text-gray-500 mt-2 sm:mt-0">Updated: {new Date(c.updatedAt).toLocaleString()}</p>
                  )}
                </div>
                {c.description && (
                  <p className="text-gray-700 text-sm mt-2 whitespace-pre-line">{c.description}</p>
                )}
              </div>
            ))}
            {contacts.length === 0 && (
              <div className="p-6 text-center text-gray-600">No contacts found.</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}


