export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'customer' | 'admin';
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  stock: number;
  sku: string | null;
  featured: boolean;
  hidden: boolean;
  materials: string | null;
  dimensions: string | null;
  care_instructions: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  product_images?: ProductImage[];
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  secondary_image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CollectionItem = {
  id: string;
  collection_id: string;
  product_id: string;
  sort_order: number;
  created_at: string;
  product?: Product;
};

export type Order = {
  id: string;
  user_id: string | null;
  order_number: string;
  status:
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';
  subtotal: number;
  shipping_cost: number;
  total: number;
  currency: string;
  shipping_address: Record<string, string> | null;
  billing_address: Record<string, string> | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  created_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  created_at: string;
};

export type Policy = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

export type SiteSettings = {
  brand: {
    name: string;
    tagline: string;
    logoText: string;
    favicon: string;
  };

  hero: {
    image: string;
    video: string;
    heading: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };

  homepage: {
    editorialTitle: string;
    editorialText: string;
    featuredCollectionTitle: string;
    featuredCollectionId: string;
    featuredProductsTitle: string;
    featuredProductsSubtitle: string;
    categoryTitle: string;
    categorySubtitle: string;
    philosophyTitle: string;
    philosophyText: string;
    philosophyImage: string;
    cinematicImage: string;
    newsletterTitle: string;
    newsletterText: string;
  };

  about: {
    heroImage: string;
    heroLabel: string;
    heroTitle: string;
    established: string;
    storyParagraphs: string[];

    philosophyLabel: string;
    philosophyText: string;
    philosophyImage: string;

    craftsmanship: {
      material: string;
      craft: string;
      longevity: string;
    };

    closingTitle: string;
    closingText: string;
    closingButtonText: string;
    closingButtonLink: string;
  };

  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundDark: string;
    foreground: string;
    muted: string;
    border: string;
  };

  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };

  social: {
    instagram: string;
    facebook: string;
    pinterest: string;
    youtube: string;
  };

  footer: {
    text: string;
    newsletterEnabled: boolean;
  };

  seo: {
    siteTitle: string;
    description: string;
    socialImage: string;
  };
};