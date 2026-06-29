import { useState } from 'react';
import { Card } from '../../components/ui/Card'; // Named import
import { Button } from '../../components/ui/Button'; // Named import
import { StatusBadge } from '../../components/ui/statusBadge'; // Named import (capital S)
import {
  BarChart3,
  Users,
  Mail,
  Eye,
  MousePointer,
  ArrowUp,
  ArrowDown,
  Download,
} from 'lucide-react';

const mockAnalytics = {
  totalCampaigns: 24,
  totalEmails: 15782,
  avgOpenRate: 34.7,
  avgClickRate: 12.3,
  topPerforming: {
    name: 'Weekly Newsletter #42',
    openRate: 48.2,
    clickRate: 18.5,
  },
  recentActivity: [
    { date: '2024-02-20', emails: 1240, opens: 423, clicks: 156 },
    { date: '2024-02-19', emails: 980, opens: 341, clicks: 112 },
    { date: '2024-02-18', emails: 1500, opens: 524, clicks: 198 },
  ],
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const stats = [
    { icon: <Mail className="w-5 h-5 text-white" />, label: 'Total Emails', value: mockAnalytics.totalEmails.toLocaleString(), change: 8.2, color: 'bg-blue-600' },
    { icon: <Eye className="w-5 h-5 text-white" />, label: 'Avg Open Rate', value: `${mockAnalytics.avgOpenRate}%`, change: 3.1, color: 'bg-green-600' },
    { icon: <MousePointer className="w-5 h-5 text-white" />, label: 'Avg Click Rate', value: `${mockAnalytics.avgClickRate}%`, change: -1.2, color: 'bg-purple-600' },
    { icon: <Users className="w-5 h-5 text-white" />, label: 'Total Contacts', value: '2,847', change: 5.7, color: 'bg-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your email performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === range ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const isPositive = stat.change && stat.change > 0;
          return (
            <Card key={index} className="p-6">
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
                      <span className="text-xs text-gray-400">vs last period</span>
                    </div>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Campaign</h3>
          <StatusBadge status="completed" />
        </div>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-sm font-medium text-gray-900">{mockAnalytics.topPerforming.name}</p>
            <p className="text-xs text-gray-400">Opened {mockAnalytics.topPerforming.openRate}% of the time</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-gray-400">Open Rate</p>
              <p className="text-lg font-semibold text-gray-900">{mockAnalytics.topPerforming.openRate}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Click Rate</p>
              <p className="text-lg font-semibold text-gray-900">{mockAnalytics.topPerforming.clickRate}%</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Email Activity</h3>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600" /> Opens</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-600" /> Clicks</span>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Performance chart would appear here</p>
            <p className="text-xs text-gray-300">Showing {timeRange} of data</p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 rounded-lg">
                <tr>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Emails Sent</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Opens</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Clicks</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Open Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockAnalytics.recentActivity.map((day, index) => {
                  const openRate = Math.round((day.opens / day.emails) * 100);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600">{day.date}</td>
                      <td className="px-3 py-2 text-gray-600">{day.emails.toLocaleString()}</td>
                      <td className="px-3 py-2 text-gray-600">{day.opens.toLocaleString()}</td>
                      <td className="px-3 py-2 text-gray-600">{day.clicks.toLocaleString()}</td>
                      <td className="px-3 py-2"><span className="text-green-600 font-medium">{openRate}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}