// pages/compose/ComposePage.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Save, X, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { useCampaigns } from '../../hooks/useCampaigns';
import { useDashboardData } from '../../hooks/useDashboardData';

const composeSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Email content is required'),
  template: z.string().optional(),
});

type ComposeFormData = z.infer<typeof composeSchema>;

export default function ComposePage() {
  const navigate = useNavigate();
  const { createCampaign } = useCampaigns();
  const { sendCampaign, refetch } = useDashboardData();
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ComposeFormData>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      name: '',
      subject: '',
      content: '',
      template: '',
    },
  });

  const onSubmit = async (data: ComposeFormData) => {
    setSaving(true);
    try {
      await createCampaign({
        name: data.name,
        subject: data.subject,
        body: data.content,
        html_body: data.content,
        status: 'draft',
        template_id: data.template || null,
        scheduled_at: null,
        sent_at: null,
        total_recipients: 0,
        sent_count: 0,
        open_count: 0,
        click_count: 0,
        bounce_count: 0,
      });
      toast.success('Campaign saved successfully');
      navigate('/campaigns');
    } catch (error) {
      toast.error('Failed to save campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleSendNow = async (data: ComposeFormData) => {
    setSending(true);
    try {
      const campaign: any = await createCampaign({
        name: data.name,
        subject: data.subject,
        body: data.content,
        html_body: data.content,
        status: 'sending',
        template_id: data.template || null,
        scheduled_at: null,
        sent_at: null,
        total_recipients: 0,
        sent_count: 0,
        open_count: 0,
        click_count: 0,
        bounce_count: 0,
      });
      await sendCampaign(campaign.id);
      await refetch();
      toast.success('Campaign sent successfully!');
      navigate('/campaigns');
    } catch (error) {
      toast.error('Failed to send campaign');
    } finally {
      setSending(false);
    }
  };

  const templateOptions = [
    { value: '', label: 'None' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'event', label: 'Event Invitation' },
    { value: 'welcome', label: 'Welcome' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compose Campaign</h1>
        <p className="text-sm text-gray-500 mt-1">Create and send your email campaign</p>
      </div>
      <Card className="p-6">
        <form className="space-y-6">
          <Input label="Campaign Name" placeholder="e.g. Weekly Newsletter" error={errors.name?.message} {...register('name')} />
          <Input label="Subject Line" placeholder="Your email subject" error={errors.subject?.message} {...register('subject')} />
          <Select label="Template (Optional)" options={templateOptions} {...register('template')} />
          <Input label="Recipients" placeholder="Enter email addresses or select a list" icon={<Users className="w-4 h-4" />} disabled value="All contacts" />
          <Textarea label="Email Content" placeholder="Write your email content here..." rows={12} error={errors.content?.message} {...register('content')} />
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" icon={<Save className="w-4 h-4" />} loading={saving} onClick={handleSubmit(onSubmit)}>Save Draft</Button>
            <Button type="button" variant="primary" icon={<Send className="w-4 h-4" />} loading={sending} onClick={handleSubmit(handleSendNow)}>Send Now</Button>
            <Button type="button" variant="ghost" icon={<X className="w-4 h-4" />} onClick={() => navigate('/dashboard')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}