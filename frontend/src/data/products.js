// Static editable product catalogue & initial seed data for Shubh Deep.

export const USER = {
  diya1: "/images/3be7aa21a985f477_diya1.jpeg",
  diya4: "/images/3b5cb3863aaec5a7_diya 4.jpeg",
  diya6: "/images/3a4a127c60f86a88_diya6.jpeg",
  diya7: "/images/92c19ab4c84ce789_diya7.jpeg",
  diya8: "/images/e22aae87214a1afa_diya 8.jpeg"
};

export const COLLECTIONS = [
  {
    id: "clay-diyas",
    title: "Traditional Clay Diyas",
    description: "Hand-moulded terracotta oil lamps from village potters.",
    image: "/images/products/classic-clay-diya-dozen.jpg"
  },
  {
    id: "decorative-diyas",
    title: "Decorative Diyas",
    description: "Hand-painted, beaded & embellished festive lights.",
    image: USER.diya1
  },
  {
    id: "brass-stands",
    title: "Brass Diya Stands",
    description: "Heirloom samai & hanging oil lamp stands.",
    image: "/images/products/brass-samai-stand.jpg"
  },
  {
    id: "handmade-artistic",
    title: "Handmade Artistic Diyas",
    description: "Intricate peacock, lotus & floral sculpted diya art.",
    image: USER.diya7
  },
  {
    id: "gift-hampers",
    title: "Festive Hampers",
    description: "Curated Diwali gifting boxes with lamps & keepsakes.",
    image: "/images/pexels-photo-8819577.jpg"
  },
  {
    id: "rangoli-decor",
    title: "Rangoli & Festive Decor",
    description: "Brass urli bowls, marigold strings & rangoli mats.",
    image: "/images/photo-1699860807907-d14a60827a25.jpg"
  }
];

