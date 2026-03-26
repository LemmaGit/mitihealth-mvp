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
  disabled?: boolean;
}

export default function SidebarContent({ profileImage, onImageChange, disabled = false }: SidebarContentProps) {
  const { register } = useFormContext<ProfileFormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { authUser: user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="bg-card shadow-botanical p-6 rounded-xl text-center">
        <div className="relative mx-auto mb-4 w-fit">
          <Avatar className="w-28 h-28">
            <AvatarImage src={profileImage || user?.imageUrl ||undefined} />
            <AvatarFallback className="bg-primary/10 font-bold text-primary text-2xl">
              {getInitials(user?.fullName)}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`right-0 bottom-0 absolute flex justify-center items-center bg-primary shadow-md rounded-full w-8 h-8 text-primary-foreground hover:scale-110 transition-transform ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={disabled}
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
            disabled={disabled}
          />
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

      <div className="bg-card shadow-botanical p-5 rounded-xl">
        <h3 className="flex items-center gap-2 mb-2 font-display font-bold text-secondary text-base">
          <Lightbulb size={18} className="text-secondary" />
          Botanical Tooltip
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Practitioners with complete availability schedules and detailed bios see a 40% higher
          consultation booking rate. Consider adding a detailed location for in-person heritage
          tours.
        </p>
      </div>
    </div>
  );
}
