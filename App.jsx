import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "./supabase";

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
  "Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk",
  "Szczecin", "Bydgoszcz", "Lublin", "Białystok", "Katowice", "Gdynia",
  "Częstochowa", "Radom", "Rzeszów", "Toruń", "Sosnowiec", "Kielce",
  "Gliwice", "Olsztyn", "Zabrze", "Bielsko-Biała", "Bytom", "Zielona Góra",
  "Rybnik", "Ruda Śląska", "Opole", "Tychy", "Gorzów Wielkopolski",
  "Dąbrowa Górnicza", "Płock", "Elbląg", "Wałbrzych", "Włocławek", "Tarnów",
  "Chorzów", "Koszalin", "Kalisz", "Legnica", "Grudziądz", "Słupsk",
  "Jaworzno", "Jastrzębie-Zdrój", "Nowy Sącz", "Jelenia Góra", "Siedlce",
  "Mysłowice", "Konin", "Piła", "Piotrków Trybunalski", "Inowrocław", "Lubin",
  "Ostrów Wielkopolski", "Suwałki", "Stargard", "Gniezno", "Siemianowice Śląskie",
  "Głogów", "Pabianice", "Leszno", "Żory", "Zamość", "Pruszków", "Łomża",
  "Ełk", "Tarnowskie Góry", "Tczew", "Chełm", "Mielec", "Kędzierzyn-Koźle",
  "Przemyśl", "Stalowa Wola", "Tomaszów Mazowiecki", "Sopot",
  "Zakopane", "Świnoujście",
];
const ALL_CATEGORIES = ["Fotografia", "Grafika", "Ilustracja", "Malarstwo", "Tatuaż"];

// Zamienia wiersz z bazy (artysta + prace) na kształt używany w aplikacji
const fromDb = (a) => ({
  ...a,
  categories: a.category ? [a.category] : [],
  styles: a.styles || [],
  avatar: a.avatar || a.projects?.[0]?.img || "https://i.pravatar.cc/150?img=12",
  projects: (a.projects || []).map((p) => ({ ...p, title: p.title || "" })),
});

