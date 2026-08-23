import { useEffect, useState } from 'react';
import { AlertCircle, Check, Save } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { saveSettings } from '@/services/settings';
import type { SiteSettings } from '@/types';

type Tab =
  | 'branding'
  | 'hero'
  | 'homepage'
  | 'about'
  | 'theme'
  | 'contact'
  | 'social'
  | 'footer'
  | 'seo';

const TABS: { key: Tab; label: string }[] = [
  { key: 'branding', label: 'Branding' },
  { key: 'hero', label: 'Hero' },
  { key: 'homepage', label: 'Homepage' },
  { key: 'about', label: 'About' },
  { key: 'theme', label: 'Theme' },
  { key: 'contact', label: 'Contact' },
  { key: 'social', label: 'Social' },
  { key: 'footer', label: 'Footer' },
  { key: 'seo', label: 'SEO' },
];

export function AdminSettings() {
  const { settings: contextSettings, refresh } = useSiteSettings();

  const [form, setForm] = useState<SiteSettings>(contextSettings);
  const [tab, setTab] = useState<Tab>('branding');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setForm(contextSettings);
  }, [contextSettings]);

  const update = <
    K extends keyof SiteSettings
  >(
    section: K,
    key: keyof SiteSettings[K] & string,
    value: unknown
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [key]: value,
      },
    }));
  };

  const updateAbout = <
    K extends keyof SiteSettings['about']
  >(
    key: K,
    value: SiteSettings['about'][K]
  ) => {
    setForm((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [key]: value,
      },
    }));
  };

  const updateCraftsmanship = (
    key: keyof SiteSettings['about']['craftsmanship'],
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        craftsmanship: {
          ...prev.about.craftsmanship,
          [key]: value,
        },
      },
    }));
  };

  const updateStoryParagraph = (
    index: number,
    value: string
  ) => {
    setForm((prev) => {
      const paragraphs = [...prev.about.storyParagraphs];

      paragraphs[index] = value;

      return {
        ...prev,
        about: {
          ...prev.about,
          storyParagraphs: paragraphs,
        },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    setErrorMsg('');

    const { error } = await saveSettings(form);

    if (error) {
      setStatus('error');
      setErrorMsg(error);
      setSaving(false);
      return;
    }

    await refresh();

    setStatus('success');
    setSaving(false);

    setTimeout(() => {
      setStatus('idle');
    }, 3000);
  };

  const inputClass =
    'w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 transition-colors';

  const textareaClass =
    `${inputClass} resize-y`;

  const labelClass =
    'block text-xs text-gray-500 uppercase tracking-wider mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-serif text-gray-900">
          Settings
        </h1>

        <div className="flex items-center gap-3 shrink-0">
          {status === 'success' && (
            <span className="text-green-600 text-sm flex items-center gap-1">
              <Check size={16} />
              Saved
            </span>
          )}

          {status === 'error' && (
            <span className="text-red-600 text-sm flex items-center gap-1 max-w-md">
              <AlertCircle size={16} />
              {errorMsg || 'Failed to save'}
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`px-3 py-1.5 text-sm ${tab === item.key
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 p-6 max-w-3xl space-y-4">
        {/* BRANDING */}
        {tab === 'branding' && (
          <>
            <div>
              <label className={labelClass}>Brand Name</label>
              <input
                type="text"
                value={form.brand.name}
                onChange={(e) =>
                  update('brand', 'name', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Tagline</label>
              <input
                type="text"
                value={form.brand.tagline}
                onChange={(e) =>
                  update('brand', 'tagline', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Logo Text</label>
              <input
                type="text"
                value={form.brand.logoText}
                onChange={(e) =>
                  update('brand', 'logoText', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Favicon URL</label>
              <input
                type="text"
                value={form.brand.favicon}
                onChange={(e) =>
                  update('brand', 'favicon', e.target.value)
                }
                className={inputClass}
              />
            </div>
          </>
        )}

        {/* HERO */}
        {tab === 'hero' && (
          <>
            <div>
              <label className={labelClass}>
                Hero Image URL
              </label>

              <input
                type="text"
                value={form.hero.image}
                onChange={(e) =>
                  update('hero', 'image', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Hero Video URL (optional)
              </label>

              <input
                type="text"
                value={form.hero.video}
                onChange={(e) =>
                  update('hero', 'video', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Heading (use line breaks)
              </label>

              <textarea
                rows={3}
                value={form.hero.heading}
                onChange={(e) =>
                  update('hero', 'heading', e.target.value)
                }
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Description
              </label>

              <textarea
                rows={3}
                value={form.hero.description}
                onChange={(e) =>
                  update('hero', 'description', e.target.value)
                }
                className={textareaClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  CTA Text
                </label>

                <input
                  type="text"
                  value={form.hero.ctaText}
                  onChange={(e) =>
                    update('hero', 'ctaText', e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  CTA Link
                </label>

                <input
                  type="text"
                  value={form.hero.ctaLink}
                  onChange={(e) =>
                    update('hero', 'ctaLink', e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Secondary CTA Text
                </label>

                <input
                  type="text"
                  value={form.hero.secondaryCtaText}
                  onChange={(e) =>
                    update(
                      'hero',
                      'secondaryCtaText',
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Secondary CTA Link
                </label>

                <input
                  type="text"
                  value={form.hero.secondaryCtaLink}
                  onChange={(e) =>
                    update(
                      'hero',
                      'secondaryCtaLink',
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </>
        )}

        {/* HOMEPAGE */}
        {tab === 'homepage' && (
          <>
            <div>
              <label className={labelClass}>
                Editorial Title
              </label>

              <input
                type="text"
                value={form.homepage.editorialTitle}
                onChange={(e) =>
                  update(
                    'homepage',
                    'editorialTitle',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Editorial Text
              </label>

              <textarea
                rows={3}
                value={form.homepage.editorialText}
                onChange={(e) =>
                  update(
                    'homepage',
                    'editorialText',
                    e.target.value
                  )
                }
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Featured Collection Title
              </label>

              <input
                type="text"
                value={form.homepage.featuredCollectionTitle}
                onChange={(e) =>
                  update(
                    'homepage',
                    'featuredCollectionTitle',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Featured Products Title
              </label>

              <input
                type="text"
                value={form.homepage.featuredProductsTitle}
                onChange={(e) =>
                  update(
                    'homepage',
                    'featuredProductsTitle',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Featured Products Subtitle
              </label>

              <input
                type="text"
                value={form.homepage.featuredProductsSubtitle}
                onChange={(e) =>
                  update(
                    'homepage',
                    'featuredProductsSubtitle',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Category Title
              </label>

              <input
                type="text"
                value={form.homepage.categoryTitle}
                onChange={(e) =>
                  update(
                    'homepage',
                    'categoryTitle',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Category Subtitle
              </label>

              <input
                type="text"
                value={form.homepage.categorySubtitle}
                onChange={(e) =>
                  update(
                    'homepage',
                    'categorySubtitle',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Philosophy Title
              </label>

              <input
                type="text"
                value={form.homepage.philosophyTitle}
                onChange={(e) =>
                  update(
                    'homepage',
                    'philosophyTitle',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Philosophy Text
              </label>

              <textarea
                rows={4}
                value={form.homepage.philosophyText}
                onChange={(e) =>
                  update(
                    'homepage',
                    'philosophyText',
                    e.target.value
                  )
                }
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Philosophy Image URL
              </label>

              <input
                type="text"
                value={form.homepage.philosophyImage}
                onChange={(e) =>
                  update(
                    'homepage',
                    'philosophyImage',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Cinematic Image URL
              </label>

              <input
                type="text"
                value={form.homepage.cinematicImage}
                onChange={(e) =>
                  update(
                    'homepage',
                    'cinematicImage',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Newsletter Title
              </label>

              <input
                type="text"
                value={form.homepage.newsletterTitle}
                onChange={(e) =>
                  update(
                    'homepage',
                    'newsletterTitle',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Newsletter Text
              </label>

              <textarea
                rows={2}
                value={form.homepage.newsletterText}
                onChange={(e) =>
                  update(
                    'homepage',
                    'newsletterText',
                    e.target.value
                  )
                }
                className={textareaClass}
              />
            </div>
          </>
        )}

        {/* ABOUT */}
        {tab === 'about' && (
          <>
            <div>
              <h2 className="text-lg font-serif text-gray-900 mb-1">
                About Page
              </h2>

              <p className="text-sm text-gray-500">
                Everything saved here appears on the public About page.
              </p>
            </div>

            {/* About Hero */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Hero
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Hero Image URL
                  </label>

                  <input
                    type="text"
                    value={form.about.heroImage}
                    onChange={(e) =>
                      updateAbout('heroImage', e.target.value)
                    }
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Hero Small Label
                  </label>

                  <input
                    type="text"
                    value={form.about.heroLabel}
                    onChange={(e) =>
                      updateAbout('heroLabel', e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Hero Main Heading
                  </label>

                  <input
                    type="text"
                    value={form.about.heroTitle}
                    onChange={(e) =>
                      updateAbout('heroTitle', e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Story */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Our Story
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Established Text
                  </label>

                  <input
                    type="text"
                    value={form.about.established}
                    onChange={(e) =>
                      updateAbout(
                        'established',
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                {form.about.storyParagraphs.map(
                  (paragraph, index) => (
                    <div key={index}>
                      <label className={labelClass}>
                        Story Paragraph {index + 1}
                      </label>

                      <textarea
                        rows={4}
                        value={paragraph}
                        onChange={(e) =>
                          updateStoryParagraph(
                            index,
                            e.target.value
                          )
                        }
                        className={textareaClass}
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Philosophy */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Philosophy
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Philosophy Label
                  </label>

                  <input
                    type="text"
                    value={form.about.philosophyLabel}
                    onChange={(e) =>
                      updateAbout(
                        'philosophyLabel',
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Philosophy Text
                  </label>

                  <textarea
                    rows={5}
                    value={form.about.philosophyText}
                    onChange={(e) =>
                      updateAbout(
                        'philosophyText',
                        e.target.value
                      )
                    }
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Philosophy Image URL
                  </label>

                  <input
                    type="text"
                    value={form.about.philosophyImage}
                    onChange={(e) =>
                      updateAbout(
                        'philosophyImage',
                        e.target.value
                      )
                    }
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Craftsmanship */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Craftsmanship
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Material
                  </label>

                  <textarea
                    rows={3}
                    value={form.about.craftsmanship.material}
                    onChange={(e) =>
                      updateCraftsmanship(
                        'material',
                        e.target.value
                      )
                    }
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Craft
                  </label>

                  <textarea
                    rows={3}
                    value={form.about.craftsmanship.craft}
                    onChange={(e) =>
                      updateCraftsmanship(
                        'craft',
                        e.target.value
                      )
                    }
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Longevity
                  </label>

                  <textarea
                    rows={3}
                    value={form.about.craftsmanship.longevity}
                    onChange={(e) =>
                      updateCraftsmanship(
                        'longevity',
                        e.target.value
                      )
                    }
                    className={textareaClass}
                  />
                </div>
              </div>
            </div>

            {/* Closing */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Closing Section
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Closing Heading
                  </label>

                  <input
                    type="text"
                    value={form.about.closingTitle}
                    onChange={(e) =>
                      updateAbout(
                        'closingTitle',
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Closing Description
                  </label>

                  <textarea
                    rows={3}
                    value={form.about.closingText}
                    onChange={(e) =>
                      updateAbout(
                        'closingText',
                        e.target.value
                      )
                    }
                    className={textareaClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Button Text
                    </label>

                    <input
                      type="text"
                      value={form.about.closingButtonText}
                      onChange={(e) =>
                        updateAbout(
                          'closingButtonText',
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Button Link
                    </label>

                    <input
                      type="text"
                      value={form.about.closingButtonLink}
                      onChange={(e) =>
                        updateAbout(
                          'closingButtonLink',
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* THEME */}
        {tab === 'theme' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'primary', label: 'Primary' },
              { key: 'secondary', label: 'Secondary' },
              { key: 'accent', label: 'Accent' },
              { key: 'background', label: 'Background' },
              { key: 'backgroundDark', label: 'Background Dark' },
              { key: 'foreground', label: 'Foreground' },
              { key: 'muted', label: 'Muted' },
              { key: 'border', label: 'Border' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className={labelClass}>
                  {label}
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      (form.theme as Record<string, string>)[
                      key
                      ]
                    }
                    onChange={(e) =>
                      update(
                        'theme',
                        key,
                        e.target.value
                      )
                    }
                    className="w-10 h-10 border border-gray-300 cursor-pointer"
                  />

                  <input
                    type="text"
                    value={
                      (form.theme as Record<string, string>)[
                      key
                      ]
                    }
                    onChange={(e) =>
                      update(
                        'theme',
                        key,
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTACT */}
        {tab === 'contact' && (
          <>
            <div>
              <label className={labelClass}>Email</label>

              <input
                type="text"
                value={form.contact.email}
                onChange={(e) =>
                  update(
                    'contact',
                    'email',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Phone</label>

              <input
                type="text"
                value={form.contact.phone}
                onChange={(e) =>
                  update(
                    'contact',
                    'phone',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Address</label>

              <textarea
                rows={2}
                value={form.contact.address}
                onChange={(e) =>
                  update(
                    'contact',
                    'address',
                    e.target.value
                  )
                }
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Business Hours
              </label>

              <input
                type="text"
                value={form.contact.hours}
                onChange={(e) =>
                  update(
                    'contact',
                    'hours',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>
          </>
        )}

        {/* SOCIAL */}
        {tab === 'social' && (
          <>
            <div>
              <label className={labelClass}>
                Instagram
              </label>

              <input
                type="text"
                value={form.social.instagram}
                onChange={(e) =>
                  update(
                    'social',
                    'instagram',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Facebook
              </label>

              <input
                type="text"
                value={form.social.facebook}
                onChange={(e) =>
                  update(
                    'social',
                    'facebook',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Pinterest
              </label>

              <input
                type="text"
                value={form.social.pinterest}
                onChange={(e) =>
                  update(
                    'social',
                    'pinterest',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                YouTube
              </label>

              <input
                type="text"
                value={form.social.youtube}
                onChange={(e) =>
                  update(
                    'social',
                    'youtube',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>
          </>
        )}

        {/* FOOTER */}
        {tab === 'footer' && (
          <>
            <div>
              <label className={labelClass}>
                Footer Text
              </label>

              <textarea
                rows={3}
                value={form.footer.text}
                onChange={(e) =>
                  update(
                    'footer',
                    'text',
                    e.target.value
                  )
                }
                className={textareaClass}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.footer.newsletterEnabled}
                onChange={(e) =>
                  update(
                    'footer',
                    'newsletterEnabled',
                    e.target.checked
                  )
                }
              />

              Show newsletter in footer
            </label>
          </>
        )}

        {/* SEO */}
        {tab === 'seo' && (
          <>
            <div>
              <label className={labelClass}>
                Site Title
              </label>

              <input
                type="text"
                value={form.seo.siteTitle}
                onChange={(e) =>
                  update(
                    'seo',
                    'siteTitle',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Description
              </label>

              <textarea
                rows={3}
                value={form.seo.description}
                onChange={(e) =>
                  update(
                    'seo',
                    'description',
                    e.target.value
                  )
                }
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Social Sharing Image URL
              </label>

              <input
                type="text"
                value={form.seo.socialImage}
                onChange={(e) =>
                  update(
                    'seo',
                    'socialImage',
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}