"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useUpdateProfile } from "@/hooks/use-session";

interface EditNameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
}

export function EditNameModal({ open, onOpenChange, customer }: EditNameModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      animation="slide-up"
      size="md"
      showCloseButton
      labelId="edit-name-modal-title"
    >
      {/* Remounts on each open so the form re-seeds from `customer` without an effect */}
      <EditNameForm
        key={open ? "open" : "closed"}
        customer={customer}
        onOpenChange={onOpenChange}
      />
    </Modal>
  );
}

interface EditNameFormProps {
  customer: Customer;
  onOpenChange: (open: boolean) => void;
}

function EditNameForm({ customer, onOpenChange }: EditNameFormProps) {
  const updateProfile = useUpdateProfile();
  const [firstName, setFirstName] = useState(customer.firstName ?? "");
  const [lastName, setLastName] = useState(customer.lastName ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await updateProfile.mutateAsync({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    if (result.success) {
      onOpenChange(false);
    } else {
      setError(result.errors[0]?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <h2 id="edit-name-modal-title" className="text-header-h2 text-grey-950 font-normal">
        Edit name
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Input
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="border-grey-100 placeholder:text-grey-500 h-12 rounded-[1px] bg-[#fcfcfc] px-4 text-sm"
          />
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="border-grey-100 placeholder:text-grey-500 h-12 rounded-[1px] bg-[#fcfcfc] px-4 text-sm"
          />
        </div>

        {error && (
          <p className="text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="pill"
          className="w-full"
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? "Saving…" : "Save"}
        </Button>
      </form>
    </div>
  );
}