// ─── i18n (PL / EN) ─────────────────────────────────────────────────────────────
const I18N = {
  pl: {
    nav_search: "Szukaj", nav_explore: "Odkrywaj", login: "Zaloguj się", join: "Dołącz jako artysta",
    logout: "Wyloguj", login_title: "Zaloguj się", login_btn: "Zaloguj",
    login_error: "Błędny e-mail lub hasło.", submitting: "Tworzę konto...",
    err_taken: "Ten nick lub e-mail jest już zajęty.",
    hero_a: "Znajdź", hero_b: "artystę",
    hero_sub: "Wpisz nick, miasto lub styl — albo użyj filtrów poniżej.",
    search_ph: "np. kraków, fine line, @zuza...",
    f_city: "Miasto", f_cat: "Kategoria", f_style: "Styl", all: "Wszystkie",
    st_artists: "Artystów", st_projects: "Projektów",
    no_results: "Brak wyników", no_results_sub: "Zmień filtry lub wyszukiwaną frazę.",
    works: "prac",
    explore_title: "Odkrywaj", explore_sub: "Przeglądaj artystów według miasta lub dziedziny.",
    cities: "Miasta", cities_count: "{n} miast", categories: "Kategorie",
    artists_count: "{n} artystów",
    no_artists: "Brak artystów", try_filters: "Spróbuj zmienić filtry.",
    back: "Wróć", projects_n: "Projekty ({n})",
    step_account: "Konto", step_profile: "Profil", step_photos: "Zdjęcia", step_payment: "Płatność",
    create_account: "Utwórz konto", create_account_sub: "Podstawowe dane do logowania i kontaktu.",
    l_nick: "Nick artystyczny *", ph_nick: "np. marta.ink", hint_nick: "Twój unikalny identyfikator w UsArt",
    l_name: "Imię i nazwisko", ph_optional: "Opcjonalnie", l_email: "E-mail *", ph_email: "twoj@email.pl",
    l_password: "Hasło *", ph_password: "Wpisz hasło", l_password2: "Powtórz hasło *",
    ph_password2: "Wpisz hasło ponownie",
    pw_intro: "Hasło musi zawierać:",
    pw_len: "minimum 8 znaków", pw_lower: "jedną małą literę",
    pw_upper: "jedną wielką literę", pw_special: "jeden znak specjalny",
    pw_match_ok: "Hasła są zgodne", pw_match_bad: "Hasła nie są takie same",
    l_ig: "Instagram", ph_ig: "@nick (bez małpy)",
    fill_required: "Uzupełnij wymagane pola oznaczone *",
    profile_title: "Twój profil artystyczny", profile_sub: "Te informacje zobaczą osoby szukające artystów.",
    l_city: "Miasto *", city_other_ph: "Nie ma Twojego miasta? Wpisz je tutaj...",
    l_cat: "Kategoria *", l_style: "Styl *", chosen: "Wybrano:",
    l_bio: "Bio / Opis", ph_bio: "Kilka słów o Tobie i Twojej twórczości...",
    photos_title: "Dodaj swoje prace", photos_sub: "Wgraj zdjęcia projektów — minimum 2, maksimum 12.",
    upload_click: "Kliknij, aby dodać zdjęcia", upload_hint: "PNG, JPG, WEBP · maks. 10 MB każde",
    photos_added: "{n} zdjęć dodanych",
    back_btn: "Wstecz", next_btn: "Dalej →",
    choose_plan: "Wybierz plan", plan_sub: "Pierwsze {m} miesiące za darmo. Studio? Każda kolejna osoba 5 zł taniej.",
    plan_solo: "Artysta solo", per_mo: "/mies.", plan_solo_desc: "Jedna osoba, własny profil",
    plan_studio: "Studio", plan_from: "od", plan_badge: "Taniej za osobę",
    plan_studio_desc: "Wielu artystów pod jednym kontem",
    members_label: "Liczba artystów w studiu",
    bd_first: "1. artysta", bd_each: "Każdy kolejny (−5 zł / os.) × {n}",
    savings: "Oszczędzasz {amt} miesięcznie względem {n} kont solo",
    plan_card_studio: "Studio · {n} artystów", plan_card_solo: "Artysta solo",
    free_for: "przez {m} mies.", then_amt: "Następnie {amt} / miesiąc",
    feat_trial: "{m} pierwsze miesiące całkowicie za darmo",
    feat_studio: "{n} profili artystów pod marką studia — każdy 5 zł taniej",
    feat_solo: "Własny profil widoczny w wyszukiwarce i sekcji Odkrywaj",
    feat_gallery: "Nielimitowana galeria prac", feat_contact: "Bezpośredni kontakt: Instagram i e-mail",
    feat_cancel: "Anuluj w dowolnym momencie",
    card_name: "Imię na karcie *", ph_card_name: "Jan Kowalski", card_number: "Numer karty *",
    card_exp: "Ważna do *", ph_exp: "MM / RR", card_cvc: "CVC *",
    pay_today: "Do zapłaty dziś",
    pay_note: "Dziś nie pobieramy żadnej opłaty. Po {m} miesiącach pobierzemy {amt}/mies., chyba że anulujesz wcześniej.",
    start_trial: "Rozpocznij {m} miesiące za darmo ✓",
    success_title: "Profil gotowy!",
    success_sub: "Okres próbny aktywny — {m} miesiące za darmo, potem {amt}/mies.{studio}.",
    success_studio: " (studio, {n} artystów)",
    success_line2: "Za chwilę pojawisz się w wynikach wyszukiwania.",
    go_home: "Wróć na stronę główną", see_profile: "Zobacz swój profil",
  },
  en: {
    nav_search: "Search", nav_explore: "Explore", login: "Log in", join: "Join as artist",
    logout: "Log out", login_title: "Log in", login_btn: "Log in",
    login_error: "Wrong email or password.", submitting: "Creating account...",
    err_taken: "This nickname or email is already taken.",
    hero_a: "Find an", hero_b: "artist",
    hero_sub: "Enter a nickname, city or style — or use the filters below.",
    search_ph: "e.g. krakow, fine line, @zuza...",
    f_city: "City", f_cat: "Category", f_style: "Style", all: "All",
    st_artists: "Artists", st_projects: "Projects",
    no_results: "No results", no_results_sub: "Change the filters or search term.",
    works: "works",
    explore_title: "Explore", explore_sub: "Browse artists by city or field.",
    cities: "Cities", cities_count: "{n} cities", categories: "Categories",
    artists_count: "{n} artists",
    no_artists: "No artists", try_filters: "Try changing the filters.",
    back: "Back", projects_n: "Projects ({n})",
    step_account: "Account", step_profile: "Profile", step_photos: "Photos", step_payment: "Payment",
    create_account: "Create account", create_account_sub: "Basic details for login and contact.",
    l_nick: "Artist nickname *", ph_nick: "e.g. marta.ink", hint_nick: "Your unique identifier on UsArt",
    l_name: "Full name", ph_optional: "Optional", l_email: "Email *", ph_email: "you@email.com",
    l_password: "Password *", ph_password: "Enter password", l_password2: "Repeat password *",
    ph_password2: "Enter password again",
    pw_intro: "Password must contain:",
    pw_len: "at least 8 characters", pw_lower: "one lowercase letter",
    pw_upper: "one uppercase letter", pw_special: "one special character",
    pw_match_ok: "Passwords match", pw_match_bad: "Passwords don't match",
    l_ig: "Instagram", ph_ig: "@handle (without @)",
    fill_required: "Fill in the required fields marked *",
    profile_title: "Your artist profile", profile_sub: "This information is shown to people searching for artists.",
    l_city: "City *", city_other_ph: "Can't find your city? Type it here...",
    l_cat: "Category *", l_style: "Style *", chosen: "Selected:",
    l_bio: "Bio / Description", ph_bio: "A few words about you and your work...",
    photos_title: "Add your work", photos_sub: "Upload project photos — minimum 2, maximum 12.",
    upload_click: "Click to add photos", upload_hint: "PNG, JPG, WEBP · max 10 MB each",
    photos_added: "{n} photos added",
    back_btn: "Back", next_btn: "Next →",
    choose_plan: "Choose a plan", plan_sub: "First {m} months free. A studio? Each extra person 5 zł cheaper.",
    plan_solo: "Solo artist", per_mo: "/mo", plan_solo_desc: "One person, own profile",
    plan_studio: "Studio", plan_from: "from", plan_badge: "Cheaper per person",
    plan_studio_desc: "Multiple artists under one account",
    members_label: "Number of artists in the studio",
    bd_first: "1st artist", bd_each: "Each extra (−5 zł / person) × {n}",
    savings: "You save {amt} per month vs {n} solo accounts",
    plan_card_studio: "Studio · {n} artists", plan_card_solo: "Solo artist",
    free_for: "for {m} mo", then_amt: "Then {amt} / month",
    feat_trial: "First {m} months completely free",
    feat_studio: "{n} artist profiles under the studio brand — each 5 zł cheaper",
    feat_solo: "Your own profile visible in search and Explore",
    feat_gallery: "Unlimited work gallery", feat_contact: "Direct contact: Instagram and email",
    feat_cancel: "Cancel anytime",
    card_name: "Name on card *", ph_card_name: "John Smith", card_number: "Card number *",
    card_exp: "Expiry *", ph_exp: "MM / YY", card_cvc: "CVC *",
    pay_today: "Due today",
    pay_note: "No charge today. After {m} months we'll charge {amt}/mo unless you cancel earlier.",
    start_trial: "Start {m} months free ✓",
    success_title: "Profile ready!",
    success_sub: "Trial active — {m} months free, then {amt}/mo{studio}.",
    success_studio: " (studio, {n} artists)",
    success_line2: "You'll appear in search results shortly.",
    go_home: "Back to home", see_profile: "View your profile",
  },
};

