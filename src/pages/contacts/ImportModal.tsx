// pages/contacts/ImportModal.tsx
import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import { Progress } from '../../components/ui/Progress';
import { parseFile } from '../../utils/fileParser';
import useContacts from '../../hooks/useContacts';
import toast from 'react-hot-toast';
import { CheckCircle, AlertCircle, Users, X } from 'lucide-react';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ImportModal({ open, onClose, onSuccess }: ImportModalProps) {
  const { createContact } = useContacts();
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload');
  const [importResult, setImportResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [imported, setImported] = useState(0);

  const handleFileSelect = async (selectedFile: File) => {
    try {
      const result = await parseFile(selectedFile);
      setImportResult(result);
      setStep('preview');
    } catch (error) {
      toast.error('Failed to parse file');
      console.error(error);
    }
  };

  const handleImport = async () => {
    if (!importResult) return;

    setStep('importing');
    const contacts = importResult.contacts;
    let successCount = 0;

    for (let i = 0; i < contacts.length; i++) {
      try {
        await createContact(contacts[i]);
        successCount++;
        setImported(successCount);
        setProgress(((i + 1) / contacts.length) * 100);
      } catch (error) {
        console.error('Failed to import contact:', error);
      }

      if (i % 10 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    setStep('complete');
    toast.success(`Successfully imported ${successCount} contacts`);
    setTimeout(() => {
      onClose();
      if (onSuccess) onSuccess();
    }, 2000);
  };

  const reset = () => {
    setStep('upload');
    setImportResult(null);
    setProgress(0);
    setImported(0);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Import Contacts" size="lg">
      <div className="py-4">
        {step === 'upload' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Import contacts from CSV, Excel, TXT, or JSON files. Supported formats: .csv, .xlsx, .xls, .txt, .json
            </p>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {step === 'preview' && importResult && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-blue-600">{importResult.total}</p>
                <p className="text-xs text-blue-600">Total Records</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-green-600">{importResult.valid}</p>
                <p className="text-xs text-green-600">Valid Contacts</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <AlertCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-red-600">{importResult.invalid + importResult.duplicates}</p>
                <p className="text-xs text-red-600">Invalid / Duplicates</p>
              </div>
            </div>

            {importResult.invalid > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700">⚠️ {importResult.invalid} invalid emails and {importResult.duplicates} duplicates will be skipped.</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setStep('upload')} icon={<X className="w-4 h-4" />}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleImport} disabled={importResult.valid === 0} icon={<Users className="w-4 h-4" />}>
                Import {importResult.valid} Contacts
              </Button>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Importing Contacts</h3>
              <p className="text-sm text-gray-500 mt-1">Importing {importResult?.contacts.length || 0} contacts</p>
            </div>
            <Progress value={progress} max={100} label={`${imported} of ${importResult?.contacts.length || 0}`} />
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Import Complete!</h3>
              <p className="text-sm text-gray-500 mt-1">Successfully imported {imported} contacts</p>
            </div>
            <div className="flex items-center justify-center">
              <Button variant="secondary" onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}