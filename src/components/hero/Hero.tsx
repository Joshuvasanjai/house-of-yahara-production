import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { scaleIn, fadeUp, staggerContainer, lineReveal } from '@/animations/variants';

export function Hero() {
  const { settings } = useSiteSettings();
  const { scrollY } = useScroll();
  const imageScale = useTransform(scrollY, [0, 500], [1.1, 1.25]);
  const textY = useTransform(scrollY, [0, 400], [0, 80]);
  const overlayOpacity = useTransform(scrollY, [0, 400], [0.5, 0.8]);

  const headingLines = settings.hero.heading.split('\n');

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-primary">
      {/* Background image */}
      <motion.div
        style={{ scale: imageScale }}
        className="absolute inset-0"
      >
        {settings.hero.video ? (
          <video
            src={settings.hero.video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.img
            src={settings.hero.image}
            alt=""
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>

      {/* Overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-primary"
      />

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="label-sm text-foreground/70 mb-6"
        >
          {settings.brand.name}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8"
        >
          {headingLines.map((line, i) => (
            <motion.h1
              key={i}
              variants={lineReveal}
              className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] text-balance"
            >
              {line}
            </motion.h1>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-foreground/70 text-sm md:text-base max-w-md mb-10 leading-relaxed"
        >
          {settings.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to={settings.hero.ctaLink} className="btn-lux-dark">
            <span>{settings.hero.ctaText}</span>
          </Link>
          {settings.hero.secondaryCtaText && (
            <Link to={settings.hero.secondaryCtaLink} className="btn-lux-dark">
              <span>{settings.hero.secondaryCtaText}</span>
            </Link>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="label-sm text-foreground/50 text-[10px]">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} strokeWidth={1.5} className="text-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
