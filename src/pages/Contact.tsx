import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { submitContact } from '@/services/contact';

export function Contact() {
  const { settings } = useSiteSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const { error } = await submitContact(form);
    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="bg-soft-white">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden bg-primary">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.pexels.com/photos/23916869/pexels-photo-23916869.png?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
        </motion.div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] text-balance"
          >
            Let's create
            <br />
            something beautiful.
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-32">
        <div className="container-lux">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-3xl text-primary mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-sm text-muted block mb-2">NAME *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="label-sm text-muted block mb-2">EMAIL *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-sm text-muted block mb-2">PHONE</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="label-sm text-muted block mb-2">SUBJECT</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="label-sm text-muted block mb-2">MESSAGE *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    className="w-full border-b border-border/40 py-3 bg-transparent text-primary outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-lux text-primary border-primary disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <Send size={14} strokeWidth={1.5} />
                    {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
                  </span>
                </button>
                {status === 'success' && (
                  <p className="text-green-700 text-sm">Thank you. Your message has been sent.</p>
                )}
                {status === 'error' && (
                  <p className="text-red-600 text-sm">{errorMsg || 'Something went wrong. Please try again.'}</p>
                )}
              </form>
            </motion.div>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <h2 className="font-serif text-3xl text-primary mb-8">Connect</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail size={20} strokeWidth={1.5} className="text-muted flex-shrink-0 mt-1" />
                  <div>
                    <p className="label-sm text-muted mb-1">EMAIL</p>
                    <a href={`mailto:${settings.contact.email}`} className="text-primary text-sm hover:text-muted transition-colors">
                      {settings.contact.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone size={20} strokeWidth={1.5} className="text-muted flex-shrink-0 mt-1" />
                  <div>
                    <p className="label-sm text-muted mb-1">PHONE</p>
                    <a href={`tel:${settings.contact.phone}`} className="text-primary text-sm hover:text-muted transition-colors">
                      {settings.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin size={20} strokeWidth={1.5} className="text-muted flex-shrink-0 mt-1" />
                  <div>
                    <p className="label-sm text-muted mb-1">ADDRESS</p>
                    <p className="text-primary text-sm leading-relaxed">{settings.contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={20} strokeWidth={1.5} className="text-muted flex-shrink-0 mt-1" />
                  <div>
                    <p className="label-sm text-muted mb-1">HOURS</p>
                    <p className="text-primary text-sm">{settings.contact.hours}</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="pt-8 border-t border-border/20">
                <p className="label-sm text-muted mb-4">FOLLOW</p>
                <div className="flex gap-6">
                  {settings.social.instagram && (
                    <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="text-sm text-primary hover:text-muted transition-colors link-underline">
                      Instagram
                    </a>
                  )}
                  {settings.social.facebook && (
                    <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="text-sm text-primary hover:text-muted transition-colors link-underline">
                      Facebook
                    </a>
                  )}
                  {settings.social.pinterest && (
                    <a href={settings.social.pinterest} target="_blank" rel="noreferrer" className="text-sm text-primary hover:text-muted transition-colors link-underline">
                      Pinterest
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
