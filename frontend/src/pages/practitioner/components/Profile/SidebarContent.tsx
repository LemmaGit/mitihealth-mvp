import { useFormContext } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Textarea } from "../../../../components/ui/textarea";
import { getInitials } from "../../../../lib/utils";
import { useAuthStore } from "../../../../store/useAuthStore";
import type { ProfileFormValues } from "./profileSchema";

interface SidebarContentProps {
  disabled?: boolean;
}

export default function SidebarContent({disabled}: SidebarContentProps
) {
  const { register } = useFormContext<ProfileFormValues>();
  const { authUser: user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="bg-card shadow-botanical p-6 rounded-xl text-center">
        <div className="relative mx-auto mb-4 w-fit">
          <Avatar className="w-28 h-28">
            <AvatarImage src={user?.imageUrl ||undefined} />
            <AvatarFallback className="bg-primary/10 font-bold text-primary text-2xl">
              {getInitials(user?.fullName)}
            </AvatarFallback>
          </Avatar>
          
        </div>
        <h3 className="font-display font-bold text-foreground text-lg">
          {user?.fullName}
        </h3>
      </div>

      <div className="bg-primary shadow-botanical p-5 rounded-xl text-primary-foreground">
        <h3 className="mb-3 font-display font-bold text-base">Professional Bio</h3>
        <Textarea
          {...register("bio")}
          className="bg-primary-foreground/10 border-none focus-visible:ring-primary-foreground/30 min-h-[120px] text-primary-foreground placeholder:text-primary-foreground/50 text-sm"
          disabled={disabled}
        />
      </div>

    </div>
  );
}
