import { useAppStore } from '@/store/useAppStore';
import type { Language } from '@/types';

type TranslationKey =
  | 'nav.explore' | 'nav.districts' | 'nav.map' | 'nav.tripPlanner' | 'nav.hiddenGems' | 'nav.favorites' | 'nav.nearby'
  | 'mobile.home' | 'mobile.explore' | 'mobile.map' | 'mobile.trips' | 'mobile.saved'
  | 'common.search' | 'common.searchDestinations' | 'common.viewAll' | 'common.destinations' | 'common.filters'
  | 'home.badge' | 'home.titleStart' | 'home.titleAccent' | 'home.description' | 'home.exploreSriLanka' | 'home.exploreNearMe' | 'home.planTrip'
  | 'home.districts' | 'home.provinces' | 'home.featured' | 'home.mustVisit' | 'home.categories' | 'home.whatLookingFor'
  | 'explore.title' | 'explore.subtitle' | 'explore.showing' | 'explore.of'
  | 'language.select';

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    'nav.explore': 'Explore', 'nav.districts': 'Districts', 'nav.map': 'Map', 'nav.tripPlanner': 'Trip Planner', 'nav.hiddenGems': 'Hidden Gems', 'nav.favorites': 'Favorites', 'nav.nearby': 'Explore Near Me',
    'mobile.home': 'Home', 'mobile.explore': 'Explore', 'mobile.map': 'Map', 'mobile.trips': 'Trips', 'mobile.saved': 'Saved',
    'common.search': 'Search', 'common.searchDestinations': 'Search destinations, districts, categories...', 'common.viewAll': 'View All', 'common.destinations': 'destinations', 'common.filters': 'Filters',
    'home.badge': 'Discover Sri Lanka', 'home.titleStart': 'Travel deeper.', 'home.titleAccent': 'Feel Sri Lanka.', 'home.description': 'Discover beaches, mountains, waterfalls, wildlife, culture, hidden gems and unforgettable places across all 25 districts.', 'home.exploreSriLanka': 'Explore Sri Lanka', 'home.exploreNearMe': 'Explore Near Me', 'home.planTrip': 'Plan a Trip',
    'home.districts': 'Districts', 'home.provinces': 'Provinces', 'home.featured': 'Featured', 'home.mustVisit': 'Must-Visit Places', 'home.categories': 'Categories', 'home.whatLookingFor': 'What Are You Looking For?',
    'explore.title': 'Explore Destinations', 'explore.subtitle': 'destinations across all 25 districts of Sri Lanka', 'explore.showing': 'Showing', 'explore.of': 'of', 'language.select': 'Select language',
  },
  si: {
    'nav.explore': 'ගවේෂණය', 'nav.districts': 'දිස්ත්‍රික්ක', 'nav.map': 'සිතියම', 'nav.tripPlanner': 'සංචාර සැලසුම', 'nav.hiddenGems': 'සැඟවුණු මැණික්', 'nav.favorites': 'ප්‍රියතම', 'nav.nearby': 'මා අසල ගවේෂණය',
    'mobile.home': 'මුල් පිටුව', 'mobile.explore': 'ගවේෂණය', 'mobile.map': 'සිතියම', 'mobile.trips': 'සංචාර', 'mobile.saved': 'සුරැකි',
    'common.search': 'සොයන්න', 'common.searchDestinations': 'ගමනාන්ත, දිස්ත්‍රික්ක, කාණ්ඩ සොයන්න...', 'common.viewAll': 'සියල්ල බලන්න', 'common.destinations': 'ගමනාන්ත', 'common.filters': 'පෙරහන්',
    'home.badge': 'ශ්‍රී ලංකාව සොයන්න', 'home.titleStart': 'ගැඹුරින් සංචාරය කරන්න.', 'home.titleAccent': 'ශ්‍රී ලංකාව විඳින්න.', 'home.description': 'දිස්ත්‍රික්ක 25 පුරා ඇති වෙරළ, කඳු, දිය ඇලි, වනජීවී, සංස්කෘතිය සහ සැඟවුණු සුන්දර ස්ථාන සොයා බලන්න.', 'home.exploreSriLanka': 'ශ්‍රී ලංකාව ගවේෂණය', 'home.exploreNearMe': 'මා අසල ගවේෂණය', 'home.planTrip': 'සංචාරයක් සැලසුම් කරන්න',
    'home.districts': 'දිස්ත්‍රික්ක', 'home.provinces': 'පළාත්', 'home.featured': 'විශේෂිත', 'home.mustVisit': 'නැරඹිය යුතු ස්ථාන', 'home.categories': 'කාණ්ඩ', 'home.whatLookingFor': 'ඔබ සොයන්නේ කුමක්ද?',
    'explore.title': 'ගමනාන්ත ගවේෂණය', 'explore.subtitle': 'ශ්‍රී ලංකාවේ දිස්ත්‍රික්ක 25 පුරා ගමනාන්ත', 'explore.showing': 'පෙන්වන්නේ', 'explore.of': 'න්', 'language.select': 'භාෂාව තෝරන්න',
  },
  ta: {
    'nav.explore': 'ஆராய்க', 'nav.districts': 'மாவட்டங்கள்', 'nav.map': 'வரைபடம்', 'nav.tripPlanner': 'பயண திட்டம்', 'nav.hiddenGems': 'மறைந்த இடங்கள்', 'nav.favorites': 'விருப்பங்கள்', 'nav.nearby': 'அருகிலுள்ள இடங்கள்',
    'mobile.home': 'முகப்பு', 'mobile.explore': 'ஆராய்க', 'mobile.map': 'வரைபடம்', 'mobile.trips': 'பயணங்கள்', 'mobile.saved': 'சேமித்தவை',
    'common.search': 'தேடு', 'common.searchDestinations': 'இடங்கள், மாவட்டங்கள், வகைகளைத் தேடுங்கள்...', 'common.viewAll': 'அனைத்தையும் காண்க', 'common.destinations': 'இடங்கள்', 'common.filters': 'வடிகட்டிகள்',
    'home.badge': 'இலங்கையைக் கண்டறியுங்கள்', 'home.titleStart': 'ஆழமாகப் பயணியுங்கள்.', 'home.titleAccent': 'இலங்கையை உணருங்கள்.', 'home.description': '25 மாவட்டங்களிலும் உள்ள கடற்கரைகள், மலைகள், நீர்வீழ்ச்சிகள், வனவிலங்கு, கலாசாரம் மற்றும் மறைந்த அழகிய இடங்களைக் கண்டறியுங்கள்.', 'home.exploreSriLanka': 'இலங்கையை ஆராய்க', 'home.exploreNearMe': 'என் அருகில் ஆராய்க', 'home.planTrip': 'பயணத்தைத் திட்டமிடுக',
    'home.districts': 'மாவட்டங்கள்', 'home.provinces': 'மாகாணங்கள்', 'home.featured': 'சிறப்புப் பரிந்துரைகள்', 'home.mustVisit': 'கண்டிப்பாகப் பார்க்க வேண்டிய இடங்கள்', 'home.categories': 'வகைகள்', 'home.whatLookingFor': 'நீங்கள் எதைத் தேடுகிறீர்கள்?',
    'explore.title': 'இடங்களை ஆராய்க', 'explore.subtitle': 'இலங்கையின் 25 மாவட்டங்களிலும் உள்ள இடங்கள்', 'explore.showing': 'காண்பிப்பது', 'explore.of': 'இல்', 'language.select': 'மொழியைத் தேர்ந்தெடுக்கவும்',
  },
};

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  return {
    language,
    t: (key: TranslationKey) => translations[language][key],
  };
}
