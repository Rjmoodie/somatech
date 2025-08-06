import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthProvider";
import { usePropertyLeads, PropertyLead } from "./usePropertyLeads";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Folder, Tag, Calendar, User, Star } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ExportCSVButton from "./ExportCSVButton";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Scaffold: My Properties Workspace Dashboard
const MyPropertiesWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [showWatchedOnly, setShowWatchedOnly] = useState(false);

  // Fetch saved leads for this user
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("saved_leads")
      .select("*, property:property_id(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setSaved(data || []);
        setLoading(false);
      });
  }, [user]);

  // Edit note handler
  const handleEditNote = (id: string, note: string) => {
    setEditingNote(id);
    setNoteDraft(note);
  };
  const handleSaveNote = async (id: string) => {
    await supabase.from("saved_leads").update({ notes: noteDraft }).eq("id", id);
    setSaved((prev) => prev.map((row) => row.id === id ? { ...row, notes: noteDraft } : row));
    setEditingNote(null);
  };
  const handleRemove = async (id: string) => {
    await supabase.from("saved_leads").delete().eq("id", id);
    setSaved((prev) => prev.filter((row) => row.id !== id));
  };

  const TAG_OPTIONS = ["Hot", "Follow Up", "Auction", "Flip", "Rental", "Probate", "Vacant", "Distressed"];
  const FOLDER_OPTIONS = ["All Properties", "2024 Watchlist", "Atlanta Flips", "(Create New List)"];

  const handleTagChange = async (id: string, tags: string[]) => {
    await supabase.from("saved_leads").update({ tags }).eq("id", id);
    setSaved((prev) => prev.map((row) => row.id === id ? { ...row, tags } : row));
  };
  const handleFolderChange = async (id: string, folder: string) => {
    await supabase.from("saved_leads").update({ folder }).eq("id", id);
    setSaved((prev) => prev.map((row) => row.id === id ? { ...row, folder } : row));
  };

  // Scaffold: Import CSV Dialog
  const ImportCSVDialog: React.FC<{ onImport: (rows: any[]) => void }> = ({ onImport }) => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      setFile(f || null);
      setError(null);
      if (f) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const text = evt.target?.result as string;
          const rows = text.split(/\r?\n/).filter(Boolean).map(line => line.split(","));
          const [header, ...data] = rows;
          setPreview(data.map(row => Object.fromEntries(header.map((h, i) => [h, row[i]]))));
        };
        reader.onerror = () => setError("Failed to read file");
        reader.readAsText(f);
      } else {
        setPreview([]);
      }
    };
    const handleImport = () => {
      if (preview.length) onImport(preview);
      setOpen(false);
      setFile(null);
      setPreview([]);
    };
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Import CSV</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Import Properties from CSV</DialogTitle>
          <DialogDescription>Upload a CSV file with property data. Preview and confirm to import.</DialogDescription>
          <input type="file" accept=".csv" onChange={handleFile} className="mb-2" />
          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          {preview.length > 0 && (
            <div className="max-h-40 overflow-y-auto border rounded bg-gray-50 dark:bg-gray-800 p-2 text-xs mb-2">
              <table className="w-full">
                <thead><tr>{Object.keys(preview[0]).map(h => <th key={h} className="pr-2 text-left">{h}</th>)}</tr></thead>
                <tbody>
                  {preview.slice(0, 5).map((row, i) => (
                    <tr key={i}>{Object.values(row).map((v, j) => <td key={j} className="pr-2">{v}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 5 && <div className="text-gray-400">...and {preview.length - 5} more rows</div>}
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleImport} disabled={!preview.length}>Import</Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const handleImportRows = async (rows: any[]) => {
    if (!user) return;
    // Map and insert each row as a new property and saved_lead
    for (const row of rows) {
      // Insert property if not exists (by address+zip)
      const { data: existing } = await supabase.from("properties").select("id").eq("address", row.address).eq("zip", row.zip).maybeSingle();
      let propertyId = existing?.id;
      if (!propertyId) {
        const { data: prop } = await supabase.from("properties").insert({ ...row }).select("id").single();
        propertyId = prop?.id;
      }
      if (propertyId) {
        await supabase.from("saved_leads").insert({ user_id: user.id, property_id: propertyId });
      }
    }
    // Refresh saved list
    supabase
      .from("saved_leads")
      .select("*, property:property_id(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setSaved(data || []));
  };

  return (
    <div className="p-2 md:p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-6">
        <Folder className="text-blue-500" size={24} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Properties Workspace</h1>
        <ExportCSVButton />
        <ImportCSVDialog onImport={handleImportRows} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showWatchedOnly ? "default" : "outline"}
                size="icon"
                className={showWatchedOnly ? "bg-yellow-400 text-white" : ""}
                onClick={() => setShowWatchedOnly((v) => !v)}
                aria-label="Show only watched properties"
              >
                <Star fill={showWatchedOnly ? "#facc15" : "none"} className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show only watched properties</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* Placeholder for folders/lists */}
      <div className="mb-4 flex gap-2">
        <Button variant="outline" size="sm" disabled><Folder size={16} /> All Properties</Button>
        <Button variant="outline" size="sm" disabled><Folder size={16} /> + New Folder (Coming Soon)</Button>
      </div>
      {loading ? (
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      ) : saved.length === 0 ? (
        <div className="text-gray-400 dark:text-gray-500">No saved properties yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {(showWatchedOnly ? saved.filter(row => (row.tags || []).includes("watchlist")) : saved).map((row) => {
            const p: PropertyLead = row.property || {};
            const isWatched = (row.tags || []).includes("watchlist");
            return (
              <Card key={row.id} className="p-4 flex flex-col gap-2 bg-white/90 dark:bg-gray-900/90 shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <User size={16} className="text-blue-400" />
                  <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">{p.address || "[No Address]"}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant={isWatched ? "default" : "outline"}
                          className={isWatched ? "bg-yellow-400 text-white ml-2" : "ml-2"}
                          onClick={() => {
                            const newTags = isWatched
                              ? (row.tags || []).filter((t: string) => t !== "watchlist")
                              : [...(row.tags || []), "watchlist"];
                            handleTagChange(row.id, newTags);
                          }}
                          aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
                        >
                          <Star fill={isWatched ? "#facc15" : "none"} className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{isWatched ? "Remove from watchlist" : "Add to watchlist"}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{p.city}, {p.state} {p.zip}</div>
                <div className="flex flex-wrap gap-2 items-center mb-1">
                  <Badge variant="secondary">{p.owner_name || "N/A"}</Badge>
                  <Badge variant="secondary">{p.owner_type || "N/A"}</Badge>
                  {/* Tag input (multi-select) */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex gap-1">
                          {TAG_OPTIONS.map((tag) => (
                            <Badge
                              key={tag}
                              variant={row.tags?.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const newTags = row.tags?.includes(tag)
                                  ? row.tags.filter((t: string) => t !== tag)
                                  : [...(row.tags || []), tag];
                                handleTagChange(row.id, newTags);
                              }}
                            >
                              <Tag size={12} className="inline mr-1" />{tag}
                            </Badge>
                          ))}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Click to add/remove tags</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {/* Folder selector (dropdown, placeholder) */}
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">List:</span>
                  <Select value={row.folder || FOLDER_OPTIONS[0]} onValueChange={val => handleFolderChange(row.id, val)}>
                    <SelectTrigger className="w-36 text-xs">
                      {row.folder || FOLDER_OPTIONS[0]}
                    </SelectTrigger>
                    <SelectContent>
                      {FOLDER_OPTIONS.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 items-center text-xs text-gray-600 dark:text-gray-300 mb-1">
                  <Calendar size={14} /> Saved: {new Date(row.created_at).toLocaleDateString()}
                  <Badge variant="outline" className="ml-2">{p.status || "N/A"}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => handleEditNote(row.id, row.notes || "")}><Edit size={16} /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit notes</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => handleRemove(row.id)}><Trash2 size={16} /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove from saved</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="mt-2">
                  <span className="font-semibold text-xs">Notes:</span>
                  {editingNote === row.id ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        className="border rounded px-2 py-1 text-xs w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={noteDraft}
                        onChange={e => setNoteDraft(e.target.value)}
                        autoFocus
                      />
                      <Button size="sm" variant="secondary" onClick={() => handleSaveNote(row.id)}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingNote(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-700 dark:text-gray-200 mt-1 min-h-[24px]">{row.notes || <span className="italic text-gray-400">No notes</span>}</div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesWorkspace; 