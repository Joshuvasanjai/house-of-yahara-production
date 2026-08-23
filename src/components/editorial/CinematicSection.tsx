import { motion } from 'framer-motion';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export function CinematicSection() {
  const { settings } = useSiteSettings();

  if (!settings.homepage.cinematicImage) return null;

  return (
    <section className="relative h-[70vh] min-h-[400px] overflow-hidden">
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0"
      >
        <img
          src={settings.homepage.cinematicImage}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>
      <div className="absolute inset-0 bg-primary/30" />
    </section>
  );
}
