'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner, Input, Button, Alert, Select, Badge, Card } from '@/components/ui';

// Types
interface CartHistory {
  id: string;
  items: any[];
  stage: 'ADDED_TO_CART' | 'STARTED_CHECKOUT' | 'COMPLETED_CHECKOUT' | 'ABANDONED_CART';
  createdAt: string;
}

interface Lead {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  cartHistory: CartHistory[];
  convertedToCustomerId?: string;
  convertedToCustomer?: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function LeadsPage() {
  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();

  // Fetch leads on component mount and when filters change
  useEffect(() => {
    fetchLeads();
  }, [currentPage, searchTerm, statusFilter]);

  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage.toString());
      queryParams.append('pageSize', '10');
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }
      
      // Fetch leads from API
      const response = await fetch(`/api/admin/leads?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setLeads(data.leads);
      setTotalPages(data.meta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching leads');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update lead status
  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update lead: ${response.status} ${response.statusText}`);
      }
      
      // Refresh leads after update
      fetchLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating lead status');
      console.error('Error updating lead status:', err);
    }
  };

  // Function to get appropriate badge color for status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'CONTACTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'QUALIFIED':
        return 'bg-green-100 text-green-800';
      case 'CONVERTED':
        return 'bg-indigo-100 text-indigo-800';
      case 'LOST':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Lead Management</h1>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <Input
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
          </Select>
        </div>
        
        <Button onClick={fetchLeads} className="w-full md:w-auto">
          Filter
        </Button>
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-8">
          <Spinner size="lg" />
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          {error}
        </Alert>
      )}
      
      {/* Leads table */}
      {!loading && leads.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No leads found. Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name / Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cart Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.name || 'Unknown Name'}
                    </div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                    {lead.phone && <div className="text-sm text-gray-500">{lead.phone}</div>}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(lead.createdAt)}
                  </td>
                  
                  <td className="px-6 py-4">
                    {lead.cartHistory.length > 0 ? (
                      <div className="max-h-24 overflow-y-auto text-sm">
                        {lead.cartHistory.map((history) => (
                          <div key={history.id} className="mb-2">
                            <Badge className="mb-1">
                              {history.stage.replace('_', ' ')}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {new Date(history.createdAt).toLocaleString()}
                            </div>
                            <div className="text-xs">
                              {history.items.length} items
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No activity</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusBadgeColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.convertedToCustomer ? (
                      <a
                        href={`/admin/customers/${lead.convertedToCustomerId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {lead.convertedToCustomer.name || lead.convertedToCustomer.email}
                      </a>
                    ) : (
                      'Not converted'
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col space-y-2">
                      {lead.status !== 'CONVERTED' && (
                        <Select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="text-sm"
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="QUALIFIED">Qualified</option>
                          <option value="LOST">Lost</option>
                        </Select>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/leads/${lead.id}`)}
                      >
                        View Details
                      </Button>
                      
                      {lead.status !== 'CONVERTED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/leads/${lead.id}/convert`)}
                        >
                          Convert to Customer
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <span className="flex items-center px-4 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 