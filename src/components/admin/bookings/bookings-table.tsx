"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { CalendarDays, Download, Eye, Filter, FileText, Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { updateBookingStatusAction } from "@/actions/bookings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingDetailsSheet } from "./booking-details-sheet";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const statusOptions = ["all", "pending", "confirmed", "completed", "cancelled"];

// Tailored color styling maps for statuses
function getStatusStyles(status: string) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-blue-50 text-primary border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900 hover:bg-blue-100/80";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900 hover:bg-emerald-100/80";
    case "cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900 hover:bg-rose-100/80";
    case "pending":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900 hover:bg-amber-100/80";
  }
}

function buildExportRows(rows: any[]) {
  return rows.map((booking) => ({
    ID: booking.id || "",
    Customer: booking.customerSnapshot?.name || "",
    Phone: booking.customerSnapshot?.phone || booking.customerId || "",
    Pet: booking.petSnapshot?.name || "",
    Breed: booking.petSnapshot?.breed || "",
    Vaccinated: booking.petSnapshot?.vaccinated ? "Yes" : "No",
    Service: booking.serviceSnapshot?.name || booking.serviceId || "",
    Staff: booking.staffSnapshot?.name || booking.staffId || "",
    Date: booking.date || "",
    StartTime: booking.startTime || "",
    EndTime: booking.endTime || "",
    Status: booking.status || "",
    Total: Number(booking.totalPrice || 0).toFixed(2),
    Notes: booking.notes || "",
  }));
}

