import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, FileText, MapPin, ArrowRight, Shield, Clock, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";
import { yearsPracticing } from "@/lib/practitionerDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PractitionerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { common } = useAppApi();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedDaySlots, setSelectedDaySlots] = useState<any[]>([]);

  const { data: practitioner, isLoading } = useQuery({
    queryKey: ["patient", "practitioner", id],
    queryFn: () => common.getPractitioner(id!),
    enabled: !!id,
  });
  console.log(practitioner)
  const availability = useMemo(() => (Array.isArray(practitioner?.availability) ? practitioner.availability : []), [practitioner]);
  // const selectedDay = availability[selectedDayIndex];
  //TODO: here only handle practitioner not available the loading will be handled by a global component
  useEffect(() => {
    if (availability.length > 0) {
      setSelectedDaySlots(availability[0]?.slots || []);
    }
  }, [availability]);

  if (!practitioner && !isLoading) {
    return (
      
        <div className="flex justify-center items-center pt-40">
          <p className="text-muted-foreground text-lg">Practitioner not found.</p>
        </div>
    );
  }

  return (
      // <main className="lg:gap-12 lg:grid lg:grid-cols-12 mx-auto px-6 pt-28 pb-16 max-w-7xl">
      <>
        <div className="space-y-10 lg:col-span-8">
          {/* Profile Header */}
          <section className="gap-6 grid grid-cols-1 md:grid-cols-3">
            <div className="group relative md:col-span-1 bg-surface-container rounded-xl aspect-square overflow-hidden">
              <img
                src={practitioner?.imageUrl ||"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800"}
                alt={practitioner?.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                width={512}
                height={512}
              />
              {practitioner?.verificationStatus === "approved" && (
                <div className="top-4 left-4 absolute flex items-center gap-1 bg-primary px-3 py-1 rounded-full font-bold text-primary-foreground text-xs">
                  <CheckCircle className="w-3 h-3" />
                  VERIFIED
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center space-y-4 md:col-span-2">
              <div>
                <span className="font-label text-secondary text-xs uppercase tracking-widest">
                  {practitioner?.specialization.split("_").join(" ")}
                </span>
                <h1 className="mt-1 font-headline font-bold text-foreground text-4xl md:text-5xl leading-tight">
                  {practitioner?.fullName}
                </h1>
              </div>
              <div className="flex flex-wrap gap-2">
                {(practitioner?.conditionsTreated || []).map((condition: string) => (
                  <Badge key={condition} variant="secondary" className="capitalize">
                    {condition.replace('_', ' ')}
                  </Badge>
                ))}
                {(!practitioner?.conditionsTreated || practitioner.conditionsTreated.length === 0) && (
                  <span className="text-muted-foreground text-sm italic">No conditions listed</span>
                )}
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex flex-col">
                  <span className="font-bold text-primary text-4xl">{yearsPracticing(practitioner?.practicingSinceEC as number)}+</span>
                  <span className="text-muted-foreground text-base uppercase tracking-tighter">Years Exp.</span>
                </div>
                <div className="bg-outline-variant/30 w-px h-10" />
                
              </div>
            </div>
          </section>

          <section className="relative bg-surface-container-low p-8 rounded-2xl overflow-hidden">
            <h2 className="flex items-center gap-2 mb-6 font-headline font-semibold text-primary text-2xl">
              <FileText className="w-5 h-5" />
              Professional Narrative
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {practitioner?.bio ? (
                practitioner.bio.split("\n\n").filter(Boolean).map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p>No bio available.</p>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 font-headline font-semibold text-primary text-2xl">
              <FileText className="w-5 h-5" />
              Consultation Services
            </h2>
            <div className="gap-4 grid md:grid-cols-3">
              {practitioner?.consultationTypes && Object.entries(practitioner.consultationTypes).map(([type, info]: [string, any]) => (
                info.enabled && (
                  <Card key={type} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <CardTitle className="text-lg capitalize">{type}</CardTitle>
                        <Badge variant="default" className="text-sm">ETB {info.price}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {type === 'chat' && '💬 Chat with practitioner'}
                        {type === 'audio' && '📞 Voice call with practitioner'}
                        {type === 'video' && '📹 Video call with practitioner'}
                      </p>
                    </CardContent>
                  </Card>
                )
              ))}
              {(!practitioner?.consultationTypes || !Object.values(practitioner.consultationTypes).some((t: any) => t.enabled)) && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground italic">No consultation services available</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 font-headline font-semibold text-primary text-2xl">
              <MapPin className="w-5 h-5" />
              Practice Location
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-primary-container rounded-full w-12 h-12">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{practitioner?.location}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <aside className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="top-28 sticky space-y-6">
            <div className="bg-surface-container-lowest shadow-botanical p-6 rounded-3xl">
              <h3 className="mb-6 font-headline font-bold text-primary text-xl">Practitioner's Schedule</h3>

              {/* Date Selector */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="flex items-center gap-2 font-bold text-foreground text-sm">
                    <Calendar className="w-4 h-4" />
                    Available Days
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {availability.filter((day: any) => day.enabled).length} days available
                  </Badge>
                </div>
                <div className="flex justify-between gap-2">
                  {availability.filter((day: any) => day.enabled).map((day: any, i: number) => (
                    <button
                      key={day.day}
                      onClick={() => {
                        
                          setSelectedDayIndex(i);
                          console.log(day.slots)
                          setSelectedDaySlots(day.slots);
                        
                      }}
                      className={`flex-1 flex-col h-auto py-2 rounded-lg border text-center transition-colors ${
                        selectedDayIndex === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-container-low hover:bg-surface-container text-foreground cursor-pointer"
                      }`}
                    >
                      <span className="font-bold text-xs">{day.day?.slice(0, 3)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="mb-8">
                <h4 className="flex items-center gap-2 mb-3 font-bold text-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  Available Time Slots
                </h4>
                <div className="gap-2 grid grid-cols-2">
                  {(selectedDaySlots || []).map((slot: any, i: number) => (
                    <div
                      key={`${slot.start}-${slot.end}- ${i}`}
                      className="bg-muted py-2 border rounded-lg h-auto font-semibold text-muted-foreground text-xs text-center"
                    >
                      {slot.start} - {slot.end}
                    </div>
                  ))}
                  {(!selectedDaySlots || selectedDaySlots.length === 0) && (
                    <div className="col-span-2 py-4 text-muted-foreground text-sm text-center italic">
                      No time slots available for this day
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(`/patient/booking/${practitioner?.clerkId}`)
                }
                className="flex justify-center items-center gap-2 bg-primary hover:bg-primary-container shadow-lg py-4 rounded-2xl w-full font-bold text-primary-foreground tracking-tight transition-all"
              >
                Book consultation
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-4 text-center">
                <span className="flex justify-center items-center gap-1 text-[10px] text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  Payments are taken care of outside the platform
                </span>
              </div>
            </div>

          </div>
        </aside>
      </>
  );
};

export default PractitionerProfile;
