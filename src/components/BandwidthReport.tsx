import { useState } from 'react';
import { reportBandwidth } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Upload, Download } from 'lucide-react';

interface BandwidthReportProps {
  address: string;
}

export function BandwidthReport({ address }: BandwidthReportProps) {
  const [upload, setUpload] = useState('');
  const [download, setDownload] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await reportBandwidth({
        address,
        nodeId: `node-${address.slice(2, 10)}`,
        upload: parseFloat(upload),
        download: parseFloat(download),
        signature: '0x' // TODO: Implement proper signature
      });

      if (result.success) {
        toast.success(result.message);
        setUpload('');
        setDownload('');
      } else {
        toast.error('Report submission failed');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
      <h3 className="text-foreground mb-4">Report Bandwidth</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Speed (MB/s)
          </Label>
          <Input
            id="upload"
            type="number"
            step="0.1"
            placeholder="50.5"
            value={upload}
            onChange={(e) => setUpload(e.target.value)}
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="download" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Speed (MB/s)
          </Label>
          <Input
            id="download"
            type="number"
            step="0.1"
            placeholder="100.5"
            value={download}
            onChange={(e) => setDownload(e.target.value)}
            required
            className="mt-2"
          />
        </div>

        <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
          Node: <span className="font-mono text-foreground">{address}</span>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </form>
    </div>
  );
}

