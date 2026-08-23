import { motion } from 'framer-motion';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export function Philosophy() {
  const { settings } = useSiteSettings();

  return (
    <section className="relative py-32 md:py-40 bg-primary text-foreground overflow-hidden">
      <div className="container-lux">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            {settings.homepage.philosophyImage && (
              <img
                src={settings.homepage.philosophyImage}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </motion.div>

          {/* Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="label-sm text-foreground/50 mb-6"
            >
              {settings.homepage.philosophyTitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.4] text-balance">
                {settings.homepage.philosophyText}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
