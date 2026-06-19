"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Plus,
  Trash2,
  Scissors,
  Clock3,
  IndianRupee,
  Weight,
  Sparkles,
} from "lucide-react";
import { saveServiceAction, deleteServiceAction } from "@/actions/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type StaffMember = {
  id: string;
  name?: string;
  email?: string;
};

type ServiceFormProps = {
  service?: any;
  onDone: () => void;
  staff?: StaffMember[];
};

type AddOn = {
  id: string;
  name: string;
  price: string | number;
  durationMinutes: string | number;
  active: boolean;
};

type WeightTier = {
  id: string;
  label: string;
  minKg: string | number;
  maxKg: string | number;
  price: string | number;
};

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function ServiceForm({
  service,
  onDone,
  staff = [],
}: ServiceFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [pricingModel, setPricingModel] = useState<"FIXED" | "WEIGHT_BASED">(
    service?.pricingModel || "FIXED"
  );

  const [addOns, setAddOns] = useState<AddOn[]>(
    Array.isArray(service?.addOns) ? service.addOns : []
  );

  const [weightTiers, setWeightTiers] = useState<WeightTier[]>(
    Array.isArray(service?.weightTiers) ? service.weightTiers : []
  );

  const assignedStaff = useMemo(() => {
    const ids = Array.isArray(service?.staffIds) ? service.staffIds : [];
    return staff.filter((member) => ids.includes(member.id));
  }, [service?.staffIds, staff]);

  const addAddOn = () => {
    setAddOns((prev) => [
      ...prev,
      {
        id: createId("addon"),
        name: "",
        price: "",
        durationMinutes: "",
        active: true,
      },
    ]);
  };

  const updateAddOn = (index: number, key: keyof AddOn, value: any) => {
    setAddOns((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const removeAddOn = (index: number) => {
    setAddOns((prev) => prev.filter((_, i) => i !== index));
  };

  const addWeightTier = () => {
    setWeightTiers((prev) => [
      ...prev,
      {
        id: createId("tier"),
        label: "",
        minKg: "",
        maxKg: "",
        price: "",
      },
    ]);
  };

  const updateWeightTier = (index: number, key: keyof WeightTier, value: any) => {
    setWeightTiers((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const removeWeightTier = (index: number) => {
    setWeightTiers((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("pricingModel", pricingModel);
    formData.set("addonsJson", JSON.stringify(addOns));
    formData.set("weightTiersJson", JSON.stringify(weightTiers));

    startTransition(async () => {
      const res = await saveServiceAction(formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      onDone();
    });
  };

  const deleteCurrent = () => {
    if (!service?.id) return;

    const formData = new FormData();
    formData.set("serviceId", service.id);

    startTransition(async () => {
      await deleteServiceAction(formData);
      onDone();
    });
  };

  return (
    <form onSubmit={submit} className="space-y-8 pb-8">
      {service?.id ? (
        <input type="hidden" name="serviceId" value={service.id} />
      ) : null}

      <div className="rounded-2xl border bg-slate-50/50 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Scissors className="h-4 w-4 text-emerald-600" />
          <h3 className="font-semibold">Basic Information</h3>
        </div>

        <div className="space-y-2">
          <Label>Service name</Label>
          <Input name="name" defaultValue={service?.name || ""} required />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            name="slug"
            defaultValue={service?.slug || ""}
            placeholder="full-service-grooming"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            name="description"
            defaultValue={service?.description || ""}
            placeholder="Bath, haircut, nail trim, ear cleaning..."
          />
        </div>

        <div className="space-y-2">
          <Label>Included items</Label>
          <Textarea
            name="included"
            defaultValue={
              Array.isArray(service?.included) ? service.included.join(", ") : ""
            }
            placeholder="Bath, nail trim, ear cleaning"
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-slate-50/50 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-blue-600" />
          <h3 className="font-semibold">Duration & Pricing</h3>
        </div>

        <div className="space-y-2">
          <Label>Duration minutes</Label>
          <Input
            name="durationMinutes"
            type="number"
            min={5}
            defaultValue={service?.durationMinutes || 60}
          />
        </div>

        <div className="space-y-3">
          <Label>Pricing model</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={pricingModel === "FIXED" ? "default" : "outline"}
              onClick={() => setPricingModel("FIXED")}
            >
              Fixed Pricing
            </Button>
            <Button
              type="button"
              variant={pricingModel === "WEIGHT_BASED" ? "default" : "outline"}
              onClick={() => setPricingModel("WEIGHT_BASED")}
            >
              Weight Based Pricing
            </Button>
          </div>
        </div>

        {pricingModel === "FIXED" ? (
          <div className="space-y-2">
            <Label>Base price</Label>
            <Input
              name="basePrice"
              type="number"
              min={0}
              step="0.01"
              defaultValue={service?.basePrice || 0}
            />
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-amber-600" />
                <h4 className="font-medium">Weight tiers</h4>
              </div>

              <Button type="button" variant="outline" onClick={addWeightTier}>
                <Plus className="mr-2 h-4 w-4" />
                Add tier
              </Button>
            </div>

            {weightTiers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No weight tiers added yet.
              </p>
            ) : null}

            <div className="space-y-3">
              {weightTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="grid grid-cols-1 gap-3 rounded-xl border p-4 md:grid-cols-4"
                >
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={tier.label}
                      onChange={(e) =>
                        updateWeightTier(index, "label", e.target.value)
                      }
                      placeholder="XXL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Min kg</Label>
                    <Input
                      type="number"
                      min={0}
                      value={tier.minKg}
                      onChange={(e) =>
                        updateWeightTier(index, "minKg", e.target.value)
                      }
                      placeholder="20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max kg</Label>
                    <Input
                      type="number"
                      min={0}
                      value={tier.maxKg}
                      onChange={(e) =>
                        updateWeightTier(index, "maxKg", e.target.value)
                      }
                      placeholder="40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={tier.price}
                        onChange={(e) =>
                          updateWeightTier(index, "price", e.target.value)
                        }
                        placeholder="999"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeWeightTier(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-slate-50/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h3 className="font-semibold">Add-ons</h3>
          </div>

          <Button type="button" variant="outline" onClick={addAddOn}>
            <Plus className="mr-2 h-4 w-4" />
            Add add-on
          </Button>
        </div>

        {addOns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No add-ons added yet.</p>
        ) : null}

        <div className="space-y-3">
          {addOns.map((addon, index) => (
            <div
              key={addon.id}
              className="grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 md:grid-cols-4"
            >
              <div className="space-y-2">
                <Label>Add-on name</Label>
                <Input
                  value={addon.name}
                  onChange={(e) => updateAddOn(index, "name", e.target.value)}
                  placeholder="Teeth brushing"
                />
              </div>

              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={addon.price}
                  onChange={(e) => updateAddOn(index, "price", e.target.value)}
                  placeholder="150"
                />
              </div>

              <div className="space-y-2">
                <Label>Duration mins</Label>
                <Input
                  type="number"
                  min={0}
                  value={addon.durationMinutes}
                  onChange={(e) =>
                    updateAddOn(index, "durationMinutes", e.target.value)
                  }
                  placeholder="15"
                />
              </div>

              <div className="flex items-end gap-2">
                <label className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm">
                  <input
                    type="checkbox"
                    checked={addon.active}
                    onChange={(e) =>
                      updateAddOn(index, "active", e.target.checked)
                    }
                  />
                  Active
                </label>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeAddOn(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {service?.id ? (
        <div className="rounded-2xl border bg-slate-50/50 p-5 space-y-3">
          <h3 className="font-semibold">Assigned Staff</h3>

          {assignedStaff.length === 0 ? (
            <p className="text-sm text-muted-foreground">No staff assigned yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {assignedStaff.map((member) => (
                <Badge key={member.id} variant="secondary">
                  {member.name || member.email || member.id}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="rounded-2xl border bg-slate-50/50 p-5 space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="active"
            defaultChecked={service?.active ?? true}
          />
          Active service
        </label>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          {service?.id ? (
            <Button
              type="button"
              variant="outline"
              onClick={deleteCurrent}
              disabled={pending}
            >
              Delete
            </Button>
          ) : null}

          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving..."
              : service?.id
              ? "Save changes"
              : "Create service"}
          </Button>
        </div>
      </div>
    </form>
  );
}