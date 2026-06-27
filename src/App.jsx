import { useState, useEffect, useRef, createContext, useContext } from "react";
import { supabase } from "./supabase";

// ─── Mock data ────────────────────────────────────────────────────────────────
const TATTOO_STYLES = [
  "Blackwork", "Realism", "Neo-Traditional", "Watercolor",
  "Fine Line", "Geometric", "Japanese", "Trash Polka",
  "Tribal", "Minimalism", "Old School", "Dotwork",
];

const OTHER_STYLES = {
  "Malarstwo": ["Akwarela", "Olej", "Akryl", "Gwasz", "Abstrakcja", "Realizm"],
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
    categories: ["Malarstwo"], styles: ["Akwarela", "Olej", "Realizm"],
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
    categories: ["Grafika"], styles: ["Logo & Branding", "Plakat", "Typografia"],
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
const ALL_CATEGORIES = ["Fotografia", "Grafika", "Malarstwo", "Tatuaż"];

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
    nav_search: "Szukaj", nav_explore: "Odkrywaj", nav_works: "Prace", nav_match: "Dobierz", nav_map: "Mapa",
    map_title: "Mapa artystów", map_sub: "Kliknij miasto lub punkt na mapie, aby zobaczyć artystów.",
    loc_title: "Lokalizacja na mapie", loc_sub: "Opcjonalnie — wpisz adres studia i znajdź go na mapie. Możesz dopręcyzować pinezką.",
    loc_address: "Adres studia", loc_find: "Znajdź", loc_clear: "Usuń lokalizację",
    loc_hint: "Kliknij mapę lub przeciągnij pinezkę, aby ustawić dokładne miejsce.",
    loc_not_found: "Nie znaleziono adresu — spróbuj inaczej lub ustaw pinezkę ręcznie.",
    works_title: "Prace", works_sub: "Przeglądaj wszystkie prace artystów — kliknij, by zobaczyć profil.",
    match_title: "Dobierz artystę", match_sub: "Odpowiedz na kilka pytań, a pokażemy pasujących artystów.",
    match_q_cat: "Czego szukasz?", match_q_style: "Jaki styl Cię interesuje?",
    match_q_city: "W jakim mieście?", match_any: "Dowolne",
    match_results: "Pasujący artyści", match_restart: "Zacznij od nowa",
    login: "Zaloguj się", join: "Zarejestruj się",
    reg_choose: "Jak chcesz dołączyć?",
    reg_as_artist: "Jako artysta", reg_as_artist_d: "Załóż profil, dodaj prace i bądź widoczny w katalogu.",
    reg_as_user: "Jako użytkownik", reg_as_user_d: "Darmowe konto — oceniaj, komentuj i zapisuj ulubionych.",
    user_signup_title: "Rejestracja użytkownika", user_signup_sub: "Darmowe konto użytkownika.",
    logout: "Wyloguj", login_title: "Zaloguj się", login_btn: "Zaloguj",
    login_error: "Błędny e-mail lub hasło.", submitting: "Tworzę konto...",
    err_taken: "Ten nick lub e-mail jest już zajęty.",
    nav_account: "Moje konto", account_title: "Moje konto",
    account_favs: "Ulubieni artyści", account_no_favs: "Nie masz jeszcze ulubionych artystów.",
    acc_profile: "Dane konta", acc_email_title: "Zmiana e-maila", acc_new_email: "Nowy e-mail",
    acc_email_saved: "Zapisano. Jeśli wymagane, potwierdź zmianę linkiem z e-maila.",
    acc_pw_title: "Zmiana hasła", acc_current_email: "Obecny e-mail",
    acc_pw_reset_info: "Wyślemy link do zmiany hasła na Twój e-mail.", acc_pw_send: "Wyślij link",
    acc_name_taken: "Ta nazwa jest już zajęta — wybierz inną.",
    nav_fav: "Ulubieni", fav_sub: "Twoi zapisani artyści.",
    fav_login: "Zaloguj się, aby zobaczyć swoich ulubionych artystów.",
    acc_photo: "Zdjęcie profilowe", acc_change_photo: "Zmień zdjęcie", acc_bio: "O mnie",
    edit_title: "Edytuj profil",
    edit_sub: "Zmień swoje dane i prace.", save: "Zapisz zmiany", saved: "Zapisano!",
    sub_title: "Subskrypcja", sub_plan: "Plan", sub_status: "Status",
    sub_status_trialing: "Okres próbny", sub_status_active: "Aktywna", sub_status_canceled: "Anulowana",
    sub_status_none: "Nie masz aktywnej subskrypcji.",
    sub_started: "Rozpoczęta", sub_trial_until: "Darmowy okres do", sub_renews: "Odnawia się", sub_ends: "Kończy się",
    sub_cancel: "Anuluj subskrypcję", sub_cancel_done: "Subskrypcja zostanie anulowana na koniec okresu.",
    sub_start_btn: "Rozpocznij subskrypcję",
    edit_photos: "Twoje prace", add_photos: "Dodaj zdjęcia", del: "Usuń",
    no_profile: "Nie masz jeszcze profilu artysty.",
    forgot: "Nie pamiętasz hasła?", reset_title: "Reset hasła",
    reset_sub: "Podaj e-mail — wyślemy link do ustawienia nowego hasła.",
    reset_send: "Wyślij link", reset_sent: "Sprawdź skrzynkę — wysłaliśmy link do zmiany hasła.",
    back_to_login: "Wróć do logowania", new_password: "Nowe hasło",
    set_password: "Ustaw nowe hasło", pw_changed: "Hasło zmienione!",
    verified: "Zweryfikowany", views_n: "{n} wyświetleń",
    fav_add: "Dodaj do ulubionych", fav_remove: "W ulubionych", report: "Zgłoś",
    report_reason: "Podaj powód zgłoszenia:", reviews_title: "Oceny i opinie",
    review_ph: "Napisz opinię (opcjonalnie)...", review_submit: "Dodaj opinię",
    no_reviews: "Brak opinii. Bądź pierwszy!", comments_title: "Komentarze",
    comment_ph: "Napisz komentarz...", comment_add_photo: "Dodaj zdjęcie",
    comment_submit: "Dodaj", no_comments: "Brak komentarzy.",
    login_to_interact: "Zaloguj się, aby oceniać i komentować.",
    signup_free: "Załóż darmowe konto", signup_title: "Darmowe konto",
    l_displayname: "Nazwa wyświetlana", signup_btn: "Utwórz konto",
    have_account: "Masz już konto? Zaloguj się", anon_user: "Użytkownik",
    pay_ok: "Płatność przyjęta — okres próbny aktywny! 🎉", pay_cancel: "Płatność anulowana.",
    footer_terms: "Regulamin", footer_privacy: "Polityka prywatności", footer_contact: "Kontakt",
    footer_rights: "Wszelkie prawa zastrzeżone.", terms_title: "Regulamin",
    privacy_title: "Polityka prywatności",
    cookie_text: "Używamy plików cookie niezbędnych do działania serwisu (logowanie, ustawienia). Korzystając z UsArt, akceptujesz Politykę prywatności.",
    cookie_ok: "Rozumiem",
    consent_text: "Akceptuję Regulamin i Politykę prywatności.",
    nav_admin: "Panel", admin_title: "Panel administratora",
    admin_reports: "Zgłoszenia", admin_no_reports: "Brak zgłoszeń.",
    admin_artists: "Artyści", admin_del_content: "Usuń treść", admin_dismiss: "Odrzuć",
    hero_a: "Znajdź", hero_b: "artystę",
    hero_sub: "Wpisz nick, miasto lub styl — albo użyj filtrów poniżej.",
    search_ph: "np. kraków, fine line, @zuza...",
    f_city: "Miasto", f_cat: "Kategoria", f_style: "Styl", all: "Wszystkie", city_other: "Inne",
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
    l_city: "Miasto *", city_select: "Wybierz miasto z listy...",
    city_other_ph: "Nie ma Twojego miasta? Wpisz je tutaj...",
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
    pay_stripe_note: "Dane karty podasz bezpiecznie na stronie Stripe. Dziś 0 zł — po {m} miesiącach {amt}/mies., anuluj kiedy chcesz.",
    start_trial: "Rozpocznij {m} miesiące za darmo ✓", publish: "Opublikuj profil ✓",
    success_simple: "Twój profil jest gotowy i widoczny w katalogu.",
    success_title: "Profil gotowy!",
    success_sub: "Okres próbny aktywny — {m} miesiące za darmo, potem {amt}/mies.{studio}.",
    success_studio: " (studio, {n} artystów)",
    success_line2: "Za chwilę pojawisz się w wynikach wyszukiwania.",
    go_home: "Wróć na stronę główną", see_profile: "Zobacz swój profil",
  },
  en: {
    nav_search: "Search", nav_explore: "Explore", nav_works: "Work", nav_match: "Match", nav_map: "Map",
    map_title: "Artist map", map_sub: "Click a city or pin on the map to see its artists.",
    loc_title: "Map location", loc_sub: "Optional — enter your studio address and find it on the map. Fine-tune with the pin.",
    loc_address: "Studio address", loc_find: "Find", loc_clear: "Remove location",
    loc_hint: "Click the map or drag the pin to set the exact spot.",
    loc_not_found: "Address not found — try again or place the pin manually.",
    works_title: "Work", works_sub: "Browse all artists' work — click to see the profile.",
    match_title: "Find your artist", match_sub: "Answer a few questions and we'll show matching artists.",
    match_q_cat: "What are you looking for?", match_q_style: "Which style interests you?",
    match_q_city: "In which city?", match_any: "Any",
    match_results: "Matching artists", match_restart: "Start over",
    login: "Log in", join: "Sign up",
    reg_choose: "How do you want to join?",
    reg_as_artist: "As an artist", reg_as_artist_d: "Create a profile, add your work and appear in the directory.",
    reg_as_user: "As a user", reg_as_user_d: "Free account — rate, comment and save favorites.",
    user_signup_title: "User sign up", user_signup_sub: "Free user account.",
    logout: "Log out", login_title: "Log in", login_btn: "Log in",
    login_error: "Wrong email or password.", submitting: "Creating account...",
    err_taken: "This nickname or email is already taken.",
    nav_account: "My account", account_title: "My account",
    account_favs: "Favorite artists", account_no_favs: "No favorite artists yet.",
    acc_profile: "Account details", acc_email_title: "Change email", acc_new_email: "New email",
    acc_email_saved: "Saved. If required, confirm the change via the email link.",
    acc_pw_title: "Change password", acc_current_email: "Current email",
    acc_pw_reset_info: "We'll email you a password reset link.", acc_pw_send: "Send link",
    acc_name_taken: "This name is already taken — choose another.",
    nav_fav: "Favorites", fav_sub: "Your saved artists.",
    fav_login: "Log in to see your favorite artists.",
    acc_photo: "Profile photo", acc_change_photo: "Change photo", acc_bio: "About me",
    edit_title: "Edit profile",
    edit_sub: "Update your details and work.", save: "Save changes", saved: "Saved!",
    sub_title: "Subscription", sub_plan: "Plan", sub_status: "Status",
    sub_status_trialing: "Trial", sub_status_active: "Active", sub_status_canceled: "Canceled",
    sub_status_none: "You don't have an active subscription.",
    sub_started: "Started", sub_trial_until: "Free trial until", sub_renews: "Renews", sub_ends: "Ends",
    sub_cancel: "Cancel subscription", sub_cancel_done: "Subscription will be canceled at the end of the period.",
    sub_start_btn: "Start subscription",
    edit_photos: "Your work", add_photos: "Add photos", del: "Delete",
    no_profile: "You don't have an artist profile yet.",
    forgot: "Forgot password?", reset_title: "Reset password",
    reset_sub: "Enter your email — we'll send a link to set a new password.",
    reset_send: "Send link", reset_sent: "Check your inbox — we sent a reset link.",
    back_to_login: "Back to login", new_password: "New password",
    set_password: "Set new password", pw_changed: "Password changed!",
    verified: "Verified", views_n: "{n} views",
    fav_add: "Add to favorites", fav_remove: "In favorites", report: "Report",
    report_reason: "Describe the reason:", reviews_title: "Ratings & reviews",
    review_ph: "Write a review (optional)...", review_submit: "Submit review",
    no_reviews: "No reviews yet. Be the first!", comments_title: "Comments",
    comment_ph: "Write a comment...", comment_add_photo: "Add photo",
    comment_submit: "Post", no_comments: "No comments yet.",
    login_to_interact: "Log in to rate and comment.",
    signup_free: "Create a free account", signup_title: "Free account",
    l_displayname: "Display name", signup_btn: "Create account",
    have_account: "Already have an account? Log in", anon_user: "User",
    pay_ok: "Payment received — trial active! 🎉", pay_cancel: "Payment canceled.",
    footer_terms: "Terms", footer_privacy: "Privacy policy", footer_contact: "Contact",
    footer_rights: "All rights reserved.", terms_title: "Terms",
    privacy_title: "Privacy policy",
    cookie_text: "We use cookies necessary for the site to work (login, settings). By using UsArt you accept the Privacy Policy.",
    cookie_ok: "Got it",
    consent_text: "I accept the Terms and Privacy Policy.",
    nav_admin: "Admin", admin_title: "Admin panel",
    admin_reports: "Reports", admin_no_reports: "No reports.",
    admin_artists: "Artists", admin_del_content: "Delete content", admin_dismiss: "Dismiss",
    hero_a: "Find an", hero_b: "artist",
    hero_sub: "Enter a nickname, city or style — or use the filters below.",
    search_ph: "e.g. krakow, fine line, @zuza...",
    f_city: "City", f_cat: "Category", f_style: "Style", all: "All", city_other: "Other",
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
    l_city: "City *", city_select: "Select a city from the list...",
    city_other_ph: "Can't find your city? Type it here...",
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
    pay_stripe_note: "You'll enter card details securely on Stripe. 0 zł today — then {amt}/mo after {m} months, cancel anytime.",
    start_trial: "Start {m} months free ✓", publish: "Publish profile ✓",
    success_simple: "Your profile is ready and visible in the catalog.",
    success_title: "Profile ready!",
    success_sub: "Trial active — {m} months free, then {amt}/mo{studio}.",
    success_studio: " (studio, {n} artists)",
    success_line2: "You'll appear in search results shortly.",
    go_home: "Back to home", see_profile: "View your profile",
  },
};

