import { type Campaign, type Contact, type EmailTemplate, type DashboardStats } from '../types';

export const mockStats: DashboardStats = {
  total_contacts: 24837,
  emails_sent: 182450,
  open_rate: 34.7,
  click_rate: 12.3,
  bounce_rate: 2.1,
  active_campaigns: 7,
};

export const mockCampaigns: Campaign[] = [
  { id: '1', user_id: 'u1', name: 'Q2 Newsletter', subject: 'Your June Update Is Here', body: '', status: 'completed', total_recipients: 8420, sent_count: 8420, open_count: 3219, click_count: 891, bounce_count: 64, created_at: '2024-06-01T10:00:00Z', updated_at: '2024-06-01T14:22:00Z' },
  { id: '2', user_id: 'u1', name: 'Product Launch - Pro Plan', subject: 'Introducing Mass Mailer Pro', body: '', status: 'sending', total_recipients: 15200, sent_count: 9100, open_count: 3411, click_count: 1022, bounce_count: 45, created_at: '2024-06-10T08:00:00Z', updated_at: '2024-06-10T08:00:00Z' },
  { id: '3', user_id: 'u1', name: 'Summer Promotion', subject: '☀️ 40% off — This week only', body: '', status: 'scheduled', scheduled_at: '2024-06-25T09:00:00Z', total_recipients: 12000, sent_count: 0, open_count: 0, click_count: 0, bounce_count: 0, created_at: '2024-06-08T15:30:00Z', updated_at: '2024-06-08T15:30:00Z' },
  { id: '4', user_id: 'u1', name: 'Onboarding Series — Day 1', subject: 'Welcome! Here\'s how to get started', body: '', status: 'completed', total_recipients: 2104, sent_count: 2104, open_count: 1456, click_count: 822, bounce_count: 12, created_at: '2024-05-15T10:00:00Z', updated_at: '2024-05-15T11:30:00Z' },
  { id: '5', user_id: 'u1', name: 'Re-engagement: 60-Day Inactive', subject: 'We miss you — here\'s something special', body: '', status: 'draft', total_recipients: 0, sent_count: 0, open_count: 0, click_count: 0, bounce_count: 0, created_at: '2024-06-12T09:00:00Z', updated_at: '2024-06-12T09:00:00Z' },
  { id: '6', user_id: 'u1', name: 'Webinar Invite — July', subject: 'Join our live session: Email at Scale', body: '', status: 'failed', total_recipients: 5500, sent_count: 2200, open_count: 0, click_count: 0, bounce_count: 440, created_at: '2024-06-05T12:00:00Z', updated_at: '2024-06-05T13:00:00Z' },
];

export const mockContacts: Contact[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  user_id: 'u1',
  email: `contact${i + 1}@example.com`,
  first_name: ['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace', 'Henry'][i % 8],
  last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][i % 8],
  company: ['Acme Corp', 'TechFlow', 'Nexus Ltd', 'DataBridge', 'CloudWorks'][i % 5],
  phone: `+1 (555) ${String(100 + i).padStart(3, '0')}-${String(1000 + i).padStart(4, '0')}`,
  tags: [['vip', 'newsletter'], ['newsletter'], ['beta'], ['customer'], ['prospect']][i % 5],
  status: (['active', 'active', 'active', 'active', 'unsubscribed', 'bounced'] as const)[i % 6],
  custom_fields: {},
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: new Date(Date.now() - i * 86400000).toISOString(),
}));

export const mockTemplates: EmailTemplate[] = [
  { id: '1', user_id: 'u1', name: 'Newsletter', subject: '{{month}} Newsletter — {{company}}', body: 'Hi {{first_name}},\n\nHere\'s your monthly update...', category: 'Newsletter', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', user_id: 'u1', name: 'Product Launch', subject: 'Introducing {{product_name}}', body: 'Hi {{first_name}},\n\nWe\'re excited to announce...', category: 'Announcement', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '3', user_id: 'u1', name: 'Promotional Offer', subject: '{{discount}}% off — Limited time', body: 'Hi {{first_name}},\n\nDon\'t miss this exclusive offer...', category: 'Promotional', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '4', user_id: 'u1', name: 'Event Invitation', subject: 'You\'re invited: {{event_name}}', body: 'Hi {{first_name}},\n\nJoin us for a special event...', category: 'Event', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '5', user_id: 'u1', name: 'Welcome Email', subject: 'Welcome to {{company}}, {{first_name}}!', body: 'Hi {{first_name}},\n\nWelcome aboard! We\'re thrilled to have you...', category: 'Onboarding', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

export const mockChartData = {
  emailActivity: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    sent: Math.floor(Math.random() * 3000) + 500,
    opened: Math.floor(Math.random() * 1500) + 200,
    clicked: Math.floor(Math.random() * 600) + 50,
  })),
  campaignPerformance: mockCampaigns.filter(c => c.sent_count > 0).map(c => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + '…' : c.name,
    openRate: c.sent_count > 0 ? Math.round((c.open_count / c.sent_count) * 100) : 0,
    clickRate: c.sent_count > 0 ? Math.round((c.click_count / c.sent_count) * 100) : 0,
  })),
};