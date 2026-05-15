import { useState } from 'react';
import { NodeInfo } from './NodeInfo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Search } from 'lucide-react';

export function NodeDashboard() {
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('0x742d...4f2a');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress) {
      setSelectedAddress(searchAddress);
    }
  };

  return (
    <section className="mx-4 sm:mx-6 lg:mx-10 my-8 sm:my-12" id="nodes">
      <h2 className="text-foreground mb-4 sm:mb-6">Node Dashboard</h2>
      
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <Label htmlFor="search-address" className="sr-only">Search Node Address</Label>
            <Input
              id="search-address"
              type="text"
              placeholder="Enter node address (e.g., 0x742d...4f2a)"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      <NodeInfo address={selectedAddress} />
    </section>
  );
}

