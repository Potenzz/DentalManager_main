import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TopAppBar } from "@/components/layout/top-app-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { StaffTable } from "@/components/staffs/staff-table";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StaffUncheckedCreateInputObjectSchema } from "@repo/db/usedSchemas";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { StaffForm } from "@/components/staffs/staff-form";
import { DeleteConfirmationDialog } from "@/components/ui/deleteDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Staff = z.infer<typeof StaffUncheckedCreateInputObjectSchema>;

export default function StaffPage() {
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const {
    data: staff = [],
    isLoading,
    isError,
    error,
  } = useQuery<Staff[]>({
    queryKey: ["/api/staffs/"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/staffs/");
      if (!res.ok) {
        throw new Error("Failed to fetch staff");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const addStaffMutate = useMutation<
    Staff,
    Error,
    Omit<Staff, "id" | "createdAt">
  >({
    mutationFn: async (newStaff: Omit<Staff, "id" | "createdAt">) => {
      const res = await apiRequest("POST", "/api/staffs/", newStaff);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to add staff");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staffs/"] });
      toast({
        title: "Staff Added",
        description: "Staff member added successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to add staff",
        variant: "destructive",
      });
    },
  });

  const updateStaffMutate = useMutation<
    Staff,
    Error,
    { id: number; updatedFields: Partial<Staff> }
  >({
    mutationFn: async ({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: Partial<Staff>;
    }) => {
      const res = await apiRequest("PUT", `/api/staffs/${id}`, updatedFields);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update staff");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staffs/"] });
      toast({
        title: "Staff Updated",
        description: "Staff member updated successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update staff",
        variant: "destructive",
      });
    },
  });

  const deleteStaffMutation = useMutation<number, Error, number>({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/staffs/${id}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete staff");
      }
      return id;
    },
    onSuccess: () => {
      setIsDeleteStaffOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/staffs/"] });
      toast({
        title: "Staff Removed",
        description: "Staff member deleted.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete staff",
        variant: "destructive",
      });
    },
  });

  const isAdding = addStaffMutate.status === "pending";
  const isAddSuccess = addStaffMutate.status === "success";
  const isUpdating = updateStaffMutate.status === "pending";
  const isUpdateSuccess = updateStaffMutate.status === "success";

  const openAddStaffModal = () => {
    setEditingStaff(null);
    setModalOpen(true);
  };

  const openEditStaffModal = (staff: Staff) => {
    setEditingStaff(staff);
    setModalOpen(true);
  };

  const handleFormSubmit = (formData: Omit<Staff, "id" | "createdAt">) => {
    if (editingStaff) {
      if (editingStaff.id === undefined) {
        toast({
          title: "Error",
          description: "Staff ID is missing",
          variant: "destructive",
        });
        return;
      }
      updateStaffMutate.mutate({
        id: editingStaff.id,
        updatedFields: formData,
      });
    } else {
      addStaffMutate.mutate(formData);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (isAddSuccess || isUpdateSuccess) {
      setModalOpen(false);
    }
  }, [isAddSuccess, isUpdateSuccess]);

  const [isDeleteStaffOpen, setIsDeleteStaffOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | undefined>(
    undefined
  );

  const handleDeleteStaff = (staff: Staff) => {
    setCurrentStaff(staff);
    setIsDeleteStaffOpen(true);
  };

  const handleConfirmDeleteStaff = async () => {
    if (currentStaff?.id) {
      deleteStaffMutation.mutate(currentStaff.id);
    } else {
      toast({
        title: "Error",
        description: "No Staff selected for deletion.",
        variant: "destructive",
      });
    }
  };

  const handleViewStaff = (staff: Staff) =>
    alert(
      `Viewing staff member:\n${staff.name} (${staff.email || "No email"})`
    );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopAppBar toggleMobileMenu={toggleMobileMenu} />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
              <p className="text-muted-foreground">
                Manage dentists, hygienists, and clinic staff
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <StaffTable
                  staff={staff}
                  isLoading={isLoading}
                  isError={isError}
                  onAdd={openAddStaffModal}
                  onEdit={openEditStaffModal}
                  onDelete={handleDeleteStaff}
                  onView={handleViewStaff}
                />
                {isError && (
                  <p className="mt-4 text-red-600">
                    {(error as Error)?.message || "Failed to load staff data."}
                  </p>
                )}

                <DeleteConfirmationDialog
                  isOpen={isDeleteStaffOpen}
                  onConfirm={handleConfirmDeleteStaff}
                  onCancel={() => setIsDeleteStaffOpen(false)}
                  entityName={currentStaff?.name}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
            </DialogTitle>
          </DialogHeader>
          <StaffForm
            initialData={editingStaff || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleModalCancel}
            isLoading={isAdding || isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
