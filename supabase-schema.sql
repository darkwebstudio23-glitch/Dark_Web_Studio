-- D'ARK Web Studio: run this once in Supabase > SQL Editor.
create table if not exists public.site_content (
  id integer primary key default 1 check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;

insert into public.site_content (id, data)
values (1, $json$
{
  "brand": "D'ARK Web Studio",
  "instagram": "https://www.instagram.com/dark_web.studio?stkn=MTlmdHRrNnJ4NmJmcw==",
  "gmail": "https://mail.google.com/mail/u/0/#inbox/FMfcgzQhWfXrQMnMWJbTxHlckMgmxPTg",
  "email": "darkwebstudio23@gmail.com",
  "phone": "+91 75075 05721",
  "phoneLink": "tel:+917507505721",
  "whatsapp": "https://wa.me/917507505721",
  "founder": "Anshu Dekate",
  "testimonials": [
    {
      "text": "Anshu delivered our website faster than we expected, and it actually looks like a real brand now — not a template.",
      "name": "Rohit Sharma",
      "role": "Founder, Local Retail Brand"
    },
    {
      "text": "Clear communication from the first call to launch. No confusion, no delays — exactly what a small business needs.",
      "name": "Priya Nair",
      "role": "Owner, Home Services Business"
    },
    {
      "text": "Our online store finally converts. The design alone made customers trust us more.",
      "name": "Karan Mehta",
      "role": "Founder, D2C Startup"
    }
  ],
  "projects": [
    {
      "title": "D'ARK Web Studio — Luxury Fashion Store",
      "tag": "E-COMMERCE",
      "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
    },
    {
      "title": "D'ARK Web Studio — Streetwear Concept",
      "tag": "BRAND SITE",
      "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85"
    },
    {
      "title": "D'ARK Web Studio — This Site",
      "tag": "WEB STUDIO SITE",
      "image": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85"
    }
  ],
  "services": [
    {
      "title": "Website Design",
      "text": "Custom, modern websites built around your brand — not a generic template everyone else is using.",
      "icon": "♨",
      "image": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=900&q=80"
    },
    {
      "title": "E-Commerce Stores",
      "text": "Full online stores with product pages, cart, and checkout — built to actually convert visitors into buyers.",
      "icon": "🛒",
      "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80"
    },
    {
      "title": "Branding & Logo Design",
      "text": "Logo, color system, and visual identity that makes your business look established from day one.",
      "icon": "✦",
      "image": "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80"
    },
    {
      "title": "CRM & Automation Setup",
      "text": "Connect your leads, orders, and follow-ups so nothing falls through the cracks as you grow.",
      "icon": "∞",
      "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
    },
    {
      "title": "Chatbot Integration",
      "text": "WhatsApp and website chatbots that answer customer questions and capture leads while you sleep.",
      "icon": "💬",
      "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
    },
    {
      "title": "Hosting & Maintenance",
      "text": "We keep your site live, fast, and updated — so you never have to think about the technical side.",
      "icon": "⚙",
      "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80"
    }
  ],
  "team": [
    {
      "name": "Anshu Dekate",
      "role": "FOUNDER",
      "bio": "D'ARK Web Studio",
      "image": ""
    }
  ]
}
$json$::jsonb)
on conflict (id) do nothing;
