import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Video, Star, Package, ArrowRight, Leaf, Activity, TrendingDown, Heart } from "lucide-react";
import Navbar from "../../components/Navbar";
import MobileBottomNav from "../../components/MobileBottomNav";
// import drSelamawit from "../../assets/dr-selamawit.png";
// import drAbebe from "../../assets/dr-abebe.png";
// import productKoseret from "../../assets/product-koseret.jpg";
// import productMoringa from "../../assets/product-moringa.jpg";

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Selamawit Gebre",
    image: "../../assets/dr-abebe.png",
    specialty: "Clinical Herbalist",
    date: "Oct 24, 2023",
    time: "10:30 AM (EAT)",
    type: "Video Consultation",
    practitionerId: "dr-selamawit",
  },
  {
    id: 2,
    doctor: "Dr. Abebe Mengistu",
    image: "../../assets/dr-abebe.png",
    specialty: "Integrative Medicine",
    date: "Oct 28, 2023",
    time: "02:00 PM (EAT)",
    type: "In-Person",
    practitionerId: "dr-abebe",
  },
];

const recentOrders = [
  { id: "EB-1042", product: "Koseret Herbal Blend", image: "../../assets/product-koseret.jpg", status: "Delivered", date: "Oct 20", price: 280 },
  { id: "EB-1038", product: "Moringa Capsules", image: "../../assets/product-koseret.jpg", status: "In Transit", date: "Oct 22", price: 520 },
];

const healthMetrics = [
  { label: "Inflammation", value: "Low", trend: "down", icon: TrendingDown, color: "text-primary" },
  { label: "Sleep Quality", value: "8.2/10", trend: "up", icon: Activity, color: "text-primary" },
  { label: "Energy Level", value: "Good", trend: "up", icon: Heart, color: "text-secondary" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <MobileBottomNav />
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* Greeting */}
        <header className="mb-10">
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary tracking-tight mb-1">
            Welcome back, Amara 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your health journey overview for today.
          </p>
        </header>

        {/* Health Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {healthMetrics.map((m) => (
            <div key={m.label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-botanical flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed/30 flex items-center justify-center">
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-label">{m.label}</p>
                <p className="text-xl font-bold text-foreground font-headline">{m.value}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Upcoming Appointments */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-headline font-bold text-foreground">Upcoming Appointments</h2>
                <button
                  onClick={() => navigate("/")}
                  className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => navigate(`/practitioner/${apt.practitionerId}`)}
                    className="bg-surface-container-lowest rounded-2xl p-5 shadow-botanical flex flex-col sm:flex-row gap-5 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                      <img src={apt.image} alt={apt.doctor} className="w-full h-full object-cover" width={64} height={64} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline font-bold text-primary">{apt.doctor}</h3>
                      <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary" /> {apt.date}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-primary" /> {apt.time}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Video className="w-3.5 h-3.5 text-primary" /> {apt.type}
                        </span>
                      </div>
                    </div>
                    <button className="self-center bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary-container transition-all">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Orders */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-headline font-bold text-foreground">Recent Orders</h2>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  Shop More <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-botanical flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                      <img src={order.image} alt={order.product} className="w-full h-full object-cover" width={56} height={56} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline font-semibold text-foreground text-sm truncate">{order.product}</h3>
                      <p className="text-xs text-muted-foreground">Order #{order.id} • {order.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-primary-fixed/30 text-primary"
                          : "bg-secondary-container/30 text-secondary"
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-sm font-bold text-foreground mt-1">{order.price} ETB</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-botanical space-y-4">
              <h3 className="font-headline font-bold text-foreground">Quick Actions</h3>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" /> Find a Practitioner
              </button>
              <button
                onClick={() => navigate("/marketplace")}
                className="w-full bg-surface-container-low text-primary py-3 rounded-xl font-bold text-sm hover:bg-surface-container transition-all flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" /> Browse Marketplace
              </button>
              <button
                onClick={() => navigate("/messages")}
                className="w-full bg-surface-container-low text-primary py-3 rounded-xl font-bold text-sm hover:bg-surface-container transition-all flex items-center justify-center gap-2"
              >
                <Leaf className="w-4 h-4" /> Message Your Doctor
              </button>
            </div>

            {/* Botanical Tip */}
            <div className="bg-tertiary-container text-on-tertiary-container p-6 rounded-2xl tibeb-pattern">
              <div className="flex items-start gap-3">
                <Leaf className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2">Daily Botanical Tip</p>
                  <p className="text-sm leading-relaxed">
                    Drinking Koseret tea in the morning can help reduce inflammation markers. Your practitioner 
                    recommends pairing it with Nigella sativa oil for enhanced benefits.
                  </p>
                </div>
              </div>
            </div>

            {/* Treatment Progress */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-botanical">
              <h3 className="font-headline font-bold text-foreground mb-4">Treatment Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Herbal Regimen</span>
                    <span className="font-bold text-primary">75%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Lab Follow-ups</span>
                    <span className="font-bold text-secondary">50%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "50%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Lifestyle Goals</span>
                    <span className="font-bold text-primary">90%</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "90%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
