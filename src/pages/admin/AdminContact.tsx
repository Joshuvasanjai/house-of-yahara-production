import { useEffect, useState } from 'react';
import { Mail, Trash2, Eye } from 'lucide-react';
import { fetchContactSubmissions, updateContactSubmissionStatus } from '@/services/contact';
import type { ContactSubmission } from '@/types';

export function AdminContact() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadSubmissions(); }, []);

  async function loadSubmissions() {
    setLoading(true);
    try {
      const data = await fetchContactSubmissions();
      setSubmissions(data as ContactSubmission[]);
    } catch { /* empty */ }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await updateContactSubmissionStatus(id, status);
    loadSubmissions();
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-gray-900 mb-8">Contact Submissions</h1>

      {loading ? <p className="text-sm text-gray-500">Loading...</p> : submissions.length === 0 ? (
        <p className="text-sm text-gray-500">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">{sub.name}</p>
                  <p className="text-xs text-gray-500">{sub.email} {sub.phone && `· ${sub.phone}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={sub.status}
                    onChange={(e) => updateStatus(sub.id, e.target.value)}
                    className="border border-gray-300 px-2 py-1 text-xs outline-none focus:border-gray-900"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              {sub.subject && <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{sub.subject}</p>}
              <p className="text-sm text-gray-700 leading-relaxed">{sub.message}</p>
              <p className="text-xs text-gray-400 mt-3">{new Date(sub.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
