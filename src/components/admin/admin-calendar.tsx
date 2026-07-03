"use client";

import { EventClickArg, EventContentArg } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import { useMemo, useState } from "react";
import { format } from "date-fns";

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Icons
import {
  Clock,
  User,
  Phone,
  Scissors,
  AlignLeft,
  CalendarDays,
  Info,
} from "lucide-react";

type AdminCalendarProps = {
  staff: any;
  events: any[];
};

function weekdayMap() {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
}

export default function AdminCalendar({ staff, events }: AdminCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const businessHours = useMemo(() => {
    const keys = weekdayMap();

    return keys
      .map((key, index) => {
        const slot = staff?.availability?.[key];
        if (!slot?.active || !slot?.start || !slot?.end) return null;

        return {
          daysOfWeek: [index],
          startTime: slot.start,
          endTime: slot.end,
        };
      })
      .filter(Boolean);
  }, [staff]);

  const handleEventClick = (info: EventClickArg) => {
    const event = info.event;
    if (event.extendedProps?.type === "dayOff") return;

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      ...event.extendedProps,
    });
  };

  // Status to Color mapping for events
  const getEventColors = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-500 text-white border-emerald-600";
      case "confirmed":
        return "bg-blue-500 text-white border-primary";
      case "pending":
        return "bg-amber-500 text-white border-amber-600";
      case "cancelled":
        return "bg-rose-500 text-white border-rose-600";
      default:
        return "bg-primary text-primary-foreground border-primary/80"; // Fallback to shadcn primary
    }
  };

  const renderEventContent = (info: EventContentArg) => {
    const isDayOff = info.event.extendedProps?.type === "dayOff";

    if (isDayOff) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/40 p-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Day Off
          </span>
        </div>
      );
    }

    const colors = getEventColors(info.event.extendedProps?.status);

    return (
      <div
        className={`flex h-full w-full flex-col overflow-hidden rounded-md border px-1.5 py-1 shadow-sm transition-opacity hover:opacity-90 ${colors}`}
      >
        <p className="truncate text-[11px] font-semibold leading-tight">
          {info.event.title}
        </p>
        <p className="truncate text-[10px] font-medium opacity-90">
          {info.timeText}
        </p>
        {info.event.extendedProps?.customerName && (
          <p className="mt-0.5 truncate text-[9px] opacity-80">
            {info.event.extendedProps.customerName}
          </p>
        )}
      </div>
    );
  };

  const minTime = "06:00:00";
  const maxTime = "22:00:00";

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <Card className="overflow-hidden border-border/50 shadow-sm">
        <CardContent className="p-0 sm:p-4">
          {/* 
            This wrapper uses Tailwind arbitrary variants to override FullCalendar's 
            default CSS variables so it matches your Shadcn UI theme perfectly.
          */}
          <div className="fc-theme-standard [&_.fc-button-primary]:bg-primary [&_.fc-button-primary]:border-primary [&_.fc-button-primary:hover]:bg-primary/90 [&_.fc-button-primary:focus]:ring-primary/50 [&_.fc-scrollgrid]:border-border [&_.fc-theme-standard_td]:border-border [&_.fc-theme-standard_th]:border-border [&_td]:border-border [&_th]:border-border">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              events={events}
              businessHours={businessHours}
              nowIndicator
              editable={false}
              selectable={false}
              allDaySlot={false}
              firstDay={1}
              slotMinTime={minTime}
              slotMaxTime={maxTime}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
              height="70vh"
              displayEventEnd
              // Remove default fullcalendar event styling to let our custom component take over
              eventClassNames="border-none bg-transparent shadow-none"
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }}
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Availability Column */}
        <Card className="md:col-span-4 border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => {
                const slot = staff?.availability?.[day];
                const isOff = !slot?.active;

                return (
                  <div
                    key={day}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="w-10 capitalize font-medium text-foreground">
                      {day}
                    </span>
                    {isOff ? (
                      <Badge variant="secondary" className="text-muted-foreground">
                        Off
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground font-medium">
                        {slot.start} - {slot.end}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Booking Details Column */}
        <Card className="md:col-span-8 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <Info className="h-4 w-4" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {!selectedEvent ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground opacity-70 min-h-[200px]">
                <CalendarDays className="mb-2 h-10 w-10 stroke-[1.5]" />
                <p className="text-sm">
                  Click on an event to view full booking details.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      {selectedEvent.serviceName}
                    </h3>
                    <p className="text-lg font-semibold text-primary">
                      ${selectedEvent.totalPrice || 0}
                    </p>
                  </div>
                  <Badge
                    variant={
                      selectedEvent.status === "completed"
                        ? "default"
                        : "secondary"
                    }
                    className="px-3 py-1 capitalize text-sm"
                  >
                    {selectedEvent.status}
                  </Badge>
                </div>

                <Separator />

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Scissors className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Pet Details</p>
                        <p className="text-muted-foreground">
                          {selectedEvent.petName} ({selectedEvent.petBreed || "Mixed"})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Customer</p>
                        <p className="text-muted-foreground">
                          {selectedEvent.customerName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-muted-foreground">
                          {selectedEvent.customerPhone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-muted-foreground">
                          {format(selectedEvent.start, "h:mm a")} -{" "}
                          {format(selectedEvent.end, "h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notes Block */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                    Notes
                  </div>
                  <ScrollArea className="h-24 w-full rounded-md border bg-muted/30 p-3 text-sm">
                    {selectedEvent.notes ? (
                      <span className="text-foreground">{selectedEvent.notes}</span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        No additional notes provided for this booking.
                      </span>
                    )}
                  </ScrollArea>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}