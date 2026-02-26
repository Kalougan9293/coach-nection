"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CoachesSection from "@/components/home/CoachesSection";
import AnnouncementsSection from "@/components/home/AnnouncementsSection";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [coachs, setCoachs] = useState<Record<string, unknown>[]>([]);
  const [annonces, setAnnonces] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [coachsRes, annoncesRes] = await Promise.all([
        supabase.from("coachs").select("*").order("created_at", { ascending: false }).limit(8),
        supabase.from("demandes").select("*").order("created_at", { ascending: false }).limit(4),
      ]);
      if (coachsRes.data) setCoachs(coachsRes.data);
      if (annoncesRes.data) setAnnonces(annoncesRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <CoachesSection coachs={coachs} loading={loading} />
        <AnnouncementsSection annonces={annonces} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