const CATEGORY_EN = {
  "Tatuaż": "Tattoo", "Malarstwo": "Painting", "Ilustracja": "Illustration",
  "Fotografia": "Photography", "Grafika": "Graphic Design",
};
const STYLE_EN = {
  "Akwarela": "Watercolor", "Olej": "Oil", "Akryl": "Acrylic", "Gwasz": "Gouache",
  "Abstrakcja": "Abstract", "Realizm": "Realism", "Komiks": "Comic", "Botanika": "Botanical",
  "Portret": "Portrait", "Street": "Street", "Analog": "Analog", "Krajobraz": "Landscape",
  "Architektura": "Architecture", "Plakat": "Poster", "Typografia": "Typography",
};
const BIO_EN = {
  "Specjalizuję się w tatuażach blackwork i geometrycznych. 7+ lat doświadczenia w Krakowie.":
    "I specialize in blackwork and geometric tattoos. 7+ years of experience in Kraków.",
  "Fine line i watercolor tattoo. Piszcie przez Instagram aby umówić sesję.":
    "Fine line and watercolor tattoo. DM me on Instagram to book a session.",
  "Trash polka, neo-traditional i realistyczne portrety. Studio na Kazimierzu.":
    "Trash polka, neo-traditional and realistic portraits. Studio in Kazimierz.",
  "Malarz i ilustrator. Tworzę głównie akwarele i oleje inspirowane naturą i architekturą.":
    "Painter and illustrator. I mostly create watercolors and oils inspired by nature and architecture.",
  "Digital artist i grafik. Projekty dla marek, plakaty, komiks autorski.":
    "Digital artist and graphic designer. Brand work, posters, original comics.",
  "Fotografia portretowa i uliczna. Ciemnia analogowa, filmy 35mm.":
    "Portrait and street photography. Analog darkroom, 35mm film.",
  "Japanese i old school — kolory, linie, klasyka. Piszcie śmiało.":
    "Japanese and old school — color, lines, the classics. Feel free to reach out.",
  "Dotwork i geometria. Każdy projekt tworzony indywidualnie.":
    "Dotwork and geometry. Every design made individually.",
};
const TITLE_EN = {
  "Geometria na ramieniu": "Geometry on the arm", "Mandala plecy": "Back mandala",
  "Blackwork łydka": "Blackwork calf", "Fine line kwiat": "Fine line flower",
  "Neo-trad sowa": "Neo-trad owl", "Portret realistyczny": "Realistic portrait",
  "Tatry o świcie": "The Tatras at dawn", "Stare Miasto Kraków": "Kraków Old Town",
  "Portret w akwareli": "Watercolor portrait", "Plakat koncertowy": "Concert poster",
  "Okładka albumu": "Album cover", "Komiks Strona 1": "Comic Page 1",
  "Praga nocą": "Praga at night",
};

