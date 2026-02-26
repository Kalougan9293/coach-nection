"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, motion, useInView } from "framer-motion";
import { supabase } from "@/lib/supabase";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `+${Math.round(latest)}`;
      }
    });
  }, [springValue]);

  return <span ref={ref}>+0</span>;
}

export default function StatsSection() {
  const [coachsCount, setCoachsCount] = useState<number>(0);
  const [demandesCount, setDemandesCount] = useState<number>(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { count: coachs } = await supabase
          .from("coachs")
          .select("*", { count: "exact", head: true });
        setCoachsCount(coachs ?? 0);
      } catch {
        setCoachsCount(0);
      }
      try {
        const { count: demandes } = await supabase
          .from("demandes")
          .select("*", { count: "exact", head: true });
        setDemandesCount(demandes ?? 0);
      } catch {
        setDemandesCount(0);
      }
    }
    fetchCounts();
  }, []);

  return (
    <section className="py-4 md:py-6 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-secondary/3 to-primary/3 backdrop-blur-sm -z-10" />

      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
          {/* Bloc 1 : Coachs inscrits (Supabase) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0 }}
            className="text-center p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-primary/10 shadow-soft"
          >
            <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
              <AnimatedNumber value={coachsCount} />
            </p>
            <p className="text-sm md:text-base text-primary/80 font-medium">
              Coachs inscrits
            </p>
          </motion.div>

          {/* Bloc 2 : Demandes gérées (Supabase) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-center p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-primary/10 shadow-soft"
          >
            <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
              <AnimatedNumber value={demandesCount} />
            </p>
            <p className="text-sm md:text-base text-primary/80 font-medium">
              Demandes gérées
            </p>
          </motion.div>

          {/* Bloc 3 : Temps de réponse moyen (statique) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            className="text-center p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-primary/10 shadow-soft"
          >
            <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
              &lt; 24h
            </p>
            <p className="text-sm md:text-base text-primary/80 font-medium">
              Temps de réponse moyen
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
