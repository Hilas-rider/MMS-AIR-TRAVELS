import { TourPackage } from '../types';

export const INDIA_TOURS: TourPackage[] = [
  {
    id: 'ind-andaman-5d4n',
    title: 'Exotic Andaman Islands & Havelock Island',
    category: 'India',
    destination: 'Port Blair, Havelock Island, Neil Island',
    stateOrCountry: 'Andaman and Nicobar Islands',
    duration: '5 Days / 4 Nights',
    priceINR: 24500,
    priceUSD: 295,
    imageUrl: 'https://images.unsplash.com/photo-1589330273594-fade1ee91647?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Radhanagar Beach Sunset', 'Cellular Jail Light & Sound', 'Elephant Beach Scuba & Snorkel', 'Private Catamaran Cruise'],
    inclusions: ['4-Star Beach Resorts', 'Daily Breakfast & Dinner', 'Inter-island Speedboat', 'Airport Pickup & Drop'],
    itinerary: [
      { day: 1, title: 'Arrival in Port Blair', desc: 'Hotel check-in, Cellular Jail visit with light and sound show.' },
      { day: 2, title: 'Ferry to Havelock Island', desc: 'Visit Asia’s best beach: Radhanagar Beach for spectacular sunset.' },
      { day: 3, title: 'Elephant Beach Snorkeling', desc: 'Speed boat ride and water sports adventures.' },
      { day: 4, title: 'Neil Island Exploration', desc: 'Natural Coral Bridge, Laxmanpur Beach, and cruise return.' },
      { day: 5, title: 'Port Blair Departure', desc: 'Local souvenir shopping and airport transfer.' }
    ]
  },
  {
    id: 'ind-goa-4d3n',
    title: 'Vibrant Goa Beach & Heritage Getaway',
    category: 'India',
    destination: 'North & South Goa, Panjim',
    stateOrCountry: 'Goa',
    duration: '4 Days / 3 Nights',
    priceINR: 14900,
    priceUSD: 180,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    highlights: ['Basilica of Bom Jesus', 'Baga & Calangute Water Sports', 'Mandovi River Sunset Cruise', 'Old Portuguese Latin Quarter'],
    inclusions: ['Luxury Boutique Resort with Pool', 'Daily Breakfast', 'Private AC Vehicle Sightseeing', 'Mandovi Cruise Tickets'],
    itinerary: [
      { day: 1, title: 'Welcome to Goa', desc: 'Arrival transfer, evening stroll at Calangute beach.' },
      { day: 2, title: 'North Goa Coastal Explorer', desc: 'Fort Aguada, Anjuna flea market, Baga water adventure.' },
      { day: 3, title: 'South Goa & Latin Quarters', desc: 'UNESCO Heritage Churches, Fontainhas walk, and River Cruise.' },
      { day: 4, title: 'Leisure & Departure', desc: 'Duty-free shopping and flight departure.' }
    ]
  },
  {
    id: 'ind-kashmir-6d5n',
    title: 'Heaven on Earth: Kashmir & Dal Lake Paradise',
    category: 'India',
    destination: 'Srinagar, Gulmarg, Pahalgam, Sonamarg',
    stateOrCountry: 'Jammu and Kashmir',
    duration: '6 Days / 5 Nights',
    priceINR: 28900,
    priceUSD: 350,
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Luxury Houseboat Stay on Dal Lake', 'Shikara Sunset Ride', 'Gulmarg Gondola World’s 2nd Highest Cable Car', 'Betaab Valley in Pahalgam'],
    inclusions: ['Houseboat + Deluxe Hotels', 'Breakfast & Dinner', 'Private Mughal Gardens Pass', 'Chauffeured Vehicle'],
    itinerary: [
      { day: 1, title: 'Srinagar Arrival & Shikara', desc: 'Mughal Gardens Nishat & Shalimar Bagh, romantic Shikara ride.' },
      { day: 2, title: 'Gulmarg Gondola Ride', desc: 'Snow peaks, highest golf course, cable car to Apharwat peak.' },
      { day: 3, title: 'Pahalgam Valley of Shepherds', desc: 'Enroute saffron fields and Awantipora ruins.' },
      { day: 4, title: 'Betaab & Aru Valley', desc: 'Lidder river side relaxation and pony ride in Baisaran meadow.' },
      { day: 5, title: 'Sonamarg Meadow of Gold', desc: 'Thajiwas Glacier trek and trout fishing streams.' },
      { day: 6, title: 'Srinagar Departure', desc: 'Kashmiri handicrafts shopping and airport drop.' }
    ]
  },
  {
    id: 'ind-himachal-6d5n',
    title: 'Scenic Himachal: Shimla, Kullu & Manali Wonders',
    category: 'India',
    destination: 'Shimla, Kullu Valley, Manali, Solang Valley',
    stateOrCountry: 'Himachal Pradesh',
    duration: '6 Days / 5 Nights',
    priceINR: 21500,
    priceUSD: 260,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    highlights: ['Mall Road & Jakhoo Temple', 'Solang Valley Paragliding', 'Atal Tunnel & Rohtang Pass', 'Hadimba Temple in Pine Forests'],
    inclusions: ['4-Star Mountain View Resorts', 'MAP Plan (Breakfast + Dinner)', 'Private Tour Guide', 'All Tolls & Permits'],
    itinerary: [
      { day: 1, title: 'Delhi/Chandigarh to Shimla', desc: 'Scenic mountain ascent, evening walk on Shimla Ridge.' },
      { day: 2, title: 'Kufri & Chail Excursion', desc: 'Himalayan National Park, horse riding in Kufri.' },
      { day: 3, title: 'Shimla to Manali via Kullu', desc: 'River rafting in Beas River, Kullu shawl factories.' },
      { day: 4, title: 'Solang Valley Adventure', desc: 'Snow activities, paragliding, zorbing and Atal Tunnel.' },
      { day: 5, title: 'Old Manali & Vashisht Hot Springs', desc: 'Hadimba forest temple and quaint cafes.' },
      { day: 6, title: 'Departure with Sweet Memories', desc: 'Scenic drive back to airport/station.' }
    ]
  },
  {
    id: 'ind-karnataka-coorg-4d3n',
    title: 'Scotland of India: Coorg, Mysuru & Bengaluru',
    category: 'India',
    destination: 'Bengaluru, Mysore Palace, Coorg Coffee Estates',
    stateOrCountry: 'Karnataka',
    duration: '4 Days / 3 Nights',
    priceINR: 16500,
    priceUSD: 200,
    imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    highlights: ['Abbey Falls & Raja’s Seat', 'Golden Temple Tibetan Monastery (Bylakuppe)', 'Private Coffee Plantation Safari', 'Mysore Palace Illumination'],
    inclusions: ['Eco Heritage Cottage Stay', 'Breakfast Daily', 'Plantation Tour with Coffee Tasting', 'AC Sedan Transport'],
    itinerary: [
      { day: 1, title: 'Bengaluru to Coorg', desc: 'Stop at Bylakuppe Tibetan Monastery, check-in to coffee resort.' },
      { day: 2, title: 'Coorg Natural Wonders', desc: 'Dubare Elephant Camp, Talacauvery source of Kaveri river.' },
      { day: 3, title: 'Coorg to Mysore', desc: 'Grand Mysore Palace, Chamundi Hills, Brindavan Garden musical fountain.' },
      { day: 4, title: 'Bengaluru Departure', desc: 'Silk and sandalwood shopping, drop at Bengaluru Airport.' }
    ]
  },
  {
    id: 'ind-sikkim-5d4n',
    title: 'Majestic Gangtok, Darjeeling & Kanchenjunga',
    category: 'India',
    destination: 'Gangtok, Tsomgo Lake, Darjeeling Tea Gardens',
    stateOrCountry: 'Sikkim & West Bengal',
    duration: '5 Days / 4 Nights',
    priceINR: 23800,
    priceUSD: 285,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    highlights: ['Tiger Hill Sunrise over Mt. Kanchenjunga', 'UNESCO Darjeeling Himalayan Toy Train', 'Sacred Tsomgo Glacial Lake (12,400 ft)', 'Rumtek Tibetan Monastery'],
    inclusions: ['Boutique Mountain Hotels', 'All Meals (Breakfast & Dinner)', 'Restricted Area Inner Line Permits', 'Private 4x4 Vehicle'],
    itinerary: [
      { day: 1, title: 'Bagdogra to Gangtok', desc: 'Drive alongside Teesta river, evening MG Marg stroll.' },
      { day: 2, title: 'Tsomgo Lake & Baba Mandir', desc: 'High altitude glacial lake and snow scenery.' },
      { day: 3, title: 'Gangtok to Darjeeling', desc: 'Rumtek Monastery, tea factory visit, Happy Valley.' },
      { day: 4, title: 'Tiger Hill Dawn & Toy Train', desc: 'Golden sunrise on Everest & Kanchenjunga, Himalayan Mountaineering Institute.' },
      { day: 5, title: 'Drop at Bagdogra Airport', desc: 'Scenic descent and flight departure.' }
    ]
  },
  {
    id: 'ind-kerala-5d4n',
    title: 'God’s Own Country: Munnar Hills & Alleppey Backwaters',
    category: 'India',
    destination: 'Cochin, Munnar, Thekkady, Alleppey',
    stateOrCountry: 'Kerala',
    duration: '5 Days / 4 Nights',
    priceINR: 21900,
    priceUSD: 265,
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Traditional Houseboat Cruise in Vembanad Lake', 'Tea Gardens & Eravikulam National Park', 'Periyar Wildlife Sanctuary Boating', 'Kathakali Dance & Kalaripayattu Show'],
    inclusions: ['Private Houseboat with all meals', 'Resorts with hill views', 'Chauffeured AC car throughout', 'Spice plantation tour'],
    itinerary: [
      { day: 1, title: 'Cochin to Munnar', desc: 'Cheeyappara waterfalls and tea museum.' },
      { day: 2, title: 'Munnar Sightseeing', desc: 'Mattupetty Dam, Echo Point, and Anamudi peak view.' },
      { day: 3, title: 'Thekkady Spices & Wildlife', desc: 'Periyar lake boat safari and elephant sanctuary.' },
      { day: 4, title: 'Alleppey Houseboat Stay', desc: 'Serene backwater cruising with authentic Kerala Sadhya lunch.' },
      { day: 5, title: 'Cochin Departure', desc: 'Fort Kochi Chinese fishing nets and airport drop.' }
    ]
  },
  {
    id: 'ind-rajasthan-6d5n',
    title: 'Royal Heritage: Jaipur, Jodhpur & Udaipur Palaces',
    category: 'India',
    destination: 'Jaipur, Jodhpur, Udaipur',
    stateOrCountry: 'Rajasthan',
    duration: '6 Days / 5 Nights',
    priceINR: 29500,
    priceUSD: 355,
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    highlights: ['Amber Fort Elephant / Jeep Ascent', 'Mehrangarh Fort in Blue City Jodhpur', 'Lake Pichola Sunset Boat Ride at Udaipur City Palace', 'Chokhi Dhani Rajasthani Cultural Dinner'],
    inclusions: ['Heritage Haveli & Palatial Stays', 'Daily Breakfast & 2 Folk Dinners', 'Monument Entry Passes', 'Dedicated Chauffeur Guide'],
    itinerary: [
      { day: 1, title: 'Arrival in Pink City Jaipur', desc: 'Hawa Mahal, City Palace, and Jantar Mantar.' },
      { day: 2, title: 'Amber Fort & Nahargarh', desc: 'Sheesh Mahal mirror palace and panoramic sunset.' },
      { day: 3, title: 'Jaipur to Jodhpur', desc: 'En route Pushkar Brahma Temple, evening clock tower market.' },
      { day: 4, title: 'Mehrangarh to Lake City Udaipur', desc: 'Ranakpur Jain temple carved pillars.' },
      { day: 5, title: 'Udaipur Palaces & Lake Pichola', desc: 'City Palace, Jagdish temple, and romantic lake cruise.' },
      { day: 6, title: 'Udaipur Departure', desc: 'Local handicrafts shopping and airport drop.' }
    ]
  }
];

