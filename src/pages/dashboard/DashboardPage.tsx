// pages/dashboard/DashboardPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Send, Eye, MousePointer, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import StatusBadge from '../../components/ui/statusBadge';
import { StatCardSkeleton, TableRowSkeleton } from '../../components/ui/Skeleton';
import useDashboardData from '../../hooks/useDashboardData';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, campaigns, loading, sendCampaign } = useDashboardData();
  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleSendCampaign = async (campaignId: string) => {
    setSendingId(campaignId);
    try {
      await sendCampaign(campaignId);
      toast.success('Campaign sent successfully!');
    } catch (error) {
      toast.error('Failed to send campaign');
    } finally {
      setSendingId(null);
    }
  };

  const statCards = [
    { icon: <Users className="w-5 h-5 text-white" />, label: 'Total Contacts', value: stats.total_contacts.toLocaleString(), change: 5.2, color: 'bg-blue-600' },
    { icon: <Send className="w-5 h-5 text-white" />, label: 'Emails Sent', value: stats.emails_sent.toLocaleString(), change: 12.8, color: 'bg-purple-600' },
    { icon: <Eye className="w-5 h-5 text-white" />, label: 'Open Rate', value: `${stats.open_rate}%`, change: 3.1, color: 'bg-green-600' },
    { icon: <MousePointer className="w-5 h-5 text-white" />, label: 'Click Rate', value: `${stats.click_rate}%`, change: -1.2, color: 'bg-orange-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <Card className="overflow-hidden">
          <div className="p-4">
            {Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with your campaigns.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/compose')}>New Campaign</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const isPositive = stat.change && stat.change > 0;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                    {stat.change !== undefined && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className={`inline-flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {Math.abs(stat.change)}%
                        </span>
                        <span className="text-xs text-gray-400">vs last week</span>
                      </div>
                    )}
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/campaigns')}>View All</Button>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Campaign</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Recipients</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Open Rate</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Click Rate</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.slice(0, 5).map((campaign: any) => {
                  const openRate = campaign.sent_count > 0 ? Math.round((campaign.open_count / campaign.sent_count) * 100) : 0;
                  const clickRate = campaign.sent_count > 0 ? Math.round((campaign.click_count / campaign.sent_count) * 100) : 0;
                  return (
                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-xs text-gray-400">{campaign.subject}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={campaign.status} /></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{campaign.total_recipients.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{campaign.sent_count > 0 ? `${openRate}%` : '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{campaign.sent_count > 0 ? `${clickRate}%` : '—'}</td>
                      <td className="px-4 py-3 text-right">
                        {campaign.status === 'draft' && (
                          <Button size="sm" variant="primary" loading={sendingId === campaign.id} onClick={() => handleSendCampaign(campaign.id)}>Send</Button>
                        )}
                        {campaign.status === 'scheduled' && <Button size="sm" variant="secondary">Edit</Button>}
                        {campaign.status === 'completed' && <Button size="sm" variant="ghost">View</Button>}
                      </td>
                    </tr>
                  );
                })}
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">No campaigns yet. Create your first campaign!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}