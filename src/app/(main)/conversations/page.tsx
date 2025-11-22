"use client";

import React, { useState } from "react";
import { chatSessionService } from "@/services/chat-session-service";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MessageSquare,
  Calendar,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ChatSession {
  id: number;
  user_id: number;
  trip_id: number | null;
  session_type: string;
  context: {
    budget?: string;
    interests?: string[];
    travel_dates?: {
      start: string;
      end: string;
    };
    destination?: string;
  };
  is_active: boolean;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

const Page = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ChatSession | null>(null);
  const [formData, setFormData] = useState({
    session_type: "trip_planning",
    trip_id: "",
    context: {
      budget: "moderate",
      interests: [] as string[],
      destination: "",
      travel_dates: {
        start: "",
        end: "",
      },
    },
  });

  const {
    data: sessions,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["chat-sessions"],
    queryFn: async () => {
      const { data } = await chatSessionService.getSessions({});
      return data?.data || [];
    },
  });

  const { mutate: createSession, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const payload = {
        session_type: formData.session_type,
        trip_id: formData.trip_id ? parseInt(formData.trip_id) : null,
        context: formData.context,
      };
      const data = await chatSessionService.createSession(payload as any);
      return data;
    },
    onSuccess: () => {
      toast.success("Chat session created successfully!");
      setOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create chat session.");
    },
  });

  const { mutate: updateSession, isPending: isUpdating } = useMutation({
    mutationFn: async (data: { id: number; updates: any }) => {
      await chatSessionService.updateSession(data.id.toString(), data.updates);
    },
    onSuccess: () => {
      toast.success("Chat session updated successfully!");
      setOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update chat session.");
    },
  });

  const { mutate: deleteSession, isPending: isDeleting } = useMutation({
    mutationFn: async (sessionId: number) => {
      await chatSessionService.deleteSession(sessionId.toString());
    },
    onSuccess: () => {
      toast.success("Chat session deleted successfully!");
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete chat session.");
    },
  });

  const resetForm = () => {
    setFormData({
      session_type: "trip_planning",
      trip_id: "",
      context: {
        budget: "moderate",
        interests: [],
        destination: "",
        travel_dates: {
          start: "",
          end: "",
        },
      },
    });
    setEditingSession(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("context.")) {
      const key = name.replace("context.", "");
      setFormData((prev) => ({
        ...prev,
        context: {
          ...prev.context,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSession) {
      const toastId = toast.loading("Updating session...");
      updateSession({
        id: editingSession.id,
        updates: {
          session_type: formData.session_type,
          trip_id: formData.trip_id ? parseInt(formData.trip_id) : null,
          context: formData.context,
        },
      });
      toast.dismiss(toastId);
    } else {
      const toastId = toast.loading("Creating session...");
      createSession();
      toast.dismiss(toastId);
    }
  };

  const handleEditSession = (session: ChatSession) => {
    setEditingSession(session);
    setFormData({
      session_type: session.session_type,
      trip_id: session.trip_id?.toString() || "",
      context: {
        budget: session.context.budget || "moderate",
        interests: session.context.interests || [],
        destination: session.context.destination || "",
        travel_dates: session.context.travel_dates || {
          start: "",
          end: "",
        },
      },
    });
    setOpen(true);
  };

  const handleDeleteSession = (sessionId: number) => {
    if (!confirm("Are you sure you want to delete this chat session?")) {
      return;
    }

    const toastId = toast.loading("Deleting session...");
    deleteSession(sessionId);
    toast.dismiss(toastId);
  };

  const handleCloseSheet = () => {
    setOpen(false);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
            <p className="mt-1 text-gray-600">Manage your chat sessions and conversations</p>
          </div>

          <Sheet
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) {
                handleCloseSheet();
              }
            }}
          >
            <Button className="flex items-center gap-2" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              New Session
            </Button>

            <SheetContent className="w-full overflow-y-auto px-4 sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>{editingSession ? "Edit Session" : "Create New Session"}</SheetTitle>
                <SheetDescription>
                  {editingSession
                    ? "Update your chat session details"
                    : "Create a new chat session for trip planning"}
                </SheetDescription>
              </SheetHeader>

              <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between pb-4">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session_type">Session Type</Label>
                    <Input
                      id="session_type"
                      name="session_type"
                      placeholder="e.g., trip_planning"
                      value={formData.session_type}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trip_id">Trip ID (Optional)</Label>
                    <Input
                      id="trip_id"
                      name="trip_id"
                      type="number"
                      placeholder="Leave empty for no trip"
                      value={formData.trip_id}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      name="context.destination"
                      placeholder="e.g., Korea"
                      value={formData.context.destination}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      name="context.budget"
                      placeholder="e.g., moderate"
                      value={formData.context.budget}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        name="context.start_date"
                        type="date"
                        value={formData.context.travel_dates?.start || ""}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            context: {
                              ...prev.context,
                              travel_dates: {
                                ...prev.context.travel_dates,
                                start: e.target.value,
                              },
                            },
                          }));
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        name="context.end_date"
                        type="date"
                        value={formData.context.travel_dates?.end || ""}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            context: {
                              ...prev.context,
                              travel_dates: {
                                ...prev.context.travel_dates,
                                end: e.target.value,
                              },
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    size={"lg"}
                    variant="outline"
                    onClick={handleCloseSheet}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size={"lg"}
                    className="flex-1"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        {editingSession ? "Updating..." : "Creating..."}
                      </span>
                    ) : editingSession ? (
                      "Update Session"
                    ) : (
                      "Create Session"
                    )}
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {/* Sessions Grid */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mb-4 animate-spin text-4xl">⏳</div>
            <p className="text-gray-600">Loading your conversations...</p>
          </div>
        ) : sessions?.length === 0 ? (
          <div className="py-12 text-center">
            <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No conversations yet</h3>
            <p className="mb-4 text-gray-600">Start a new chat session to begin planning!</p>
            <Button onClick={() => setOpen(true)}>Create Your First Session</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions?.map((session: ChatSession) => (
              <Card key={session.id} className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2 flex items-center gap-2 text-lg">
                        <MessageSquare className="h-5 w-5" />
                        {session.session_type}
                      </CardTitle>
                      {session.context.destination && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{session.context.destination}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`rounded-full border px-2 py-1 text-xs ${
                        session.is_active
                          ? "border-green-200 bg-green-100 text-green-700"
                          : "border-gray-200 bg-gray-100 text-gray-700"
                      }`}
                    >
                      {session.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {session.trip_id && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Trip ID: {session.trip_id}</span>
                    </div>
                  )}

                  {session.context.budget && (
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Budget:</span> {session.context.budget}
                    </div>
                  )}

                  {session.context.travel_dates?.start && session.context.travel_dates?.end && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {calculateDuration(
                          session.context.travel_dates.start,
                          session.context.travel_dates.end,
                        )}{" "}
                        days
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-2">
                    <p className="text-xs text-gray-500">
                      Started: {formatDate(session.started_at)}
                    </p>
                  </div>

                  <div className="flex gap-2 border-t pt-3">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        router.push(
                          `/chat?sessionId=${session.id}${session.trip_id ? `&tripId=${session.trip_id}` : ""}`,
                        )
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Open Chat
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="px-3" disabled={isDeleting}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditSession(session)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Session
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Session
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
