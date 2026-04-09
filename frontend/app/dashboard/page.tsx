"use client";

import { useState, useEffect } from "react";
import { useUser, useLogout, useUpdateDiscord } from "@/hooks/use-auth";
import { useEvents, useDeleteEvent, CalendarEvent } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EventDialog } from "@/components/event-dialog";
import { 
  LogOut, 
  User, 
  ShieldCheck, 
  HelpCircle, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Calendar, 
  Pencil, 
  Trash2,
  ExternalLink
} from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: events, isLoading: isEventsLoading } = useEvents();
  const logout = useLogout();
  const updateDiscord = useUpdateDiscord();
  const deleteEvent = useDeleteEvent();
  
  const [discordId, setDiscordId] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Event Management State
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.discordId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiscordId(user.discordId);
    }
  }, [user?.discordId]);

  const handleUpdateDiscord = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    updateDiscord.reset();

    if (!/^\d{17,20}$/.test(discordId)) {
      setValidationError("Discord ID must be 17-20 digits.");
      return;
    }

    try {
      await updateDiscord.mutateAsync(discordId);
    } catch (err) {
      console.error("Discord update failed:", err);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEventToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDeleteId) return;
    try {
      await deleteEvent.mutateAsync(eventToDeleteId);
      setIsDeleteDialogOpen(false);
      setEventToDeleteId(null);
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center">
              <ShieldCheck className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                Dashboard
              </h1>
              <p className="text-zinc-500 text-sm">Welcome back, {user?.email.split('@')[0]}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => logout.mutate()}
            className="text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-200">
                  <User className="h-5 w-5 text-purple-400" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-sm">Email</span>
                    <span className="text-zinc-200 font-medium">{user?.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-200">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />
                  Discord Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleUpdateDiscord} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="discordId" className="text-zinc-300">Discord ID</Label>
                      <div className="group relative">
                        <HelpCircle className="h-4 w-4 text-zinc-500 cursor-help hover:text-zinc-300 transition-colors" />
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-800 text-[10px] text-zinc-300 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                          Enable &quot;Developer Mode&quot; in Discord Settings &gt; Advanced, then right-click your profile to &quot;Copy User ID&quot;.
                        </div>
                      </div>
                    </div>
                    <Input 
                      id="discordId"
                      value={discordId}
                      onChange={(e) => setDiscordId(e.target.value)}
                      placeholder="e.g. 123456789012345678"
                      className="bg-black/50 border-white/10 text-zinc-200 focus:border-blue-500/50"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={updateDiscord.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-500"
                  >
                    {updateDiscord.isPending ? <Loader2 className="animate-spin" /> : "Update Link"}
                  </Button>
                  
                  {updateDiscord.isSuccess && (
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Updated!
                    </p>
                  )}
                  {(validationError || updateDiscord.isError) && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> 
                      {validationError || (updateDiscord.error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error"}
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-zinc-200">
                    <Calendar className="h-5 w-5 text-green-400" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription className="text-zinc-500">
                    Your schedule for the next 24 hours.
                  </CardDescription>
                </div>
                <Button onClick={handleCreateEvent} className="bg-green-600 hover:bg-green-500">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </CardHeader>
              <CardContent>
                {isEventsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
                  </div>
                ) : events && events.length > 0 ? (
                  <div className="relative rounded-xl border border-white/5 bg-black/20 overflow-hidden">
                    <div className="overflow-x-auto overflow-y-visible custom-scrollbar">
                      <Table className="min-w-[650px] table-fixed">
                        <TableHeader className="bg-white/[0.02] border-white/5">
                          <TableRow className="hover:bg-transparent border-white/5 h-12">
                            <TableHead className="w-[50%] px-6 text-zinc-400 font-medium">Event Details</TableHead>
                            <TableHead className="w-[30%] px-4 text-zinc-400 font-medium text-center">Schedule</TableHead>
                            <TableHead className="w-[20%] px-6 text-zinc-400 font-medium text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events.map((event) => (
                            <TableRow key={event.id} className="border-white/5 hover:bg-white/[0.04] transition-all group h-20">
                              <TableCell className="px-6 py-4">
                                <div className="flex flex-col gap-1.5">
                                  <div className="font-semibold text-zinc-100 group-hover:text-white transition-colors leading-tight truncate">
                                    {event.summary}
                                  </div>
                                  <div className="text-xs text-zinc-500 line-clamp-2 leading-relaxed max-w-md">
                                    {event.description || "\u2014"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-4 text-center">
                                <div className="inline-flex flex-col items-center p-2 rounded-lg bg-white/[0.03] border border-white/5 min-w-[120px]">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400/80">
                                    {new Date(event.start.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                  </span>
                                  <span className="text-sm font-medium text-zinc-300">
                                    {new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <div className="flex justify-end items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    variant="ghost" 
                                    size="icon-sm" 
                                    onClick={() => handleEditEvent(event)}
                                    className="h-8 w-8 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg"
                                    title="Edit Event"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon-sm" 
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                                    title="Delete Event"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  {event.htmlLink && (
                                    <a 
                                      href={event.htmlLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="flex items-center justify-center h-8 w-8 text-zinc-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                      title="Open in Google Calendar"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-black/20 rounded-xl border border-dashed border-white/10">
                    <Calendar className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-400">No events scheduled for the next 24 hours.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EventDialog 
        isOpen={isEventDialogOpen} 
        onClose={() => setIsEventDialogOpen(false)} 
        event={editingEvent}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Event?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500">
              This action cannot be undone. This will permanently remove the event from your Google Calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteEvent.isPending} className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteEvent.isPending}
              className="bg-red-600 hover:bg-red-500 text-white font-medium"
            >
              {deleteEvent.isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