export const INTERNATIONAL_TOURS: TourPackage[] = [
  {
    id: 'int-thailand-5d4n',
    title: '5D/4N Amazing Thailand: Bangkok & Pattaya Fiesta',
    category: 'International',
    destination: 'Bangkok, Pattaya, Coral Island',
    stateOrCountry: 'Thailand',
    duration: '5 Days / 4 Nights',
    priceINR: 19800,
    priceUSD: 240,
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Coral Island Speedboat with Seafood Lunch', 'Alcazar World Famous Cabaret Show', 'Chao Phraya Luxury Dinner Cruise', 'Wat Pho Reclining Buddha & Golden Temple'],
    inclusions: ['4-Star Central Hotels', 'Breakfast + Coral Island Lunch + Dinner Cruise', 'Speedboat transfers', 'Free Visa on Arrival Support'],
    itinerary: [
      { day: 1, title: 'Bangkok to Pattaya', desc: 'Airport welcome, drive to Pattaya seaside, Alcazar Show VIP seat.' },
      { day: 2, title: 'Coral Island Adventure', desc: 'Speedboat, parasailing, sea-walking, crystal clear beaches.' },
      { day: 3, title: 'Pattaya to Bangkok', desc: 'Gems Gallery, Golden & Marble Temples, evening Chao Phraya cruise.' },
      { day: 4, title: 'Safari World & Marine Park', desc: 'Wild animals safari and dolphin shows, evening Chatuchak / MBK shopping.' },
      { day: 5, title: 'Suvarnabhumi Airport Departure', desc: 'Final Thai souvenirs and flight back home.' }
    ]
  },
  {
    id: 'int-singapore-5d4n',
    title: 'Glamorous Singapore & Sentosa Island Fantasy',
    category: 'International',
    destination: 'Singapore City, Marina Bay, Sentosa Island',
    stateOrCountry: 'Singapore',
    duration: '5 Days / 4 Nights',
    priceINR: 42500,
    priceUSD: 510,
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Universal Studios Singapore All-Day Pass', 'Gardens by the Bay Cloud Forest & Flower Dome', 'Marina Bay Sands SkyPark Observation Deck', 'Night Safari Tram Ride'],
    inclusions: ['4-Star Orchard / Bugis Hotel', 'Daily Buffet Breakfast', 'All Attraction Entry Tickets', 'Return Airport Transfers'],
    itinerary: [
      { day: 1, title: 'Welcome to the Lion City', desc: 'Arrival at Changi, evening Night Safari tram experience.' },
      { day: 2, title: 'City Tour & Sentosa Thrills', desc: 'Merlion Park, Cable Car, Madame Tussauds, Wings of Time laser show.' },
      { day: 3, title: 'Universal Studios Singapore', desc: 'Full day adrenaline at Sci-Fi City, Ancient Egypt, and Jurassic Park.' },
      { day: 4, title: 'Gardens by the Bay & SkyPark', desc: 'Supertrees light show and Marina Bay Sands observatory.' },
      { day: 5, title: 'Jewel Changi Rain Vortex & Flight', desc: 'Vortex waterfall photos and flight departure.' }
    ]
  },
  {
    id: 'int-dubai-5d4n',
    title: 'Dazzling Dubai & Abu Dhabi Grand Experience',
    category: 'International',
    destination: 'Dubai Marina, Burj Khalifa, Abu Dhabi',
    stateOrCountry: 'United Arab Emirates',
    duration: '5 Days / 4 Nights',
    priceINR: 34900,
    priceUSD: 420,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Burj Khalifa 124th Floor Observation', 'Red Dunes Desert Safari with BBQ & Belly Dance', 'Abu Dhabi Sheikh Zayed Grand Mosque', 'Dubai Marina Dhow Dinner Cruise'],
    inclusions: ['4-Star City Hotel with Rooftop Pool', 'Breakfast Daily + Desert BBQ Dinner', '4x4 Land Cruiser Dune Bashing', 'UAE Tourist Visa Included'],
    itinerary: [
      { day: 1, title: 'Arrival in Dubai & Marina Cruise', desc: 'Private transfer to hotel, evening 5-star Marina Dhow Dinner.' },
      { day: 2, title: 'Dubai Modern Wonders', desc: 'Dubai Frame, Museum of the Future photo stop, Burj Khalifa 124th floor.' },
      { day: 3, title: 'Desert Safari Extravaganza', desc: 'Dune bashing, camel riding, sandboarding, tanoura show and BBQ dinner.' },
      { day: 4, title: 'Abu Dhabi Cultural Day', desc: 'Sheikh Zayed Mosque, Emirates Palace, Ferrari World photo stop.' },
      { day: 5, title: 'Gold Souk & Airport Departure', desc: 'Deira gold and spice shopping, transfer to DXB Airport.' }
    ]
  },
  {
    id: 'int-bali-6d5n',
    title: 'Enchanting Bali: Ubud Rainforest & Kuta Beaches',
    category: 'International',
    destination: 'Ubud, Kuta, Nusa Penida Island, Tanah Lot',
    stateOrCountry: 'Indonesia',
    duration: '6 Days / 5 Nights',
    priceINR: 27900,
    priceUSD: 335,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    highlights: ['Nusa Penida Kelingking T-Rex Cliff Tour', 'Ubud Jungle Swing & Tegallalang Rice Terraces', 'Tanah Lot Sunset Sea Temple', 'Mount Batur Sunrise or Jimbaran Bay Seafood Dinner'],
    inclusions: ['Private Pool Villa in Ubud + 4-Star Beach Resort', 'Daily Floating / Buffet Breakfast', 'Fast Boat to Nusa Penida', 'English Speaking Guide'],
    itinerary: [
      { day: 1, title: 'Arrival in Bali', desc: 'Traditional flower garland welcome, transfer to Kuta resort.' },
      { day: 2, title: 'Nusa Penida Island Expedition', desc: 'Fast boat, Broken Beach, Angel’s Billabong, Kelingking Cliff.' },
      { day: 3, title: 'Ubud Cultural Heart', desc: 'Sacred Monkey Forest, Bali Jungle Swing, Rice Terraces.' },
      { day: 4, title: 'Temples & Waterfalls', desc: 'Tegenungan Waterfall, Tirta Empul holy spring temple.' },
      { day: 5, title: 'Tanah Lot & Jimbaran Dinner', desc: 'Iconic sea temple sunset and candlelit beachfront seafood dinner.' },
      { day: 6, title: 'Denpasar Airport Departure', desc: 'Balinese coffee and souvenir market, airport transfer.' }
    ]
  },
  {
    id: 'int-baku-5d4n',
    title: 'Land of Fire: Baku & Absheron Peninsula (Azerbaijan)',
    category: 'International',
    destination: 'Baku, Gobustan, Ateshgah Fire Temple, Yanar Dag',
    stateOrCountry: 'Azerbaijan',
    duration: '5 Days / 4 Nights',
    priceINR: 38500,
    priceUSD: 460,
    imageUrl: 'https://images.unsplash.com/photo-1584974292709-5c2f3619971b?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    highlights: ['Flame Towers & Highland Park View', 'UNESCO Old City (Icherisheher) & Maiden Tower', 'Gobustan Mud Volcanoes & Ancient Rock Art', 'Yanardag Burning Mountain'],
    inclusions: ['4-Star Central Baku Hotel', 'Daily Breakfast', 'All Intercity Excursions with Guide', 'Azerbaijan E-Visa Support'],
    itinerary: [
      { day: 1, title: 'Arrival in Baku', desc: 'Transfer to hotel, evening walk along Baku Seaside Boulevard.' },
      { day: 2, title: 'Old & Modern Baku City Tour', desc: 'Heydar Aliyev Center, Flame Towers, Nizami Street shopping.' },
      { day: 3, title: 'Gobustan & Mud Volcanoes', desc: 'Petroglyphs museum, bubbling mud volcanoes 4x4 tour.' },
      { day: 4, title: 'Ateshgah & Yanardag Fire Tour', desc: 'Ancient Zoroastrian Fire Temple and burning natural gas hillside.' },
      { day: 5, title: 'Baku Departure', desc: 'Baku local sweets shopping and flight home.' }
    ]
  },
  {
    id: 'int-armenia-5d4n',
    title: 'Historic Armenia: Yerevan, Lake Sevan & Mount Ararat',
    category: 'International',
    destination: 'Yerevan, Garni Temple, Geghard, Lake Sevan',
    stateOrCountry: 'Armenia',
    duration: '5 Days / 4 Nights',
    priceINR: 36800,
    priceUSD: 440,
    imageUrl: 'https://images.unsplash.com/photo-1589785209736-224a13247072?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    highlights: ['Garni Pagan Sun Temple', 'UNESCO Geghard Monastery carved into cliffs', 'Turquoise Lake Sevan & Sevanavank', 'Cascade Complex overlooking Yerevan'],
    inclusions: ['Centrally located Hotel', 'Breakfast Daily + Traditional Armenian Lunch', 'All Museum & Monument Passes', 'English Speaking Guide'],
    itinerary: [
      { day: 1, title: 'Yerevan Arrival', desc: 'Republic Square musical fountains and night city walking tour.' },
      { day: 2, title: 'Garni & Geghard', desc: 'Lavash bread baking masterclass and pagan temple exploration.' },
      { day: 3, title: 'Lake Sevan & Dilijan', desc: 'Blue pearl of Armenia and picturesque Dilijan "Little Switzerland".' },
      { day: 4, title: 'Khor Virap & Mount Ararat', desc: 'Closest monastery view of biblical Mount Ararat.' },
      { day: 5, title: 'Vernissage Art Market & Departure', desc: 'Souvenirs and airport drop.' }
    ]
  },
  {
    id: 'int-maldives-4d3n',
    title: 'Maldives Overwater Villa & Turquoise Coral Lagoon',
    category: 'International',
    destination: 'Male Atoll, Maafushi, Ari Atoll',
    stateOrCountry: 'Maldives',
    duration: '4 Days / 3 Nights',
    priceINR: 48900,
    priceUSD: 589,
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Luxury Overwater Water Bungalow', 'Speedboat Airport Transfers Included', 'Nurse Shark & Sea Turtle Snorkeling Tour', 'Sunset Dolphin Watching Cruise'],
    inclusions: ['4-Star Island Resort with Pool', 'All Meals (Breakfast, Lunch & Dinner Included)', 'Free Snorkeling Gear', 'Complimentary Visa on Arrival for Indians'],
    itinerary: [
      { day: 1, title: 'Speedboat Welcome to Resort Island', desc: 'Tropical welcome drink, check-in to water villa.' },
      { day: 2, title: 'Coral Reef & Turtle Safari', desc: 'Guided snorkeling adventure in crystal-clear waters.' },
      { day: 3, title: 'Sandbank Picnic & Sunset Dolphins', desc: 'Private sandbank excursion and sunset catamaran cruise.' },
      { day: 4, title: 'Island Leisure & Departure', desc: 'Souvenirs and speedboat transfer to Male Velana Airport.' }
    ]
  },
  {
    id: 'int-turkey-7d6n',
    title: 'Jewels of Turkey: Istanbul Bosphorus & Cappadocia Balloons',
    category: 'International',
    destination: 'Istanbul, Cappadocia, Goreme Valley',
    stateOrCountry: 'Turkey',
    duration: '7 Days / 6 Nights',
    priceINR: 64500,
    priceUSD: 775,
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Hot Air Balloon Flight over Cappadocia Fairy Chimneys', 'Bosphorus Dinner Cruise with Turkish Folk Dance', 'Hagia Sophia & Blue Mosque Guided Walk', 'Underground City of Derinkuyu Exploration'],
    inclusions: ['Boutique Cave Hotel in Cappadocia & 4-Star Istanbul Hotel', 'Daily Breakfast + 3 Traditional Dinners', 'Domestic Flights Istanbul-Nevsehir-Istanbul', 'English Speaking Historian Guide'],
    itinerary: [
      { day: 1, title: 'Arrival in Istanbul', desc: 'Transfer to Sultanahmet, Grand Bazaar walking tour.' },
      { day: 2, title: 'Ottoman & Byzantine Wonders', desc: 'Hagia Sophia, Topkapi Palace, and Basilica Cistern.' },
      { day: 3, title: 'Flight to Cappadocia', desc: 'Check-in to unique fairy chimney cave suite.' },
      { day: 4, title: 'Sunrise Hot Air Balloon & Goreme', desc: 'Spectacular sunrise balloon flight and open-air museum.' },
      { day: 5, title: 'Derinkuyu Underground City', desc: 'Multi-level subterranean troglodyte tunnels.' },
      { day: 6, title: 'Return to Istanbul & Bosphorus Cruise', desc: 'Farewell cruise separating Europe and Asia.' },
      { day: 7, title: 'Istanbul Departure', desc: 'Turkish delight shopping and airport departure.' }
    ]
  }
];

