"use client"

import { useState, useEffect } from "react"
import { useAddEvent, useUpdateEvent, CalendarEvent } from "@/hooks/use-events"
import { Dialog, DialogPopup, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Loader2, CalendarIcon } from "lucide-react"
import { format, parseISO, startOfHour, addHours } from "date-fns"
import { cn } from "@/lib/utils"

interface EventDialogProps {
  isOpen: boolean
  onClose: () => void
  event?: CalendarEvent | null
}

export function EventDialog({ isOpen, onClose, event }: EventDialogProps) {
  const addEvent = useAddEvent()
  const updateEvent = useUpdateEvent()

  const [summary, setSummary] = useState("")
  const [description, setDescription] = useState("")
  
  // Separate date and time for cleaner UI
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState("09:00")
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [endTime, setEndTime] = useState("10:00")

  useEffect(() => {
    if (event && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSummary(event.summary)
      setDescription(event.description || "")
      const start = parseISO(event.start.dateTime)
      const end = parseISO(event.end.dateTime)
      setStartDate(start)
      setStartTime(format(start, "HH:mm"))
      setEndDate(end)
      setEndTime(format(end, "HH:mm"))
    } else if (isOpen) {
      setSummary("")
      setDescription("")
      const now = startOfHour(addHours(new Date(), 1))
      setStartDate(now)
      setStartTime(format(now, "HH:mm"))
      setEndDate(addHours(now, 1))
      setEndTime(format(addHours(now, 1), "HH:mm"))
    }
  }, [event, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) return

    // Combine date and time
    const [startH, startM] = startTime.split(":").map(Number)
    const [endH, endM] = endTime.split(":").map(Number)

    const finalStart = new Date(startDate)
    finalStart.setHours(startH, startM)

    const finalEnd = new Date(endDate)
    finalEnd.setHours(endH, endM)

    const payload = {
      summary,
      description,
      start: { dateTime: finalStart.toISOString() },
      end: { dateTime: finalEnd.toISOString() },
    }

    try {
      if (event) {
        await updateEvent.mutateAsync({ id: event.id, event: payload })
      } else {
        await addEvent.mutateAsync(payload)
      }
      onClose()
    } catch (err) {
      console.error("Failed to save event", err)
    }
  }

  const isPending = addEvent.isPending || updateEvent.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPopup className="sm:max-w-[450px] bg-zinc-950 border-zinc-800 text-white shadow-2xl overflow-visible">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{event ? "Edit Event" : "New Event"}</DialogTitle>
            <DialogDescription className="text-zinc-500">
              {event ? "Modify your appointment details." : "Schedule a new meeting or event."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="summary" className="text-zinc-400">Title</Label>
              <Input
                id="summary"
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Team Sync"
                className="bg-zinc-900 border-zinc-800 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-400">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Meeting notes, agenda, etc..."
                className="bg-zinc-900 border-zinc-800 focus:border-purple-600 min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-4 pt-2">
              {/* Start Date & Time */}
              <div className="space-y-2">
                <Label className="text-zinc-400">Starts</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 min-w-0">
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-zinc-900 border-zinc-800 h-11 hover:bg-zinc-800",
                              !startDate && "text-zinc-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-purple-500" />
                            <span className="truncate">
                              {startDate ? format(startDate, "PPP") : "Pick a date"}
                            </span>
                          </Button>
                        }
                      />
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="w-full sm:w-32 shrink-0">
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-zinc-900 border-zinc-800 h-11 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* End Date & Time */}
              <div className="space-y-2">
                <Label className="text-zinc-400">Ends</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 min-w-0">
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-zinc-900 border-zinc-800 h-11 hover:bg-zinc-800",
                              !endDate && "text-zinc-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-green-500" />
                            <span className="truncate">
                              {endDate ? format(endDate, "PPP") : "Pick a date"}
                            </span>
                          </Button>
                        }
                      />
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="w-full sm:w-32 shrink-0">
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-zinc-900 border-zinc-800 h-11 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
              className="hover:bg-zinc-900 text-zinc-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !startDate || !endDate}
              className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {event ? "Update Event" : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  )
}
