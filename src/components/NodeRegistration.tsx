import { useState } from 'react';
import { registerNode } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

export function NodeRegistration() {
  const [address, setAddress] = useState('');
  const [bandwidth, setBandwidth] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate node ID from address
      const nodeId = `node-${address.slice(2, 10).toLowerCase()}`;
      
      // Create a simple signature (in production, this should be done with wallet)
      const signature = '0x' + '0'.repeat(130); // Placeholder signature
      
      const result = await registerNode({
        address,
        nodeId,
        signature,
        rpcUrl: ''
      });

      if (result.success) {
        toast.success(result.message);
        setAddress('');
        setBandwidth('');
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-4 sm:mx-6 lg:mx-10 my-8 sm:my-12" id="register">
      <h2 className="text-foreground mb-4 sm:mb-6">Register New Node</h2>
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="address">Node Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="bandwidth">Bandwidth Capacity (GB)</Label>
            <Input
              id="bandwidth"
              type="number"
              step="0.1"
              placeholder="100"
              value={bandwidth}
              onChange={(e) => setBandwidth(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Registering...' : 'Register Node'}
          </Button>
        </form>
      </div>
    </section>
  );
}

