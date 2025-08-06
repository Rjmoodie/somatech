import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, Send, FileText, Tag, RefreshCw, CheckCircle, XCircle } from "lucide-react";

// Mock campaign data for scaffold/demo
const MOCK_CAMPAIGNS = [
  {
    id: 1,
    name: "Spring Postcard Blast",
    date: "2024-04-10",
    type: "Postcard",
    status: "Completed",
    leads: 120,
    opens: null,
    responses: 18,
    tags: ["HOT", "Follow Up"],
    followUp: 5,
  },
  {
    id: 2,
    name: "Atlanta Email Outreach",
    date: "2024-05-01",
    type: "Email",
    status: "In Progress",
    leads: 80,
    opens: 42,
    responses: 9,
    tags: ["UNREACHABLE"],
    followUp: 2,
  },
  {
    id: 3,
    name: "Probate Letter Batch",
    date: "2024-05-15",
    type: "Letter",
    status: "Draft",
    leads: 30,
    opens: null,
    responses: null,
    tags: [],
    followUp: 0,
  },
];

const STATUS_COLORS = {
  "Completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Draft": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

const CampaignTrackingDashboard: React.FC = () => {
  const [campaigns] = useState(MOCK_CAMPAIGNS);

  return (
    <div className="p-2 md:p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-6">
        <Send className="text-blue-500" size={24} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Campaign Tracking Dashboard</h1>
      </div>
      <Card className="p-2 md:p-4 bg-white/90 dark:bg-gray-900/90 shadow-md overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Leads</TableHead>
              <TableHead>Opens</TableHead>
              <TableHead>Responses</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Follow-Up</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-semibold">{c.name}</TableCell>
                <TableCell>{c.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {c.type === "Email" && <Mail size={14} />} 
                    {c.type === "Postcard" && <FileText size={14} />} 
                    {c.type === "Letter" && <FileText size={14} />} 
                    {c.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                </TableCell>
                <TableCell>{c.leads}</TableCell>
                <TableCell>{c.opens !== null ? c.opens : <span className="text-gray-400">-</span>}</TableCell>
                <TableCell>{c.responses !== null ? c.responses : <span className="text-gray-400">-</span>}</TableCell>
                <TableCell>
                  {c.tags.length ? c.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="mr-1"><Tag size={12} className="inline mr-1" />{tag}</Badge>
                  )) : <span className="text-gray-400">-</span>}
                </TableCell>
                <TableCell>
                  {c.followUp > 0 ? (
                    <Badge variant="outline" className="flex items-center gap-1 text-blue-700 dark:text-blue-200"><RefreshCw size={12} />{c.followUp}</Badge>
                  ) : <span className="text-gray-400">-</span>}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label="View details"><CheckCircle size={16} /></Button>
                      </TooltipTrigger>
                      <TooltipContent>View campaign details</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label="Delete campaign"><XCircle size={16} /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete campaign</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CampaignTrackingDashboard; 