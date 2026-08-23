import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export function About() {
  const { settings } = useSiteSettings();
  const about = settings.about;

  return (
    <div className="bg-soft-white">
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 2,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="absolute inset-0"
        >
          <img
            src={about.heroImage}
            alt={about.heroTitle}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-primary/40" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
            }}
            className="label-sm text-foreground/70 mb-6"
          >
            {about.heroLabel}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
            }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] text-balance"
          >
            {about.heroTitle}
          </motion.h1>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-24 md:py-32">
        <div className="container-lux max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="label-sm text-muted mb-6 text-center"
          >
            {about.established}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              margin: '-60px',
            }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-lg md:text-xl font-serif text-primary leading-relaxed text-center"
          >
            {about.storyParagraphs.map(
              (paragraph, index) => (
                <p
                  key={`${index}-${paragraph.slice(
                    0,
                    20
                  )}`}
                >
                  {paragraph}
                </p>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="relative py-32 md:py-40 bg-primary text-foreground overflow-hidden">
        <div className="container-lux">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{
                opacity: 0,
                scale: 1.1,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
                margin: '-80px',
              }}
              transition={{
                duration: 1.2,
              }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <img
                src={about.philosophyImage}
                alt={about.philosophyLabel}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>

            <div>
              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                className="label-sm text-foreground/50 mb-6"
              >
                {about.philosophyLabel}
              </motion.p>

              <motion.p
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: '-60px',
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                }}
                className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.4] text-balance"
              >
                {about.philosophyText}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* CRAFTSMANSHIP */}
      <section className="py-24 md:py-32">
        <div className="container-lux">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: 'MATERIAL',
                text: about.craftsmanship.material,
              },
              {
                title: 'CRAFT',
                text: about.craftsmanship.craft,
              },
              {
                title: 'LONGEVITY',
                text: about.craftsmanship.longevity,
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: '-60px',
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                className="text-center"
              >
                <h3 className="label-sm text-primary mb-4">
                  {item.title}
                </h3>

                <p className="text-sm text-muted leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-24 md:py-32 bg-primary text-foreground text-center">
        <div className="container-lux max-w-2xl">
          <motion.h2
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            className="font-serif text-3xl md:text-5xl mb-6 text-balance"
          >
            {about.closingTitle}
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="text-foreground/60 text-sm mb-8"
          >
            {about.closingText}
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              delay: 0.3,
            }}
          >
            <Link
              to={about.closingButtonLink}
              className="btn-lux-dark"
            >
              <span>{about.closingButtonText}</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}