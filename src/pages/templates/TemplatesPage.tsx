import { useState } from 'react';
import { Search, Plus, FileText, Trash2, Copy, MoreVertical, Star } from 'lucide-react';
import { Card } from '../../components/ui/Card'; // Named import
import { Button } from '../../components/ui/Button'; // Named import
import toast from 'react-hot-toast';

interface Template {
  id: string;
  name: string;
  subject: string;
  category: string;
  usageCount: number;
  isFavorite: boolean;
  createdAt: string;
}

const mockTemplates: Template[] = [
  { id: '1', name: 'Welcome Email', subject: 'Welcome to our community!', category: 'Onboarding', usageCount: 45, isFavorite: true, createdAt: '2024-01-15' },
  { id: '2', name: 'Weekly Newsletter', subject: 'Your weekly update', category: 'Newsletter', usageCount: 32, isFavorite: false, createdAt: '2024-01-20' },
  { id: '3', name: 'Promotional Offer', subject: 'Exclusive offer just for you', category: 'Marketing', usageCount: 28, isFavorite: true, createdAt: '2024-02-01' },
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [templates] = useState(mockTemplates);

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    toast.success('Template deleted successfully');
  };

  const handleFavorite = () => {
    toast.success('Template updated');
  };

  const handleDuplicate = () => {
    toast.success('Template duplicated');
  };

  const categories = ['All', 'Onboarding', 'Newsletter', 'Marketing', 'Transactional'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your email templates</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>New Template</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button key={category} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${category === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-400">{template.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleFavorite} className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <Star className={`w-4 h-4 ${template.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Subject: {template.subject}</p>
            <p className="text-xs text-gray-400">Used {template.usageCount} times</p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <Button size="sm" variant="outline" className="flex-1">Edit</Button>
              <Button size="sm" variant="ghost" icon={<Copy className="w-3 h-3" />} onClick={handleDuplicate} />
              <Button size="sm" variant="ghost" icon={<Trash2 className="w-3 h-3" />} onClick={handleDelete} />
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No templates found</p>
          <Button className="mt-4" size="sm">Create Template</Button>
        </div>
      )}
    </div>
  );
}