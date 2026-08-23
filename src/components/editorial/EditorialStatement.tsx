import { motion } from 'framer-motion';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { lineReveal, staggerContainer } from '@/animations/variants';

export function EditorialStatement() {
  const { settings } = useSiteSettings();
  const textLines = settings.homepage.editorialText.split('\n');

  return (
    <section className="py-32 md:py-48 bg-soft-white">
      <div className="container-lux text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="label-sm text-muted mb-12"
        >
          {settings.homepage.editorialTitle}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {textLines.map((line, i) => (
            <motion.p
              key={i}
              variants={lineReveal}
              className="font-serif text-3xl md:text-5xl lg:text-6xl text-primary leading-[1.3] text-balance"
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
