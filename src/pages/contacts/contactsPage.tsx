// pages/contacts/ContactsPage.tsx
import { useState } from 'react';
import { Search, Plus, Upload, Download, MoreVertical, Mail, Phone, User, Trash2, Edit2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import ImportModal from './ImportModal'; 
import useContacts from '../../hooks/useContacts';
import toast from 'react-hot-toast';

export default function ContactsPage() {
  // Added a default empty array fallback to safeguard against undefined hook returns
  const { contacts = [], loading, deleteContact, refetch } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Added optional chaining (?.) on email just in case bad database entries exist
  const filteredContacts = contacts.filter(
    (c) =>
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await deleteContact(id);
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const handleExport = () => {
    const headers = ['Email', 'First Name', 'Last Name', 'Company', 'Phone', 'Status'];
    const rows = contacts.map((c) => [
      c.email,
      c.first_name || '',
      c.last_name || '',
      c.company || '',
      c.phone || '',
      c.status || 'active',
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Contacts exported successfully');
  };

  // FIX: Fixed structural hydration bugs by wrapping skeleton rows into an explicit table frame
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your email contacts</p>
          </div>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          refetch();
          toast.success('Contacts list updated');
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {contacts.length} contacts in your list
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={<Upload className="w-4 h-4" />}
            onClick={() => setShowImportModal(true)}
          >
            Import
          </Button>
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExport}
            disabled={contacts.length === 0}
          >
            Export
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>Add Contact</Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Contact
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Email
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Company
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {contact.first_name} {contact.last_name}
                        </p>
                        {contact.phone && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{contact.email}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {contact.company || '—'}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${contact.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : contact.status === 'unsubscribed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                        }
                      `}
                    >
                      {contact.status || 'active'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                    {searchTerm ? 'No contacts match your search' : 'No contacts yet. Import or add your first contact!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}