export const GROUP_TOURS: TourPackage[] = [
  {
    id: 'grp-thailand-6d5n',
    title: 'Thailand Mega Group Departure: Bangkok, Pattaya & Phuket',
    category: 'Group',
    destination: 'Bangkok, Pattaya, Phuket, James Bond Island',
    stateOrCountry: 'Thailand',
    duration: '6 Days / 5 Nights',
    priceINR: 32500,
    priceUSD: 390,
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Fixed Group Departures with Tour Manager from India', 'Phang Nga Bay James Bond Island Longtail Boat Cruise', 'Indian Buffet Lunches & Dinners Daily', 'Phi Phi Islands Catamaran Cruise'],
    inclusions: ['Dedicated Tamil / Hindi Tour Leader', '4-Star Hotels with Twin/Triple sharing', 'All Meals (Breakfast, Lunch, Dinner)', 'International Airfare + Domestic Flights Included'],
    itinerary: [
      { day: 1, title: 'Group Arrival in Bangkok & Transfer to Pattaya', desc: 'Welcome party, check-in, Alcazar Cabaret.' },
      { day: 2, title: 'Coral Island & Group Beach Sports', desc: 'Exclusive private speedboat charter and Indian beachside lunch.' },
      { day: 3, title: 'Bangkok City & Gems World', desc: 'Golden Buddha temple, Chao Phraya dinner cruise with music.' },
      { day: 4, title: 'Flight to Phuket', desc: 'Transfer to Patong beach, evening group gala dinner.' },
      { day: 5, title: 'Phi Phi Island Cruise', desc: 'Maya Bay snorkeling, monkey beach, group photography session.' },
      { day: 6, title: 'Phuket Airport Departure', desc: 'Farewell group photos and group return flight.' }
    ]
  },
  {
    id: 'grp-dubai-5d4n',
    title: 'Dubai Shopping Festival (DSF) Special Group Tour',
    category: 'Group',
    destination: 'Dubai & Abu Dhabi',
    stateOrCountry: 'United Arab Emirates',
    duration: '5 Days / 4 Nights',
    priceINR: 39900,
    priceUSD: 480,
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Group Exclusive 4x4 Desert Safari Camp', 'Burj Khalifa Top Floor Group Slot', 'Miracle Garden & Global Village VIP Entry', 'Indian Chef Special Dinners'],
    inclusions: ['4-Star Deluxe Hotel', 'Breakfast, Lunch & Dinner by Indian Chefs', 'Luxury AC Coach for all group tours', 'UAE Group Tourist Visa'],
    itinerary: [
      { day: 1, title: 'Group Arrival in Dubai', desc: 'Meet & greet at Terminal 3, luxury coach to hotel, Dhow Cruise Dinner.' },
      { day: 2, title: 'Dubai Mall & Burj Khalifa', desc: 'World’s biggest mall, fountain show, 124th floor entry.' },
      { day: 3, title: 'Global Village & Desert Safari', desc: 'Pavilions from 90 countries followed by private desert dune camp.' },
      { day: 4, title: 'Abu Dhabi Grand Day Excursion', desc: 'Sheikh Zayed Mosque group tour, BAPS Hindu Mandir, Ferrari World.' },
      { day: 5, title: 'Shopping at Meena Bazaar & Flight Home', desc: 'Electronics and spices shopping, group airport departure.' }
    ]
  },
  {
    id: 'grp-kashmir-6d5n',
    title: 'Kashmir Family & Friends Group Extravaganza',
    category: 'Group',
    destination: 'Srinagar, Gulmarg, Pahalgam, Sonamarg',
    stateOrCountry: 'Jammu and Kashmir',
    duration: '6 Days / 5 Nights',
    priceINR: 26500,
    priceUSD: 320,
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    highlights: ['Exclusive Group Houseboat Charter', 'Gulmarg Gondola Phase 1 & 2 Passes Guaranteed', 'Live Kashmiri Folk Music & Campfire Night', 'All Meals with Pure Veg / Jain / Halal options'],
    inclusions: ['Group Tour Escort', 'Deluxe Stays with Central Heating', 'All Shikara Rides & Gondola Passes', 'Airport Pick & Drop in Tempo Traveller'],
    itinerary: [
      { day: 1, title: 'Arrival in Srinagar', desc: 'Warm Kahwa welcome, Dal lake houseboat check-in, sunset Shikara.' },
      { day: 2, title: 'Gulmarg Snow Playground', desc: 'Group snow battles, gondola ride, skiing guidance.' },
      { day: 3, title: 'Pahalgam Scenic Journey', desc: 'Lidder river walk, saffron farm visit, local walnut shopping.' },
      { day: 4, title: 'Betaab Valley & Baisaran Mini Switzerland', desc: 'Group picnic in meadows.' },
      { day: 5, title: 'Sonamarg & Campfire Gala', desc: 'Thajiwas glacier and evening group celebratory dinner.' },
      { day: 6, title: 'Srinagar Departure', desc: 'Group souvenir hampers and airport drop.' }
    ]
  },
  {
    id: 'grp-singapore-malaysia-6d5n',
    title: 'Southeast Asia Duo: Singapore & Malaysia Super Group Tour',
    category: 'Group',
    destination: 'Singapore, Kuala Lumpur, Genting Highlands',
    stateOrCountry: 'Singapore & Malaysia',
    duration: '6 Days / 5 Nights',
    priceINR: 44500,
    priceUSD: 535,
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Gardens by the Bay Cloud Forest & Flower Dome', 'Universal Studios Singapore Full Day Pass', 'Genting Highlands Cable Car & Batu Caves', 'Petronas Twin Towers Observation Deck'],
    inclusions: ['All Group Transfers in Luxury Coach', '4-Star Hotels with Daily Indian Breakfast & Dinner', 'Singapore Visa & Malaysia Entry Filing', 'Experienced Group Tour Escort'],
    itinerary: [
      { day: 1, title: 'Group Arrival in Singapore', desc: 'Night safari tram ride with Asian wildlife.' },
      { day: 2, title: 'Gardens by the Bay & Marina Bay', desc: 'Supertrees light & sound spectacle and Merlion photo stop.' },
      { day: 3, title: 'Sentosa Island & Universal Studios', desc: 'Full day theme park group adventure.' },
      { day: 4, title: 'Coach to Kuala Lumpur via Malacca', desc: 'UNESCO heritage stopover, check-in to Kuala Lumpur hotel.' },
      { day: 5, title: 'Batu Caves & Genting Highlands', desc: 'Rainbow stairs temple and Genting Skyway cable car.' },
      { day: 6, title: 'KL City Tour & KLIA Airport Return', desc: 'Twin Towers, Putrajaya administrative capital, flight home.' }
    ]
  }
];

export const ALL_TOUR_PACKAGES: TourPackage[] = [
  ...INDIA_TOURS,
  ...INTERNATIONAL_TOURS,
  ...GROUP_TOURS
];