function downloadXml(filename: string, rows: any[]) {
  const xmlRows = rows
    .map((row) => {
      return `
  <booking>
    <id>${row.ID}</id>
    <customer>${row.Customer}</customer>
    <phone>${row.Phone}</phone>
    <pet>${row.Pet}</pet>
    <breed>${row.Breed}</breed>
    <vaccinated>${row.Vaccinated}</vaccinated>
    <service>${row.Service}</service>
    <staff>${row.Staff}</staff>
    <date>${row.Date}</date>
    <startTime>${row.StartTime}</startTime>
    <endTime>${row.EndTime}</endTime>
    <status>${row.Status}</status>
    <total>${row.Total}</total>
    <notes>${row.Notes}</notes>
  </booking>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<bookings>${xmlRows}
</bookings>`;

  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function BookingsTable({ bookings }: { bookings: any[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    const rows = bookings.filter((booking: any) => {
      const customerName = String(booking.customerSnapshot?.name || "").toLowerCase();
      const phone = String(booking.customerSnapshot?.phone || booking.customerId || "").toLowerCase();
      const petName = String(booking.petSnapshot?.name || "").toLowerCase();
      const breed = String(booking.petSnapshot?.breed || "").toLowerCase();
      const serviceName = String(booking.serviceSnapshot?.name || booking.serviceId || "").toLowerCase();
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        customerName.includes(searchValue) ||
        phone.includes(searchValue) ||
        petName.includes(searchValue) ||
        breed.includes(searchValue) ||
        serviceName.includes(searchValue);

      const matchesStatus = status === "all" || booking.status === status;
      const matchesDate = !dateFilter || booking.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });

    rows.sort((a: any, b: any) => {
      switch (sortBy) {
        case "price_asc":
          return Number(a.totalPrice || 0) - Number(b.totalPrice || 0);
        case "price_desc":
          return Number(b.totalPrice || 0) - Number(a.totalPrice || 0);
        case "date_asc":
          return String(a.date || "").localeCompare(String(b.date || ""));
        case "date_desc":
          return String(b.date || "").localeCompare(String(b.date || ""));
        case "customer_asc":
          return String(a.customerSnapshot?.name || "").localeCompare(
            String(b.customerSnapshot?.name || "")
          );
        case "status_asc":
          return String(a.status || "").localeCompare(String(b.status || ""));
        default:
          return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      }
    });

    return rows;
  }, [bookings, search, status, dateFilter, sortBy]);

  const exportRows = useMemo(() => buildExportRows(filtered), [filtered]);

  const handleExcelExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "bookings-filtered.xlsx");
  };

  const handleXmlExport = () => {
    downloadXml("bookings-filtered.xml", exportRows);
  };

  // Instant continuous status changes without buttons
  const handleInstantStatusUpdate = async (bookingId: string, newStatus: string) => {
    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("status", newStatus);
    await updateBookingStatusAction(formData);
  };

  const openDetails = (booking: any) => {
    setSelectedBooking(booking);
    setSheetOpen(true);
  };

  return (
    <>
      <Card className="rounded-2xl border-muted/60 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">All bookings</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Filter, export, and manage bookings from one place.
              </p>
            </div>

            {/* Custom styled actionable contextual buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={showFilters ? "secondary" : "outline"}
                onClick={() => setShowFilters((prev) => !prev)}
                className={showFilters ? "bg-slate-200 text-slate-900 border-slate-300 font-medium" : ""}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>

              <Button
                variant="outline"
                onClick={handleExcelExport}
                className="border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-600 hover:text-white dark:border-emerald-900 dark:text-emerald-400 dark:bg-emerald-950/20 transition-all duration-200"
              >
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>

              <Button
                variant="outline"
                onClick={handleXmlExport}
                className="border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white dark:border-indigo-900 dark:text-indigo-400 dark:bg-indigo-950/20 transition-all duration-200"
              >
                <FileText className="mr-2 h-4 w-4" />
                XML
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((item) => (
              <Button
                key={item}
                type="button"
                variant={status === item ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus(item)}
                className="capitalize font-medium shadow-xs"
              >
                {item === "all" ? "All" : item}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Input
              placeholder="Search by customer, phone, pet, breed, or service"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="lg:max-w-sm"
            />

            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-muted w-fit">
              <CalendarDays className="h-4 w-4 text-muted-foreground/80" />
              <span className="font-medium text-foreground/80">{filtered.length} bookings shown</span>
            </div>
          </div>

          {showFilters ? (
            <div className="grid gap-4 rounded-xl border p-4 bg-muted/20 md:grid-cols-3 items-end animate-in fade-in duration-200">
              {/* Shadcn Refactored Calendar Picker */}
              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-medium text-muted-foreground">Booking date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal bg-background ${!dateFilter && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                      {dateFilter ? format(parseISO(dateFilter), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFilter ? parseISO(dateFilter) : undefined}
                      onSelect={(date) => setDateFilter(date ? format(date, "yyyy-MM-dd") : "")}

                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Shadcn Sort Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Sort orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Options</SelectLabel>
                      <SelectItem value="createdAt_desc">Latest booking</SelectItem>
                      <SelectItem value="date_asc">Date: oldest first</SelectItem>
                      <SelectItem value="date_desc">Date: newest first</SelectItem>
                      <SelectItem value="price_asc">Price: low to high</SelectItem>
                      <SelectItem value="price_desc">Price: high to low</SelectItem>
                      <SelectItem value="customer_asc">Customer: A to Z</SelectItem>
                      <SelectItem value="status_asc">Status: A to Z</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Redesigned Custom Reset Filter Button */}
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                    setDateFilter("");
                    setSortBy("createdAt_desc");
                  }}
                  className="w-full md:w-auto border-rose-200 text-rose-700 bg-rose-50/40 hover:bg-rose-600 hover:text-white transition-all"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset filters
                </Button>
              </div>
            </div>
          ) : null}

          <div className="overflow-x-auto rounded-xl border border-muted/80">
            <table className="w-full min-w-[1200px] text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="px-4 py-3.5 font-semibold text-muted-foreground">Customer</th>
                  <th className="px-4 py-3.5 font-semibold text-muted-foreground">Pet Details</th>
                  <th className="px-4 py-3.5 font-semibold text-muted-foreground">Vaccinated</th>
                  <th className="px-4 py-3.5 font-semibold text-muted-foreground">Service Info</th>
                  <th className="px-4 py-3.5 font-semibold text-muted-foreground">Date & Time</th>
                  <th className="px-4 py-3.5 font-semibold text-muted-foreground">Status (Instant Selector)</th>
                  <th className="px-4 py-3.5 font-semibold text-muted-foreground">Total</th>
                  <th className="px-4 py-3.5 font-semibold text-muted-foreground">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground font-medium">
                      No bookings found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((booking: any) => {
                    const pet = booking.petSnapshot || {};
                    const addOns = Array.isArray(booking.addOns) ? booking.addOns : [];

                    return (
                      <tr key={booking.id} className="border-b align-top last:border-0 hover:bg-muted/10 transition-colors">
                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-foreground">
                              {booking.customerSnapshot?.name || "-"}
                            </p>
                            <p className=" text-muted-foreground">
                              {booking.customerSnapshot?.phone || booking.customerId || "-"}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-foreground">{pet.name || "-"}</p>
                            <p className=" text-muted-foreground">
                              {pet.type || "Pet"} {pet.breed ? `• ${pet.breed}` : ""}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <Badge variant={pet.vaccinated ? "secondary" : "outline"} className={cn("font-medium ", pet.vaccinated ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900 hover:bg-emerald-100/80" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900 hover:bg-red-100/80")}>
                              {pet.vaccinated ? "Vaccinated" : "Not vaccinated"}
                            </Badge>
                            <p className="text-[11px] text-muted-foreground pl-1">
                              {pet.vaccinatedAt || pet.vaccinationDate}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <p className="font-medium text-foreground">
                              {booking.serviceSnapshot?.name || booking.serviceId || "-"}
                            </p>
                            {addOns.length > 0 ? (
                              <p className=" text-muted-foreground">
                                Add-ons: {addOns.map((item: any) => item.name).filter(Boolean).join(", ")}
                              </p>
                            ) : (
                              <p className=" text-muted-foreground/60">No add-ons</p>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="space-y-0.5">
                            <p className="font-medium text-foreground">{booking.date || "-"}</p>
                            <p className=" text-muted-foreground">
                              {booking.startTime && booking.endTime
                                ? `${booking.startTime} - ${booking.endTime}`
                                : booking.startTime || "-"}
                            </p>
                          </div>
                        </td>

                        {/* Instant single selector badge replacing old form updates */}
                        <td className="px-4 py-3">
                          <div className="w-36">
                            <Select
                              defaultValue={booking.status || "pending"}
                              onValueChange={(value) => handleInstantStatusUpdate(booking.id, value)}
                            >
                              <SelectTrigger className={`h-8 w-full border font-medium capitalize  rounded-lg transition-all ${getStatusStyles(booking.status)}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="pending" className=" capitalize">Pending</SelectItem>
                                  <SelectItem value="confirmed" className=" capitalize">Confirmed</SelectItem>
                                  <SelectItem value="completed" className=" capitalize">Completed</SelectItem>
                                  <SelectItem value="cancelled" className=" capitalize">Cancelled</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-semibold text-foreground">
                            ₹{Number(booking.totalPrice || 0).toFixed(2)}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetails(booking)}
                            className="h-8  font-medium border-muted-foreground/20 shadow-xs"
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <BookingDetailsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        booking={selectedBooking}
      />
    </>
  );
}