import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";
import { useAppApi } from "../../hooks/useAppApi";
import { useAuthStore } from "../../store/useAuthStore";

import { practitionerProfileSchema, type ProfileFormValues, defaultValuesObj } from "./components/Profile/profileSchema";
import ProfessionalIdentity from "./components/Profile/ProfessionalIdentity";
import WeeklyAvailability from "./components/Profile/WeeklyAvailability";
import SidebarContent from "./components/Profile/SidebarContent";

export default function PractitionerProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { practitioner } = useAppApi();
  const { authUser: user } = useAuthStore();
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageModified, setImageModified] = useState(false);

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(practitionerProfileSchema) as any,
    defaultValues: defaultValuesObj,
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  const isFormModified = isDirty || imageModified;
  const { data: existing } = useQuery({
    queryKey: ["practitioner", "self", user?.id],
    queryFn: () => practitioner.getPractitioner(user?.id!),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (existing) {
      reset(existing);
    }
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: ProfileFormValues) => practitioner.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["practitioner", user?.id] });
      console.log("Profile saved successfully!");
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save profile");
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    const payload = {
      ...data,
      availability: data.availability?.filter((day) => day.enabled && day.slots.length > 0) || [],
    };
    mutation.mutate(payload);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setImageModified(true);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Edit Practitioner Profile
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your professional identity and clinical availability.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {existing?.verificationStatus === "pending" && (
              <p className="text-xs rounded-lg bg-secondary/20 text-secondary px-3 py-2">Waiting for verification</p>
            )}
            <Button
              type="button"
              variant="ghost"
              className="font-semibold"
              onClick={() => { reset(); setImageModified(false); setProfileImage(null); }}
              disabled={!isFormModified || mutation.isPending}
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              className="botanical-gradient text-primary-foreground flex items-center"
              disabled={!isFormModified || mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Profile
            </Button>
          </div>
        </div>

        {/* Mobile: Sidebar on top */}
        <div className="lg:hidden mb-8">
          <SidebarContent profileImage={profileImage} onImageChange={handleImageChange} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Form */}
          <div className="space-y-8">
            <ProfessionalIdentity />
            <WeeklyAvailability />
          </div>

          {/* Desktop: Right Sidebar */}
          <div className="hidden lg:block">
            <SidebarContent profileImage={profileImage} onImageChange={handleImageChange} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
