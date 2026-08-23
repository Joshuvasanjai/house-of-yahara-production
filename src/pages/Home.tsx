import { Hero } from '@/components/hero/Hero';
import { EditorialStatement } from '@/components/editorial/EditorialStatement';
import { FeaturedCollection } from '@/components/editorial/FeaturedCollection';
import { CinematicSection } from '@/components/editorial/CinematicSection';
import { FeaturedProducts } from '@/components/editorial/FeaturedProducts';
import { CategoryExperience } from '@/components/editorial/CategoryExperience';
import { Philosophy } from '@/components/editorial/Philosophy';
import { Newsletter } from '@/components/editorial/Newsletter';

export function Home() {
  return (
    <>
      <Hero />
      <EditorialStatement />
      <FeaturedCollection />
      <CinematicSection />
      <FeaturedProducts />
      <CategoryExperience />
      <Philosophy />
      <Newsletter />
    </>
  );
}
