import { useState } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────
const TATTOO_STYLES = [
  "Blackwork", "Realism", "Neo-Traditional", "Watercolor",
  "Fine Line", "Geometric", "Japanese", "Trash Polka",
  "Tribal", "Minimalism", "Old School", "Dotwork",
];

const OTHER_STYLES = {
  "Malarstwo": ["Akwarela", "Olej", "Akryl", "Gwasz", "Abstrakcja", "Realizm"],
  "Ilustracja": ["Digital", "Komiks", "Botanika", "Portret", "Editorial"],
  "Fotografia": ["Portret", "Street", "Analog", "Krajobraz", "Architektura"],
  "Grafika": ["Logo & Branding", "Plakat", "Typografia", "3D", "Motion"],
};

const ARTISTS = [
  {
    id: 1, nick: "marta.ink", name: "Marta Kowalska", city: "Kraków",
    categories: ["Tatuaż"], styles: ["Blackwork", "Geometric", "Fine Line"],
    bio: "Specjalizuję się w tatuażach blackwork i geometrycznych. 7+ lat doświadczenia w Krakowie.",
    avatar: "https://i.pravatar.cc/150?img=47",
    instagram: "marta.ink", email: "marta@ink.pl",
    projects: [
      { id: 1, title: "Geometria na ramieniu", img: "https://picsum.photos/seed/t1/400/400" },
      { id: 2, title: "Mandala plecy", img: "https://picsum.photos/seed/t2/400/400" },
      { id: 3, title: "Blackwork łydka", img: "https://picsum.photos/seed/t3/400/400" },
      { id: 4, title: "Fine line kwiat", img: "https://picsum.photos/seed/t4/400/400" },
    ],
  },
  {
    id: 2, nick: "zuza.tattoo", name: "Zuzanna Nowak", city: "Kraków",
    categories: ["Tatuaż"], styles: ["Fine Line", "Watercolor", "Minimalism"],
    bio: "Fine line i watercolor tattoo. Piszcie przez Instagram aby umówić sesję.",
    avatar: "https://i.pravatar.cc/150?img=45",
    instagram: "zuza.tattoo", email: null,
    projects: [
      { id: 5, title: "Fine line rose", img: "https://picsum.photos/seed/f1/400/400" },
      { id: 6, title: "Watercolor fox", img: "https://picsum.photos/seed/f2/400/400" },
      { id: 7, title: "Minimal wrist", img: "https://picsum.photos/seed/f3/400/400" },
      { id: 8, title: "Fine line snake", img: "https://picsum.photos/seed/f4/400/400" },
    ],
  },
  {
    id: 3, nick: "tomasz.tattoo", name: "Tomasz Grela", city: "Kraków",
    categories: ["Tatuaż"], styles: ["Trash Polka", "Realism", "Neo-Traditional"],
    bio: "Trash polka, neo-traditional i realistyczne portrety. Studio na Kazimierzu.",
    avatar: "https://i.pravatar.cc/150?img=57",
    instagram: "tomasz.tattoo", email: "tomasz@studio.pl",
    projects: [
      { id: 9, title: "Trash polka sleeve", img: "https://picsum.photos/seed/tt1/400/400" },
      { id: 10, title: "Neo-trad sowa", img: "https://picsum.photos/seed/tt2/400/400" },
      { id: 11, title: "Portret realistyczny", img: "https://picsum.photos/seed/tt3/400/400" },
    ],
  },
  {
    id: 4, nick: "jakub.paints", name: "Jakub Wiśniewski", city: "Kraków",
    categories: ["Malarstwo", "Ilustracja"], styles: ["Akwarela", "Olej", "Botanika"],
    bio: "Malarz i ilustrator. Tworzę głównie akwarele i oleje inspirowane naturą i architekturą.",
    avatar: "https://i.pravatar.cc/150?img=52",
    instagram: "jakub.paints", email: "jakub@paints.pl",
    projects: [
      { id: 12, title: "Tatry o świcie", img: "https://picsum.photos/seed/p1/400/400" },
      { id: 13, title: "Stare Miasto Kraków", img: "https://picsum.photos/seed/p2/400/400" },
      { id: 14, title: "Portret w akwareli", img: "https://picsum.photos/seed/p3/400/400" },
    ],
  },
  {
    id: 5, nick: "piotr.design", name: "Piotr Adamski", city: "Warszawa",
    categories: ["Grafika", "Ilustracja"], styles: ["Logo & Branding", "Plakat", "Digital"],
    bio: "Digital artist i grafik. Projekty dla marek, plakaty, komiks autorski.",
    avatar: "https://i.pravatar.cc/150?img=60",
    instagram: "piotr.design", email: "piotr@design.io",
    projects: [
      { id: 15, title: "Plakat koncertowy", img: "https://picsum.photos/seed/g1/400/400" },
      { id: 16, title: "Okładka albumu", img: "https://picsum.photos/seed/g2/400/400" },
      { id: 17, title: "Komiks Strona 1", img: "https://picsum.photos/seed/g3/400/400" },
    ],
  },
  {
    id: 6, nick: "ola.frames", name: "Aleksandra Bąk", city: "Warszawa",
    categories: ["Fotografia"], styles: ["Portret", "Analog", "Street"],
    bio: "Fotografia portretowa i uliczna. Ciemnia analogowa, filmy 35mm.",
    avatar: "https://i.pravatar.cc/150?img=39",
    instagram: "ola.frames", email: "ola@frames.co",
    projects: [
      { id: 18, title: "Portret #12", img: "https://picsum.photos/seed/ph1/400/400" },
      { id: 19, title: "Praga nocą", img: "https://picsum.photos/seed/ph2/400/400" },
      { id: 20, title: "Analog series", img: "https://picsum.photos/seed/ph3/400/400" },
    ],
  },
  {
    id: 7, nick: "kris.black", name: "Krzysztof Maj", city: "Gdańsk",
    categories: ["Tatuaż"], styles: ["Japanese", "Old School", "Neo-Traditional"],
    bio: "Japanese i old school — kolory, linie, klasyka. Piszcie śmiało.",
    avatar: "https://i.pravatar.cc/150?img=68",
    instagram: "kris.black", email: "kris@black.pl",
    projects: [
      { id: 21, title: "Japanese dragon", img: "https://picsum.photos/seed/j1/400/400" },
      { id: 22, title: "Old school eagle", img: "https://picsum.photos/seed/j2/400/400" },
      { id: 23, title: "Hannya mask", img: "https://picsum.photos/seed/j3/400/400" },
    ],
  },
  {
    id: 8, nick: "dot.wrk", name: "Agata Lis", city: "Wrocław",
    categories: ["Tatuaż"], styles: ["Dotwork", "Geometric", "Blackwork"],
    bio: "Dotwork i geometria. Każdy projekt tworzony indywidualnie.",
    avatar: "https://i.pravatar.cc/150?img=41",
    instagram: "dot.wrk", email: "agata@dotwrk.pl",
    projects: [
      { id: 24, title: "Dotwork mandala", img: "https://picsum.photos/seed/d1/400/400" },
      { id: 25, title: "Sacred geometry", img: "https://picsum.photos/seed/d2/400/400" },
      { id: 26, title: "Dotwork sleeve", img: "https://picsum.photos/seed/d3/400/400" },
    ],
  },
];

