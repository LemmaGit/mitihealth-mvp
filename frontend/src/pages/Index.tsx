import { Link } from "react-router-dom";
import { Leaf, ArrowRight, Star, Shield, Heart, Users } from "lucide-react";
import { Button } from "../components/ui/button";

const features = [
  {
    icon: Leaf,
    title: "Traditional Remedies",
    desc: "Access centuries-old Ethiopian botanical knowledge curated by certified herbalists.",
  },
  {
    icon: Shield,
    title: "Clinical Oversight",
    desc: "Every remedy is verified by modern healthcare standards for safety and efficacy.",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    desc: "One-on-one consultations tailored to your unique wellness needs.",
  },
  {
    icon: Users,
    title: "Community Driven",
    desc: "Join 1,200+ botanical enthusiasts sharing their wellness journeys.",
  },
];

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="flex h-16 items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-2">
          <Leaf size={22} className="text-primary" />
          <span className="font-display text-xl font-bold">MitiHealth</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/onboarding" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
          <Link to="/product/1" className="text-sm text-muted-foreground hover:text-foreground">Remedies</Link>
          <Link to="/patient/consultations" className="text-sm text-muted-foreground hover:text-foreground">Consult</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button className="botanical-gradient text-primary-foreground" asChild>
            <Link to="/onboarding">Get Started</Link>
          </Button>
        </div>
      </header>

      <div className="heritage-divider" />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
              Ethiopian Botanical Wellness
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-7xl">
              Ancient wisdom,
              <br />
              modern healing.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg">
              Bridging centuries of Ethiopian herbal knowledge with clinical precision. 
              Consult certified practitioners, discover organic remedies, and nurture your health naturally.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="h-14 px-8 botanical-gradient text-base font-semibold text-primary-foreground" asChild>
                <Link to="/onboarding">
                  Begin Your Journey <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="outline" className="h-14 px-8 text-base border-border/30" asChild>
                <Link to="/product/1">Explore Remedies</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute -right-20 top-20 hidden h-[500px] w-[500px] rounded-full bg-primary/5 lg:block" />
      </section>

      {/* Features */}
      <section className="bg-muted px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Rooted in tradition,
            <br />
            refined by science.
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl bg-card p-6 shadow-botanical transition-shadow hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-secondary text-secondary" />
            ))}
          </div>
          <blockquote className="mx-auto mt-6 max-w-2xl font-display text-2xl font-semibold leading-relaxed text-foreground">
            "The aroma is unlike anything else. It immediately clears my sinuses and has a wonderful peppery finish."
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">— Abinet T., Botanical Enthusiast</p>
        </div>
      </section>

      {/* CTA */}
      <section className="botanical-gradient px-6 py-20 text-center text-primary-foreground lg:px-12">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Ready to start your botanical journey?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-primary-foreground/70">
          Join thousands who trust MitiHealth for natural, clinically-backed wellness.
        </p>
        <Button className="mt-8 h-14 bg-primary-foreground px-10 text-base font-semibold text-primary hover:bg-primary-foreground/90" asChild>
          <Link to="/onboarding">
            Get Started <ArrowRight size={18} />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-foreground px-6 py-12 text-primary-foreground/70 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-primary-foreground">MitiHealth</h3>
            <p className="mt-2 max-w-xs text-sm">
              Bridging ancient Ethiopian botanical wisdom with clinical precision for a healthier, more connected world.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-primary-foreground/50">Navigation</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>Our Story</li>
                <li>Practitioner Network</li>
                <li>Botanical Index</li>
                <li>Ethical Sourcing</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider text-primary-foreground/50">Support</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>Shipping & Returns</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-primary-foreground/10 pt-6 text-xs">
          <p>© 2023 MITIHEALTH BOTANICAL REMEDIES. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