export const PRODUCTS = [
  {
    id: "pearl-ring-diya-set",
    name: "Pearl Ring Tealight Diya Set",
    collection: "decorative-diyas",
    price: 1299,
    oldPrice: 1599,
    images: ["/images/3be7aa21a985f477_diya1.jpeg"],
    description: "A radiant set of handcrafted tealight diyas wrapped in silk thread, bordered with pearl beads and gold ghungroos. Each piece glows with warmth and old-world charm — a perfect centrepiece for your pooja thali or dining table on Diwali night.",
    details: [
      "Set of 6 handcrafted tealight diyas",
      "Silk thread, pearl bead & metallic ghungroo work",
      "Includes 6 wax tealights",
      "Approximate diameter: 6 cm each"
    ],
    sizes: ["Set of 4", "Set of 6", "Set of 12"],
    colors: ["Multicolour", "Gold", "Maroon"],
    availability: "in_stock",
    stock_quantity: 45,
    badge: "Bestseller",
    isNew: false,
    featured: true
  },
  {
    id: "emerald-silk-diya",
    name: "Emerald Silk Thread Diya",
    collection: "decorative-diyas",
    price: 349,
    images: ["/images/3b5cb3863aaec5a7_diya 4.jpeg"],
    description: "A single statement diya wound with emerald silk thread, framed by lustrous pearl and antique gold beading. Mounted on a rustic wood slice, it feels like a sliver of festive heirloom.",
    details: [
      "Single handcrafted tealight diya",
      "Emerald silk thread with pearl & gold bead border",
      "Includes 1 wax tealight",
      "Approximate diameter: 7 cm"
    ],
    sizes: ["Single"],
    colors: ["Emerald", "Ruby", "Royal Blue"],
    availability: "in_stock",
    stock_quantity: 30,
    isNew: true,
    featured: true
  },
  {
    id: "kundan-saffron-pair",
    name: "Kundan Saffron Diya Pair",
    collection: "handmade-artistic",
    price: 899,
    images: ["/images/3a4a127c60f86a88_diya6.jpeg"],
    description: "A delicate pair of silk-wrapped diyas crowned with kundan motifs, pearl drops and golden tassels. Light them on a brass thali for a photograph-worthy Diwali tableau.",
    details: [
      "Pair of hand-finished diyas",
      "Kundan motif, pearl drops & gold tassel",
      "Includes 2 LED tealights (reusable)",
      "Approximate diameter: 8 cm each"
    ],
    sizes: ["Pair"],
    colors: ["Saffron & Yellow", "Red & Gold"],
    availability: "in_stock",
    stock_quantity: 25,
    badge: "Handcrafted",
    isNew: false,
    featured: true
  },
  {
    id: "marigold-wheel-plate",
    name: "Marigold Wheel Rangoli Diya Plate",
    collection: "rangoli-decor",
    price: 1499,
    images: ["/images/photo-1699860807907-d14a60827a25.jpg"],
    description: "A spoked saffron wheel woven in silk thread, encircled with pearl flowers and crystal border — holds a tealight at its heart. Equal parts rangoli, equal parts diya.",
    details: [
      "Handwoven saffron silk thread wheel",
      "Pearl flower & crystal border",
      "Includes 1 wax tealight",
      "Approximate diameter: 20 cm"
    ],
    sizes: ["Standard"],
    colors: ["Saffron"],
    availability: "in_stock",
    stock_quantity: 20,
    isNew: true,
    featured: true
  },
  {
    id: "blush-lotus-crochet-diya",
    name: "Blush Lotus Crochet Diya",
    collection: "handmade-artistic",
    price: 599,
    images: ["/images/92c19ab4c84ce789_diya7.jpeg"],
    description: "A soft, blush-pink crochet lotus with pearl centres — a quiet, poetic counterpoint to the brass and gold of a Diwali table. Hand-crocheted by women artisans.",
    details: [
      "Hand-crocheted cotton lace in blush & ivory",
      "Pearl bead accents",
      "Includes 1 wax tealight",
      "Approximate diameter: 10 cm"
    ],
    sizes: ["Single", "Set of 2"],
    colors: ["Blush", "Ivory", "Sage"],
    availability: "in_stock",
    stock_quantity: 35,
    badge: "New",
    isNew: true,
    featured: true
  },
  {
    id: "classic-clay-diya-dozen",
    name: "Classic Clay Diyas · Dozen",
    collection: "clay-diyas",
    price: 249,
    images: ["/images/products/classic-clay-diya-dozen.jpg"],
    description: "Twelve pure terracotta diyas thrown on the wheel and sun-dried the traditional way — ready to be filled with ghee or mustard oil. The soul of every Indian Diwali.",
    details: [
      "Pack of 12 unglazed terracotta diyas",
      "Hand-thrown by village potters",
      "Food-safe clay, no chemical coating",
      "Approximate diameter: 5 cm each"
    ],
    sizes: ["Pack of 12", "Pack of 24", "Pack of 51"],
    colors: ["Terracotta"],
    availability: "in_stock",
    stock_quantity: 100,
    isNew: false,
    featured: true
  },
  {
    id: "brass-samai-stand",
    name: "Antique Brass Samai Stand",
    collection: "brass-stands",
    price: 2499,
    images: ["/images/products/brass-samai-stand.jpg"],
    description: "A tall, hand-cast brass samai with a classic bell-and-leaf finial, inspired by the lamps of Maharashtra. Holds five wicks for a steady, meditative glow.",
    details: [
      "Hand-cast brass samai lamp",
      "Five-wick traditional design",
      "Approximate height: 30 cm",
      "Comes with a soft polishing cloth"
    ],
    sizes: ['9"', '12"', '15"'],
    colors: ["Antique Brass"],
    availability: "in_stock",
    stock_quantity: 15,
    badge: "Heirloom",
    isNew: false,
    featured: false
  },
  {
    id: "diwali-essential-hamper",
    name: "The Diwali Essentials Hamper",
    collection: "gift-hampers",
    price: 1899,
    oldPrice: 2299,
    images: ["/images/pexels-photo-8819577.jpg"],
    description: "A thoughtfully curated gift box with handcrafted diyas, scented wax candles, a mini brass urli and a handwritten festive note — wrapped in khadi and gold ribbon.",
    details: [
      "4 handcrafted diyas · 2 scented candles · 1 mini brass urli",
      "Khadi-wrapped keepsake box",
      "Includes a handwritten festive note (optional)",
      "Corporate gifting available"
    ],
    sizes: ["Classic", "Premium", "Luxe"],
    colors: ["Maroon & Gold"],
    availability: "in_stock",
    stock_quantity: 18,
    badge: "Gifting",
    isNew: true,
    featured: false
  },
  {
    id: "rangoli-brass-urli",
    name: "Brass Urli with Floating Diyas",
    collection: "rangoli-decor",
    price: 1799,
    images: ["/images/photo-1775427527606-5b317b5e6a96.jpg"],
    description: "An elegant brass urli bowl paired with four floating lotus diyas and marigold petals — the loveliest welcome at your entrance on Diwali evening.",
    details: [
      "Hand-cast brass urli bowl (approx. 25 cm)",
      "Four floating lotus-shaped tealight diyas",
      "Includes a pouch of dried marigold petals"
    ],
    sizes: ["Small", "Medium", "Large"],
    colors: ["Brass"],
    availability: "limited",
    stock_quantity: 8,
    isNew: false,
    featured: false
  },
  {
    id: "peacock-artisan-diya",
    name: "Peacock Artisan Diya",
    collection: "handmade-artistic",
    price: 749,
    images: ["/images/e22aae87214a1afa_diya 8.jpeg"],
    description: "A sculpted peacock diya hand-finished in antique gold and ruby — a tribute to the Mor of Mughal miniatures. A single piece lights up a whole shelf.",
    details: [
      "Hand-sculpted resin peacock diya",
      "Antique gold & ruby finish",
      "Includes 1 reusable LED tealight"
    ],
    sizes: ["Standard"],
    colors: ["Antique Gold", "Ruby"],
    availability: "in_stock",
    stock_quantity: 22,
    isNew: false,
    featured: false
  },
  {
    id: "ivory-crochet-diya-set",
    name: "Ivory Crochet Diya · Set of 2",
    collection: "decorative-diyas",
    price: 999,
    images: ["/images/products/ivory-crochet-diya-set.jpg"],
    description: "Delicate ivory and blush crochet diyas with pearl detailing — hand-crocheted by women artisans in Lucknow. A whisper-soft, modern take on Diwali light.",
    details: [
      "Set of 2 hand-crocheted lace diyas",
      "Pearl bead work",
      "Includes 2 wax tealights"
    ],
    sizes: ["Set of 2"],
    colors: ["Blush", "Ivory"],
    availability: "in_stock",
    stock_quantity: 14,
    badge: "Artisan",
    isNew: true,
    featured: false
  },
  {
    id: "mini-lantern-hamper",
    name: "Festive Lantern Mini Hamper",
    collection: "gift-hampers",
    price: 1299,
    images: ["/images/pexels-photo-28769885.jpg"],
    description: "A compact gift box with a mini brass lantern, a pair of decorative diyas, dry fruits and a card. Thoughtful for colleagues, neighbours and secret-santa Diwali.",
    details: [
      "1 mini brass lantern · 2 decorative diyas",
      "100g dry fruit assortment (packed hygienically)",
      "Khadi gift pouch with a festive card"
    ],
    sizes: ["Mini"],
    colors: ["Maroon & Gold"],
    availability: "in_stock",
    stock_quantity: 12,
    isNew: false,
    featured: false
  },
  {
    id: "aesthetic-diya",
    name: "Aesthetic Handcrafted Diya",
    collection: "decorative-diyas",
    price: 159,
    images: ["/images/products/aesthetic-floral-diya.jpg"],
    description: "An artisanal handcrafted terracotta floral diya sculpted with gentle petal contours and finished in warm festive hues. Ideal for pooja alcoves and quiet festive corners.",
    details: [
      "Single artisan sculpted earthen diya",
      "Hand-painted petal borders",
      "Compatible with cotton wicks and oil"
    ],
    sizes: ["Single"],
    colors: ["Terracotta and Gold"],
    availability: "in_stock",
    stock_quantity: 10,
    isNew: false,
    featured: false
  },
  {
    id: "kolkata-terracotta-carved-diyas",
    name: "Kumartuli Hand-Carved Terracotta Diyas (Set of 6)",
    collection: "clay-diyas",
    price: 499,
    oldPrice: 699,
    images: ["/images/products/kolkata-terracotta-carved-diyas.jpg"],
    description: "Moulded from sacred Ganges alluvial clay by hereditary Kumartuli potters and hand-chiseled with floral sunburst motifs. When lit with mustard oil, they emit an earthy petrichor scent that embodies classic Diwali nostalgia.",
    details: [
      "Set of 6 hand-carved clay diyas",
      "Natural unglazed terracotta finish",
      "Deep oil wells designed for 4+ hour continuous burn",
      "Traditional cotton battis included"
    ],
    sizes: ["Set of 6", "Set of 12"],
    colors: ["Earthy Terracotta"],
    availability: "in_stock",
    stock_quantity: 40,
    badge: "Artisan Handcrafted",
    isNew: true,
    featured: true
  },
  {
    id: "panchmukhi-auspicious-clay-diya",
    name: "Panchmukhi Five-Wick Earthen Diya (Set of 2)",
    collection: "clay-diyas",
    price: 549,
    oldPrice: 749,
    images: ["/images/products/panchmukhi-auspicious-clay-diya.jpg"],
    description: "A commanding five-pointed clay diya symbolizing the five cosmic elements (Panchabhuta). Hand-pressed on potter's wheels in rural Rajasthan, this sacred vessel is traditionally lit at the main entrance to invoke auspicious blessings.",
    details: [
      "Pack of 2 five-wick deepaks",
      "100% natural kiln-baked terracotta",
      "Capacity for 5 cotton wicks simultaneously",
      "Approximate diameter: 12 cm"
    ],
    sizes: ["Set of 2", "Set of 4"],
    colors: ["Natural Clay Red"],
    availability: "in_stock",
    stock_quantity: 32,
    badge: "Auspicious",
    isNew: false,
    featured: false
  },
  {
    id: "matki-terracotta-diya-set",
    name: "Heritage Matki Terracotta Diya Set (Pack of 8)",
    collection: "clay-diyas",
    price: 649,
    oldPrice: 899,
    images: ["/images/products/matki-terracotta-diya-set.jpg"],
    description: "Charming miniature pot-shaped diyas adorned with subtle white tribal warli etchings. These stable, wind-resistant lamps protect the flame from autumn breezes on verandahs and balconies.",
    details: [
      "Set of 8 pot-style clay lamps",
      "Eco-friendly, lead-free natural earthenware",
      "Deep cavity resists wind flicker",
      "Includes complimentary raw cotton wicks"
    ],
    sizes: ["Set of 8", "Set of 16"],
    colors: ["Terracotta with White Warli"],
    availability: "in_stock",
    stock_quantity: 50,
    badge: "Bestseller",
    isNew: true,
    featured: false
  },
  {
    id: "royal-meenakari-floral-diyas",
    name: "Royal Jaipuri Meenakari Diya (Set of 4)",
    collection: "decorative-diyas",
    price: 1499,
    oldPrice: 1899,
    images: ["/images/products/royal-meenakari-floral-diyas.jpg"],
    description: "Inspired by the royal courts of Amber, each diya features intricate enamelled floral art in deep crimson, emerald green and gold foil. Finished with hand-strung seed pearls that catch the flicker of warm candlelight.",
    details: [
      "Set of 4 enamelled metal diyas",
      "Hand-painted Meenakari craftsmanship",
      "Includes 4 soy-wax smokeless tealights",
      "Velvet gift pouch included"
    ],
    sizes: ["Set of 4", "Set of 8"],
    colors: ["Crimson & Gold", "Peacock Blue & Gold"],
    availability: "in_stock",
    stock_quantity: 28,
    badge: "Royal Heritage",
    isNew: true,
    featured: true
  },
  {
    id: "mirror-work-zari-tealight-set",
    name: "Kutch Mirror Work Zari Diya Holders (Set of 6)",
    collection: "decorative-diyas",
    price: 1199,
    oldPrice: 1449,
    images: ["/images/products/mirror-work-zari-tealight-set.jpg"],
    description: "Vibrant raw silk and velvet borders embedded with shisha mirror embroidery and golden gota patti lace. The mirrors create a glittering halo around each burning flame, multiplying the festive radiance.",
    details: [
      "Set of 6 embellished tealight holders",
      "Authentic Gujarat mirror-work & zari lace",
      "Heat-resistant metal inner casing",
      "Diameter: 7.5 cm each"
    ],
    sizes: ["Set of 6"],
    colors: ["Festive Jewel Tones", "Maroon & Antique Gold"],
    availability: "in_stock",
    stock_quantity: 35,
    badge: "Festive Edit",
    isNew: false,
    featured: false
  },
  {
    id: "ghungroo-gemstone-diya-pair",
    name: "Ghungroo & Gemstone Festive Diya Pair",
    collection: "decorative-diyas",
    price: 849,
    oldPrice: 1099,
    images: ["/images/products/ghungroo-gemstone-diya-pair.jpg"],
    description: "Faceted teardrop glass crystals and brass ghungroos border a deep metallic bowl. Gentle movement produces a delicate, auspicious chime reminiscent of temple ceremonies.",
    details: [
      "Pair of 2 decorative brass-plated diyas",
      "Tinkling brass bells and ruby glass stones",
      "Reusable wax or oil basin",
      "Gift-ready gold packaging"
    ],
    sizes: ["Pair"],
    colors: ["Gold & Ruby", "Gold & Amber"],
    availability: "in_stock",
    stock_quantity: 22,
    badge: "Trending",
    isNew: true,
    featured: false
  },
  {
    id: "mayur-peacock-brass-hanging-diya",
    name: "Mayur Peacock Hanging Brass Diya with Chain",
    collection: "brass-stands",
    price: 2499,
    oldPrice: 2999,
    images: ["/images/products/mayur-peacock-brass-hanging-diya.jpg"],
    description: "Cast in virgin yellow brass by Aligarh metallurgists, this hanging deepak features an engraved peacock perched proudly atop a lotus cup, suspended from a sturdy 18-inch link chain with brass bell pendants.",
    details: [
      "Solid virgin brass (Net Weight: ~850g)",
      "Length with chain: 55 cm",
      "Peacock crest with five-wick oil basin",
      "Hand-polished antique golden patina"
    ],
    sizes: ["Medium (18-inch chain)", "Large (24-inch chain)"],
    colors: ["Antique Brass"],
    availability: "in_stock",
    stock_quantity: 16,
    badge: "Heirloom",
    isNew: true,
    featured: true
  },
  {
    id: "ashtalakshmi-brass-oil-lamp",
    name: "Ashtalakshmi Engraved Brass Diya Stand",
    collection: "brass-stands",
    price: 3299,
    oldPrice: 3899,
    images: ["/images/products/ashtalakshmi-brass-oil-lamp.jpg"],
    description: "A majestic temple-grade brass oil lamp featuring the eight auspicious forms of Goddess Lakshmi embossed around the base. Designed for heirloom longevity, this lamp serves as the spiritual crown of any pooja altar.",
    details: [
      "Heavy cast brass construction (Net Weight: ~1.2 kg)",
      "Height: 30 cm, Base: 14 cm",
      "Deep central oil reservoir for long aartis",
      "Coated with clear tarnish-resistant protective finish"
    ],
    sizes: ["Standard (30 cm)", "Grand (42 cm)"],
    colors: ["Temple Brass"],
    availability: "in_stock",
    stock_quantity: 12,
    badge: "Temple Grade",
    isNew: false,
    featured: true
  },
  {
    id: "kamal-brass-pooja-thali-stand",
    name: "Kamal Petal 3-Tier Brass Diya Stand",
    collection: "brass-stands",
    price: 1999,
    oldPrice: 2499,
    images: ["/images/products/kamal-brass-pooja-thali-stand.jpg"],
    description: "Three graduated tiers of blooming lotus petals crafted from polished brass. Accommodates 15 individual wicks, creating a spectacular pyramid of living light that dazzles festive gatherings.",
    details: [
      "3-tiered modular brass lamp stand",
      "Accommodates 15 wicks across 3 levels",
      "Height: 22 cm, Stable weighted base",
      "Easy screw-assembly for cleaning and storage"
    ],
    sizes: ["3-Tier"],
    colors: ["Golden Brass"],
    availability: "in_stock",
    stock_quantity: 20,
    badge: "Bestseller",
    isNew: true,
    featured: false
  },
  {
    id: "sahasrara-thousand-petal-lotus-diya",
    name: "Sahasrara Lotus Brass & Clay Diya",
    collection: "handmade-artistic",
    price: 1149,
    oldPrice: 1399,
    images: ["/images/products/sahasrara-thousand-petal-lotus-diya.jpg"],
    description: "A multi-layered sculptural piece where concentric brass petals emerge from a terracotta core, mimicking the Sahasrara crown lotus. Hand-antiqued edges lend a regal vintage character.",
    details: [
      "Layered sheet-brass petals on clay foundation",
      "Hand-hammered texture with antique patina",
      "Accommodates standard tealight or organic ghee wick",
      "Diameter: 14 cm"
    ],
    sizes: ["Standard (14 cm)"],
    colors: ["Antique Brass & Terracotta"],
    availability: "in_stock",
    stock_quantity: 26,
    badge: "Master Artisan",
    isNew: true,
    featured: true
  },
  {
    id: "shubh-labh-ganesha-carved-diya",
    name: "Shubh Labh Ganesha Sculpted Diya",
    collection: "handmade-artistic",
    price: 949,
    oldPrice: 1199,
    images: ["/images/products/shubh-labh-ganesha-carved-diya.jpg"],
    description: "Hand-moulded terracotta and fine stoneware clay depicting Vignaharta Ganesha seated behind an auspicious oil flame, flanked by Shubh-Labh engravings. An essential centerpiece for Diwali pooja rituals.",
    details: [
      "Hand-sculpted clay with natural mineral pigments",
      "Integrated deep oil bowl for pure ghee burning",
      "Dimensions: 12 cm x 10 cm x 8 cm",
      "Blessed with sacred Kalawa thread"
    ],
    sizes: ["Standard"],
    colors: ["Terracotta & Gold Foil"],
    availability: "in_stock",
    stock_quantity: 30,
    badge: "Pooja Special",
    isNew: false,
    featured: false
  },
  {
    id: "dhokra-tribal-brass-oil-diya",
    name: "Dhokra Lost-Wax Tribal Brass Diya",
    collection: "handmade-artistic",
    price: 1399,
    oldPrice: 1699,
    images: ["/images/products/dhokra-tribal-brass-oil-diya.jpg"],
    description: "Created using the 4,000-year-old lost-wax casting technique by Bastar tribal artisans. Every piece is unique, featuring rustic corded wire textures and primitive elephant motifs holding a brass cup.",
    details: [
      "Authentic Dhokra bell-metal bronze casting",
      "100% handcrafted — no two pieces are identical",
      "Non-toxic, heirloom metallic alloy",
      "Includes artisan authenticity certificate"
    ],
    sizes: ["Artisan Original"],
    colors: ["Raw Bell-Metal Patina"],
    availability: "in_stock",
    stock_quantity: 15,
    badge: "GI Certified Craft",
    isNew: true,
    featured: false
  },
  {
    id: "rajasthani-royal-diwali-box",
    name: "Royal Rajwada Diya & Dhoop Gift Hamper",
    collection: "gift-hampers",
    price: 2899,
    oldPrice: 3499,
    images: ["/images/products/rajasthani-royal-diwali-box.jpg"],
    description: "A luxurious maroon velvet keepsake box embossed with golden peacocks. Unveils 4 handcrafted silk thread diyas, a brass pooja bell, organic rose and sandalwood dhoop cones, and a brass wick trimmer.",
    details: [
      "Maroon velvet & gold foil keepsake box",
      "4 embellished silk thread pearl diyas",
      "1 solid brass pooja bell + pure dhoop cones",
      "50 organic cow ghee wicks + custom gift card"
    ],
    sizes: ["Royal Rajwada Edition"],
    colors: ["Maroon & Gold"],
    availability: "in_stock",
    stock_quantity: 20,
    badge: "Luxury Gift",
    isNew: true,
    featured: true
  },
  {
    id: "shilpakar-terracotta-craft-hamper",
    name: "Shilpakar Master Potter Gift Hamper",
    collection: "gift-hampers",
    price: 1699,
    oldPrice: 2199,
    images: ["/images/products/shilpakar-terracotta-craft-hamper.jpg"],
    description: "Curated for lovers of pure organic craftsmanship: 12 assorted village terracotta diyas, a bottle of cold-pressed fragrant sesame lamp oil, hand-spun raw cotton battis, and an artisan brass matchbox case.",
    details: [
      "12 assorted handcrafted terracotta lamps",
      "100ml cold-pressed pooja oil bottle",
      "100 organic hand-spun cotton wicks",
      "Brass matchbox case in jute basket packaging"
    ],
    sizes: ["Classic Craft Basket"],
    colors: ["Organic Jute & Terracotta"],
    availability: "in_stock",
    stock_quantity: 25,
    badge: "Eco-Friendly",
    isNew: false,
    featured: false
  },
  {
    id: "handcrafted-brass-urli-peacock-handles",
    name: "Hand-Hammered Brass Urli with Peacock Handles",
    collection: "rangoli-decor",
    price: 2799,
    oldPrice: 3299,
    images: ["/images/products/handcrafted-brass-urli-peacock-handles.jpg"],
    description: "A 12-inch wide hand-beaten brass urli vessel crowned with sculpted peacock handles. Fill with fresh water, floating marigold petals, and fragrant candles to create an unforgettable welcome at your threshold.",
    details: [
      "Heavy gauge virgin brass (Weight: ~1.4 kg)",
      "Diameter: 30 cm (12 inches)",
      "Sculpted twin peacock handles with floral rim",
      "Includes 6 floating lotus-shaped tealights"
    ],
    sizes: ["12-inch Diameter", "14-inch Diameter"],
    colors: ["Gleaming Antique Brass"],
    availability: "in_stock",
    stock_quantity: 14,
    badge: "Centerpiece",
    isNew: true,
    featured: true
  },
  {
    id: "kundan-wooden-rangoli-diya-mat",
    name: "Kundan & Pearl Multi-Piece Rangoli Diya Mat",
    collection: "rangoli-decor",
    price: 1399,
    oldPrice: 1799,
    images: ["/images/products/kundan-wooden-rangoli-diya-mat.jpg"],
    description: "A 7-piece modular wooden rangoli set encrusted with lustrous kundan gemstones, pearl borders, and vivid green enamel. Arrange in countless geometric formations around your pooja thali or entryway.",
    details: [
      "7 modular MDF base pieces with kundan work",
      "Includes 6 matching metal tealight diyas",
      "Instant mess-free rangoli — reusable for years",
      "Gift boxed with velvet-lined protective tray"
    ],
    sizes: ["7-Piece Set (Approx. 40 cm span)"],
    colors: ["Ruby, Emerald & Gold"],
    availability: "in_stock",
    stock_quantity: 30,
    badge: "Bestseller",
    isNew: false,
    featured: true
  }
];

export const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
export const COLLECTION_BY_ID = Object.fromEntries(COLLECTIONS.map((c) => [c.id, c]));

export const INSTAGRAM_FEED = [
  "/images/pexels-photo-33243963.jpg",
  USER.diya1,
  USER.diya6,
  "/images/products/brass-samai-stand.jpg",
  USER.diya7,
  USER.diya8,
  "/images/pexels-photo-8819577.jpg",
  USER.diya4
];

export const HERO_IMAGE = "/images/pexels-photo-33243963.jpg";
export const BRAND_STORY_IMAGE = "/images/photo-1775427527606-5b317b5e6a96.jpg";
export const GIFTING_IMAGE = "/images/pexels-photo-28769885.jpg";
