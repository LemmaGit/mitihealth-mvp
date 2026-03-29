import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  // const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { practitioner } = useAppApi();
  const { authUser: user } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageModified, setImageModified] = useState(false); 

  const { data: existing } = useQuery({
    queryKey: ["practitioner", "self", user?.id],
    queryFn: () => practitioner.getPractitionerData(user?.id!),
    enabled: !!user?.id,
  });

   const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(practitionerProfileSchema) as any,
    defaultValues: existing || defaultValuesObj,
  });
   const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  const isFormModified = isDirty || imageModified;

 
  const isVerifiedOrNotExists = existing?.verificationStatus === "approved"|| !existing;
  const isPending = existing?.verificationStatus === "pending" ;

  const mutation = useMutation({
    mutationFn: (data: ProfileFormValues) => practitioner.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["practitioner", user?.id] });
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
    console.log(data,"😁",payload)
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
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display font-bold text-foreground text-3xl">
                Edit Practitioner Profile
              </h1>
              {isPending && (
                <span className="bg-yellow-100 px-3 py-1 rounded-full font-medium text-yellow-800 text-xs">
                  Under Verification
                </span>
              )}
            </div>
            <p className="mt-1 text-muted-foreground text-sm">
              Manage your professional identity and clinical availability.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isPending && (
              <p className="bg-secondary/20 px-3 py-2 rounded-lg text-secondary text-xs">Waiting for verification</p>
            )}
            {isVerifiedOrNotExists && (
              <>
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
                  className="flex items-center text-primary-foreground botanical-gradient"
                  disabled={!isFormModified || mutation.isPending}
                >
                  {mutation.isPending ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : null}
                  Save Profile
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile: Sidebar on top */}
        <div className="lg:hidden mb-8">
          <SidebarContent 
            profileImage={profileImage} 
            onImageChange={handleImageChange}
            disabled={isPending}
          />
        </div>

        <div className="gap-8 grid lg:grid-cols-[1fr_300px] overflow-y-auto">
          {/* Main Form */}
          <div className="space-y-8">
            <ProfessionalIdentity disabled={isPending} />
            <WeeklyAvailability disabled={isPending} />
          </div>

          {/* Desktop: Right Sidebar */}
          <div className="hidden lg:block self-start">
            <SidebarContent 
              profileImage={profileImage} 
              onImageChange={handleImageChange}
              disabled={isPending}
            />
          </div>

        </div>
      </form>
    </FormProvider>
  );
}
