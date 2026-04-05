import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import { CheckCircle } from "lucide-react";

export interface PractitionerCardModel {
  id: string;
  title: string;
  location: string;
  specialties: string[];
  yearsExp: number;
  image: string;
  verified: boolean;
  profileImage: string;
  firstName: string;
  lastName: string;
}


interface PractitionerImageProps {
  image: string;
  firstName: string;
  lastName: string;
  verified: boolean;
}

interface Props {
  practitioner: PractitionerCardModel;
}


interface BookButtonProps {
  practitionerId: string;
  onBook: (id: string) => void;
}
interface SpecialtiesListProps {
  specialties: string[];
}

interface ExperienceBadgeProps {
  yearsExp: number;
}

interface PractitionerInfoProps {
  firstName: string;
  lastName: string;
  location: string;
}

const PractitionerCard = ({ practitioner }: Props) => {
  const navigate = useNavigate();

  const handleBook = (id: string) => {
    navigate(`/patient/booking/${id}`);
  };

  return (
    <Card className="group flex flex-col shadow-botanical hover:shadow-lg h-full overflow-hidden transition-all duration-300" onClick={(e) => { e.stopPropagation(); navigate(`/patient/practitioner/${practitioner.id}`) }}>
      <PractitionerImage
        image={practitioner.profileImage! || practitioner.image}
        firstName={practitioner.firstName}
        lastName={practitioner.lastName}
        verified={practitioner.verified}
      />
      
      <CardContent className="flex flex-col flex-1 p-5">
        <div className="flex-1">
          <PractitionerInfo
            firstName={practitioner.firstName}
            lastName={practitioner.lastName}
            location={practitioner.location}
          />
          
          <SpecialtiesList specialties={practitioner.specialties} />
          
          <ExperienceBadge yearsExp={practitioner.yearsExp} />
        </div>
        
        <div className="mt-4 pt-2" onClick={(e) => e.stopPropagation()}>
          <BookButton
            practitionerId={practitioner.id}
            onBook={handleBook}
          />
        </div>
      </CardContent>
    </Card>
  );
};



export const PractitionerImage = ({ image, firstName, lastName, verified }: PractitionerImageProps) => {
  return (
    <div className="relative bg-muted w-full aspect-4/3 overflow-hidden">
      <img
        src={image}
        alt={`${firstName} ${lastName}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      {verified && (
        <Badge 
          variant="secondary" 
          className="top-3 left-3 absolute gap-1 bg-primary/90 hover:bg-primary/90 shadow-sm backdrop-blur-sm px-2.5 py-1 font-semibold text-primary-foreground text-xs"
        >
          <CheckCircle className="size-3" />
          Verified
        </Badge>
      )}
    </div>
  );
};




export const PractitionerInfo = ({ firstName, lastName, location }: PractitionerInfoProps) => {
  return (
    <div className="mb-3">
      <h3 className="font-headline font-bold text-foreground text-lg line-clamp-1 leading-tight">
        {firstName} {lastName}
      </h3>
      <p className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
        <MapPin className="size-3.5 shrink-0" />
        <span className="line-clamp-1">{location}</span>
      </p>
    </div>
  );
};



export const SpecialtiesList = ({ specialties }: SpecialtiesListProps) => {
  const displaySpecialties = specialties.slice(0, 3);
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {displaySpecialties.map((specialty) => (
        <Badge 
          key={specialty} 
          variant="outline"
          className="bg-muted/50 hover:bg-muted px-3 py-1 rounded-full font-medium text-primary text-xs"
        >
          {specialty}
        </Badge>
      ))}
      {specialties.length > 3 && (
        <Badge 
          variant="outline"
          className="bg-muted/50 px-3 py-1 rounded-full font-medium text-muted-foreground text-xs"
        >
          +{specialties.length - 3}
        </Badge>
      )}
    </div>
  );
};


export const ExperienceBadge = ({ yearsExp }: ExperienceBadgeProps) => {
  return (
    <div className="flex items-center gap-2 pt-4 border-border border-t">
      <span className="font-bold text-primary text-lg">
        {yearsExp}+
      </span>
      <span className="font-medium text-muted-foreground text-xs uppercase tracking-tight">
        Years experience
      </span>
    </div>
  );
};



export const BookButton = ({ practitionerId, onBook }: BookButtonProps) => {
  return (
    <Button
      className="gap-2 w-full font-headline font-semibold"
      onClick={() => onBook(practitionerId)}
    >
      <Calendar className="size-4" />
      Book Appointment
    </Button>
  );
};
export default PractitionerCard;

