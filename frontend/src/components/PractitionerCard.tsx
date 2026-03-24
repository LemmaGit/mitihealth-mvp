import { useNavigate } from "react-router-dom";
import { Star, CheckCircle } from "lucide-react";
interface Practitioner {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  yearsExp: number;
  consultations: number;
  rating: number;
  price: number;
  image: string;
  verified: boolean;
}

interface Props {
  practitioner: Practitioner;
}

const PractitionerCard = ({ practitioner }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-botanical hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row gap-5 p-6">
        {/* Image */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-surface-container">
          <img
            src={practitioner.image}
            alt={practitioner.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width={128}
            height={128}
          />
          {practitioner.verified && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              VERIFIED
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <span className="text-secondary font-label text-xs tracking-widest uppercase">
              {practitioner.title}
            </span>
            <h3 className="text-xl font-headline font-bold text-foreground mt-0.5 leading-tight">
              {practitioner.name}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {practitioner.specialties.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full bg-surface-container-low text-primary text-xs font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5 mt-4">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">{practitioner.yearsExp}+</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Years</span>
            </div>
            <div className="h-8 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">{practitioner.consultations}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Consults</span>
            </div>
            <div className="h-8 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-primary">{practitioner.rating}</span>
                <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Rating</span>
            </div>
          </div>
        </div>

        {/* Price + Book */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-3 sm:min-w-[120px]">
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{practitioner.price}</span>
            <span className="text-xs text-muted-foreground ml-1">ETB</span>
          </div>
          <button
            onClick={() => navigate(`/practitioner/${practitioner.id}`)}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-headline font-bold text-sm hover:bg-primary-container transition-all shadow-sm hover:shadow-md"
          >
            Book →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PractitionerCard;
