import { Camera, Lightbulb } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Textarea } from "../../../../components/ui/textarea";
import { getInitials } from "../../../../lib/utils";
import { useRef } from "react";
import { useAuthStore } from "../../../../store/useAuthStore";
import type { ProfileFormValues } from "./profileSchema";

interface SidebarContentProps {
  profileImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SidebarContent({ profileImage, onImageChange }: SidebarContentProps) {
  const { register } = useFormContext<ProfileFormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { authUser: user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-card p-6 text-center shadow-botanical">
        <div className="relative mx-auto mb-4 w-fit">
          <Avatar className="h-28 w-28">
            <AvatarImage src={profileImage || user?.imageUrl ||undefined} />
            <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
              {getInitials(user?.fullName)}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">
          {user?.fullName}
        </h3>
      </div>

      <div className="rounded-xl bg-primary p-5 text-primary-foreground shadow-botanical">
        <h3 className="mb-3 font-display text-base font-bold">Professional Bio</h3>
        <Textarea
          {...register("bio")}
          className="min-h-[120px] border-none bg-primary-foreground/10 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/30"
        />
      </div>

      <div className="rounded-xl bg-card p-5 shadow-botanical">
        <h3 className="mb-2 flex items-center gap-2 font-display text-base font-bold text-secondary">
          <Lightbulb size={18} className="text-secondary" />
          Botanical Tooltip
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Practitioners with complete availability schedules and detailed bios see a 40% higher
          consultation booking rate. Consider adding a detailed location for in-person heritage
          tours.
        </p>
      </div>
    </div>
  );
}