const ALL_CITIES = [...new Set(ARTISTS.map((a) => a.city))].sort();
const REGISTER_CITIES = [
  "Warszawa", "Kraków", "Gdańsk", "Wrocław", "Poznań", "Łódź",
  "Katowice", "Szczecin", "Bydgoszcz", "Lublin", "Białystok",
  "Rzeszów", "Toruń", "Gdynia", "Sopot", "Częstochowa",
  "Radom", "Sosnowiec", "Kielce", "Gliwice", "Olsztyn",
  "Opole", "Zakopane", "Nowy Sącz",
];
const ALL_CATEGORIES = [...new Set(ARTISTS.flatMap((a) => a.categories))].sort();

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 18, fill = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"}
    stroke={fill ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IconSearch = () => <Ico d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />;
const IconIG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);
const IconEmail  = () => <Ico d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
const IconPin    = () => <Ico d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" size={14} />;
const IconBack   = () => <Ico d="M19 12H5M12 5l-7 7 7 7" />;
const IconX      = () => <Ico d="M18 6L6 18M6 6l12 12" size={16} />;
const IconUpload = () => <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const IconUser   = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />;
const IconCompass= () => <Ico d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0v2m0 18v-2m10-10h-2M4 12H2" />;
const IconCheck  = () => <Ico d="M20 6L9 17l-5-5" />;
const IconLock   = () => <Ico d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4" size={13} />;

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; background: #0a0a0a; color: #f0f0f0; }

  /* ── NAV ── */
  .nav { position: sticky; top: 0; z-index: 100; background: rgba(10,10,10,0.88);
    backdrop-filter: blur(14px); border-bottom: 1px solid #1c1c1c;
    padding: 0 28px; height: 58px; display: flex; align-items: center; justify-content: space-between; }
  .nav-logo { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; cursor: pointer;
    background: linear-gradient(135deg, #e879f9 0%, #818cf8 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    flex: 1; }
  .nav-tabs { display: flex; gap: 4px; justify-content: center; }
  .nav-tab { padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; background: transparent; color: #666; transition: all .15s;
    display: flex; align-items: center; gap: 6px; }
  .nav-tab:hover { color: #ccc; background: #1a1a1a; }
  .nav-tab.active { color: #fff; background: #1e1e1e; }
  .nav-right { display: flex; gap: 8px; flex: 1; justify-content: flex-end; }
  .btn { padding: 7px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;
    font-weight: 500; transition: all .15s; }
  .btn-ghost { background: transparent; color: #777; border: 1px solid #272727; }
  .btn-ghost:hover { background: #1a1a1a; color: #ddd; }
  .btn-primary { background: linear-gradient(135deg, #e879f9, #818cf8); color: #fff; }
  .btn-primary:hover { opacity: .9; transform: translateY(-1px); }

  /* ── HERO ── */
  .hero { padding: 72px 28px 48px; text-align: center; max-width: 680px; margin: 0 auto; }
  .hero h1 { font-size: clamp(30px, 6vw, 54px); font-weight: 700; letter-spacing: -1px;
    line-height: 1.1; margin-bottom: 14px; }
  .hero h1 span { background: linear-gradient(135deg, #e879f9, #818cf8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero p { color: #777; font-size: 16px; margin-bottom: 32px; line-height: 1.65; }

  /* ── SEARCH BAR ── */
  .search-wrap { position: relative; max-width: 520px; margin: 0 auto 36px; }
  .search-input { width: 100%; padding: 13px 44px; background: #141414; border: 1px solid #252525;
    border-radius: 12px; color: #f0f0f0; font-size: 15px; outline: none; transition: border .15s; }
  .search-input:focus { border-color: #818cf8; }
  .search-input::placeholder { color: #444; }
  .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #444; pointer-events: none; }
  .search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: #222; border: none; color: #777; cursor: pointer; border-radius: 5px;
    padding: 3px; display: flex; align-items: center; }

  /* ── STATS ── */
  .stats { max-width: 1160px; margin: 0 auto 32px; padding: 0 28px;
    display: flex; gap: 36px; flex-wrap: wrap; }
  .stat-num { font-size: 26px; font-weight: 700;
    background: linear-gradient(135deg, #e879f9, #818cf8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .stat-label { color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; margin-top: 1px; }

  /* ── FILTERS PANEL ── */
  .filters-panel { max-width: 1160px; margin: 0 auto 28px; padding: 0 28px; }
  .filter-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 10px; }
  .filter-row:last-child { margin-bottom: 0; }
  .filter-label { color: #555; font-size: 12px; font-weight: 600; text-transform: uppercase;
    letter-spacing: .5px; min-width: 68px; }
  .chip { padding: 5px 13px; border-radius: 20px; border: 1px solid #222; background: #111;
    color: #666; font-size: 12px; cursor: pointer; transition: all .15s; white-space: nowrap; }
  .chip:hover { border-color: #383838; color: #bbb; }
  .chip.active { background: linear-gradient(135deg, #e879f9, #818cf8); border-color: transparent; color: #fff; }
  .chip-style { font-size: 11px; padding: 4px 11px; }

  /* ── GRID ── */
  .grid { max-width: 1160px; margin: 0 auto; padding: 0 28px 80px;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 18px; }
  .empty { text-align: center; padding: 72px 24px; color: #444; grid-column: 1/-1; }
  .empty h3 { font-size: 18px; margin-bottom: 6px; color: #666; }

  /* ── ARTIST CARD ── */
  .artist-card { background: #111; border: 1px solid #1c1c1c; border-radius: 16px;
    overflow: hidden; cursor: pointer; transition: all .2s; }
  .artist-card:hover { transform: translateY(-3px); border-color: #818cf8;
    box-shadow: 0 8px 28px rgba(129,140,248,.12); }
  .card-thumb { position: relative; aspect-ratio: 1; overflow: hidden; background: #181818; }
  .card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
  .artist-card:hover .card-thumb img { transform: scale(1.05); }
  .card-count { position: absolute; bottom: 9px; right: 9px;
    background: rgba(0,0,0,.65); backdrop-filter: blur(4px);
    border-radius: 6px; padding: 2px 8px; font-size: 11px; color: #ccc; }
  .card-body { padding: 14px 16px 16px; }
  .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .avatar { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid #222; }
  .card-name { font-weight: 600; font-size: 14px; }
  .card-nick { color: #555; font-size: 12px; }
  .card-city { color: #555; font-size: 12px; display: flex; align-items: center; gap: 3px; }
  .card-styles { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px; }
  .style-tag { padding: 2px 9px; border-radius: 10px; font-size: 10px; font-weight: 500;
    background: rgba(129,140,248,.1); color: #818cf8; border: 1px solid rgba(129,140,248,.2); }

  /* ── EXPLORE PAGE ── */
  .explore { max-width: 1160px; margin: 0 auto; padding: 40px 28px 80px; }
  .explore-title { font-size: 26px; font-weight: 700; margin-bottom: 6px; }
  .explore-sub { color: #555; font-size: 14px; margin-bottom: 36px; }
  .explore-section { margin-bottom: 44px; }
  .section-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
  .section-title { font-size: 16px; font-weight: 600; color: #ddd; }
  .section-count { font-size: 12px; color: #555; }
  .city-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
  .city-card { background: #111; border: 1px solid #1c1c1c; border-radius: 14px; padding: 20px 16px;
    cursor: pointer; transition: all .2s; text-align: center; }
  .city-card:hover { border-color: #e879f9; transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(232,121,249,.1); }
  .city-card-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
  .city-card-count { color: #555; font-size: 12px; }
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
  .cat-card { background: #111; border: 1px solid #1c1c1c; border-radius: 12px; padding: 16px;
    cursor: pointer; transition: all .2s; display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 6px; aspect-ratio: 1.2; }
  .cat-card:hover { border-color: #818cf8; transform: translateY(-2px); }
  .cat-card-name { font-size: 13px; font-weight: 500; }
  .cat-card-count { font-size: 11px; color: #555; }

  /* ── EXPLORE RESULTS ── */
  .explore-results { margin-top: 8px; }
  .results-header { display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .results-breadcrumb { display: flex; align-items: center; gap: 8px; }
  .bc-item { font-size: 13px; color: #555; cursor: pointer; }
  .bc-item:hover { color: #aaa; }
  .bc-sep { color: #333; font-size: 13px; }
  .bc-current { font-size: 13px; font-weight: 600; color: #f0f0f0; }
  .results-count { color: #555; font-size: 13px; }
  .style-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }

  /* ── PROFILE ── */
  .profile { max-width: 960px; margin: 0 auto; padding: 32px 28px 80px; }
  .profile-back { display: flex; align-items: center; gap: 7px; color: #555; font-size: 13px;
    cursor: pointer; margin-bottom: 28px; background: none; border: none; transition: color .15s; }
  .profile-back:hover { color: #fff; }
  .profile-card { background: #111; border: 1px solid #1c1c1c; border-radius: 20px;
    padding: 28px; margin-bottom: 32px; display: flex; gap: 24px; align-items: flex-start; }
  .profile-avatar { width: 84px; height: 84px; border-radius: 50%; object-fit: cover;
    border: 3px solid #1e1e1e; flex-shrink: 0; }
  .profile-name { font-size: 24px; font-weight: 700; margin-bottom: 2px; }
  .profile-nick { color: #555; font-size: 14px; margin-bottom: 8px; }
  .profile-city { color: #555; font-size: 13px; display: flex; align-items: center; gap: 4px; margin-bottom: 10px; }
  .profile-bio { color: #888; font-size: 14px; line-height: 1.6; margin-bottom: 16px; max-width: 520px; }
  .contact-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
  .contact-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px;
    border-radius: 8px; font-size: 12px; font-weight: 500; cursor: pointer; text-decoration: none; transition: all .15s; border: none; }
  .contact-ig { background: #1a1020; color: #e879f9; border: 1px solid rgba(232,121,249,.2); }
  .contact-ig:hover { background: #220a2a; border-color: #e879f9; }
  .contact-email { background: #10101a; color: #818cf8; border: 1px solid rgba(129,140,248,.2); }
  .contact-email:hover { background: #0e1030; border-color: #818cf8; }
  .style-badges { display: flex; gap: 7px; flex-wrap: wrap; }
  .style-badge { padding: 4px 13px; border-radius: 12px; font-size: 12px; font-weight: 500;
    background: rgba(129,140,248,.12); border: 1px solid rgba(129,140,248,.25); color: #a5b4fc; }
  .proj-title { font-size: 16px; font-weight: 600; margin-bottom: 14px; }
  .proj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
  .proj-item { border-radius: 12px; overflow: hidden; aspect-ratio: 1; position: relative;
    background: #181818; cursor: pointer; }
  .proj-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
  .proj-item:hover img { transform: scale(1.06); }
  .proj-overlay { position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 55%);
    opacity: 0; transition: opacity .2s; display: flex; align-items: flex-end; padding: 10px; }
  .proj-item:hover .proj-overlay { opacity: 1; }
  .proj-name { font-size: 12px; font-weight: 500; color: #fff; }

  /* ── REGISTER FLOW ── */
  .register { max-width: 620px; margin: 0 auto; padding: 40px 28px 80px; }
  .register-back { display: flex; align-items: center; gap: 7px; color: #555; font-size: 13px;
    cursor: pointer; margin-bottom: 28px; background: none; border: none; transition: color .15s; }
  .register-back:hover { color: #fff; }
  .steps { display: flex; gap: 0; margin-bottom: 36px; }
  .step { display: flex; align-items: center; flex: 1; }
  .step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0;
    border: 2px solid #252525; color: #444; background: #111; transition: all .2s; }
  .step-dot.done { background: linear-gradient(135deg, #e879f9, #818cf8); border-color: transparent; color: #fff; }
  .step-dot.active { border-color: #818cf8; color: #818cf8; }
  .step-line { flex: 1; height: 2px; background: #1c1c1c; margin: 0 8px; }
  .step-line.done { background: linear-gradient(90deg, #e879f9, #818cf8); }
  .step-label { font-size: 10px; color: #444; text-align: center; margin-top: 4px; white-space: nowrap; }
  .reg-card { background: #111; border: 1px solid #1c1c1c; border-radius: 16px; padding: 28px; }
  .reg-card h2 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
  .reg-card p { color: #666; font-size: 13px; margin-bottom: 24px; }
  .form-row { margin-bottom: 18px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: #777;
    text-transform: uppercase; letter-spacing: .4px; margin-bottom: 7px; }
  .form-input { width: 100%; padding: 11px 14px; background: #0d0d0d; border: 1px solid #222;
    border-radius: 10px; color: #f0f0f0; font-size: 14px; outline: none; transition: border .15s; }
  .form-input:focus { border-color: #818cf8; }
  .form-input::placeholder { color: #333; }
  .form-hint { font-size: 11px; color: #444; margin-top: 5px; }
  .upload-zone { border: 2px dashed #252525; border-radius: 12px; padding: 36px 24px;
    text-align: center; cursor: pointer; transition: all .2s; color: #444; }
  .upload-zone:hover { border-color: #818cf8; color: #818cf8; background: rgba(129,140,248,.04); }
  .upload-zone svg { margin: 0 auto 10px; display: block; }
  .upload-zone p { font-size: 13px; margin-bottom: 4px; color: #777; }
  .upload-zone span { font-size: 11px; color: #444; }
  .upload-previews { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
  .upload-preview { aspect-ratio: 1; border-radius: 8px; background: #1a1a1a; overflow: hidden;
    position: relative; }
  .upload-preview img { width: 100%; height: 100%; object-fit: cover; }
  .style-picker { display: flex; gap: 8px; flex-wrap: wrap; }
  .style-pick-btn { padding: 6px 13px; border-radius: 20px; border: 1px solid #222; background: #0d0d0d;
    color: #555; font-size: 12px; cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 5px; }
  .style-pick-btn:hover { border-color: #818cf8; color: #818cf8; }
  .style-pick-btn.selected { background: rgba(129,140,248,.15); border-color: #818cf8; color: #a5b4fc; }
  .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
  .success-state { text-align: center; padding: 40px 0; }
  .success-icon { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #e879f9, #818cf8);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .success-state h2 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
  .success-state p { color: #666; font-size: 14px; line-height: 1.6; }

  /* ── SUBSCRIPTION / PAYMENT ── */
  .plan-card { border: 1px solid rgba(129,140,248,.3); border-radius: 16px; padding: 22px;
    background: linear-gradient(135deg, rgba(232,121,249,.06), rgba(129,140,248,.06)); margin-bottom: 22px; }
  .plan-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .plan-name { font-size: 15px; font-weight: 600; color: #ddd; }
  .plan-price { font-size: 30px; font-weight: 700;
    background: linear-gradient(135deg, #e879f9, #818cf8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .plan-price small { font-size: 13px; color: #666; -webkit-text-fill-color: #666; font-weight: 500; }
  .plan-after { font-size: 12px; color: #777; margin-top: 4px; }
  .plan-feats { list-style: none; margin-top: 16px; display: flex; flex-direction: column; gap: 9px; }
  .plan-feats li { display: flex; align-items: center; gap: 9px; font-size: 13px; color: #aaa; }
  .plan-feats li svg { color: #818cf8; flex-shrink: 0; }
  .pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .pay-grid .form-row { margin-bottom: 0; }
  .pay-note { display: flex; align-items: center; gap: 7px; font-size: 11px; color: #555; margin-top: 16px; }
  .pay-total { display: flex; justify-content: space-between; align-items: center; padding: 14px 0 2px;
    border-top: 1px solid #1c1c1c; margin-top: 18px; font-size: 14px; color: #ccc; }
  .pay-total b { font-size: 18px; color: #fff; }

  /* ── LIGHTBOX ── */
  .lightbox { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,.94);
    display: flex; align-items: center; justify-content: center; padding: 24px; }
  .lightbox img { max-width: 100%; max-height: 85vh; border-radius: 12px;
    box-shadow: 0 24px 80px rgba(0,0,0,.8); }
  .lightbox-caption { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
    background: rgba(255,255,255,.07); backdrop-filter: blur(8px); border-radius: 8px;
    padding: 7px 18px; font-size: 13px; color: #bbb; white-space: nowrap; }
  .lightbox-close { position: absolute; top: 18px; right: 18px; background: rgba(255,255,255,.08);
    border: none; color: #fff; cursor: pointer; border-radius: 8px; padding: 7px; display: flex; }

  @media (max-width: 640px) {
    .nav-tabs { display: none; }
    .profile-card { flex-direction: column; align-items: center; text-align: center; }
    .contact-row, .style-badges { justify-content: center; }
    .profile-city { justify-content: center; }
  }
`;

// ─── REGISTER FLOW ─────────────────────────────────────────────────────────────
const STEPS = ["Konto", "Profil", "Zdjęcia", "Płatność"];
const SUB_PRICE = "49,99 zł";
const TRIAL_MONTHS = 2;

function RegisterFlow({ onBack, onDone }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    nick: "", name: "", email: "", instagram: "", city: "",
    category: "", bio: "", styles: [], photos: [],
    cardName: "", cardNumber: "", cardExp: "", cardCvc: "",
  });
  const [done, setDone] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleStyle = (s) => update("styles",
    form.styles.includes(s) ? form.styles.filter((x) => x !== s) : [...form.styles, s]);

  const availableStyles = form.category === "Tatuaż"
    ? TATTOO_STYLES
    : OTHER_STYLES[form.category] || [];

  const DEMO_PHOTOS = [
    "https://picsum.photos/seed/up1/300/300",
    "https://picsum.photos/seed/up2/300/300",
    "https://picsum.photos/seed/up3/300/300",
    "https://picsum.photos/seed/up4/300/300",
  ];

  const addDemoPhotos = () => update("photos", DEMO_PHOTOS);

  if (done) return (
    <div className="register">
      <div className="reg-card">
        <div className="success-state">
          <div className="success-icon"><IconCheck /></div>
          <h2>Profil gotowy!</h2>
          <p>Okres próbny aktywny — {TRIAL_MONTHS} miesiące za darmo, potem {SUB_PRICE}/mies.<br />
          Za chwilę pojawisz się w wynikach wyszukiwania.</p>
          <div style={{ marginTop: 28, display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="btn btn-ghost" onClick={onBack}>Wróć na stronę główną</button>
            <button className="btn btn-primary" onClick={onDone}>Zobacz swój profil</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="register">
      <button className="register-back" onClick={onBack}><IconBack /> Wróć</button>

      {/* Steps */}
      <div style={{ marginBottom: 28 }}>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step" key={s}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className={`step-dot ${i < step ? "done" : i === step ? "active" : ""}`}>
                  {i < step ? <IconCheck /> : i + 1}
                </div>
                <div className="step-label">{s}</div>
              </div>
              {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="reg-card">
        {step === 0 && (
          <>
            <h2>Utwórz konto</h2>
            <p>Podstawowe dane do logowania i kontaktu.</p>
            <div className="form-row">
              <label className="form-label">Nick artystyczny *</label>
              <input className="form-input" placeholder="np. marta.ink" value={form.nick}
                onChange={e => update("nick", e.target.value)} />
              <div className="form-hint">Twój unikalny identyfikator w UsArt</div>
            </div>
            <div className="form-row">
              <label className="form-label">Imię i nazwisko</label>
              <input className="form-input" placeholder="Opcjonalnie" value={form.name}
                onChange={e => update("name", e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label">E-mail *</label>
              <input className="form-input" type="email" placeholder="twoj@email.pl" value={form.email}
                onChange={e => update("email", e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label">Instagram</label>
              <input className="form-input" placeholder="@nick (bez małpy)" value={form.instagram}
                onChange={e => update("instagram", e.target.value)} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2>Twój profil artystyczny</h2>
            <p>Te informacje zobaczą osoby szukające artystów.</p>

            {/* MIASTO — chipsy */}
            <div className="form-row">
              <label className="form-label">Miasto *</label>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {REGISTER_CITIES.map(c => (
                  <button key={c} onClick={() => update("city", c)}
                    className={`chip ${form.city === c ? "active" : ""}`}
                    style={{ fontSize: 12 }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* KATEGORIA */}
            <div className="form-row">
              <label className="form-label">Kategoria *</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ALL_CATEGORIES.map(c => (
                  <button key={c} onClick={() => { update("category", c); update("styles", []); }}
                    className={`chip ${form.category === c ? "active" : ""}`}
                    style={{ fontSize: 13 }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* STYLE — pojawiają się po wyborze kategorii */}
            {availableStyles.length > 0 && (
              <div className="form-row">
                <label className="form-label">Styl *</label>
                <div className="style-picker">
                  {availableStyles.map(s => (
                    <button key={s} className={`style-pick-btn ${form.styles.includes(s) ? "selected" : ""}`}
                      onClick={() => toggleStyle(s)}>
                      {form.styles.includes(s) && <IconCheck />}
                      {s}
                    </button>
                  ))}
                </div>
                {form.styles.length > 0 && (
                  <div style={{ marginTop: 8, color: "#555", fontSize: 11 }}>
                    Wybrano: {form.styles.join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* BIO */}
            <div className="form-row">
              <label className="form-label">Bio / Opis</label>
              <textarea className="form-input" rows={3} placeholder="Kilka słów o Tobie i Twojej twórczości..."
                value={form.bio} onChange={e => update("bio", e.target.value)}
                style={{ resize: "vertical" }} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Dodaj swoje prace</h2>
            <p>Wgraj zdjęcia projektów — minimum 2, maksimum 12.</p>
            {form.photos.length === 0 ? (
              <div className="upload-zone" onClick={addDemoPhotos}>
                <IconUpload />
                <p>Kliknij, aby dodać zdjęcia</p>
                <span>PNG, JPG, WEBP · maks. 10 MB każde</span>
              </div>
            ) : (
              <>
                <div className="upload-previews">
                  {form.photos.map((src, i) => (
                    <div className="upload-preview" key={i}>
                      <img src={src} alt={`preview ${i}`} />
                    </div>
                  ))}
                  {form.photos.length < 12 && (
                    <div className="upload-zone" style={{ aspectRatio: "1", padding: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 8 }} onClick={addDemoPhotos}>
                      <span style={{ fontSize: 24, color: "#333" }}>+</span>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 10, color: "#444", fontSize: 11 }}>
                  {form.photos.length} zdjęć dodanych
                </div>
              </>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2>Subskrypcja artysty</h2>
            <p>Pierwsze {TRIAL_MONTHS} miesiące za darmo. Potem {SUB_PRICE} miesięcznie — anuluj kiedy chcesz.</p>

            <div className="plan-card">
              <div className="plan-top">
                <span className="plan-name">UsArt Artysta</span>
                <span className="plan-price">0 zł<small> przez {TRIAL_MONTHS} mies.</small></span>
              </div>
              <div className="plan-after">Następnie {SUB_PRICE} / miesiąc</div>
              <ul className="plan-feats">
                <li><IconCheck /> {TRIAL_MONTHS} pierwsze miesiące całkowicie za darmo</li>
                <li><IconCheck /> Profil widoczny w wyszukiwarce i sekcji Odkrywaj</li>
                <li><IconCheck /> Nielimitowana galeria prac</li>
                <li><IconCheck /> Bezpośredni kontakt: Instagram i e-mail</li>
                <li><IconCheck /> Anuluj w dowolnym momencie</li>
              </ul>
            </div>

            <div className="form-row">
              <label className="form-label">Imię na karcie *</label>
              <input className="form-input" placeholder="Jan Kowalski" value={form.cardName}
                onChange={e => update("cardName", e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label">Numer karty *</label>
              <input className="form-input" placeholder="0000 0000 0000 0000" inputMode="numeric" value={form.cardNumber}
                onChange={e => update("cardNumber", e.target.value)} />
            </div>
            <div className="pay-grid">
              <div className="form-row">
                <label className="form-label">Ważna do *</label>
                <input className="form-input" placeholder="MM / RR" value={form.cardExp}
                  onChange={e => update("cardExp", e.target.value)} />
              </div>
              <div className="form-row">
                <label className="form-label">CVC *</label>
                <input className="form-input" placeholder="123" inputMode="numeric" value={form.cardCvc}
                  onChange={e => update("cardCvc", e.target.value)} />
              </div>
            </div>

            <div className="pay-total">
              <span>Do zapłaty dziś</span>
              <b>0,00 zł</b>
            </div>
            <div className="pay-note">
              <IconLock /> Dziś nie pobieramy żadnej opłaty. Po {TRIAL_MONTHS} miesiącach pobierzemy {SUB_PRICE}/mies., chyba że anulujesz wcześniej.
            </div>
          </>
        )}

        <div className="form-actions">
          {step > 0 && (
            <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>Wstecz</button>
          )}
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Dalej →</button>
          ) : (
            <button className="btn btn-primary" onClick={() => setDone(true)}>
              Rozpocznij {TRIAL_MONTHS} miesiące za darmo ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EXPLORE PAGE ──────────────────────────────────────────────────────────────
function ExplorePage({ onArtist }) {
  const [exploreCity, setExploreCity] = useState(null);
  const [exploreCat, setExploreCat] = useState(null);
  const [exploreStyle, setExploreStyle] = useState(null);

  const cityStats = ALL_CITIES.map(c => ({
    city: c,
    count: ARTISTS.filter(a => a.city === c).length,
  }));

  const catStats = ALL_CATEGORIES.map(c => ({
    cat: c,
    count: ARTISTS.filter(a => a.categories.includes(c)).length,
  }));

  const filteredArtists = ARTISTS.filter(a => {
    const mc = !exploreCity || a.city === exploreCity;
    const mk = !exploreCat || a.categories.includes(exploreCat);
    const ms = !exploreStyle || a.styles.includes(exploreStyle);
    return mc && mk && ms;
  });

  const availableStyles = exploreCat === "Tatuaż"
    ? TATTOO_STYLES
    : exploreCat ? (OTHER_STYLES[exploreCat] || []) : [];

  const hasFilter = exploreCity || exploreCat;

  return (
    <div className="explore">
      {!hasFilter ? (
        <>
          <div className="explore-title">Odkrywaj</div>
          <div className="explore-sub">Przeglądaj artystów według miasta lub dziedziny.</div>

          <div className="explore-section">
            <div className="section-header">
              <span className="section-title">Miasta</span>
              <span className="section-count">{ALL_CITIES.length} miast</span>
            </div>
            <div className="city-grid">
              {cityStats.map(({ city, count }) => (
                <div className="city-card" key={city} onClick={() => setExploreCity(city)}>
                  <div className="city-card-name">{city}</div>
                  <div className="city-card-count">{count} artystów</div>
                </div>
              ))}
            </div>
          </div>

          <div className="explore-section">
            <div className="section-header">
              <span className="section-title">Kategorie</span>
            </div>
            <div className="cat-grid">
              {catStats.map(({ cat, count }) => (
                <div className="cat-card" key={cat} onClick={() => setExploreCat(cat)}>
                  <div className="cat-card-name">{cat}</div>
                  <div className="cat-card-count">{count} artystów</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="explore-results">
          <div className="results-header">
            <div className="results-breadcrumb">
              <span className="bc-item" onClick={() => { setExploreCity(null); setExploreCat(null); setExploreStyle(null); }}>
                Odkrywaj
              </span>
              {exploreCity && (<><span className="bc-sep">/</span><span className="bc-current" style={{ cursor: "pointer" }}
                onClick={() => { setExploreCat(null); setExploreStyle(null); }}>{exploreCity}</span></>)}
              {exploreCat && (<><span className="bc-sep">/</span><span className="bc-current">{exploreCat}</span></>)}
              {exploreStyle && (<><span className="bc-sep">/</span><span className="bc-current">{exploreStyle}</span></>)}
            </div>
            <span className="results-count">{filteredArtists.length} artystów</span>
          </div>

          {/* Category chips if only city selected */}
          {exploreCity && !exploreCat && (
            <div className="filter-row" style={{ marginBottom: 20 }}>
              <span className="filter-label">Kategoria</span>
              {ALL_CATEGORIES.map(c => (
                <button key={c} className={`chip ${exploreCat === c ? "active" : ""}`}
                  onClick={() => setExploreCat(c)}>{c}</button>
              ))}
            </div>
          )}

          {/* Style chips */}
          {availableStyles.length > 0 && (
            <div className="filter-row" style={{ marginBottom: 20 }}>
              <span className="filter-label">Styl</span>
              {availableStyles.map(s => (
                <button key={s} className={`chip chip-style ${exploreStyle === s ? "active" : ""}`}
                  onClick={() => setExploreStyle(exploreStyle === s ? null : s)}>{s}</button>
              ))}
            </div>
          )}

          {/* City chips if only category selected */}
          {exploreCat && !exploreCity && (
            <div className="filter-row" style={{ marginBottom: 20 }}>
              <span className="filter-label">Miasto</span>
              {ALL_CITIES.map(c => (
                <button key={c} className={`chip ${exploreCity === c ? "active" : ""}`}
                  onClick={() => setExploreCity(exploreCity === c ? null : c)}>{c}</button>
              ))}
            </div>
          )}

          <div className="grid" style={{ padding: 0 }}>
            {filteredArtists.length === 0 ? (
              <div className="empty">
                <h3>Brak artystów</h3>
                <p>Spróbuj zmienić filtry.</p>
              </div>
            ) : (
              filteredArtists.map(a => <ArtistCard key={a.id} artist={a} onClick={() => onArtist(a)} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ARTIST CARD ───────────────────────────────────────────────────────────────
function ArtistCard({ artist: a, onClick }) {
  return (
    <div className="artist-card" onClick={onClick}>
      <div className="card-thumb">
        <img src={a.projects[0]?.img} alt="" />
        <span className="card-count">{a.projects.length} prac</span>
      </div>
      <div className="card-body">
        <div className="card-header">
          <img className="avatar" src={a.avatar} alt={a.nick} />
          <div>
            <div className="card-name">@{a.nick}</div>
            <div className="card-city"><IconPin /> {a.city}</div>
          </div>
        </div>
        <div className="card-styles">
          {a.styles.slice(0, 3).map(s => <span className="style-tag" key={s}>{s}</span>)}
          {a.styles.length > 3 && <span className="style-tag">+{a.styles.length - 3}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── ARTIST PROFILE ────────────────────────────────────────────────────────────
function ArtistProfile({ artist: a, onBack }) {
  const [lightbox, setLightbox] = useState(null);
  return (
    <>
      <div className="profile">
        <button className="profile-back" onClick={onBack}><IconBack /> Wróć</button>
        <div className="profile-card">
          <img className="profile-avatar" src={a.avatar} alt={a.nick} />
          <div style={{ flex: 1 }}>
            <div className="profile-name">@{a.nick}</div>
            {a.name && <div className="profile-nick">{a.name}</div>}
            <div className="profile-city"><IconPin /> {a.city}</div>
            <p className="profile-bio">{a.bio}</p>
            <div className="contact-row">
              {a.instagram && (
                <a className="contact-btn contact-ig"
                  href={`https://instagram.com/${a.instagram}`} target="_blank" rel="noreferrer">
                  <IconIG /> @{a.instagram}
                </a>
              )}
              {a.email && (
                <a className="contact-btn contact-email" href={`mailto:${a.email}`}>
                  <IconEmail /> {a.email}
                </a>
              )}
            </div>
            <div className="style-badges">
              {a.styles.map(s => <span className="style-badge" key={s}>{s}</span>)}
            </div>
          </div>
        </div>
        <div className="proj-title">Projekty ({a.projects.length})</div>
        <div className="proj-grid">
          {a.projects.map(p => (
            <div className="proj-item" key={p.id} onClick={() => setLightbox(p)}>
              <img src={p.img} alt={p.title} />
              <div className="proj-overlay"><span className="proj-name">{p.title}</span></div>
            </div>
          ))}
        </div>
      </div>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}><IconX /></button>
          <img src={lightbox.img} alt={lightbox.title} onClick={e => e.stopPropagation()} />
          <div className="lightbox-caption">{lightbox.title}</div>
        </div>
      )}
    </>
  );
}

// ─── SEARCH PAGE ───────────────────────────────────────────────────────────────
function SearchPage({ onArtist }) {
  const [q, setQ] = useState("");
  const [cityF, setCityF] = useState("Wszystkie");
  const [catF, setCatF] = useState("Wszystkie");
  const [styleF, setStyleF] = useState("Wszystkie");

  const availableStyles = catF === "Tatuaż"
    ? ["Wszystkie", ...TATTOO_STYLES]
    : catF !== "Wszystkie" ? ["Wszystkie", ...(OTHER_STYLES[catF] || [])] : [];

  const filtered = ARTISTS.filter(a => {
    const lq = q.toLowerCase();
    const ms = !q || a.nick.toLowerCase().includes(lq) || a.name?.toLowerCase().includes(lq)
      || a.city.toLowerCase().includes(lq)
      || a.styles.some(s => s.toLowerCase().includes(lq))
      || a.categories.some(c => c.toLowerCase().includes(lq));
    const mc = cityF === "Wszystkie" || a.city === cityF;
    const mk = catF === "Wszystkie" || a.categories.includes(catF);
    const mst = styleF === "Wszystkie" || a.styles.includes(styleF);
    return ms && mc && mk && mst;
  });

  return (
    <>
      <div className="hero" style={{ paddingTop: 56 }}>
        <h1>Znajdź <span>artystę</span></h1>
        <p>Wpisz nick, miasto lub styl — albo użyj filtrów poniżej.</p>
        <div className="search-wrap">
          <span className="search-icon"><IconSearch /></span>
          <input className="search-input" placeholder="np. kraków, fine line, @zuza..."
            value={q} onChange={e => setQ(e.target.value)} />
          {q && <button className="search-clear" onClick={() => setQ("")}><IconX /></button>}
        </div>
      </div>

      <div className="filters-panel">
        <div className="filter-row">
          <span className="filter-label">Miasto</span>
          {["Wszystkie", ...ALL_CITIES].map(c => (
            <button key={c} className={`chip ${cityF === c ? "active" : ""}`}
              onClick={() => setCityF(c)}>{c}</button>
          ))}
        </div>
        <div className="filter-row">
          <span className="filter-label">Kategoria</span>
          {["Wszystkie", ...ALL_CATEGORIES].map(c => (
            <button key={c} className={`chip ${catF === c ? "active" : ""}`}
              onClick={() => { setCatF(c); setStyleF("Wszystkie"); }}>{c}</button>
          ))}
        </div>
        {availableStyles.length > 1 && (
          <div className="filter-row">
            <span className="filter-label">Styl</span>
            {availableStyles.map(s => (
              <button key={s} className={`chip chip-style ${styleF === s ? "active" : ""}`}
                onClick={() => setStyleF(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <div className="stats">
        {[
          { num: filtered.length, label: "Artystów" },
          { num: filtered.flatMap(a => a.projects).length, label: "Projektów" },
        ].map(s => (
          <div key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>Brak wyników</h3>
            <p>Zmień filtry lub wyszukiwaną frazę.</p>
          </div>
        ) : (
          filtered.map(a => <ArtistCard key={a.id} artist={a} onClick={() => onArtist(a)} />)
        )}
      </div>
    </>
  );
}

// ─── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("search");           // "search" | "explore" | "register"
  const [profileArtist, setProfileArtist] = useState(null);
  const [prevTab, setPrevTab] = useState("search");

  const openArtist = (a) => { setPrevTab(tab); setProfileArtist(a); };
  const closeArtist = () => setProfileArtist(null);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <span className="nav-logo" onClick={() => { setProfileArtist(null); setTab("search"); }}>
            UsArt
          </span>
          <div className="nav-tabs">
            <button className={`nav-tab ${tab === "search" && !profileArtist ? "active" : ""}`}
              onClick={() => { setProfileArtist(null); setTab("search"); }}>
              <IconSearch /> Szukaj
            </button>
            <button className={`nav-tab ${tab === "explore" && !profileArtist ? "active" : ""}`}
              onClick={() => { setProfileArtist(null); setTab("explore"); }}>
              <IconCompass /> Odkrywaj
            </button>
          </div>
          <div className="nav-right">
            <button className="btn btn-ghost" onClick={() => { setProfileArtist(null); setTab("search"); }}>
              Zaloguj się
            </button>
            <button className="btn btn-primary" onClick={() => { setProfileArtist(null); setTab("register"); }}>
              <IconUser style={{ display: "inline", marginRight: 4 }} /> Dołącz jako artysta
            </button>
          </div>
        </nav>

        {profileArtist ? (
          <ArtistProfile artist={profileArtist} onBack={closeArtist} />
        ) : tab === "search" ? (
          <SearchPage onArtist={openArtist} />
        ) : tab === "explore" ? (
          <ExplorePage onArtist={openArtist} />
        ) : tab === "register" ? (
          <RegisterFlow
            onBack={() => setTab("search")}
            onDone={() => setTab("search")}
          />
        ) : null}
      </div>
    </>
  );
}