const CATEGORY_EN = {
  "Tatuaż": "Tattoo", "Malarstwo": "Painting",
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

// Współrzędne miast (do mapy)
const CITY_COORDS = {
  "Warszawa": [52.2297, 21.0122], "Kraków": [50.0647, 19.9450], "Łódź": [51.7592, 19.4560],
  "Wrocław": [51.1079, 17.0385], "Poznań": [52.4064, 16.9252], "Gdańsk": [54.3520, 18.6466],
  "Szczecin": [53.4285, 14.5528], "Bydgoszcz": [53.1235, 18.0084], "Lublin": [51.2465, 22.5684],
  "Białystok": [53.1325, 23.1688], "Katowice": [50.2649, 19.0238], "Gdynia": [54.5189, 18.5305],
  "Częstochowa": [50.8118, 19.1203], "Radom": [51.4027, 21.1471], "Rzeszów": [50.0413, 21.9990],
  "Toruń": [53.0138, 18.5984], "Sosnowiec": [50.2862, 19.1040], "Kielce": [50.8661, 20.6286],
  "Gliwice": [50.2945, 18.6714], "Olsztyn": [53.7784, 20.4801], "Zabrze": [50.3249, 18.7857],
  "Bielsko-Biała": [49.8224, 19.0584], "Bytom": [50.3483, 18.9157], "Zielona Góra": [51.9356, 15.5062],
  "Rybnik": [50.0971, 18.5416], "Opole": [50.6751, 17.9213], "Tychy": [50.1372, 18.9663],
  "Gorzów Wielkopolski": [52.7368, 15.2288], "Płock": [52.5468, 19.7064], "Elbląg": [54.1522, 19.4088],
  "Wałbrzych": [50.7714, 16.2845], "Tarnów": [50.0121, 20.9858], "Koszalin": [54.1944, 16.1722],
  "Kalisz": [51.7611, 18.0910], "Legnica": [51.2070, 16.1619], "Słupsk": [54.4641, 17.0287],
  "Nowy Sącz": [49.6174, 20.7156], "Jelenia Góra": [50.9044, 15.7197], "Sopot": [54.4418, 18.5601],
  "Zakopane": [49.2992, 19.9496], "Gniezno": [52.5348, 17.5826], "Przemyśl": [49.7838, 22.7677],
  "Suwałki": [54.1117, 22.9309], "Chełm": [51.1431, 23.4716], "Świnoujście": [53.9100, 14.2470],
  "Mielec": [50.2872, 21.4239], "Pruszków": [52.1705, 20.8021], "Stalowa Wola": [50.5826, 22.0537],
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
const IconStar   = ({ fill }) => <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={16} fill={fill} />;
const IconHeart  = ({ fill }) => <Ico d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" size={15} fill={fill} />;
const IconFlag   = () => <Ico d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" size={13} />;
const IconGrid   = () => <Ico d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />;

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
  .nav-action { min-width: 122px; text-align: center; }
  .pay-banner { display: flex; align-items: center; justify-content: center; gap: 14px;
    padding: 12px 18px; font-size: 14px; font-weight: 500; }
  .pay-banner.ok { background: rgba(74,222,128,.12); color: #4ade80; border-bottom: 1px solid rgba(74,222,128,.25); }
  .pay-banner.cancel { background: rgba(248,113,113,.1); color: #f87171; border-bottom: 1px solid rgba(248,113,113,.25); }
  .pay-banner button { background: none; border: none; color: inherit; cursor: pointer; display: flex; opacity: .7; }
  .pay-banner button:hover { opacity: 1; }
  .btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  .btn:disabled:hover { opacity: .4; transform: none; }
  .btn-danger { background: rgba(248,113,113,.12); color: #f87171; border: 1px solid rgba(248,113,113,.3); }
  .btn-danger:hover { background: rgba(248,113,113,.2); }
  .admin-list { max-width: 760px; display: flex; flex-direction: column; gap: 8px; }
  .admin-row { display: flex; align-items: center; justify-content: space-between; gap: 12px;
    background: #111; border: 1px solid #1c1c1c; border-radius: 12px; padding: 12px 16px; }
  .admin-row-main { font-size: 14px; font-weight: 600; color: #eee; }
  .admin-row-sub { font-size: 12px; color: #555; margin-top: 2px; word-break: break-all; }
  .sub-row { display: flex; justify-content: space-between; gap: 12px; padding: 9px 0;
    border-bottom: 1px solid #1a1a1a; font-size: 14px; color: #999; }
  .sub-row:last-of-type { border-bottom: none; }
  .sub-row b { color: #eee; font-weight: 600; text-align: right; }

  /* ── STOPKA / PRAWNE / COOKIES ── */
  .footer { border-top: 1px solid #1a1a1a; margin-top: 40px; padding: 24px 28px; }
  .footer-inner { max-width: 1160px; margin: 0 auto; display: flex; align-items: center;
    justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .footer-logo { font-size: 18px; font-weight: 700;
    background: linear-gradient(135deg, #e879f9, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .footer-links { display: flex; gap: 18px; flex-wrap: wrap; }
  .footer-links button, .footer-links a { background: none; border: none; color: #888; cursor: pointer;
    font-size: 13px; text-decoration: none; }
  .footer-links button:hover, .footer-links a:hover { color: #ddd; }
  .footer-copy { color: #555; font-size: 12px; }
  .cookie-banner { position: fixed; bottom: 0; left: 0; right: 0; z-index: 350;
    background: #141414; border-top: 1px solid #2a2a2a; padding: 14px 20px;
    display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap;
    font-size: 13px; color: #bbb; }
  .cookie-link { background: none; border: none; color: #818cf8; cursor: pointer; text-decoration: underline; font: inherit; }
  .legal { max-width: 800px; margin: 0 auto; padding: 32px 28px 60px; color: #c8ccd2; }
  .legal h1 { font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .legal h3 { font-size: 15px; font-weight: 600; color: #eee; margin: 22px 0 8px; }
  .legal p { font-size: 14px; line-height: 1.65; margin-bottom: 8px; }
  .legal-date { color: #666; font-size: 13px; margin-bottom: 8px; }
  .legal-note { margin-top: 26px; padding: 12px 14px; background: rgba(240,168,104,.08);
    border: 1px solid rgba(240,168,104,.25); border-radius: 10px; color: #f0a868; font-size: 13px; }
  .consent { display: flex; align-items: flex-start; gap: 10px; margin-top: 8px; cursor: pointer;
    font-size: 13px; color: #aaa; line-height: 1.5; }
  .consent input { margin-top: 2px; width: 16px; height: 16px; flex-shrink: 0; accent-color: #818cf8; cursor: pointer; }
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
  .link-btn { display: block; width: 100%; text-align: center; margin-top: 14px; background: none;
    border: none; color: #818cf8; font-size: 13px; cursor: pointer; }
  .link-btn:hover { color: #a5b4fc; text-decoration: underline; }
  .form-note-ok { font-size: 13px; color: #4ade80; padding: 10px 12px; margin-bottom: 4px;
    background: rgba(74,222,128,.08); border: 1px solid rgba(74,222,128,.25); border-radius: 10px; }
  .del-photo { position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,.6);
    backdrop-filter: blur(4px); border: none; color: #fff; cursor: pointer; border-radius: 7px;
    padding: 5px; display: flex; opacity: 0; transition: opacity .15s; }
  .proj-item:hover .del-photo { opacity: 1; }

  /* ── SOCIAL: badge, oceny, komentarze, ulubione ── */
  .verified-badge { display: inline-flex; align-items: center; gap: 4px; margin-left: 8px;
    font-size: 11px; font-weight: 600; vertical-align: middle; padding: 3px 8px; border-radius: 20px;
    background: rgba(74,222,128,.12); border: 1px solid rgba(74,222,128,.3); color: #4ade80; }
  .verified-badge svg { width: 12px; height: 12px; }
  .rev-summary { display: flex; align-items: center; gap: 8px; margin: 6px 0; font-size: 13px; color: #aaa; }
  .stars-display { display: inline-flex; color: #fbbf24; }
  .profile-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-top: 14px; }
  .views-count { font-size: 12px; color: #555; }
  .fav-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 13px; border-radius: 8px;
    font-size: 12px; font-weight: 500; cursor: pointer; background: #161616; border: 1px solid #272727;
    color: #aaa; transition: all .15s; }
  .fav-btn:hover { border-color: #e879f9; color: #e879f9; }
  .fav-btn.on { background: rgba(232,121,249,.12); border-color: #e879f9; color: #e879f9; }
  .fav-btn.on svg { color: #e879f9; }
  .mini-link { background: none; border: none; color: #666; font-size: 12px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 5px; }
  .mini-link:hover { color: #aaa; }
  .social-section { max-width: 960px; margin: 0 auto; padding: 8px 0 0; }
  .review-form, .comment-form { background: #111; border: 1px solid #1c1c1c; border-radius: 14px;
    padding: 16px; margin-bottom: 16px; }
  .stars-input { display: flex; gap: 4px; margin-bottom: 10px; color: #fbbf24; }
  .star-btn { background: none; border: none; cursor: pointer; color: #333; padding: 2px; display: flex; }
  .star-btn:hover { color: #fbbf24; }
  .review-form .form-input, .comment-form .form-input { margin-bottom: 10px; }
  .comment-form-actions { display: flex; gap: 10px; justify-content: space-between; align-items: center; }
  .social-item { background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 12px;
    padding: 12px 14px; margin-bottom: 10px; }
  .social-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 5px; }
  .social-author { font-size: 13px; font-weight: 600; color: #ddd; }
  .social-text { font-size: 13px; color: #aaa; line-height: 1.5; }
  .comment-img { margin-top: 10px; max-width: 180px; border-radius: 10px; cursor: pointer; display: block; }
  .comment-avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid #2a2a2a; }
  .like-badge { position: absolute; bottom: 8px; left: 8px; z-index: 2; display: flex; align-items: center;
    gap: 5px; background: rgba(0,0,0,.6); backdrop-filter: blur(4px); border: none; color: #fff;
    cursor: pointer; border-radius: 20px; padding: 5px 10px; font-size: 12px; font-weight: 600; transition: color .15s; }
  .like-badge:hover { color: #e879f9; }
  .like-badge.on { color: #e879f9; }
  .like-badge svg { width: 14px; height: 14px; }
  .lightbox-like { position: absolute; bottom: 34px; left: 24px; display: flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,.1); border: none; color: #fff; cursor: pointer; border-radius: 9px;
    padding: 9px 15px; font-size: 14px; font-weight: 600; }
  .lightbox-like.on { color: #e879f9; }
  .login-hint { font-size: 13px; color: #666; padding: 12px; background: #0f0f0f;
    border: 1px solid #1a1a1a; border-radius: 12px; margin-bottom: 16px; text-align: center; }
  .muted { font-size: 13px; color: #555; padding: 8px 0; }

  .match-q { font-size: 19px; font-weight: 600; color: #eee; margin: 8px 0 18px; }
  .map-box { height: 460px; border-radius: 16px; overflow: hidden; border: 1px solid #1c1c1c;
    margin-bottom: 24px; z-index: 0; background: #0d0d0d; }
  .map-box .leaflet-container { height: 100%; width: 100%; background: #0d0d0d; font-family: inherit; }
  .loc-map { height: 280px; border-radius: 12px; overflow: hidden; border: 1px solid #222; z-index: 0; background: #0d0d0d; }
  .loc-map .leaflet-container { height: 100%; width: 100%; background: #0d0d0d; font-family: inherit; }

  /* ── WORKS FEED ── */
  .works-grid { max-width: 1160px; margin: 0 auto; padding: 0 28px 80px;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
  .work-item { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden;
    cursor: pointer; background: #181818; }
  .work-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
  .work-item:hover img { transform: scale(1.05); }
  .work-overlay { position: absolute; inset: 0; display: flex; align-items: flex-end; gap: 7px;
    padding: 10px; opacity: 0; transition: opacity .2s;
    background: linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 55%); }
  .work-item:hover .work-overlay { opacity: 1; }
  .work-overlay span { font-size: 12px; font-weight: 600; color: #fff; }
  .work-overlay .work-avatar { width: 24px; height: 24px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,.35); object-fit: cover; }

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
  .other-wrap { position: relative; display: inline-block; }
  .other-pop { position: absolute; top: 100%; left: 0; margin-top: 0; z-index: 50;
    width: 340px; max-width: 80vw; max-height: 300px; overflow-y: auto; background: #141414;
    border: 1px solid #2a2a2a; border-radius: 12px; padding: 12px;
    display: flex; flex-wrap: wrap; gap: 6px; box-shadow: 0 14px 36px rgba(0,0,0,.55); }
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
  .upload-zone { display: block; border: 2px dashed #252525; border-radius: 12px; padding: 36px 24px;
    text-align: center; cursor: pointer; transition: all .2s; color: #444; }
  .form-select { appearance: none; -webkit-appearance: none; cursor: pointer; padding-right: 38px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23818cf8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center; }
  .form-select option { background: #141414; color: #f0f0f0; }
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
  .reg-choice { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 620px; margin: 0 auto; }
  .reg-choice-card { text-align: center; background: #111; border: 1px solid #1c1c1c; border-radius: 16px;
    padding: 32px 22px; cursor: pointer; transition: all .2s; color: #ccc; }
  .reg-choice-card:hover { border-color: #818cf8; transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(129,140,248,.12); }
  .reg-choice-card svg { color: #818cf8; margin-bottom: 12px; width: 28px; height: 28px; }
  .reg-choice-card h3 { font-size: 17px; font-weight: 700; margin-bottom: 6px; color: #fff; }
  .reg-choice-card p { font-size: 13px; color: #666; line-height: 1.5; }
  @media (max-width: 560px) { .reg-choice { grid-template-columns: 1fr; } }
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
    .nav { flex-wrap: wrap; height: auto; padding: 8px 12px; gap: 8px; }
    .nav-logo { flex: 0 0 auto; font-size: 20px; }
    .nav-right { flex: 0 0 auto; gap: 6px; }
    .nav-right .btn { padding: 6px 11px; font-size: 12px; }
    .nav-action { min-width: 0; flex: 1; }
    .lang-switch button { padding: 4px 7px; font-size: 11px; }
    .nav-tabs { order: 3; flex: 1 1 100%; justify-content: flex-start; gap: 6px;
      overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 2px; }
    .nav-tab { white-space: nowrap; }

    .hero { padding-left: 16px; padding-right: 16px; }
    .filters-panel, .stats, .grid, .explore, .works-grid, .profile, .register {
      padding-left: 16px; padding-right: 16px; }
    .grid, .works-grid { gap: 12px; }
    .profile-card { flex-direction: column; align-items: center; text-align: center; padding: 22px; }
    .contact-row, .style-badges { justify-content: center; }
    .profile-city, .rev-summary, .profile-meta { justify-content: center; flex-wrap: wrap; }
    .reg-choice { grid-template-columns: 1fr; }
    .other-pop { width: 280px; }
  }
`;

// ─── REGISTER FLOW ─────────────────────────────────────────────────────────────
const STEPS = ["step_account", "step_profile", "step_photos"];
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
    plan: "solo", members: 3, consent: false,
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
    if (s === 0) return form.nick.trim() && /\S+@\S+\.\S+/.test(form.email) && pwValid && pwMatch && form.consent;
    if (s === 1) return form.city.trim() && form.category && form.styles.length > 0;
    if (s === 2) return form.photos.length >= 2;
    if (s === 3) return true;
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

      // Profil konta (rola: artysta)
      await supabase.from("profiles").upsert({ id: uid, display_name: form.nick, role: "artist" });

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
          <p>{t("success_simple")}<br />
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
            <label className="consent">
              <input type="checkbox" checked={form.consent} onChange={e => update("consent", e.target.checked)} />
              <span>{t("consent_text")}</span>
            </label>
          </>
        )}

        {step === 1 && (
          <>
            <h2>{t("profile_title")}</h2>
            <p>{t("profile_sub")}</p>

            {/* MIASTO — chipsy */}
            <div className="form-row">
              <label className="form-label">{t("l_city")}</label>
              <select className="form-input form-select"
                value={REGISTER_CITIES.includes(form.city) ? form.city : ""}
                onChange={e => update("city", e.target.value)}>
                <option value="">{t("city_select")}</option>
                {[...REGISTER_CITIES].sort((a, b) => a.localeCompare(b, "pl")).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input className="form-input" style={{ marginTop: 10 }} placeholder={t("city_other_ph")}
                value={REGISTER_CITIES.includes(form.city) ? "" : form.city}
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

            <div className="pay-total">
              <span>{t("pay_today")}</span>
              <b>0,00 zł</b>
            </div>
            <div className="pay-note">
              <IconLock /> {t("pay_stripe_note", { m: TRIAL_MONTHS, amt: zl(monthlyTotal) })}
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
              {submitting ? t("submitting") : t("publish")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── REJESTRACJA UŻYTKOWNIKA (darmowe konto) ────────────────────────────────────
function UserSignup({ onBack, onDone }) {
  const { t } = useLang();
  const [form, setForm] = useState({ displayName: "", email: "", password: "", password2: "", consent: false });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const pw = form.password;
  const r = { len: pw.length >= 8, lower: /[a-z]/.test(pw), upper: /[A-Z]/.test(pw), special: /[^A-Za-z0-9]/.test(pw) };
  const pwValid = r.len && r.lower && r.upper && r.special;
  const match = pw.length > 0 && pw === form.password2;
  const valid = form.displayName.trim() && /\S+@\S+\.\S+/.test(form.email) && pwValid && match && form.consent;

  const submit = async () => {
    setBusy(true); setErr("");
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) { setBusy(false); setErr(error.message); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id, display_name: form.displayName, role: "user",
      });
    }
    setBusy(false);
    if (data.session) onDone();
    else setErr("Wyłącz potwierdzanie e-mail w Supabase, aby od razu się zalogować.");
  };

  return (
    <div className="register">
      <button className="register-back" onClick={onBack}><IconBack /> {t("back")}</button>
      <div className="reg-card">
        <h2>{t("user_signup_title")}</h2>
        <p>{t("user_signup_sub")}</p>
        <div className="form-row">
          <label className="form-label">{t("l_displayname")} *</label>
          <input className="form-input" value={form.displayName}
            onChange={e => u("displayName", e.target.value)} placeholder={t("ph_nick")} />
        </div>
        <div className="form-row">
          <label className="form-label">{t("l_email")}</label>
          <input className="form-input" type="email" value={form.email}
            onChange={e => u("email", e.target.value)} placeholder={t("ph_email")} />
        </div>
        <div className="form-row">
          <label className="form-label">{t("l_password")}</label>
          <div className="pw-intro">{t("pw_intro")}</div>
          <ul className="pw-rules">
            <li className={r.len ? "ok" : ""}><span className="pw-dot" /> {t("pw_len")}</li>
            <li className={r.lower ? "ok" : ""}><span className="pw-dot" /> {t("pw_lower")}</li>
            <li className={r.upper ? "ok" : ""}><span className="pw-dot" /> {t("pw_upper")}</li>
            <li className={r.special ? "ok" : ""}><span className="pw-dot" /> {t("pw_special")}</li>
          </ul>
          <input className="form-input" type="password" value={form.password}
            onChange={e => u("password", e.target.value)} placeholder={t("ph_password")} />
        </div>
        <div className="form-row">
          <label className="form-label">{t("l_password2")}</label>
          <input className="form-input" type="password" value={form.password2}
            onChange={e => u("password2", e.target.value)} placeholder={t("ph_password2")} />
          {form.password2.length > 0 && (
            <div className={`pw-match ${match ? "ok" : "bad"}`}>
              {match ? t("pw_match_ok") : t("pw_match_bad")}
            </div>
          )}
        </div>
        <label className="consent">
          <input type="checkbox" checked={form.consent} onChange={e => u("consent", e.target.checked)} />
          <span>{t("consent_text")}</span>
        </label>
        {err && <div className="form-error">{err}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" disabled={busy || !valid} onClick={submit}>
            {busy ? "…" : t("signup_btn")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REJESTRACJA: wybór ścieżki (artysta / użytkownik) ──────────────────────────
function Register({ onBack, onDone }) {
  const { t } = useLang();
  const [mode, setMode] = useState(null);
  if (mode === "artist") return <RegisterFlow onBack={() => setMode(null)} onDone={onDone} />;
  if (mode === "user") return <UserSignup onBack={() => setMode(null)} onDone={onDone} />;
  return (
    <div className="register">
      <button className="register-back" onClick={onBack}><IconBack /> {t("back")}</button>
      <h2 style={{ fontSize: 24, textAlign: "center", marginBottom: 28 }}>{t("reg_choose")}</h2>
      <div className="reg-choice">
        <button className="reg-choice-card" onClick={() => setMode("artist")}>
          <IconUser />
          <h3>{t("reg_as_artist")}</h3>
          <p>{t("reg_as_artist_d")}</p>
        </button>
        <button className="reg-choice-card" onClick={() => setMode("user")}>
          <IconHeart />
          <h3>{t("reg_as_user")}</h3>
          <p>{t("reg_as_user_d")}</p>
        </button>
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
function ArtistProfile({ artist: a, onBack, session }) {
  const { lang, t } = useLang();
  const [lightbox, setLightbox] = useState(null);
  const isReal = typeof a.id === "string";
  const uid = session?.user?.id || null;

  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [names, setNames] = useState({});
  const [fav, setFav] = useState(false);
  const [likes, setLikes] = useState({});
  const [myRating, setMyRating] = useState(0);
  const [myText, setMyText] = useState("");
  const [cText, setCText] = useState("");
  const [cFile, setCFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!isReal) return;
    const { data: rv } = await supabase.from("reviews").select("*").eq("artist_id", a.id);
    const { data: cm } = await supabase.from("comments").select("*").eq("artist_id", a.id).order("created_at", { ascending: false });
    setReviews(rv || []); setComments(cm || []);
    const ids = [...new Set([...(rv || []).map(x => x.user_id), ...(cm || []).map(x => x.user_id)])];
    if (ids.length) {
      const { data: pf } = await supabase.from("profiles").select("id,display_name,avatar").in("id", ids);
      const m = {}; (pf || []).forEach(p => { m[p.id] = { name: p.display_name, avatar: p.avatar }; }); setNames(m);
    }
    if (uid) {
      const mine = (rv || []).find(x => x.user_id === uid);
      if (mine) { setMyRating(mine.rating); setMyText(mine.text || ""); }
      const { data: f } = await supabase.from("favorites").select("artist_id").eq("user_id", uid).eq("artist_id", a.id);
      setFav((f || []).length > 0);
    }
    // Polubienia zdjęć
    const pids = (a.projects || []).map(p => p.id);
    if (pids.length) {
      const { data: lk } = await supabase.from("photo_likes").select("project_id,user_id").in("project_id", pids);
      const map = {};
      (lk || []).forEach(l => {
        if (!map[l.project_id]) map[l.project_id] = { count: 0, mine: false };
        map[l.project_id].count++;
        if (l.user_id === uid) map[l.project_id].mine = true;
      });
      setLikes(map);
    }
  };

  const toggleLike = async (pid) => {
    if (!uid) return;
    const cur = likes[pid] || { count: 0, mine: false };
    setLikes(prev => ({ ...prev, [pid]: { count: cur.count + (cur.mine ? -1 : 1), mine: !cur.mine } }));
    if (cur.mine) await supabase.from("photo_likes").delete().eq("user_id", uid).eq("project_id", pid);
    else await supabase.from("photo_likes").insert({ user_id: uid, project_id: pid });
  };

  useEffect(() => {
    if (isReal) { supabase.rpc("increment_views", { aid: a.id }); load(); }
  }, [a.id]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const toggleFav = async () => {
    if (!uid) return;
    if (fav) { await supabase.from("favorites").delete().eq("user_id", uid).eq("artist_id", a.id); setFav(false); }
    else { await supabase.from("favorites").insert({ user_id: uid, artist_id: a.id }); setFav(true); }
  };

  const submitReview = async () => {
    if (!uid || !myRating) return;
    setBusy(true);
    await supabase.from("reviews").upsert(
      { artist_id: a.id, user_id: uid, rating: myRating, text: myText || null },
      { onConflict: "artist_id,user_id" });
    setBusy(false); load();
  };

  const submitComment = async () => {
    if (!uid || (!cText && !cFile)) return;
    setBusy(true);
    let img = null;
    if (cFile) {
      const path = `comments/${uid}/${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const { error } = await supabase.storage.from("portfolios").upload(path, cFile);
      if (!error) img = supabase.storage.from("portfolios").getPublicUrl(path).data.publicUrl;
    }
    await supabase.from("comments").insert({ artist_id: a.id, user_id: uid, text: cText || null, img });
    setCText(""); setCFile(null); setBusy(false); load();
  };

  const delComment = async (id) => { await supabase.from("comments").delete().eq("id", id); load(); };

  const report = async (type, id) => {
    if (!uid) return;
    const reason = window.prompt(t("report_reason"));
    if (reason == null) return;
    await supabase.from("reports").insert({ reporter: uid, target_type: type, target_id: id, reason });
  };

  const nameOf = (id) => names[id]?.name || t("anon_user");
  const avatarOf = (id) => names[id]?.avatar;

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
            {reviews.length > 0 && (
              <div className="rev-summary">
                <span className="stars-display">{[1, 2, 3, 4, 5].map(n => <IconStar key={n} fill={n <= Math.round(avg)} />)}</span>
                <span>{avg.toFixed(1)} ({reviews.length})</span>
              </div>
            )}
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
            {isReal && (
              <div className="profile-meta">
                <span className="views-count">{t("views_n", { n: a.views || 0 })}</span>
                {uid && (
                  <button className={`fav-btn ${fav ? "on" : ""}`} onClick={toggleFav}>
                    <IconHeart fill={fav} /> {fav ? t("fav_remove") : t("fav_add")}
                  </button>
                )}
                {uid && <button className="mini-link" onClick={() => report("artist", a.id)}><IconFlag /> {t("report")}</button>}
              </div>
            )}
          </div>
        </div>

        <div className="proj-title">{t("projects_n", { n: a.projects.length })}</div>
        <div className="proj-grid">
          {a.projects.map(p => (
            <div className="proj-item" key={p.id} onClick={() => setLightbox(p)}>
              <img src={p.img} alt={tTitle(p, lang)} />
              <div className="proj-overlay"><span className="proj-name">{tTitle(p, lang)}</span></div>
              {isReal && (
                <button className={`like-badge ${likes[p.id]?.mine ? "on" : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleLike(p.id); }}>
                  <IconHeart fill={likes[p.id]?.mine} /> {likes[p.id]?.count || 0}
                </button>
              )}
            </div>
          ))}
        </div>

        {isReal && (
          <>
            <div className="social-section">
              <div className="proj-title">{t("reviews_title")}</div>
              {uid ? (
                <div className="review-form">
                  <div className="stars-input">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} className="star-btn" onClick={() => setMyRating(n)}>
                        <IconStar fill={n <= myRating} />
                      </button>
                    ))}
                  </div>
                  <textarea className="form-input" rows={2} placeholder={t("review_ph")}
                    value={myText} onChange={e => setMyText(e.target.value)} style={{ resize: "vertical" }} />
                  <button className="btn btn-primary" disabled={busy || !myRating} onClick={submitReview}>
                    {t("review_submit")}
                  </button>
                </div>
              ) : <div className="login-hint">{t("login_to_interact")}</div>}
              {reviews.length === 0 ? <div className="muted">{t("no_reviews")}</div> : reviews.map(r => (
                <div className="social-item" key={r.id}>
                  <div className="social-head">
                    <span className="social-author">{nameOf(r.user_id)}</span>
                    <span className="stars-display">{[1, 2, 3, 4, 5].map(n => <IconStar key={n} fill={n <= r.rating} />)}</span>
                  </div>
                  {r.text && <div className="social-text">{r.text}</div>}
                </div>
              ))}
            </div>

            <div className="social-section">
              <div className="proj-title">{t("comments_title")} ({comments.length})</div>
              {uid ? (
                <div className="comment-form">
                  <textarea className="form-input" rows={2} placeholder={t("comment_ph")}
                    value={cText} onChange={e => setCText(e.target.value)} style={{ resize: "vertical" }} />
                  <div className="comment-form-actions">
                    <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
                      <input type="file" accept="image/*" hidden onChange={e => setCFile(e.target.files?.[0] || null)} />
                      {cFile ? "✓ " + cFile.name.slice(0, 14) : t("comment_add_photo")}
                    </label>
                    <button className="btn btn-primary" disabled={busy || (!cText && !cFile)} onClick={submitComment}>
                      {t("comment_submit")}
                    </button>
                  </div>
                </div>
              ) : <div className="login-hint">{t("login_to_interact")}</div>}
              {comments.length === 0 ? <div className="muted">{t("no_comments")}</div> : comments.map(c => (
                <div className="social-item" key={c.id}>
                  <div className="social-head">
                    <span className="social-author" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {avatarOf(c.user_id) && <img className="comment-avatar" src={avatarOf(c.user_id)} alt="" />}
                      {nameOf(c.user_id)}
                    </span>
                    <span style={{ display: "flex", gap: 10 }}>
                      <button className="mini-link" onClick={() => report("comment", c.id)}>{t("report")}</button>
                      {uid === c.user_id && <button className="mini-link" onClick={() => delComment(c.id)}>{t("del")}</button>}
                    </span>
                  </div>
                  {c.text && <div className="social-text">{c.text}</div>}
                  {c.img && <img className="comment-img" src={c.img} alt="" onClick={() => setLightbox({ img: c.img, title: "" })} />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}><IconX /></button>
          <img src={lightbox.img} alt="" onClick={e => e.stopPropagation()} />
          {lightbox.title && <div className="lightbox-caption">{tTitle(lightbox, lang)}</div>}
          {isReal && lightbox.id && (
            <button className={`lightbox-like ${likes[lightbox.id]?.mine ? "on" : ""}`}
              onClick={e => { e.stopPropagation(); toggleLike(lightbox.id); }}>
              <IconHeart fill={likes[lightbox.id]?.mine} /> {likes[lightbox.id]?.count || 0}
            </button>
          )}
        </div>
      )}
    </>
  );
}

// ─── MAPA (Leaflet z CDN, ciemne kafelki CARTO) ─────────────────────────────────
function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) return resolve(window.L);
    if (!document.getElementById("leaflet-css")) {
      const css = document.createElement("link");
      css.id = "leaflet-css"; css.rel = "stylesheet";
      css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(css);
    }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    s.onload = () => resolve(window.L);
    document.head.appendChild(s);
  });
}

function MapView({ artists, onArtist }) {
  const { t } = useLang();
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const [selCity, setSelCity] = useState(null);

  const draw = () => {
    const L = window.L;
    if (!L || !layerRef.current) return;
    layerRef.current.clearLayers();
    const counts = {};
    artists.forEach(a => {
      if (a.lat && a.lng) {
        // dokładny punkt (artysta/studio ustawił adres)
        const m = L.circleMarker([a.lat, a.lng], { radius: 7,
          color: "#fff", weight: 2, fillColor: "#e879f9", fillOpacity: .95 });
        m.addTo(layerRef.current).bindTooltip(`@${a.nick}${a.address ? " · " + a.address : ""}`);
        m.on("click", () => onArtist(a));
      } else {
        counts[a.city] = (counts[a.city] || 0) + 1;
      }
    });
    Object.entries(counts).forEach(([city, n]) => {
      const c = CITY_COORDS[city];
      if (!c) return;
      const m = L.circleMarker(c, { radius: 7 + Math.min(n * 2, 14),
        color: "#818cf8", weight: 2, fillColor: "#818cf8", fillOpacity: .5 });
      m.addTo(layerRef.current).bindTooltip(`${city} (${n})`);
      m.on("click", () => setSelCity(city));
    });
  };

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then(L => {
      if (cancelled || mapRef.current || !elRef.current) return;
      const map = L.map(elRef.current, { scrollWheelZoom: false }).setView([52.1, 19.4], 6);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { attribution: "© OpenStreetMap, © CARTO", maxZoom: 18 }).addTo(map);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      draw();
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { draw(); }, [artists]);

  const cityArtists = selCity ? artists.filter(a => a.city === selCity) : [];

  return (
    <div className="explore">
      <div className="explore-title">{t("map_title")}</div>
      <div className="explore-sub">{t("map_sub")}</div>
      <div ref={elRef} className="map-box" />
      {selCity && (
        <div className="explore-results">
          <div className="section-header" style={{ marginBottom: 18 }}>
            <span className="section-title">{selCity}</span>
            <span className="section-count">{t("artists_count", { n: cityArtists.length })}</span>
            <button className="mini-link" style={{ marginLeft: "auto" }} onClick={() => setSelCity(null)}>
              <IconX />
            </button>
          </div>
          <div className="grid" style={{ padding: 0 }}>
            {cityArtists.map(a => <ArtistCard key={a.id} artist={a} onClick={() => onArtist(a)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ARTIST MATCHER (kreator doboru) ────────────────────────────────────────────
function ArtistMatcher({ artists, onArtist }) {
  const { lang, t } = useLang();
  const [step, setStep] = useState(0);
  const [cat, setCat] = useState(null);
  const [style, setStyle] = useState(null);
  const [city, setCity] = useState(null);

  const cities = [...new Set(artists.map(a => a.city))].sort();
  const styles = cat === "Tatuaż" ? TATTOO_STYLES : cat ? (OTHER_STYLES[cat] || []) : [];
  const results = artists.filter(a =>
    (!cat || a.categories.includes(cat)) &&
    (!style || a.styles.includes(style)) &&
    (!city || a.city === city));

  const restart = () => { setStep(0); setCat(null); setStyle(null); setCity(null); };

  return (
    <div className="explore">
      <div className="explore-title">{t("match_title")}</div>
      <div className="explore-sub">{t("match_sub")}</div>

      {step > 0 && step < 3 && (
        <button className="profile-back" style={{ marginBottom: 20 }}
          onClick={() => setStep(s => s - 1)}><IconBack /> {t("back_btn")}</button>
      )}

      {step === 0 && (
        <>
          <div className="match-q">{t("match_q_cat")}</div>
          <div className="cat-grid">
            {ALL_CATEGORIES.map(c => (
              <div className="cat-card" key={c} onClick={() => { setCat(c); setStyle(null); setStep(1); }}>
                <div className="cat-card-name">{tCat(c, lang)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div className="match-q">{t("match_q_style")}</div>
          <div className="filter-row" style={{ gap: 8 }}>
            <button className="chip" onClick={() => { setStyle(null); setStep(2); }}>{t("match_any")}</button>
            {styles.map(s => (
              <button key={s} className="chip chip-style" onClick={() => { setStyle(s); setStep(2); }}>
                {tStyle(s, lang)}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="match-q">{t("match_q_city")}</div>
          <div className="filter-row" style={{ gap: 8 }}>
            <button className="chip" onClick={() => { setCity(null); setStep(3); }}>{t("match_any")}</button>
            {cities.map(c => (
              <button key={c} className="chip" onClick={() => { setCity(c); setStep(3); }}>{c}</button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="section-header" style={{ marginBottom: 18 }}>
            <span className="section-title">{t("match_results")}</span>
            <span className="section-count">{t("artists_count", { n: results.length })}</span>
            <button className="mini-link" style={{ marginLeft: "auto" }} onClick={restart}>
              ↻ {t("match_restart")}
            </button>
          </div>
          {results.length === 0 ? (
            <div className="empty"><h3>{t("no_artists")}</h3><p>{t("try_filters")}</p></div>
          ) : (
            <div className="grid" style={{ padding: 0 }}>
              {results.map(a => <ArtistCard key={a.id} artist={a} onClick={() => onArtist(a)} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── FILTR MIAST (miasta z artystami + "Inne" z rozwijanym okienkiem) ───────────
function CityFilter({ cities, value, onChange }) {
  // value: tablica wybranych miast ([] = wszystkie)
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const others = [...REGISTER_CITIES].sort((a, b) => a.localeCompare(b, "pl")).filter(c => !cities.includes(c));
  const toggle = (c) => onChange(value.includes(c) ? value.filter(x => x !== c) : [...value, c]);
  const selectedOthers = value.filter(c => !cities.includes(c));

  return (
    <div className="filter-row">
      <span className="filter-label">{t("f_city")}</span>
      <button className={`chip ${value.length === 0 ? "active" : ""}`} onClick={() => onChange([])}>{t("all")}</button>
      {cities.map(c => (
        <button key={c} className={`chip ${value.includes(c) ? "active" : ""}`} onClick={() => toggle(c)}>{c}</button>
      ))}
      {selectedOthers.map(c => (
        <button key={c} className="chip active" onClick={() => toggle(c)}>{c}</button>
      ))}
      <div className="other-wrap" onMouseLeave={() => setOpen(false)}>
        <button className="chip" onClick={() => setOpen(o => !o)}>{t("city_other")} ▾</button>
        {open && (
          <div className="other-pop">
            {others.map(c => (
              <button key={c} className={`chip ${value.includes(c) ? "active" : ""}`}
                onClick={() => toggle(c)}>{c}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WORKS FEED (galeria wszystkich prac) ───────────────────────────────────────
function WorksFeed({ artists, onArtist }) {
  const { lang, t } = useLang();
  const [catF, setCatF] = useState("Wszystkie");
  const [styleF, setStyleF] = useState("Wszystkie");
  const [cityF, setCityF] = useState([]);

  const cities = [...new Set(artists.map(a => a.city))].sort();
  const availableStyles = catF === "Tatuaż"
    ? ["Wszystkie", ...TATTOO_STYLES]
    : catF !== "Wszystkie" ? ["Wszystkie", ...(OTHER_STYLES[catF] || [])] : [];

  const works = artists.flatMap(a => (a.projects || []).map(p => ({ ...p, artist: a })));
  const filtered = works.filter(w => {
    const a = w.artist;
    const mc = catF === "Wszystkie" || a.categories.includes(catF);
    const ms = styleF === "Wszystkie" || a.styles.includes(styleF);
    const mt = cityF.length === 0 || cityF.includes(a.city);
    return mc && ms && mt;
  });

  return (
    <div className="explore">
      <div className="explore-title">{t("works_title")}</div>
      <div className="explore-sub">{t("works_sub")}</div>

      <div className="filters-panel" style={{ padding: 0, marginBottom: 24 }}>
        <div className="filter-row">
          <span className="filter-label">{t("f_cat")}</span>
          {["Wszystkie", ...ALL_CATEGORIES].map(c => (
            <button key={c} className={`chip ${catF === c ? "active" : ""}`}
              onClick={() => { setCatF(c); setStyleF("Wszystkie"); }}>
              {c === "Wszystkie" ? t("all") : tCat(c, lang)}
            </button>
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
        <CityFilter cities={cities} value={cityF} onChange={setCityF} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty"><h3>{t("no_results")}</h3><p>{t("try_filters")}</p></div>
      ) : (
        <div className="works-grid">
          {filtered.map(w => (
            <div className="work-item" key={typeof w.id === "string" ? w.id : "m" + w.id}
              onClick={() => onArtist(w.artist)}>
              <img src={w.img} alt={tTitle(w, lang)} />
              <div className="work-overlay">
                <img className="work-avatar" src={w.artist.avatar} alt="" />
                <span>@{w.artist.nick}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SEARCH PAGE ───────────────────────────────────────────────────────────────
function SearchPage({ onArtist, artists }) {
  const { lang, t } = useLang();
  const [q, setQ] = useState("");
  const [cityF, setCityF] = useState([]);
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
    const mc = cityF.length === 0 || cityF.includes(a.city);
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
        <CityFilter cities={cities} value={cityF} onChange={setCityF} />
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

// ─── LOGIN MODAL (logowanie + reset hasła) ──────────────────────────────────────
function LoginModal({ onClose }) {
  const { t } = useLang();
  const [mode, setMode] = useState("login"); // "login" | "reset" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  const login = async () => {
    setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr(t("login_error"));
    else onClose();
  };

  const signup = async () => {
    setBusy(true); setErr("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setBusy(false); setErr(error.message); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id, display_name: displayName || email.split("@")[0], role: "user",
      });
    }
    setBusy(false);
    if (data.session) onClose();
    else setErr("Wyłącz potwierdzanie e-mail w Supabase, aby od razu się zalogować.");
  };

  const sendReset = async () => {
    setBusy(true); setErr("");
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    setBusy(false); setSent(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><IconX /></button>

        {mode === "signup" ? (
          <>
            <h2>{t("signup_title")}</h2>
            <p>UsArt</p>
            <div className="form-row">
              <label className="form-label">{t("l_displayname")}</label>
              <input className="form-input" value={displayName}
                onChange={e => setDisplayName(e.target.value)} placeholder={t("ph_optional")} />
            </div>
            <div className="form-row">
              <label className="form-label">{t("l_email")}</label>
              <input className="form-input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder={t("ph_email")} />
            </div>
            <div className="form-row">
              <label className="form-label">{t("l_password")}</label>
              <input className="form-input" type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder={t("ph_password")} />
            </div>
            <label className="consent">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
              <span>{t("consent_text")}</span>
            </label>
            {err && <div className="form-error">{err}</div>}
            <button className="btn btn-primary" disabled={busy || !email || password.length < 6 || !consent} onClick={signup}>
              {busy ? "…" : t("signup_btn")}
            </button>
            <button className="link-btn" onClick={() => { setMode("login"); setErr(""); }}>
              {t("have_account")}
            </button>
          </>
        ) : mode === "login" ? (
          <>
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
            <button className="btn btn-primary" disabled={busy || !email || !password} onClick={login}>
              {busy ? "…" : t("login_btn")}
            </button>
            <button className="link-btn" onClick={() => { setMode("reset"); setErr(""); }}>
              {t("forgot")}
            </button>
            <button className="link-btn" onClick={() => { setMode("signup"); setErr(""); }}>
              {t("signup_free")}
            </button>
          </>
        ) : (
          <>
            <h2>{t("reset_title")}</h2>
            <p>{t("reset_sub")}</p>
            {sent ? (
              <div className="form-note-ok">{t("reset_sent")}</div>
            ) : (
              <>
                <div className="form-row">
                  <label className="form-label">{t("l_email")}</label>
                  <input className="form-input" type="email" value={email}
                    onChange={e => setEmail(e.target.value)} placeholder={t("ph_email")} />
                </div>
                <button className="btn btn-primary" disabled={busy || !email} onClick={sendReset}>
                  {busy ? "…" : t("reset_send")}
                </button>
              </>
            )}
            <button className="link-btn" onClick={() => { setMode("login"); setSent(false); }}>
              {t("back_to_login")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── RESET PASSWORD MODAL (po kliknięciu linku z e-maila) ───────────────────────
function ResetPasswordModal({ onClose }) {
  const { t } = useLang();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const valid = password.length >= 8 && /[a-z]/.test(password)
    && /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (!error) setDone(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{t("set_password")}</h2>
        {done ? (
          <>
            <div className="form-note-ok">{t("pw_changed")}</div>
            <button className="btn btn-primary" onClick={onClose}>OK</button>
          </>
        ) : (
          <>
            <div className="pw-intro">{t("pw_intro")}</div>
            <ul className="pw-rules">
              <li className={password.length >= 8 ? "ok" : ""}><span className="pw-dot" /> {t("pw_len")}</li>
              <li className={/[a-z]/.test(password) ? "ok" : ""}><span className="pw-dot" /> {t("pw_lower")}</li>
              <li className={/[A-Z]/.test(password) ? "ok" : ""}><span className="pw-dot" /> {t("pw_upper")}</li>
              <li className={/[^A-Za-z0-9]/.test(password) ? "ok" : ""}><span className="pw-dot" /> {t("pw_special")}</li>
            </ul>
            <div className="form-row">
              <label className="form-label">{t("new_password")}</label>
              <input className="form-input" type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder={t("ph_password")} />
            </div>
            <button className="btn btn-primary" disabled={busy || !valid} onClick={save}>
              {busy ? "…" : t("set_password")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── WYBÓR LOKALIZACJI NA MAPIE (adres + pinezka) ───────────────────────────────
function LocationPicker({ value, onChange }) {
  const { t } = useLang();
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState(value.address || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const setMarker = (latlng) => {
    const L = window.L;
    if (markerRef.current) markerRef.current.setLatLng(latlng);
    else {
      markerRef.current = L.marker(latlng, { draggable: true }).addTo(mapRef.current);
      markerRef.current.on("dragend", () => {
        const p = markerRef.current.getLatLng();
        onChange({ address, lat: p.lat, lng: p.lng });
      });
    }
  };

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then(L => {
      if (cancelled || mapRef.current || !elRef.current) return;
      const has = value.lat && value.lng;
      const map = L.map(elRef.current).setView(has ? [value.lat, value.lng] : [52.1, 19.4], has ? 14 : 5);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { attribution: "© OpenStreetMap, © CARTO", maxZoom: 18 }).addTo(map);
      mapRef.current = map;
      if (has) setMarker([value.lat, value.lng]);
      map.on("click", (e) => {
        setMarker([e.latlng.lat, e.latlng.lng]);
        onChange({ address, lat: e.latlng.lat, lng: e.latlng.lng });
      });
    });
    return () => { cancelled = true; };
  }, []);

  const geocode = async () => {
    if (!address) return;
    setBusy(true); setErr("");
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pl&q=${encodeURIComponent(address)}`);
      const d = await r.json();
      if (d && d[0]) {
        const lat = parseFloat(d[0].lat), lng = parseFloat(d[0].lon);
        mapRef.current.setView([lat, lng], 15);
        setMarker([lat, lng]);
        onChange({ address, lat, lng });
      } else setErr(t("loc_not_found"));
    } catch { setErr(t("loc_not_found")); }
    setBusy(false);
  };

  const clear = () => {
    if (markerRef.current) { mapRef.current.removeLayer(markerRef.current); markerRef.current = null; }
    setAddress("");
    onChange({ address: "", lat: null, lng: null });
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input className="form-input" placeholder={t("loc_address")} value={address}
          onChange={e => { setAddress(e.target.value); onChange({ address: e.target.value, lat: value.lat, lng: value.lng }); }} />
        <button className="btn btn-primary" disabled={busy || !address} onClick={geocode}>
          {busy ? "…" : t("loc_find")}
        </button>
      </div>
      {err && <div className="form-error" style={{ marginBottom: 10 }}>{err}</div>}
      <div ref={elRef} className="loc-map" />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontSize: 11, color: "#555" }}>{t("loc_hint")}</span>
        {(value.lat && value.lng) ? <button className="mini-link" onClick={clear}>{t("loc_clear")}</button> : null}
      </div>
    </div>
  );
}

// ─── EDYCJA PROFILU (zalogowany artysta) ────────────────────────────────────────
function EditProfile({ artist, onSaved }) {
  const { lang, t } = useLang();
  const [form, setForm] = useState({
    name: artist.name || "", city: artist.city || "", category: artist.category || "",
    styles: artist.styles || [], bio: artist.bio || "", instagram: artist.instagram || "",
    email: artist.email || "",
    address: artist.address || "", lat: artist.lat || null, lng: artist.lng || null,
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false); };
  const setLoc = (loc) => { setForm(f => ({ ...f, ...loc })); setSaved(false); };
  const toggleStyle = (s) => update("styles",
    form.styles.includes(s) ? form.styles.filter(x => x !== s) : [...form.styles, s]);
  const availableStyles = form.category === "Tatuaż"
    ? TATTOO_STYLES : OTHER_STYLES[form.category] || [];

  const saveProfile = async () => {
    setBusy(true);
    await supabase.from("artists").update({
      name: form.name || null, city: form.city, category: form.category,
      styles: form.styles, bio: form.bio || null, instagram: form.instagram || null,
      email: form.email || null,
      address: form.address || null, lat: form.lat, lng: form.lng,
    }).eq("id", artist.id);
    setBusy(false); setSaved(true);
    onSaved();
  };

  const addPhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    setBusy(true);
    for (const file of files) {
      const path = `${artist.id}/${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const { error: upErr } = await supabase.storage.from("portfolios").upload(path, file);
      if (!upErr) {
        const url = supabase.storage.from("portfolios").getPublicUrl(path).data.publicUrl;
        await supabase.from("projects").insert({ artist_id: artist.id, title: artist.nick, img: url });
      }
    }
    setBusy(false); onSaved();
  };

  const delPhoto = async (id) => {
    setBusy(true);
    await supabase.from("projects").delete().eq("id", id);
    setBusy(false); onSaved();
  };

  const [subBusy, setSubBusy] = useState(false);
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-GB") : "";
  const hasSub = artist.stripe_subscription_id && artist.sub_status && artist.sub_status !== "canceled";
  const planLabel = artist.plan === "studio"
    ? t("plan_card_studio", { n: artist.members || 2 }) : t("plan_card_solo");
  const statusLabel = artist.sub_status === "trialing" ? t("sub_status_trialing")
    : artist.sub_status === "active" ? t("sub_status_active")
    : artist.sub_status === "canceled" ? t("sub_status_canceled") : artist.sub_status;

  const cancelSub = async () => {
    setSubBusy(true);
    try {
      const r = await fetch("/api/subscription", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", subscription_id: artist.stripe_subscription_id }),
      });
      const d = await r.json();
      if (d.subscription_id) {
        await supabase.from("artists").update({
          sub_status: d.status, sub_cancel: true,
          sub_period_end: d.period_end ? new Date(d.period_end * 1000).toISOString() : artist.sub_period_end,
        }).eq("id", artist.id);
        onSaved();
      }
    } catch { /* pomiń */ }
    setSubBusy(false);
  };

  const startSub = async () => {
    setSubBusy(true);
    try {
      const r = await fetch("/api/create-checkout-session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: artist.plan || "solo", members: artist.members || 1,
          email: artist.email, artistId: artist.id, origin: window.location.origin }),
      });
      const d = await r.json();
      if (d.url) { window.location.href = d.url; return; }
    } catch { /* pomiń */ }
    setSubBusy(false);
  };

  return (
    <div className="register">
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>{t("edit_title")}</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>{t("edit_sub")} (@{artist.nick})</p>

      <div className="reg-card">
        <div className="form-row">
          <label className="form-label">{t("l_name")}</label>
          <input className="form-input" value={form.name} onChange={e => update("name", e.target.value)} />
        </div>
        <div className="form-row">
          <label className="form-label">{t("l_city")}</label>
          <select className="form-input form-select"
            value={REGISTER_CITIES.includes(form.city) ? form.city : ""}
            onChange={e => update("city", e.target.value)}>
            <option value="">{t("city_select")}</option>
            {[...REGISTER_CITIES].sort((a, b) => a.localeCompare(b, "pl")).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input className="form-input" style={{ marginTop: 10 }} placeholder={t("city_other_ph")}
            value={REGISTER_CITIES.includes(form.city) ? "" : form.city}
            onChange={e => update("city", e.target.value)} />
        </div>
        <div className="form-row">
          <label className="form-label">{t("l_cat")}</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ALL_CATEGORIES.map(c => (
              <button key={c} onClick={() => { update("category", c); update("styles", []); }}
                className={`chip ${form.category === c ? "active" : ""}`}>{tCat(c, lang)}</button>
            ))}
          </div>
        </div>
        {availableStyles.length > 0 && (
          <div className="form-row">
            <label className="form-label">{t("l_style")}</label>
            <div className="style-picker">
              {availableStyles.map(s => (
                <button key={s} className={`style-pick-btn ${form.styles.includes(s) ? "selected" : ""}`}
                  onClick={() => toggleStyle(s)}>
                  {form.styles.includes(s) && <IconCheck />} {tStyle(s, lang)}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="form-row">
          <label className="form-label">{t("l_ig")}</label>
          <input className="form-input" value={form.instagram} onChange={e => update("instagram", e.target.value)}
            placeholder={t("ph_ig")} />
        </div>
        <div className="form-row">
          <label className="form-label">{t("l_email")}</label>
          <input className="form-input" type="email" value={form.email}
            onChange={e => update("email", e.target.value)} placeholder={t("ph_email")} />
        </div>
        <div className="form-row">
          <label className="form-label">{t("l_bio")}</label>
          <textarea className="form-input" rows={3} value={form.bio}
            onChange={e => update("bio", e.target.value)} style={{ resize: "vertical" }} />
        </div>

        <div className="form-row">
          <label className="form-label">{t("loc_title")}</label>
          <div className="form-hint" style={{ marginBottom: 12 }}>{t("loc_sub")}</div>
          <LocationPicker
            value={{ address: form.address, lat: form.lat, lng: form.lng }}
            onChange={setLoc} />
        </div>

        <div className="form-actions">
          {saved && <span style={{ color: "#4ade80", fontSize: 13, alignSelf: "center" }}>{t("saved")}</span>}
          <button className="btn btn-primary" disabled={busy} onClick={saveProfile}>{t("save")}</button>
        </div>
      </div>

      <div className="reg-card" style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 16, marginBottom: 14 }}>{t("edit_photos")}</h2>
        <div className="proj-grid">
          {(artist.projects || []).map(p => (
            <div className="proj-item" key={p.id}>
              <img src={p.img} alt="" />
              <button className="del-photo" onClick={() => delPhoto(p.id)} title={t("del")}><IconX /></button>
            </div>
          ))}
          <label className="upload-zone" style={{ aspectRatio: "1", padding: 0, display: "flex",
            alignItems: "center", justifyContent: "center", borderRadius: 12 }}>
            <input type="file" accept="image/*" multiple hidden onChange={addPhotos} />
            <span style={{ fontSize: 28, color: "#444" }}>+</span>
          </label>
        </div>
      </div>
    </div>
  );
}

// ─── PANEL ADMINA (zgłoszenia + moderacja) ──────────────────────────────────────
function AdminPanel() {
  const { t } = useLang();
  const [reports, setReports] = useState([]);
  const [arts, setArts] = useState([]);

  const load = async () => {
    const { data: r } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
    setReports(r || []);
    const { data: a } = await supabase.from("artists").select("id,nick,city,plan").order("created_at", { ascending: false });
    setArts(a || []);
  };
  useEffect(() => { load(); }, []);

  const tableFor = (type) => type === "artist" ? "artists" : type === "comment" ? "comments" : "reviews";

  const delTarget = async (rep) => {
    await supabase.from(tableFor(rep.target_type)).delete().eq("id", rep.target_id);
    await supabase.from("reports").delete().eq("id", rep.id);
    load();
  };
  const dismiss = async (id) => { await supabase.from("reports").delete().eq("id", id); load(); };
  const delArtist = async (id) => { await supabase.from("artists").delete().eq("id", id); load(); };

  return (
    <div className="explore">
      <div className="explore-title">{t("admin_title")}</div>

      <div className="section-header" style={{ margin: "20px 0 14px" }}>
        <span className="section-title">{t("admin_reports")}</span>
        <span className="section-count">{reports.length}</span>
      </div>
      {reports.length === 0 ? <div className="muted">{t("admin_no_reports")}</div> : (
        <div className="admin-list">
          {reports.map(r => (
            <div className="admin-row" key={r.id}>
              <div>
                <div className="admin-row-main">{r.target_type} · {r.reason || "—"}</div>
                <div className="admin-row-sub">{r.target_id}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => dismiss(r.id)}>{t("admin_dismiss")}</button>
                <button className="btn btn-danger" onClick={() => delTarget(r)}>{t("admin_del_content")}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="section-header" style={{ margin: "32px 0 14px" }}>
        <span className="section-title">{t("admin_artists")}</span>
        <span className="section-count">{arts.length}</span>
      </div>
      <div className="admin-list">
        {arts.map(a => (
          <div className="admin-row" key={a.id}>
            <div>
              <div className="admin-row-main">@{a.nick}</div>
              <div className="admin-row-sub">{a.city} · {a.plan}</div>
            </div>
            <button className="btn btn-danger" onClick={() => delArtist(a.id)}>{t("del")}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ULUBIENI (strona główna, obok Szukaj) ─────────────────────────────────────
function FavoritesPage({ session, artists, onArtist }) {
  const { t } = useLang();
  const [favs, setFavs] = useState([]);
  useEffect(() => {
    if (!session) { setFavs([]); return; }
    supabase.from("favorites").select("artist_id").eq("user_id", session.user.id).then(({ data }) => {
      const ids = (data || []).map(x => x.artist_id);
      setFavs(artists.filter(a => ids.includes(a.id)));
    });
  }, [session, artists]);

  return (
    <div className="explore">
      <div className="explore-title">{t("nav_fav")}</div>
      <div className="explore-sub">{t("fav_sub")}</div>
      {!session ? (
        <div className="login-hint" style={{ maxWidth: 420 }}>{t("fav_login")}</div>
      ) : favs.length === 0 ? (
        <div className="muted">{t("account_no_favs")}</div>
      ) : (
        <div className="grid" style={{ padding: 0 }}>
          {favs.map(a => <ArtistCard key={a.id} artist={a} onClick={() => onArtist(a)} />)}
        </div>
      )}
    </div>
  );
}

// ─── PANEL UŻYTKOWNIKA (zwykłe konto) ───────────────────────────────────────────
function UserAccount({ session, artists, onArtist }) {
  const { t } = useLang();
  const uid = session.user.id;
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [favs, setFavs] = useState([]);
  const [nameBusy, setNameBusy] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameErr, setNameErr] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");

  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  const load = async () => {
    const { data: p } = await supabase.from("profiles").select("display_name,avatar,bio").eq("id", uid).single();
    setName(p?.display_name || ""); setAvatar(p?.avatar || ""); setBio(p?.bio || "");
    const { data: f } = await supabase.from("favorites").select("artist_id").eq("user_id", uid);
    const ids = (f || []).map(x => x.artist_id);
    setFavs(artists.filter(a => ids.includes(a.id)));
  };
  useEffect(() => { load(); }, [artists]);

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    setNameBusy(true);
    const path = `avatars/${uid}/${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const { error } = await supabase.storage.from("portfolios").upload(path, file);
    if (!error) setAvatar(supabase.storage.from("portfolios").getPublicUrl(path).data.publicUrl);
    setNameBusy(false); setNameSaved(false);
  };

  const saveProfile = async () => {
    setNameBusy(true); setNameErr(""); setNameSaved(false);
    const clean = name.trim();
    const { data: taken } = await supabase.from("profiles")
      .select("id").ilike("display_name", clean).neq("id", uid).limit(1);
    if (taken && taken.length) { setNameBusy(false); setNameErr(t("acc_name_taken")); return; }
    await supabase.from("profiles").update({
      display_name: clean, bio: bio || null, avatar: avatar || null,
    }).eq("id", uid);
    setNameBusy(false); setNameSaved(true);
  };
  const saveEmail = async () => {
    setEmailBusy(true); setEmailMsg("");
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setEmailBusy(false);
    setEmailMsg(error ? error.message : t("acc_email_saved"));
    if (!error) setNewEmail("");
  };
  const sendResetLink = async () => {
    setPwBusy(true); setPwMsg("");
    await supabase.auth.resetPasswordForEmail(session.user.email, { redirectTo: window.location.origin });
    setPwBusy(false); setPwMsg(t("reset_sent"));
  };
  const removeFav = async (id) => {
    await supabase.from("favorites").delete().eq("user_id", uid).eq("artist_id", id);
    load();
  };

  return (
    <div className="register">
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>{t("account_title")}</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>{session.user.email}</p>

      {/* Dane konta (wizytówka) */}
      <div className="reg-card">
        <h2 style={{ fontSize: 16, marginBottom: 14 }}>{t("acc_profile")}</h2>
        <div className="form-row">
          <label className="form-label">{t("acc_photo")}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img className="profile-avatar" style={{ width: 64, height: 64 }}
              src={avatar || "https://i.pravatar.cc/150?img=12"} alt="" />
            <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
              <input type="file" accept="image/*" hidden onChange={uploadAvatar} />
              {t("acc_change_photo")}
            </label>
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">{t("l_displayname")}</label>
          <input className="form-input" value={name}
            onChange={e => { setName(e.target.value); setNameSaved(false); setNameErr(""); }} />
        </div>
        <div className="form-row">
          <label className="form-label">{t("acc_bio")}</label>
          <textarea className="form-input" rows={3} value={bio} placeholder={t("ph_bio")}
            onChange={e => { setBio(e.target.value); setNameSaved(false); }} style={{ resize: "vertical" }} />
        </div>
        {nameErr && <div className="form-error">{nameErr}</div>}
        <div className="form-actions">
          {nameSaved && <span style={{ color: "#4ade80", fontSize: 13, alignSelf: "center" }}>{t("saved")}</span>}
          <button className="btn btn-primary" disabled={nameBusy || !name.trim()} onClick={saveProfile}>{t("save")}</button>
        </div>
      </div>

      {/* Zmiana e-maila */}
      <div className="reg-card" style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 16, marginBottom: 14 }}>{t("acc_email_title")}</h2>
        <div className="form-row">
          <label className="form-label">{t("acc_current_email")}</label>
          <input className="form-input" value={session.user.email} disabled />
        </div>
        <div className="form-row">
          <label className="form-label">{t("acc_new_email")}</label>
          <input className="form-input" type="email" value={newEmail}
            onChange={e => { setNewEmail(e.target.value); setEmailMsg(""); }} placeholder={t("ph_email")} />
        </div>
        {emailMsg && <div className="form-note-ok">{emailMsg}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" disabled={emailBusy || !/\S+@\S+\.\S+/.test(newEmail)}
            onClick={saveEmail}>{t("save")}</button>
        </div>
      </div>

      {/* Zmiana hasła (link na e-mail) */}
      <div className="reg-card" style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>{t("acc_pw_title")}</h2>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 14 }}>{t("acc_pw_reset_info")}</p>
        {pwMsg && <div className="form-note-ok">{pwMsg}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" disabled={pwBusy} onClick={sendResetLink}>{t("acc_pw_send")}</button>
        </div>
      </div>

      {/* Ulubieni */}
      <div className="reg-card" style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 16, marginBottom: 14 }}>{t("account_favs")} ({favs.length})</h2>
        {favs.length === 0 ? <div className="muted">{t("account_no_favs")}</div> : (
          <div className="grid" style={{ padding: 0 }}>
            {favs.map(a => (
              <div key={a.id} style={{ position: "relative" }}>
                <ArtistCard artist={a} onClick={() => onArtist(a)} />
                <button className="del-photo" style={{ opacity: 1 }}
                  onClick={(e) => { e.stopPropagation(); removeFav(a.id); }} title={t("fav_remove")}>
                  <IconHeart fill={true} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>{t("logout")}</button>
      </div>
    </div>
  );
}

// ─── STOPKA ─────────────────────────────────────────────────────────────────────
function Footer({ onNav }) {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">UsArt</span>
        <div className="footer-links">
          <button onClick={() => onNav("terms")}>{t("footer_terms")}</button>
          <button onClick={() => onNav("privacy")}>{t("footer_privacy")}</button>
          <a href="mailto:kontakt@usart.pl">{t("footer_contact")}</a>
        </div>
        <span className="footer-copy">© {new Date().getFullYear()} UsArt · {t("footer_rights")}</span>
      </div>
    </footer>
  );
}

// ─── BANER COOKIES ───────────────────────────────────────────────────────────────
function CookieBanner({ onNav }) {
  const { t } = useLang();
  const [show, setShow] = useState(() => {
    try { return !localStorage.getItem("usart_cookies"); } catch { return true; }
  });
  if (!show) return null;
  const accept = () => { try { localStorage.setItem("usart_cookies", "1"); } catch {} setShow(false); };
  return (
    <div className="cookie-banner">
      <span>{t("cookie_text")} <button className="cookie-link" onClick={() => onNav("privacy")}>{t("footer_privacy")}</button></span>
      <button className="btn btn-primary" onClick={accept}>{t("cookie_ok")}</button>
    </div>
  );
}

// ─── STRONY PRAWNE ───────────────────────────────────────────────────────────────
function TermsPage({ onBack }) {
  const { t } = useLang();
  return (
    <div className="legal">
      <button className="profile-back" onClick={onBack}><IconBack /> {t("back")}</button>
      <h1>Regulamin serwisu UsArt</h1>
      <p className="legal-date">Obowiązuje od: [DATA]</p>

      <h3>§1. Postanowienia ogólne</h3>
      <p>1. Regulamin określa zasady korzystania z serwisu internetowego UsArt, dostępnego pod adresem usart.pl („Serwis").</p>
      <p>2. Operatorem Serwisu jest [NAZWA OPERATORA], [forma prawna / NIP], [adres], kontakt: kontakt@usart.pl.</p>
      <p>3. Serwis jest katalogiem artystów (m.in. tatuaż, malarstwo, fotografia, grafika) umożliwiającym prezentację profili i prac oraz kontakt między artystami a użytkownikami.</p>

      <h3>§2. Definicje</h3>
      <p>Użytkownik – osoba korzystająca z Serwisu. Konto – konto zakładane w Serwisie (Użytkownika lub Artysty). Artysta – Użytkownik prezentujący w Serwisie swój profil i prace.</p>

      <h3>§3. Konta i rejestracja</h3>
      <p>1. Serwis umożliwia założenie bezpłatnego konta Użytkownika (ocenianie, komentowanie, ulubione) oraz konta Artysty (profil z galerią prac).</p>
      <p>2. Rejestracja wymaga podania adresu e-mail i hasła oraz akceptacji Regulaminu i Polityki prywatności.</p>
      <p>3. Użytkownik zobowiązuje się podawać prawdziwe dane i nie udostępniać konta osobom trzecim.</p>

      <h3>§4. Zasady korzystania i treści</h3>
      <p>1. Zabronione jest zamieszczanie treści bezprawnych, obraźliwych lub naruszających prawa osób trzecich (w tym prawa autorskie) oraz dobre obyczaje.</p>
      <p>2. Artysta oświadcza, że posiada prawa do zamieszczanych prac i zdjęć.</p>
      <p>3. Operator może usuwać treści naruszające Regulamin i blokować konta. Użytkownik może zgłaszać naruszenia funkcją „Zgłoś".</p>

      <h3>§5. Płatności</h3>
      <p>1. Korzystanie z Serwisu jest bezpłatne do dnia 31 grudnia 2026 r.</p>
      <p>2. Od dnia 1 stycznia 2027 r. prowadzenie konta Artysty może podlegać opłacie abonamentowej: 49,99 zł miesięcznie za konto solo oraz – w koncie studia – 49,99 zł za pierwszego artystę i 45,00 zł za każdego kolejnego.</p>
      <p>3. O szczegółach i terminie wprowadzenia opłat Operator poinformuje z wyprzedzeniem. Konto Użytkownika pozostaje bezpłatne.</p>

      <h3>§6. Odpowiedzialność</h3>
      <p>1. Operator nie jest stroną kontaktów ani umów zawieranych między Artystami a Użytkownikami.</p>
      <p>2. Operator dokłada starań o dostępność Serwisu, lecz nie gwarantuje jego nieprzerwanego działania.</p>

      <h3>§7. Reklamacje i rozwiązanie</h3>
      <p>1. Reklamacje można składać na adres kontakt@usart.pl; będą rozpatrywane w terminie 14 dni.</p>
      <p>2. Użytkownik może w każdej chwili zrezygnować i zażądać usunięcia konta, kontaktując się pod kontakt@usart.pl.</p>

      <h3>§8. Postanowienia końcowe</h3>
      <p>1. Operator może zmienić Regulamin z ważnych przyczyn, informując Użytkowników. 2. W sprawach nieuregulowanych stosuje się prawo polskie.</p>

      <p className="legal-note">Dokument jest wzorem — przed publikacją wymaga weryfikacji przez prawnika i uzupełnienia danych w nawiasach […].</p>
    </div>
  );
}

function PrivacyPage({ onBack }) {
  const { t } = useLang();
  return (
    <div className="legal">
      <button className="profile-back" onClick={onBack}><IconBack /> {t("back")}</button>
      <h1>Polityka prywatności UsArt</h1>
      <p className="legal-date">Obowiązuje od: [DATA]</p>

      <h3>1. Administrator danych</h3>
      <p>Administratorem danych osobowych jest [NAZWA OPERATORA], [adres], kontakt: kontakt@usart.pl.</p>

      <h3>2. Jakie dane przetwarzamy</h3>
      <p>Adres e-mail, hasło (w formie zaszyfrowanej), nazwę/nick, miasto, dane profilu artysty (opis, Instagram, zdjęcia prac), opcjonalnie adres i lokalizację studia oraz treści tworzone w Serwisie (oceny, komentarze, polubienia, ulubione).</p>

      <h3>3. Cele i podstawy prawne (RODO art. 6)</h3>
      <p>Świadczenie usługi i prowadzenie konta – art. 6 ust. 1 lit. b (wykonanie umowy). Kontakt i obsługa reklamacji – lit. f (uzasadniony interes). Rozliczenie płatności (po ich uruchomieniu) – lit. b i c.</p>

      <h3>4. Odbiorcy danych</h3>
      <p>Dostawcy usług przetwarzający dane w naszym imieniu: Supabase (baza danych i uwierzytelnianie), Vercel (hosting), a po uruchomieniu płatności – Stripe. Dane mogą być przetwarzane na serwerach w UE.</p>

      <h3>5. Okres przechowywania</h3>
      <p>Dane przechowujemy do czasu usunięcia konta lub ustania celu przetwarzania, a następnie przez okres wymagany przepisami (np. rozliczenia).</p>

      <h3>6. Twoje prawa</h3>
      <p>Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu, a także skargi do Prezesa Urzędu Ochrony Danych Osobowych (PUODO).</p>

      <h3>7. Pliki cookie</h3>
      <p>Używamy plików cookie niezbędnych do działania Serwisu (logowanie, ustawienia języka). Nie używamy cookie marketingowych; w razie ich wprowadzenia zaktualizujemy Politykę i poprosimy o zgodę.</p>

      <h3>8. Kontakt</h3>
      <p>W sprawach danych osobowych: kontakt@usart.pl.</p>

      <p className="legal-note">Dokument jest wzorem — przed publikacją wymaga weryfikacji przez prawnika i uzupełnienia danych w nawiasach […].</p>
    </div>
  );
}

// Ścieżki URL dla zakładek (profile artystów: /nick)
const TAB_PATHS = { search: "/", favorites: "/ulubione", works: "/prace",
  map: "/mapa", register: "/dolacz", account: "/konto", admin: "/admin",
  terms: "/regulamin", privacy: "/polityka-prywatnosci" };
const PATH_TABS = Object.fromEntries(Object.entries(TAB_PATHS).map(([t, p]) => [p, t]));

// ─── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("search");           // "search" | "explore" | "register"
  const [profileArtist, setProfileArtist] = useState(null);
  const [dbArtists, setDbArtists] = useState([]);
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [myRole, setMyRole] = useState(null);
  const [payMsg, setPayMsg] = useState(null);
  const [pendingSid, setPendingSid] = useState(null);
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

  const artistsRef = useRef([]);
  const [pendingNick, setPendingNick] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadArtists = async () => {
    try {
      const { data, error } = await supabase.from("artists").select("*, projects(*)");
      if (!error && data) setDbArtists(data.map(fromDb));
    } catch { /* zostaw dane przykładowe */ }
    setDataLoaded(true);
  };

  useEffect(() => {
    loadArtists();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Routing po adresie URL (np. usart.pl/marta.ink) + przycisk "wstecz"
  useEffect(() => {
    const p = decodeURIComponent(window.location.pathname);
    const isNick = p.length > 1 && !PATH_TABS[p];
    setTab(PATH_TABS[p] || "search");
    if (isNick) setPendingNick(p.slice(1));
    window.history.replaceState({ tab: PATH_TABS[p] || "search", nick: isNick ? p.slice(1) : null }, "", p);

    const onPop = (e) => {
      const st = e.state || {};
      setTab(st.tab || "search");
      window.scrollTo(0, 0);
      if (st.nick) {
        const a = artistsRef.current.find(x => x.nick === st.nick);
        if (a) setProfileArtist(a); else { setProfileArtist(null); setPendingNick(st.nick); }
      } else setProfileArtist(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Prawdziwi artyści z bazy + przykładowi (żeby katalog nie był pusty na start)
  const artists = [...dbArtists, ...ARTISTS];
  artistsRef.current = artists;
  const myArtist = session ? dbArtists.find(a => a.id === session.user.id) : null;

  // Rola zalogowanego użytkownika (do panelu admina)
  useEffect(() => {
    if (!session) { setMyRole(null); return; }
    supabase.from("profiles").select("role").eq("id", session.user.id).single()
      .then(({ data }) => setMyRole(data?.role || "user"));
  }, [session]);

  // Rozwiązanie /nick na profil, gdy dane się załadują
  useEffect(() => {
    if (!pendingNick) return;
    const a = artists.find(x => x.nick === pendingNick);
    if (a) { setProfileArtist(a); setPendingNick(null); }
    else if (dataLoaded) setPendingNick(null);
  }, [pendingNick, dataLoaded, dbArtists]);

  // Tytuł karty przeglądarki (udostępnianie / SEO)
  useEffect(() => {
    document.title = profileArtist ? `@${profileArtist.nick} · UsArt` : "UsArt — znajdź artystę";
  }, [profileArtist]);

  // Wynik płatności po powrocie ze Stripe (?platnosc=ok&sid=... / anulowano)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("platnosc");
    const sid = params.get("sid");
    if (p === "ok") setPayMsg("ok");
    else if (p === "anulowano") setPayMsg("cancel");
    if (sid) setPendingSid(sid);
    if (p) window.history.replaceState({ tab: "search", nick: null }, "", "/");
  }, []);

  // Zapis danych subskrypcji po powrocie ze Stripe (do wiersza zalogowanego artysty)
  useEffect(() => {
    if (!pendingSid || !session) return;
    const ts = (x) => (x ? new Date(x * 1000).toISOString() : null);
    (async () => {
      try {
        const r = await fetch("/api/subscription", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "sync", session_id: pendingSid }),
        });
        const d = await r.json();
        if (d.subscription_id) {
          await supabase.from("artists").update({
            stripe_customer_id: d.customer, stripe_subscription_id: d.subscription_id,
            sub_status: d.status, sub_start: ts(d.start), sub_period_end: ts(d.period_end),
            sub_trial_end: ts(d.trial_end), sub_cancel: d.cancel_at_period_end,
          }).eq("id", session.user.id);
          loadArtists();
        }
      } catch { /* pomiń */ }
      setPendingSid(null);
    })();
  }, [pendingSid, session]);

  const go = (next, push = true) => {
    setTab(next.tab);
    setProfileArtist(next.artist || null);
    window.scrollTo(0, 0);
    const url = next.artist ? "/" + next.artist.nick : (TAB_PATHS[next.tab] || "/");
    const state = { tab: next.tab, nick: next.artist ? next.artist.nick : null };
    if (push) window.history.pushState(state, "", url);
  };

  const openArtist = (a) => go({ tab, artist: a });
  const closeArtist = () => window.history.back();

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <span className="nav-logo" onClick={() => go({ tab: "search" })}>
            UsArt
          </span>
          <div className="nav-tabs">
            <button className={`nav-tab ${tab === "search" && !profileArtist ? "active" : ""}`}
              onClick={() => go({ tab: "search" })}>
              <IconSearch /> {t("nav_search")}
            </button>
            <button className={`nav-tab ${tab === "favorites" && !profileArtist ? "active" : ""}`}
              onClick={() => go({ tab: "favorites" })}>
              <IconHeart /> {t("nav_fav")}
            </button>
            <button className={`nav-tab ${tab === "works" && !profileArtist ? "active" : ""}`}
              onClick={() => go({ tab: "works" })}>
              <IconGrid /> {t("nav_works")}
            </button>
            <button className={`nav-tab ${tab === "map" && !profileArtist ? "active" : ""}`}
              onClick={() => go({ tab: "map" })}>
              <IconPin /> {t("nav_map")}
            </button>
          </div>
          <div className="nav-right">
            <div className="lang-switch">
              <button className={lang === "pl" ? "active" : ""} onClick={() => setLang("pl")}>PL</button>
              <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
            </div>
            {session ? (
              <div className="nav-user">
                {myRole === "admin" && (
                  <button className="btn btn-ghost" onClick={() => go({ tab: "admin" })}>
                    {t("nav_admin")}
                  </button>
                )}
                <button className="btn btn-ghost" onClick={() => go({ tab: "account" })}>
                  {t("nav_account")}
                </button>
                <button className="btn btn-ghost" onClick={() => { supabase.auth.signOut(); go({ tab: "search" }); }}>
                  {t("logout")}
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-ghost nav-action" onClick={() => setShowLogin(true)}>
                  {t("login")}
                </button>
                <button className="btn btn-primary nav-action" onClick={() => go({ tab: "register" })}>
                  {t("join")}
                </button>
              </>
            )}
          </div>
        </nav>

        {payMsg && (
          <div className={`pay-banner ${payMsg === "ok" ? "ok" : "cancel"}`}>
            <span>{payMsg === "ok" ? t("pay_ok") : t("pay_cancel")}</span>
            <button onClick={() => setPayMsg(null)}><IconX /></button>
          </div>
        )}

        {profileArtist ? (
          <ArtistProfile artist={profileArtist} onBack={closeArtist} session={session} />
        ) : tab === "search" ? (
          <SearchPage onArtist={openArtist} artists={artists} />
        ) : tab === "favorites" ? (
          <FavoritesPage session={session} onArtist={openArtist} artists={artists} />
        ) : tab === "works" ? (
          <WorksFeed onArtist={openArtist} artists={artists} />
        ) : tab === "map" ? (
          <MapView onArtist={openArtist} artists={artists} />
        ) : tab === "register" ? (
          <Register
            onBack={() => window.history.back()}
            onDone={() => { loadArtists(); go({ tab: "search" }); }}
          />
        ) : tab === "account" ? (
          myArtist
            ? <EditProfile artist={myArtist} onSaved={loadArtists} />
            : session
              ? <UserAccount session={session} artists={artists} onArtist={openArtist} />
              : <div className="empty" style={{ padding: "72px 24px" }}><h3>{t("no_profile")}</h3></div>
        ) : tab === "admin" ? (
          myRole === "admin" ? <AdminPanel /> : <div className="empty" style={{ padding: "72px 24px" }}><h3>—</h3></div>
        ) : tab === "terms" ? (
          <TermsPage onBack={() => window.history.back()} />
        ) : tab === "privacy" ? (
          <PrivacyPage onBack={() => window.history.back()} />
        ) : null}

        <Footer onNav={(tb) => go({ tab: tb })} />

        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        {recovery && <ResetPasswordModal onClose={() => setRecovery(false)} />}
        <CookieBanner onNav={(tb) => go({ tab: tb })} />
      </div>
    </LangContext.Provider>
  );
}