const LangContext = createContext({ lang: "pl", setLang: () => {}, t: (k) => k });
const useLang = () => useContext(LangContext);
const tCat = (c, lang) => (lang === "en" ? CATEGORY_EN[c] || c : c);
const tStyle = (s, lang) => (lang === "en" ? STYLE_EN[s] || s : s);
const tBio = (a, lang) => (lang === "en" ? BIO_EN[a.bio] || a.bio : a.bio);
const tTitle = (p, lang) => (lang === "en" ? TITLE_EN[p.title] || p.title : p.title);

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
  .nav-right { display: flex; gap: 8px; flex: 1; justify-content: flex-end; align-items: center; }
  .lang-switch { display: flex; gap: 2px; background: #141414; border: 1px solid #252525;
    border-radius: 8px; padding: 2px; }
  .lang-switch button { border: none; background: transparent; color: #666; cursor: pointer;
    font-size: 12px; font-weight: 600; padding: 4px 9px; border-radius: 6px; transition: all .15s; }
  .lang-switch button:hover { color: #ccc; }
  .lang-switch button.active { background: #1e1e1e; color: #fff; }
  .btn { padding: 7px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px;
    font-weight: 500; transition: all .15s; }
  .btn-ghost { background: transparent; color: #777; border: 1px solid #272727; }
  .btn-ghost:hover { background: #1a1a1a; color: #ddd; }
  .btn-primary { background: linear-gradient(135deg, #e879f9, #818cf8); color: #fff; }
  .btn-primary:hover { opacity: .9; transform: translateY(-1px); }
  .btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  .btn:disabled:hover { opacity: .4; transform: none; }
  .form-warning { font-size: 12px; color: #f0a868; margin-top: 18px; text-align: right; }
  .form-error { font-size: 13px; color: #f87171; margin-top: 14px; padding: 10px 12px;
    background: rgba(248,113,113,.08); border: 1px solid rgba(248,113,113,.25); border-radius: 10px; }

  /* ── LOGIN MODAL ── */
  .modal-overlay { position: fixed; inset: 0; z-index: 400; background: rgba(0,0,0,.7);
    backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 24px; }
  .modal { width: 100%; max-width: 380px; background: #111; border: 1px solid #1f1f1f;
    border-radius: 18px; padding: 26px; position: relative; }
  .modal h2 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
  .modal p { color: #666; font-size: 13px; margin-bottom: 20px; }
  .modal-close { position: absolute; top: 14px; right: 14px; background: #1a1a1a; border: none;
    color: #888; cursor: pointer; border-radius: 8px; padding: 6px; display: flex; }
  .modal .btn-primary { width: 100%; margin-top: 6px; padding: 11px; }
  .nav-user { display: flex; align-items: center; gap: 8px; }
  .nav-email { font-size: 12px; color: #888; max-width: 150px; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap; }

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
  .pw-intro { font-size: 12px; color: #777; margin-bottom: 8px; }
  .pw-rules { list-style: none; margin: 0 0 12px; display: flex; flex-direction: column; gap: 6px; }
  .pw-rules li { display: flex; align-items: center; gap: 9px; font-size: 12px; color: #666;
    transition: color .15s; }
  .pw-dot { width: 9px; height: 9px; border-radius: 50%; background: #2c2c2c; flex-shrink: 0;
    transition: background .15s, box-shadow .15s; }
  .pw-rules li.ok { color: #4ade80; }
  .pw-rules li.ok .pw-dot { background: #4ade80; box-shadow: 0 0 7px rgba(74,222,128,.6); }
  .pw-match { font-size: 12px; margin-top: 6px; }
  .pw-match.ok { color: #4ade80; }
  .pw-match.bad { color: #f87171; }
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
  /* Wybór planu Solo / Studio */
  .plan-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .plan-opt { position: relative; text-align: left; padding: 16px; border-radius: 14px; cursor: pointer;
    background: #0d0d0d; border: 1px solid #222; color: #ccc; transition: all .15s; }
  .plan-opt:hover { border-color: #383838; }
  .plan-opt.selected { border-color: #818cf8; background: rgba(129,140,248,.07);
    box-shadow: 0 0 0 1px #818cf8 inset; }
  .plan-opt-name { font-size: 14px; font-weight: 600; color: #eee; }
  .plan-opt-price { font-size: 20px; font-weight: 700; margin-top: 4px; color: #fff; }
  .plan-opt-price small { font-size: 12px; color: #666; font-weight: 500; }
  .plan-opt-desc { font-size: 11px; color: #666; margin-top: 5px; }
  .plan-badge { position: absolute; top: 10px; right: 10px; font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .4px; padding: 3px 7px; border-radius: 20px;
    background: linear-gradient(135deg, #e879f9, #818cf8); color: #fff; }
  /* Licznik osób + rozbicie ceny */
  .members-box { background: #0d0d0d; border: 1px solid #222; border-radius: 14px;
    padding: 16px; margin-bottom: 16px; }
  .members-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .members-label { font-size: 13px; font-weight: 600; color: #ccc; }
  .stepper { display: flex; align-items: center; gap: 4px; background: #161616;
    border: 1px solid #262626; border-radius: 10px; padding: 3px; }
  .step-btn { width: 30px; height: 30px; border-radius: 8px; border: none; background: #1f1f1f;
    color: #ddd; font-size: 18px; cursor: pointer; transition: all .15s; }
  .step-btn:hover:not(:disabled) { background: #818cf8; color: #fff; }
  .step-btn:disabled { opacity: .3; cursor: not-allowed; }
  .step-count { min-width: 34px; text-align: center; font-size: 15px; font-weight: 700; color: #fff; }
  .price-breakdown { margin-top: 14px; padding-top: 14px; border-top: 1px solid #1c1c1c;
    display: flex; flex-direction: column; gap: 7px; }
  .bd-line { display: flex; justify-content: space-between; font-size: 13px; color: #aaa; }
  .bd-line em { color: #e879f9; font-style: normal; font-size: 11px; }
  .savings-badge { display: flex; align-items: center; gap: 7px; margin-top: 14px;
    padding: 9px 12px; border-radius: 10px; font-size: 12px; font-weight: 500;
    background: rgba(74,222,128,.08); border: 1px solid rgba(74,222,128,.25); color: #4ade80; }
  .savings-badge svg { flex-shrink: 0; }
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
const STEPS = ["step_account", "step_profile", "step_photos", "step_payment"];
const TRIAL_MONTHS = 2;
const BASE_PRICE = 49.99;     // pierwszy artysta
const EXTRA_PRICE = 45.00;    // każdy kolejny artysta ze studia (5 zł taniej)
const MAX_MEMBERS = 10;
const zl = (n) => n.toFixed(2).replace(".", ",") + " zł";

function RegisterFlow({ onBack, onDone }) {
  const { lang, t } = useLang();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    nick: "", name: "", email: "", password: "", password2: "", instagram: "", city: "",
    category: "", bio: "", styles: [], photos: [],
    cardName: "", cardNumber: "", cardExp: "", cardCvc: "",
    plan: "solo", members: 3,
  });
  const [done, setDone] = useState(false);

  const pwRules = {
    len: form.password.length >= 8,
    lower: /[a-z]/.test(form.password),
    upper: /[A-Z]/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };
  const pwValid = pwRules.len && pwRules.lower && pwRules.upper && pwRules.special;
  const pwMatch = form.password.length > 0 && form.password === form.password2;

  const stepValid = (s) => {
    if (s === 0) return form.nick.trim() && /\S+@\S+\.\S+/.test(form.email) && pwValid && pwMatch;
    if (s === 1) return form.city.trim() && form.category && form.styles.length > 0;
    if (s === 2) return form.photos.length >= 2;
    if (s === 3) return form.cardName.trim() && form.cardNumber.trim() && form.cardExp.trim() && form.cardCvc.trim();
    return true;
  };

  const memberCount = form.plan === "studio" ? form.members : 1;
  const monthlyTotal = BASE_PRICE + (memberCount - 1) * EXTRA_PRICE;
  const monthlySavings = (memberCount - 1) * (BASE_PRICE - EXTRA_PRICE);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setMembers = (n) => update("members", Math.max(2, Math.min(MAX_MEMBERS, n)));
  const toggleStyle = (s) => update("styles",
    form.styles.includes(s) ? form.styles.filter((x) => x !== s) : [...form.styles, s]);

  const availableStyles = form.category === "Tatuaż"
    ? TATTOO_STYLES
    : OTHER_STYLES[form.category] || [];

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    update("photos", [...form.photos, ...files].slice(0, 12));
    e.target.value = "";
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError("");
    try {
      // Krok 1 - Konto (e-mail + hasło)
      const { data: auth, error: authErr } = await supabase.auth.signUp({
        email: form.email, password: form.password,
      });
      if (authErr) throw authErr;
      const uid = auth.user?.id;
      if (!auth.session) throw new Error("no_session");

      // Krok 2 - Zdjęcia do magazynu
      const urls = [];
      for (const file of form.photos) {
        const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const { error: upErr } = await supabase.storage.from("portfolios").upload(path, file);
        if (upErr) throw upErr;
        urls.push(supabase.storage.from("portfolios").getPublicUrl(path).data.publicUrl);
      }

      // Krok 3 - Profil artysty
      const { error: insErr } = await supabase.from("artists").insert({
        id: uid, nick: form.nick, name: form.name || null, city: form.city,
        category: form.category, styles: form.styles, bio: form.bio || null,
        instagram: form.instagram || null, email: form.email,
        avatar: urls[0] || null, plan: form.plan, members: memberCount,
      });
      if (insErr) throw insErr;

      // Krok 4 - Prace
      if (urls.length) {
        await supabase.from("projects").insert(
          urls.map((img, i) => ({ artist_id: uid, title: `${form.nick} #${i + 1}`, img }))
        );
      }
      setDone(true);
    } catch (e) {
      if (e.message === "no_session")
        setError("Wyłącz potwierdzanie e-mail w Supabase (Authentication → Sign In / Providers → Email).");
      else if (e.code === "23505" || /duplicate|unique/i.test(e.message || ""))
        setError(t("err_taken"));
      else setError(e.message || "Coś poszło nie tak.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div className="register">
      <div className="reg-card">
        <div className="success-state">
          <div className="success-icon"><IconCheck /></div>
          <h2>{t("success_title")}</h2>
          <p>{t("success_sub", {
            m: TRIAL_MONTHS,
            amt: zl(monthlyTotal),
            studio: form.plan === "studio" ? t("success_studio", { n: memberCount }) : "",
          })}<br />
          {t("success_line2")}</p>
          <div style={{ marginTop: 28, display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="btn btn-ghost" onClick={onBack}>{t("go_home")}</button>
            <button className="btn btn-primary" onClick={onDone}>{t("see_profile")}</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="register">
      <button className="register-back" onClick={onBack}><IconBack /> {t("back")}</button>

      {/* Steps */}
      <div style={{ marginBottom: 28 }}>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step" key={s}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className={`step-dot ${i < step ? "done" : i === step ? "active" : ""}`}>
                  {i < step ? <IconCheck /> : i + 1}
                </div>
                <div className="step-label">{t(s)}</div>
              </div>
              {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="reg-card">
        {step === 0 && (
          <>
            <h2>{t("create_account")}</h2>
            <p>{t("create_account_sub")}</p>
            <div className="form-row">
              <label className="form-label">{t("l_nick")}</label>
              <input className="form-input" placeholder={t("ph_nick")} value={form.nick}
                onChange={e => update("nick", e.target.value)} />
              <div className="form-hint">{t("hint_nick")}</div>
            </div>
            <div className="form-row">
              <label className="form-label">{t("l_name")}</label>
              <input className="form-input" placeholder={t("ph_optional")} value={form.name}
                onChange={e => update("name", e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label">{t("l_email")}</label>
              <input className="form-input" type="email" placeholder={t("ph_email")} value={form.email}
                onChange={e => update("email", e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label">{t("l_password")}</label>
              <div className="pw-intro">{t("pw_intro")}</div>
              <ul className="pw-rules">
                <li className={pwRules.len ? "ok" : ""}><span className="pw-dot" /> {t("pw_len")}</li>
                <li className={pwRules.lower ? "ok" : ""}><span className="pw-dot" /> {t("pw_lower")}</li>
                <li className={pwRules.upper ? "ok" : ""}><span className="pw-dot" /> {t("pw_upper")}</li>
                <li className={pwRules.special ? "ok" : ""}><span className="pw-dot" /> {t("pw_special")}</li>
              </ul>
              <input className="form-input" type="password" placeholder={t("ph_password")} value={form.password}
                onChange={e => update("password", e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label">{t("l_password2")}</label>
              <input className="form-input" type="password" placeholder={t("ph_password2")} value={form.password2}
                onChange={e => update("password2", e.target.value)} />
              {form.password2.length > 0 && (
                <div className={`pw-match ${pwMatch ? "ok" : "bad"}`}>
                  {pwMatch ? t("pw_match_ok") : t("pw_match_bad")}
                </div>
              )}
            </div>
            <div className="form-row">
              <label className="form-label">{t("l_ig")}</label>
              <input className="form-input" placeholder={t("ph_ig")} value={form.instagram}
                onChange={e => update("instagram", e.target.value)} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2>{t("profile_title")}</h2>
            <p>{t("profile_sub")}</p>

            {/* MIASTO — chipsy */}
            <div className="form-row">
              <label className="form-label">{t("l_city")}</label>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
                {REGISTER_CITIES.map(c => (
                  <button key={c} onClick={() => update("city", c)}
                    className={`chip ${form.city === c ? "active" : ""}`}
                    style={{ fontSize: 12 }}>
                    {c}
                  </button>
                ))}
              </div>
              <input className="form-input" placeholder={t("city_other_ph")} value={form.city}
                onChange={e => update("city", e.target.value)} />
            </div>

            {/* KATEGORIA */}
            <div className="form-row">
              <label className="form-label">{t("l_cat")}</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ALL_CATEGORIES.map(c => (
                  <button key={c} onClick={() => { update("category", c); update("styles", []); }}
                    className={`chip ${form.category === c ? "active" : ""}`}
                    style={{ fontSize: 13 }}>
                    {tCat(c, lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* STYLE — pojawiają się po wyborze kategorii */}
            {availableStyles.length > 0 && (
              <div className="form-row">
                <label className="form-label">{t("l_style")}</label>
                <div className="style-picker">
                  {availableStyles.map(s => (
                    <button key={s} className={`style-pick-btn ${form.styles.includes(s) ? "selected" : ""}`}
                      onClick={() => toggleStyle(s)}>
                      {form.styles.includes(s) && <IconCheck />}
                      {tStyle(s, lang)}
                    </button>
                  ))}
                </div>
                {form.styles.length > 0 && (
                  <div style={{ marginTop: 8, color: "#555", fontSize: 11 }}>
                    {t("chosen")} {form.styles.map(s => tStyle(s, lang)).join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* BIO */}
            <div className="form-row">
              <label className="form-label">{t("l_bio")}</label>
              <textarea className="form-input" rows={3} placeholder={t("ph_bio")}
                value={form.bio} onChange={e => update("bio", e.target.value)}
                style={{ resize: "vertical" }} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>{t("photos_title")}</h2>
            <p>{t("photos_sub")}</p>
            {form.photos.length === 0 ? (
              <label className="upload-zone">
                <input type="file" accept="image/*" multiple hidden onChange={onPickFiles} />
                <IconUpload />
                <p>{t("upload_click")}</p>
                <span>{t("upload_hint")}</span>
              </label>
            ) : (
              <>
                <div className="upload-previews">
                  {form.photos.map((src, i) => (
                    <div className="upload-preview" key={i}>
                      <img src={URL.createObjectURL(src)} alt={`preview ${i}`} />
                    </div>
                  ))}
                  {form.photos.length < 12 && (
                    <label className="upload-zone" style={{ aspectRatio: "1", padding: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 8 }}>
                      <input type="file" accept="image/*" multiple hidden onChange={onPickFiles} />
                      <span style={{ fontSize: 24, color: "#333" }}>+</span>
                    </label>
                  )}
                </div>
                <div style={{ marginTop: 10, color: "#444", fontSize: 11 }}>
                  {t("photos_added", { n: form.photos.length })}
                </div>
              </>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2>{t("choose_plan")}</h2>
            <p>{t("plan_sub", { m: TRIAL_MONTHS })}</p>

            {/* Wybór planu: Solo / Studio */}
            <div className="plan-toggle">
              <button type="button" onClick={() => update("plan", "solo")}
                className={`plan-opt ${form.plan === "solo" ? "selected" : ""}`}>
                <div className="plan-opt-name">{t("plan_solo")}</div>
                <div className="plan-opt-price">{zl(BASE_PRICE)}<small>{t("per_mo")}</small></div>
                <div className="plan-opt-desc">{t("plan_solo_desc")}</div>
              </button>
              <button type="button" onClick={() => update("plan", "studio")}
                className={`plan-opt ${form.plan === "studio" ? "selected" : ""}`}>
                <span className="plan-badge">{t("plan_badge")}</span>
                <div className="plan-opt-name">{t("plan_studio")}</div>
                <div className="plan-opt-price">{t("plan_from")} {zl(BASE_PRICE + EXTRA_PRICE)}<small>{t("per_mo")}</small></div>
                <div className="plan-opt-desc">{t("plan_studio_desc")}</div>
              </button>
            </div>

            {/* Licznik osób + rozbicie ceny (tylko studio) */}
            {form.plan === "studio" && (
              <div className="members-box">
                <div className="members-row">
                  <span className="members-label">{t("members_label")}</span>
                  <div className="stepper">
                    <button type="button" className="step-btn" onClick={() => setMembers(form.members - 1)}
                      disabled={form.members <= 2}>−</button>
                    <span className="step-count">{form.members}</span>
                    <button type="button" className="step-btn" onClick={() => setMembers(form.members + 1)}
                      disabled={form.members >= MAX_MEMBERS}>+</button>
                  </div>
                </div>
                <div className="price-breakdown">
                  <div className="bd-line"><span>{t("bd_first")}</span><span>{zl(BASE_PRICE)}</span></div>
                  <div className="bd-line"><span>{t("bd_each", { n: memberCount - 1 })}</span>
                    <span>{zl((memberCount - 1) * EXTRA_PRICE)}</span></div>
                </div>
                <div className="savings-badge">
                  <IconCheck /> {t("savings", { amt: zl(monthlySavings), n: memberCount })}
                </div>
              </div>
            )}

            <div className="plan-card">
              <div className="plan-top">
                <span className="plan-name">{form.plan === "studio" ? t("plan_card_studio", { n: memberCount }) : t("plan_card_solo")}</span>
                <span className="plan-price">0 zł<small> {t("free_for", { m: TRIAL_MONTHS })}</small></span>
              </div>
              <div className="plan-after">{t("then_amt", { amt: zl(monthlyTotal) })}</div>
              <ul className="plan-feats">
                <li><IconCheck /> {t("feat_trial", { m: TRIAL_MONTHS })}</li>
                {form.plan === "studio"
                  ? <li><IconCheck /> {t("feat_studio", { n: memberCount })}</li>
                  : <li><IconCheck /> {t("feat_solo")}</li>}
                <li><IconCheck /> {t("feat_gallery")}</li>
                <li><IconCheck /> {t("feat_contact")}</li>
                <li><IconCheck /> {t("feat_cancel")}</li>
              </ul>
            </div>

            <div className="form-row">
              <label className="form-label">{t("card_name")}</label>
              <input className="form-input" placeholder={t("ph_card_name")} value={form.cardName}
                onChange={e => update("cardName", e.target.value)} />
            </div>
            <div className="form-row">
              <label className="form-label">{t("card_number")}</label>
              <input className="form-input" placeholder="0000 0000 0000 0000" inputMode="numeric" value={form.cardNumber}
                onChange={e => update("cardNumber", e.target.value)} />
            </div>
            <div className="pay-grid">
              <div className="form-row">
                <label className="form-label">{t("card_exp")}</label>
                <input className="form-input" placeholder={t("ph_exp")} value={form.cardExp}
                  onChange={e => update("cardExp", e.target.value)} />
              </div>
              <div className="form-row">
                <label className="form-label">{t("card_cvc")}</label>
                <input className="form-input" placeholder="123" inputMode="numeric" value={form.cardCvc}
                  onChange={e => update("cardCvc", e.target.value)} />
              </div>
            </div>

            <div className="pay-total">
              <span>{t("pay_today")}</span>
              <b>0,00 zł</b>
            </div>
            <div className="pay-note">
              <IconLock /> {t("pay_note", { m: TRIAL_MONTHS, amt: zl(monthlyTotal) })}
            </div>
          </>
        )}

        {!stepValid(step) && (
          <div className="form-warning">{t("fill_required")}</div>
        )}
        {error && <div className="form-error">{error}</div>}
        <div className="form-actions">
          {step > 0 && (
            <button className="btn btn-ghost" disabled={submitting} onClick={() => setStep(s => s - 1)}>{t("back_btn")}</button>
          )}
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" disabled={!stepValid(step)}
              onClick={() => stepValid(step) && setStep(s => s + 1)}>{t("next_btn")}</button>
          ) : (
            <button className="btn btn-primary" disabled={!stepValid(step) || submitting}
              onClick={handleSubmit}>
              {submitting ? t("submitting") : t("start_trial", { m: TRIAL_MONTHS })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EXPLORE PAGE ──────────────────────────────────────────────────────────────
function ExplorePage({ onArtist, artists }) {
  const { lang, t } = useLang();
  const [exploreCity, setExploreCity] = useState(null);
  const [exploreCat, setExploreCat] = useState(null);
  const [exploreStyle, setExploreStyle] = useState(null);

  const cities = [...new Set(artists.map(a => a.city))].sort();

  const cityStats = cities.map(c => ({
    city: c,
    count: artists.filter(a => a.city === c).length,
  }));

  const catStats = ALL_CATEGORIES.map(c => ({
    cat: c,
    count: artists.filter(a => a.categories.includes(c)).length,
  })).filter(s => s.count > 0);

  const filteredArtists = artists.filter(a => {
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
          <div className="explore-title">{t("explore_title")}</div>
          <div className="explore-sub">{t("explore_sub")}</div>

          <div className="explore-section">
            <div className="section-header">
              <span className="section-title">{t("cities")}</span>
              <span className="section-count">{t("cities_count", { n: cities.length })}</span>
            </div>
            <div className="city-grid">
              {cityStats.map(({ city, count }) => (
                <div className="city-card" key={city} onClick={() => setExploreCity(city)}>
                  <div className="city-card-name">{city}</div>
                  <div className="city-card-count">{t("artists_count", { n: count })}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="explore-section">
            <div className="section-header">
              <span className="section-title">{t("categories")}</span>
            </div>
            <div className="cat-grid">
              {catStats.map(({ cat, count }) => (
                <div className="cat-card" key={cat} onClick={() => setExploreCat(cat)}>
                  <div className="cat-card-name">{tCat(cat, lang)}</div>
                  <div className="cat-card-count">{t("artists_count", { n: count })}</div>
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
                {t("explore_title")}
              </span>
              {exploreCity && (<><span className="bc-sep">/</span><span className="bc-current" style={{ cursor: "pointer" }}
                onClick={() => { setExploreCat(null); setExploreStyle(null); }}>{exploreCity}</span></>)}
              {exploreCat && (<><span className="bc-sep">/</span><span className="bc-current">{tCat(exploreCat, lang)}</span></>)}
              {exploreStyle && (<><span className="bc-sep">/</span><span className="bc-current">{tStyle(exploreStyle, lang)}</span></>)}
            </div>
            <span className="results-count">{t("artists_count", { n: filteredArtists.length })}</span>
          </div>

          {/* Category chips if only city selected */}
          {exploreCity && !exploreCat && (
            <div className="filter-row" style={{ marginBottom: 20 }}>
              <span className="filter-label">{t("f_cat")}</span>
              {ALL_CATEGORIES.map(c => (
                <button key={c} className={`chip ${exploreCat === c ? "active" : ""}`}
                  onClick={() => setExploreCat(c)}>{tCat(c, lang)}</button>
              ))}
            </div>
          )}

          {/* Style chips */}
          {availableStyles.length > 0 && (
            <div className="filter-row" style={{ marginBottom: 20 }}>
              <span className="filter-label">{t("f_style")}</span>
              {availableStyles.map(s => (
                <button key={s} className={`chip chip-style ${exploreStyle === s ? "active" : ""}`}
                  onClick={() => setExploreStyle(exploreStyle === s ? null : s)}>{tStyle(s, lang)}</button>
              ))}
            </div>
          )}

          {/* City chips if only category selected */}
          {exploreCat && !exploreCity && (
            <div className="filter-row" style={{ marginBottom: 20 }}>
              <span className="filter-label">{t("f_city")}</span>
              {cities.map(c => (
                <button key={c} className={`chip ${exploreCity === c ? "active" : ""}`}
                  onClick={() => setExploreCity(exploreCity === c ? null : c)}>{c}</button>
              ))}
            </div>
          )}

          <div className="grid" style={{ padding: 0 }}>
            {filteredArtists.length === 0 ? (
              <div className="empty">
                <h3>{t("no_artists")}</h3>
                <p>{t("try_filters")}</p>
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
  const { lang, t } = useLang();
  return (
    <div className="artist-card" onClick={onClick}>
      <div className="card-thumb">
        <img src={a.projects[0]?.img} alt="" />
        <span className="card-count">{a.projects.length} {t("works")}</span>
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
          {a.styles.slice(0, 3).map(s => <span className="style-tag" key={s}>{tStyle(s, lang)}</span>)}
          {a.styles.length > 3 && <span className="style-tag">+{a.styles.length - 3}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── ARTIST PROFILE ────────────────────────────────────────────────────────────
function ArtistProfile({ artist: a, onBack }) {
  const { lang, t } = useLang();
  const [lightbox, setLightbox] = useState(null);
  return (
    <>
      <div className="profile">
        <button className="profile-back" onClick={onBack}><IconBack /> {t("back")}</button>
        <div className="profile-card">
          <img className="profile-avatar" src={a.avatar} alt={a.nick} />
          <div style={{ flex: 1 }}>
            <div className="profile-name">@{a.nick}</div>
            {a.name && <div className="profile-nick">{a.name}</div>}
            <div className="profile-city"><IconPin /> {a.city}</div>
            <p className="profile-bio">{tBio(a, lang)}</p>
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
              {a.styles.map(s => <span className="style-badge" key={s}>{tStyle(s, lang)}</span>)}
            </div>
          </div>
        </div>
        <div className="proj-title">{t("projects_n", { n: a.projects.length })}</div>
        <div className="proj-grid">
          {a.projects.map(p => (
            <div className="proj-item" key={p.id} onClick={() => setLightbox(p)}>
              <img src={p.img} alt={tTitle(p, lang)} />
              <div className="proj-overlay"><span className="proj-name">{tTitle(p, lang)}</span></div>
            </div>
          ))}
        </div>
      </div>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}><IconX /></button>
          <img src={lightbox.img} alt={tTitle(lightbox, lang)} onClick={e => e.stopPropagation()} />
          <div className="lightbox-caption">{tTitle(lightbox, lang)}</div>
        </div>
      )}
    </>
  );
}

// ─── SEARCH PAGE ───────────────────────────────────────────────────────────────
function SearchPage({ onArtist, artists }) {
  const { lang, t } = useLang();
  const [q, setQ] = useState("");
  const [cityF, setCityF] = useState("Wszystkie");
  const [catF, setCatF] = useState("Wszystkie");
  const [styleF, setStyleF] = useState("Wszystkie");

  const cities = [...new Set(artists.map(a => a.city))].sort();

  const availableStyles = catF === "Tatuaż"
    ? ["Wszystkie", ...TATTOO_STYLES]
    : catF !== "Wszystkie" ? ["Wszystkie", ...(OTHER_STYLES[catF] || [])] : [];

  const filtered = artists.filter(a => {
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
        <h1>{t("hero_a")} <span>{t("hero_b")}</span></h1>
        <p>{t("hero_sub")}</p>
        <div className="search-wrap">
          <span className="search-icon"><IconSearch /></span>
          <input className="search-input" placeholder={t("search_ph")}
            value={q} onChange={e => setQ(e.target.value)} />
          {q && <button className="search-clear" onClick={() => setQ("")}><IconX /></button>}
        </div>
      </div>

      <div className="filters-panel">
        <div className="filter-row">
          <span className="filter-label">{t("f_city")}</span>
          {["Wszystkie", ...cities].map(c => (
            <button key={c} className={`chip ${cityF === c ? "active" : ""}`}
              onClick={() => setCityF(c)}>{c === "Wszystkie" ? t("all") : c}</button>
          ))}
        </div>
        <div className="filter-row">
          <span className="filter-label">{t("f_cat")}</span>
          {["Wszystkie", ...ALL_CATEGORIES].map(c => (
            <button key={c} className={`chip ${catF === c ? "active" : ""}`}
              onClick={() => { setCatF(c); setStyleF("Wszystkie"); }}>{c === "Wszystkie" ? t("all") : tCat(c, lang)}</button>
          ))}
        </div>
        {availableStyles.length > 1 && (
          <div className="filter-row">
            <span className="filter-label">{t("f_style")}</span>
            {availableStyles.map(s => (
              <button key={s} className={`chip chip-style ${styleF === s ? "active" : ""}`}
                onClick={() => setStyleF(s)}>{s === "Wszystkie" ? t("all") : tStyle(s, lang)}</button>
            ))}
          </div>
        )}
      </div>

      <div className="stats">
        {[
          { num: filtered.length, label: t("st_artists") },
          { num: filtered.flatMap(a => a.projects).length, label: t("st_projects") },
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
            <h3>{t("no_results")}</h3>
            <p>{t("no_results_sub")}</p>
          </div>
        ) : (
          filtered.map(a => <ArtistCard key={a.id} artist={a} onClick={() => onArtist(a)} />)
        )}
      </div>
    </>
  );
}

// ─── LOGIN MODAL ───────────────────────────────────────────────────────────────
function LoginModal({ onClose }) {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr(t("login_error"));
    else onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><IconX /></button>
        <h2>{t("login_title")}</h2>
        <p>UsArt</p>
        <div className="form-row">
          <label className="form-label">{t("l_email")}</label>
          <input className="form-input" type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder={t("ph_email")} />
        </div>
        <div className="form-row">
          <label className="form-label">{t("l_password")}</label>
          <input className="form-input" type="password" value={password}
            onChange={e => setPassword(e.target.value)} placeholder="••••••" />
        </div>
        {err && <div className="form-error">{err}</div>}
        <button className="btn btn-primary" disabled={busy || !email || !password} onClick={submit}>
          {busy ? "…" : t("login_btn")}
        </button>
      </div>
    </div>
  );
}

// ─── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("search");           // "search" | "explore" | "register"
  const [profileArtist, setProfileArtist] = useState(null);
  const [dbArtists, setDbArtists] = useState([]);
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem("usart_lang") || "pl"; } catch { return "pl"; }
  });
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("usart_lang", l); } catch {}
  };

  const t = (key, vars) => {
    let s = (I18N[lang] && I18N[lang][key]) ?? key;
    if (vars) for (const k in vars) s = s.split(`{${k}}`).join(vars[k]);
    return s;
  };

  const loadArtists = async () => {
    try {
      const { data, error } = await supabase.from("artists").select("*, projects(*)");
      if (!error && data) setDbArtists(data.map(fromDb));
    } catch { /* zostaw dane przykładowe */ }
  };

  useEffect(() => {
    loadArtists();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Prawdziwi artyści z bazy + przykładowi (żeby katalog nie był pusty na start)
  const artists = [...dbArtists, ...ARTISTS];

  const openArtist = (a) => setProfileArtist(a);
  const closeArtist = () => setProfileArtist(null);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <span className="nav-logo" onClick={() => { setProfileArtist(null); setTab("search"); }}>
            UsArt
          </span>
          <div className="nav-tabs">
            <button className={`nav-tab ${tab === "search" && !profileArtist ? "active" : ""}`}
              onClick={() => { setProfileArtist(null); setTab("search"); }}>
              <IconSearch /> {t("nav_search")}
            </button>
            <button className={`nav-tab ${tab === "explore" && !profileArtist ? "active" : ""}`}
              onClick={() => { setProfileArtist(null); setTab("explore"); }}>
              <IconCompass /> {t("nav_explore")}
            </button>
          </div>
          <div className="nav-right">
            <div className="lang-switch">
              <button className={lang === "pl" ? "active" : ""} onClick={() => setLang("pl")}>PL</button>
              <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
            </div>
            {session ? (
              <div className="nav-user">
                <span className="nav-email">{session.user.email}</span>
                <button className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>
                  {t("logout")}
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={() => setShowLogin(true)}>
                  {t("login")}
                </button>
                <button className="btn btn-primary" onClick={() => { setProfileArtist(null); setTab("register"); }}>
                  <IconUser style={{ display: "inline", marginRight: 4 }} /> {t("join")}
                </button>
              </>
            )}
          </div>
        </nav>

        {profileArtist ? (
          <ArtistProfile artist={profileArtist} onBack={closeArtist} />
        ) : tab === "search" ? (
          <SearchPage onArtist={openArtist} artists={artists} />
        ) : tab === "explore" ? (
          <ExplorePage onArtist={openArtist} artists={artists} />
        ) : tab === "register" ? (
          <RegisterFlow
            onBack={() => setTab("search")}
            onDone={() => { loadArtists(); setTab("search"); }}
          />
        ) : null}

        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    </LangContext.Provider>
  );
}
