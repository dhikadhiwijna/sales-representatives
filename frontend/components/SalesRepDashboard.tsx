'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Brain, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(...registerables);

interface Deal {
  client: string;
  value: number;
  status: string;
}

interface Client {
  id: number;
  name: string;
  industry: string;
  contact: string;
}

interface SalesRep {
  id: number;
  name: string;
  role: string;
  region: string;
  skills: string[];
  deals: Deal[];
  clients: Client[];
}

interface DummyData {
  salesReps: SalesRep[];
}

export default function SalesRepDashboard() {
  const [users, setUsers] = useState<DummyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof SalesRep | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  useEffect(() => {
    fetch("http://localhost:8000/api/data")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  const handleAskQuestion = async () => {
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: aiQuestion }),
      });

      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error in AI response",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSort = (key: keyof SalesRep) => {
    setSortKey(key);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredAndSortedUsers = users?.salesReps
    .filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.region.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const chartData = {
    labels: users?.salesReps.map((user) => user.name),
    datasets: [
      {
        label: 'Total Deals Value',
        data: users?.salesReps.map((user) =>
          user.deals.reduce((sum, deal) => sum + deal.value, 0)
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">Failed to load sales data. Please try again later.</p>
          <Button onClick={() => { setError(false); setLoading(true); }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
        <Users className="h-8 w-8" />
        Sales Representatives Dashboard
      </h1>
      <div className="flex justify-center items-center" style={{ height: '33vh', width: '100%' }}>
        <Bar data={chartData} className="mb-8" />
      </div>

      <Input
        placeholder="Search by name or region..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />


      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')}>Name</TableHead>
            <TableHead onClick={() => handleSort('region')}>Region</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Total Deals Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.region}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                ${user.deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
              </TableCell>
              <TableCell>
                <Tabs defaultValue="clients" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="deals">Deals</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                  </TabsList>

                  <TabsContent value="clients">
                    <div className="space-y-4">
                      {user.clients.map((client) => (
                        <div key={client.id}>
                          <span className="font-medium">{client.name}</span> - {client.industry}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="deals">
                    <div className="space-y-4">
                      {user.deals.map((deal, index) => (
                        <div key={index}>
                          <span className="font-medium">{deal.client}</span> - ${deal.value.toLocaleString()} ({deal.status})
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="skills">
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain className="h-6 w-6" />
          AI Sales Assistant
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          className="flex gap-2 mb-4"
        >
          <Input
            placeholder="Ask a question about the sales data..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
          />
          <Button type="submit" disabled={aiLoading}>
            {aiLoading ? "Thinking..." : "Ask AI"}
          </Button>
        </form>
        {aiResponse && (
          <div className="bg-muted p-4 rounded">
            <ul>
              {aiResponse.split('\n').map((line, index) => (
                <li
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: line
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>'),
                  }}
                ></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}