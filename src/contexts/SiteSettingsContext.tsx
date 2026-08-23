import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types';

const DEFAULT_SETTINGS: SiteSettings = {
  brand: {
    name: 'HOUSE OF YAHARA',
    tagline: 'Curated Spaces. Timeless Living.',
    logoText: 'HOUSE OF YAHARA',
    favicon: '',
  },

  hero: {
    image:
      'https://images.pexels.com/photos/12441654/pexels-photo-12441654.jpeg?auto=compress&cs=tinysrgb&w=1920',
    video: '',
    heading: 'CURATED SPACES.\nTIMELESS LIVING.',
    description:
      'Objects chosen with intention. Spaces created with feeling.',
    ctaText: 'EXPLORE COLLECTION',
    ctaLink: '/collections',
    secondaryCtaText: 'SHOP ALL',
    secondaryCtaLink: '/shop',
  },

  homepage: {
    editorialTitle: 'THE ART OF LIVING',
    editorialText:
      'Objects chosen with intention.\nSpaces created with feeling.',
    featuredCollectionTitle: 'FEATURED COLLECTION',
    featuredCollectionId: '',
    featuredProductsTitle: 'SELECTED PIECES',
    featuredProductsSubtitle:
      'A curated edit of our most cherished objects.',
    categoryTitle: 'EXPLORE BY CATEGORY',
    categorySubtitle: 'Find the perfect piece for every room.',
    philosophyTitle: 'WHY YAHARA',
    philosophyText:
      'We believe that a home is not assembled — it is composed.',
    philosophyImage: '',
    cinematicImage: '',
    newsletterTitle: 'STAY INSPIRED',
    newsletterText: 'Join the House of Yahara journal.',
  },

  about: {
    heroImage:
      'https://images.pexels.com/photos/6283973/pexels-photo-6283973.jpeg?auto=compress&cs=tinysrgb&w=1920',
    heroLabel: 'OUR STORY',
    heroTitle: 'The House of Yahara',
    established: 'EST. 2024',

    storyParagraphs: [
      'House of Yahara was born from a simple belief: that the objects we live with each day should be chosen with the same intention as the art we hang on our walls.',
      'We work directly with artisans across India — woodworkers in Rajasthan, ceramicists in Pondicherry, weavers in Kashmir — to create pieces that honor traditional craft while serving contemporary life.',
      'Every object in our collection is made to last. Not just in terms of durability, but in relevance. We design for timelessness, not trends.',
    ],

    philosophyLabel: 'OUR PHILOSOPHY',
    philosophyText:
      'We believe a home is not assembled — it is composed. Each object should earn its place through craftsmanship, material integrity, and the quiet pleasure it brings to daily life.',
    philosophyImage:
      'https://images.pexels.com/photos/37372056/pexels-photo-37372056.jpeg?auto=compress&cs=tinysrgb&w=1920',

    craftsmanship: {
      material:
        'We source natural, sustainable materials — solid wood, natural stone, pure linen, and lead-free ceramics.',
      craft:
        'Each piece is made by hand, often by a single artisan from start to finish, preserving the human touch.',
      longevity:
        'We design for decades of use. Our furniture is repairable, our ceramics are durable, our textiles soften with age.',
    },

    closingTitle: 'Begin your collection',
    closingText:
      'Explore our curated edit of furniture, ceramics, and objects.',
    closingButtonText: 'EXPLORE THE COLLECTION',
    closingButtonLink: '/shop',
  },

  theme: {
    primary: '#111111',
    secondary: '#202020',
    accent: '#D8CBB8',
    background: '#FAFAF8',
    backgroundDark: '#111111',
    foreground: '#F5F1E8',
    muted: '#77736C',
    border: '#A99B89',
  },

  contact: {
    email: 'hello@houseofyahara.com',
    phone: '+91 98765 43210',
    address: 'No. 42, Lavelle Road, Bengaluru, Karnataka 560001',
    hours: 'Monday – Saturday · 10:00 – 19:00',
  },

  social: {
    instagram: 'https://instagram.com/houseofyahara',
    facebook: 'https://facebook.com/houseofyahara',
    pinterest: 'https://pinterest.com/houseofyahara',
    youtube: '',
  },

  footer: {
    text:
      'House of Yahara is a curated collection of furniture, ceramics, and objects for the modern home.',
    newsletterEnabled: true,
  },

  seo: {
    siteTitle: 'House of Yahara — Curated Spaces, Timeless Living',
    description:
      'A curated collection of furniture, ceramics, and lighting for the modern home.',
    socialImage: '',
  },
};

type SiteSettingsContextValue = {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SiteSettingsContext =
  createContext<SiteSettingsContextValue | undefined>(undefined);

function applyThemeColors(theme: SiteSettings['theme']) {
  const root = document.documentElement;

  root.style.setProperty('--color-background', theme.background);
  root.style.setProperty('--color-background-dark', theme.backgroundDark);
  root.style.setProperty('--color-foreground', theme.foreground);
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-muted', theme.muted);
  root.style.setProperty('--color-border', theme.border);
}

export function SiteSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('website_settings')
      .select('settings')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
      return;
    }

    if (data?.settings) {
      const merged = deepMerge(
        DEFAULT_SETTINGS,
        data.settings as Partial<SiteSettings>
      );

      setSettings(merged);
      applyThemeColors(merged.theme);
    } else {
      applyThemeColors(DEFAULT_SETTINGS.theme);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

function deepMerge<T>(base: T, override: Partial<T>): T {
  if (typeof base !== 'object' || base === null) {
    return (override ?? base) as T;
  }

  if (typeof override !== 'object' || override === null) {
    return base;
  }

  const result: Record<string, unknown> = {
    ...(base as Record<string, unknown>),
  };

  for (const key of Object.keys(override)) {
    const baseVal = (base as Record<string, unknown>)[key];
    const overrideVal = (override as Record<string, unknown>)[key];

    if (
      typeof baseVal === 'object' &&
      baseVal !== null &&
      !Array.isArray(baseVal) &&
      typeof overrideVal === 'object' &&
      overrideVal !== null &&
      !Array.isArray(overrideVal)
    ) {
      result[key] = deepMerge(baseVal, overrideVal);
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal;
    }
  }

  return result as T;
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);

  if (!ctx) {
    throw new Error(
      'useSiteSettings must be used within SiteSettingsProvider'
    );
  }

  return ctx;
}