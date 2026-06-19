"use client";

import { useState } from "react";
import {
    Clock3,
    IndianRupee,
    Plus,
    Scissors,
    Users,
    Weight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ServiceForm } from "./service-form";
import { toggleMyAssignmentAction } from "@/actions/services";

type StaffMember = {
    id: string;
    name?: string;
    email?: string;
};

type ServicesClientProps = {
    initialServices: any[];
    staff: StaffMember[];
    currentUserId?: string;
};

export function ServicesClient({
    initialServices,
    staff,
    currentUserId,
}: ServicesClientProps) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);

    const openCreate = () => {
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (service: any) => {
        setEditing(service);
        setOpen(true);
    };

    const resolveAssignedStaff = (staffIds: string[] = []) => {
        return staff.filter((member) => staffIds.includes(member.id));
    };

    const handleToggleAssignment = async (formData: FormData) => {
        await toggleMyAssignmentAction(formData);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Service
                </Button>
            </div>

            {initialServices.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-14 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                            <Scissors className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold">No services yet</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Create your first service to start accepting bookings.
                        </p>
                        <Button className="mt-5" onClick={openCreate}>
                            Add first service
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {initialServices.map((service) => {
                        const isAssigned = Array.isArray(service.staffIds)
                            ? service.staffIds.includes(currentUserId)
                            : false;

                        const assignedStaff = resolveAssignedStaff(service.staffIds || []);

                        return (
                            <Card key={service.id} className="overflow-hidden rounded-2xl">
                                <CardHeader className="border-b bg-slate-50/60">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-xl">{service.name}</CardTitle>
                                                <Badge variant={service.active ? "default" : "secondary"}>
                                                    {service.active ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground">
                                                {service.description || "No description"}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => openEdit(service)}>
                                                Edit
                                            </Button>

                                            {service.id ? (
                                                <form action={handleToggleAssignment}>
                                                    <input type="hidden" name="serviceId" value={service.id} />
                                                    <input
                                                        type="hidden"
                                                        name="mode"
                                                        value={isAssigned ? "unassign" : "assign"}
                                                    />
                                                    <Button type="submit" variant="secondary">
                                                        {isAssigned ? "Unassign Me" : "Assign Me"}
                                                    </Button>
                                                </form>
                                            ) : null}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-5 p-6">
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                        <span className="inline-flex items-center gap-1">
                                            <Clock3 className="h-4 w-4" />
                                            {service.durationMinutes || 0} mins
                                        </span>

                                        {service.pricingModel === "WEIGHT_BASED" ? (
                                            <span className="inline-flex items-center gap-1">
                                                <Weight className="h-4 w-4" />
                                                {service.weightTiers?.length || 0} weight tiers
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1">
                                                <IndianRupee className="h-4 w-4" />
                                                {service.basePrice || 0}
                                            </span>
                                        )}

                                        <span className="inline-flex items-center gap-1">
                                            <Scissors className="h-4 w-4" />
                                            {service.addOns?.length || 0} add-ons
                                        </span>

                                        <span className="inline-flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {service.staffIds?.length || 0} assigned
                                        </span>
                                    </div>

                                    {Array.isArray(service.included) && service.included.length > 0 ? (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Included</p>
                                            <div className="flex flex-wrap gap-2">
                                                {service.included.map((item: string, index: number) => (
                                                    <Badge key={`${item}-${index}`} variant="outline">
                                                        {item}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    {assignedStaff.length > 0 ? (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Assigned staff</p>
                                            <div className="flex flex-wrap gap-2">
                                                {assignedStaff.map((member) => (
                                                    <Badge key={member.id} variant="secondary">
                                                        {member.name || member.email || member.id}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
                    <SheetHeader>
                        <SheetTitle>
                            {editing ? "Edit Service" : "Create Service"}
                        </SheetTitle>
                    </SheetHeader>

                    <div className="mt-6">
                        <ServiceForm
                            service={editing}
                            onDone={() => setOpen(false)}
                            staff={staff}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}