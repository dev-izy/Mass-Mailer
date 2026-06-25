// pages/campaigns/CampaignsPage.tsx
import { useState } from 'react';
import { Search, Plus, Filter, Eye } from 'lucide-react';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import useCampaigns from '../../hooks/useCampaigns';
import useDashboardData from '../../hooks/useDashboardData';
import toast from 'react-hot-toast';

export default function CampaignsPage() {
  const navigate = useNavigate();
  const { campaigns, loading, refetch } = useCampaigns();
  const { sendCampaign } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingId, setSendingId] = useState<string | null>(null);

  const filteredCampaigns = campaigns.filter(
    (c: any) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendCampaign = async (campaignId: string) => {
    setSendingId(campaignId);

    try {
      await sendCampaign(campaignId);
      toast.success('Campaign sent successfully!');
      await refetch();
    } catch (error) {
      toast.error('Failed to send campaign');
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your email campaigns</p>
          </div>
        </div>
        <Card className="overflow-hidden">
          <div className="p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your email campaigns</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/compose')}>
          New Campaign
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
          Filter
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Campaign</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Recipients</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Sent</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Open Rate</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCampaigns.map((campaign: any) => {
                const openRate = campaign.sent_count > 0 ? Math.round((campaign.open_count / campaign.sent_count) * 100) : 0;
                return (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-xs text-gray-400">{campaign.subject}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={campaign.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{campaign.total_recipients}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{campaign.sent_count}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{campaign.sent_count > 0 ? `${openRate}%` : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      {campaign.status === 'draft' && (
                        <Button size="sm" variant="primary" loading={sendingId === campaign.id} onClick={() => handleSendCampaign(campaign.id)}>
                          Send
                        </Button>
                      )}
                      {campaign.status === 'completed' && (
                        <Button size="sm" variant="ghost" icon={<Eye className="w-3 h-3" />}>View</Button>
                      )}
                      {campaign.status === 'scheduled' && (
                        <Button size="sm" variant="secondary">Edit</Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                    {searchTerm ? 'No campaigns match your search' : 'No campaigns yet. Create your first campaign!'}
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