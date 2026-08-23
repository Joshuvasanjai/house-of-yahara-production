import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchPolicyBySlug } from '@/services/settings';
import type { Policy } from '@/types';

export function PolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!slug) return;
    fetchPolicyBySlug(slug)
      .then(setPolicy)
      .catch(() => setPolicy(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-28 min-h-screen bg-soft-white">
        <div className="container-lux py-20 animate-pulse">
          <div className="h-12 bg-background w-1/3" />
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="pt-28 min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-3xl text-primary mb-4">Page not found</p>
          <Link to="/" className="label-sm text-primary link-underline">RETURN HOME</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-soft-white">
      <div className="container-lux max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-5xl text-primary mb-12"
        >
          {policy.title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-sm max-w-none"
        >
          <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{policy.content}</p>
        </motion.div>
        <div className="mt-12 pt-8 border-t border-border/20">
          <Link to="/" className="label-sm text-primary link-underline">RETURN HOME</Link>
        </div>
      </div>
    </div>
  );
}
