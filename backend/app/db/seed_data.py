from decimal import Decimal
from sqlalchemy.orm import Session
from app.models.admin_user import AdminUser
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.product_image import ProductImage
from app.core.security import get_password_hash
from app.core.config import settings

INITIAL_COLLECTIONS = [
  {
    "slug": "clay-diyas",
    "name": "Traditional Clay Diyas",
    "description": "Hand-moulded terracotta oil lamps from village potters."
  },
  {
    "slug": "decorative-diyas",
    "name": "Decorative Diyas",
    "description": "Hand-painted, beaded & embellished festive lights."
  },
  {
    "slug": "brass-stands",
    "name": "Brass Diya Stands",
    "description": "Heirloom samai & hanging oil lamp stands."
  },
  {
    "slug": "handmade-artistic",
    "name": "Handmade Artistic Diyas",
    "description": "Intricate peacock, lotus & floral sculpted diya art."
  },
  {
    "slug": "gift-hampers",
    "name": "Festive Hampers",
    "description": "Curated Diwali gifting boxes with lamps & keepsakes."
  },
  {
    "slug": "rangoli-decor",
    "name": "Rangoli & Festive Decor",
    "description": "Brass urli bowls, marigold strings & rangoli mats."
  }
]

INITIAL_PRODUCTS = [
  {
    "slug": "pearl-ring-diya-set",
    "name": "Pearl Ring Tealight Diya Set",
    "category_slug": "decorative-diyas",
    "price": Decimal("1299.00"),
    "old_price": Decimal("1599.00"),
    "images": ["/images/3be7aa21a985f477_diya1.jpeg"],
    "description": "A radiant set of handcrafted tealight diyas wrapped in silk thread, bordered with pearl beads and gold ghungroos. Each piece glows with warmth and old-world charm — a perfect centrepiece for your pooja thali or dining table on Diwali night.",
    "details": [
      "Set of 6 handcrafted tealight diyas",
      "Silk thread, pearl bead & metallic ghungroo work",
      "Includes 6 wax tealights",
      "Approximate diameter: 6 cm each"
    ],
    "sizes": ["Set of 4", "Set of 6", "Set of 12"],
    "colors": ["Multicolour", "Gold", "Maroon"],
    "stock_quantity": 45,
    "is_available": True,
    "badge": "Bestseller",
    "is_new": False,
    "featured": True
  },
  {
    "slug": "emerald-silk-diya",
    "name": "Emerald Silk Thread Diya",
    "category_slug": "decorative-diyas",
    "price": Decimal("349.00"),
    "images": ["/images/3b5cb3863aaec5a7_diya 4.jpeg"],
    "description": "A single statement diya wound with emerald silk thread, framed by lustrous pearl and antique gold beading. Mounted on a rustic wood slice, it feels like a sliver of festive heirloom.",
    "details": [
      "Single handcrafted tealight diya",
      "Emerald silk thread with pearl & gold bead border",
      "Includes 1 wax tealight",
      "Approximate diameter: 7 cm"
    ],
    "sizes": ["Single"],
    "colors": ["Emerald", "Ruby", "Royal Blue"],
    "stock_quantity": 30,
    "is_available": True,
    "is_new": True,
    "featured": True
  },
  {
    "slug": "kundan-saffron-pair",
    "name": "Kundan Saffron Diya Pair",
    "category_slug": "handmade-artistic",
    "price": Decimal("899.00"),
    "images": ["/images/3a4a127c60f86a88_diya6.jpeg"],
    "description": "A delicate pair of silk-wrapped diyas crowned with kundan motifs, pearl drops and golden tassels. Light them on a brass thali for a photograph-worthy Diwali tableau.",
    "details": [
      "Pair of hand-finished diyas",
      "Kundan motif, pearl drops & gold tassel",
      "Includes 2 LED tealights (reusable)",
      "Approximate diameter: 8 cm each"
    ],
    "sizes": ["Pair"],
    "colors": ["Saffron & Yellow", "Red & Gold"],
    "stock_quantity": 25,
    "is_available": True,
    "badge": "Handcrafted",
    "is_new": False,
    "featured": True
  },
  {
    "slug": "marigold-wheel-plate",
    "name": "Marigold Wheel Rangoli Diya Plate",
    "category_slug": "rangoli-decor",
    "price": Decimal("1499.00"),
    "images": ["/images/photo-1699860807907-d14a60827a25.jpg"],
    "description": "A spoked saffron wheel woven in silk thread, encircled with pearl flowers and crystal border — holds a tealight at its heart. Equal parts rangoli, equal parts diya.",
    "details": [
      "Handwoven saffron silk thread wheel",
      "Pearl flower & crystal border",
      "Includes 1 wax tealight",
      "Approximate diameter: 20 cm"
    ],
    "sizes": ["Standard"],
    "colors": ["Saffron"],
    "stock_quantity": 20,
    "is_available": True,
    "is_new": True,
    "featured": True
  },
  {
    "slug": "blush-lotus-crochet-diya",
    "name": "Blush Lotus Crochet Diya",
    "category_slug": "handmade-artistic",
    "price": Decimal("599.00"),
    "images": ["/images/92c19ab4c84ce789_diya7.jpeg"],
    "description": "A soft, blush-pink crochet lotus with pearl centres — a quiet, poetic counterpoint to the brass and gold of a Diwali table. Hand-crocheted by women artisans.",
    "details": [
      "Hand-crocheted cotton lace in blush & ivory",
      "Pearl bead accents",
      "Includes 1 wax tealight",
      "Approximate diameter: 10 cm"
    ],
    "sizes": ["Single", "Set of 2"],
    "colors": ["Blush", "Ivory", "Sage"],
    "stock_quantity": 35,
    "is_available": True,
    "badge": "New",
    "is_new": True,
    "featured": True
  },
  {
    "slug": "classic-clay-diya-dozen",
    "name": "Classic Clay Diyas · Dozen",
    "category_slug": "clay-diyas",
    "price": Decimal("249.00"),
    "images": ["/images/products/classic-clay-diya-dozen.jpg"],
    "description": "Twelve pure terracotta diyas thrown on the wheel and sun-dried the traditional way — ready to be filled with ghee or mustard oil. The soul of every Indian Diwali.",
    "details": [
      "Pack of 12 unglazed terracotta diyas",
      "Hand-thrown by village potters",
      "Food-safe clay, no chemical coating",
      "Approximate diameter: 5 cm each"
    ],
    "sizes": ["Pack of 12", "Pack of 24", "Pack of 51"],
    "colors": ["Terracotta"],
    "stock_quantity": 100,
    "is_available": True,
    "is_new": False,
    "featured": True
  },
  {
    "slug": "brass-samai-stand",
    "name": "Antique Brass Samai Stand",
    "category_slug": "brass-stands",
    "price": Decimal("2499.00"),
    "images": ["/images/products/brass-samai-stand.jpg"],
    "description": "A tall, hand-cast brass samai with a classic bell-and-leaf finial, inspired by the lamps of Maharashtra. Holds five wicks for a steady, meditative glow.",
    "details": [
      "Hand-cast brass samai lamp",
      "Five-wick traditional design",
      "Approximate height: 30 cm",
      "Comes with a soft polishing cloth"
    ],
    "sizes": ['9"', '12"', '15"'],
    "colors": ["Antique Brass"],
    "stock_quantity": 15,
    "is_available": True,
    "badge": "Heirloom",
    "is_new": False,
    "featured": False
  },
  {
    "slug": "diwali-essential-hamper",
    "name": "The Diwali Essentials Hamper",
    "category_slug": "gift-hampers",
    "price": Decimal("1899.00"),
    "old_price": Decimal("2299.00"),
    "images": ["/images/pexels-photo-8819577.jpg"],
    "description": "A thoughtfully curated gift box with handcrafted diyas, scented wax candles, a mini brass urli and a handwritten festive note — wrapped in khadi and gold ribbon.",
    "details": [
      "4 handcrafted diyas · 2 scented candles · 1 mini brass urli",
      "Khadi-wrapped keepsake box",
      "Includes a handwritten festive note (optional)",
      "Corporate gifting available"
    ],
    "sizes": ["Classic", "Premium", "Luxe"],
    "colors": ["Maroon & Gold"],
    "stock_quantity": 18,
    "is_available": True,
    "badge": "Gifting",
    "is_new": True,
    "featured": False
  },
  {
    "slug": "rangoli-brass-urli",
    "name": "Brass Urli with Floating Diyas",
    "category_slug": "rangoli-decor",
    "price": Decimal("1799.00"),
    "images": ["/images/photo-1775427527606-5b317b5e6a96.jpg"],
    "description": "An elegant brass urli bowl paired with four floating lotus diyas and marigold petals — the loveliest welcome at your entrance on Diwali evening.",
    "details": [
      "Hand-cast brass urli bowl (approx. 25 cm)",
      "Four floating lotus-shaped tealight diyas",
      "Includes a pouch of dried marigold petals"
    ],
    "sizes": ["Small", "Medium", "Large"],
    "colors": ["Brass"],
    "stock_quantity": 8,
    "is_available": True,
    "is_new": False,
    "featured": False
  },
  {
    "slug": "peacock-artisan-diya",
    "name": "Peacock Artisan Diya",
    "category_slug": "handmade-artistic",
    "price": Decimal("749.00"),
    "images": ["/images/e22aae87214a1afa_diya 8.jpeg"],
    "description": "A sculpted peacock diya hand-finished in antique gold and ruby — a tribute to the Mor of Mughal miniatures. A single piece lights up a whole shelf.",
    "details": [
      "Hand-sculpted resin peacock diya",
      "Antique gold & ruby finish",
      "Includes 1 reusable LED tealight"
    ],
    "sizes": ["Standard"],
    "colors": ["Antique Gold", "Ruby"],
    "stock_quantity": 22,
    "is_available": True,
    "is_new": False,
    "featured": False
  },
  {
    "slug": "ivory-crochet-diya-set",
    "name": "Ivory Crochet Diya · Set of 2",
    "category_slug": "decorative-diyas",
    "price": Decimal("999.00"),
    "images": ["/images/products/ivory-crochet-diya-set.jpg"],
    "description": "Delicate ivory and blush crochet diyas with pearl detailing — hand-crocheted by women artisans in Lucknow. A whisper-soft, modern take on Diwali light.",
    "details": [
      "Set of 2 hand-crocheted lace diyas",
      "Pearl bead work",
      "Includes 2 wax tealights"
    ],
    "sizes": ["Set of 2"],
    "colors": ["Blush", "Ivory"],
    "stock_quantity": 14,
    "is_available": True,
    "badge": "Artisan",
    "is_new": True,
    "featured": False
  },
  {
    "slug": "mini-lantern-hamper",
    "name": "Festive Lantern Mini Hamper",
    "category_slug": "gift-hampers",
    "price": Decimal("1299.00"),
    "images": ["/images/pexels-photo-28769885.jpg"],
    "description": "A compact gift box with a mini brass lantern, a pair of decorative diyas, dry fruits and a card. Thoughtful for colleagues, neighbours and secret-santa Diwali.",
    "details": [
      "1 mini brass lantern · 2 decorative diyas",
      "100g dry fruit assortment (packed hygienically)",
      "Khadi gift pouch with a festive card"
    ],
    "sizes": ["Mini"],
    "colors": ["Maroon & Gold"],
    "stock_quantity": 12,
    "is_available": True,
    "is_new": False,
    "featured": False
  },
  {
    "slug": "aesthetic-diya",
    "name": "Aesthetic Handcrafted Diya",
    "category_slug": "decorative-diyas",
    "price": Decimal("159.00"),
    "images": ["/images/products/aesthetic-floral-diya.jpg"],
    "description": "An artisanal handcrafted terracotta floral diya sculpted with gentle petal contours and finished in warm festive hues. Ideal for pooja alcoves and quiet festive corners.",
    "details": [
      "Single artisan sculpted earthen diya",
      "Hand-painted petal borders",
      "Compatible with cotton wicks and oil"
    ],
    "sizes": ["Single"],
    "colors": ["Terracotta and Gold"],
    "stock_quantity": 10,
    "is_available": True,
    "is_new": False,
    "featured": False
  },
  {
    "slug": "kolkata-terracotta-carved-diyas",
    "name": "Kumartuli Hand-Carved Terracotta Diyas (Set of 6)",
    "category_slug": "clay-diyas",
    "price": Decimal("499.00"),
    "old_price": Decimal("699.00"),
    "images": ["/images/products/kolkata-terracotta-carved-diyas.jpg"],
    "description": "Moulded from sacred Ganges alluvial clay by hereditary Kumartuli potters and hand-chiseled with floral sunburst motifs. When lit with mustard oil, they emit an earthy petrichor scent that embodies classic Diwali nostalgia.",
    "details": [
      "Set of 6 hand-carved clay diyas",
      "Natural unglazed terracotta finish",
      "Deep oil wells designed for 4+ hour continuous burn",
      "Traditional cotton battis included"
    ],
    "sizes": ["Set of 6", "Set of 12"],
    "colors": ["Earthy Terracotta"],
    "stock_quantity": 40,
    "badge": "Artisan Handcrafted",
    "is_new": True,
    "featured": True
  },
  {
    "slug": "panchmukhi-auspicious-clay-diya",
    "name": "Panchmukhi Five-Wick Earthen Diya (Set of 2)",
    "category_slug": "clay-diyas",
    "price": Decimal("549.00"),
    "old_price": Decimal("749.00"),
    "images": ["/images/products/panchmukhi-auspicious-clay-diya.jpg"],
    "description": "A commanding five-pointed clay diya symbolizing the five cosmic elements (Panchabhuta). Hand-pressed on potter's wheels in rural Rajasthan, this sacred vessel is traditionally lit at the main entrance to invoke auspicious blessings.",
    "details": [
      "Pack of 2 five-wick deepaks",
      "100% natural kiln-baked terracotta",
      "Capacity for 5 cotton wicks simultaneously",
      "Approximate diameter: 12 cm"
    ],
    "sizes": ["Set of 2", "Set of 4"],
    "colors": ["Natural Clay Red"],
    "stock_quantity": 32,
    "badge": "Auspicious",
    "is_new": False,
    "featured": False
  },
  {
    "slug": "matki-terracotta-diya-set",
    "name": "Heritage Matki Terracotta Diya Set (Pack of 8)",
    "category_slug": "clay-diyas",
    "price": Decimal("649.00"),
    "old_price": Decimal("899.00"),
    "images": ["/images/products/matki-terracotta-diya-set.jpg"],
    "description": "Charming miniature pot-shaped diyas adorned with subtle white tribal warli etchings. These stable, wind-resistant lamps protect the flame from autumn breezes on verandahs and balconies.",
    "details": [
      "Set of 8 pot-style clay lamps",
      "Eco-friendly, lead-free natural earthenware",
      "Deep cavity resists wind flicker",
      "Includes complimentary raw cotton wicks"
    ],
    "sizes": ["Set of 8", "Set of 16"],
    "colors": ["Terracotta with White Warli"],
    "stock_quantity": 50,
    "badge": "Bestseller",
    "is_new": True,
    "featured": False
  },
  {
    "slug": "royal-meenakari-floral-diyas",
    "name": "Royal Jaipuri Meenakari Diya (Set of 4)",
    "category_slug": "decorative-diyas",
    "price": Decimal("1499.00"),
    "old_price": Decimal("1899.00"),
    "images": ["/images/products/royal-meenakari-floral-diyas.jpg"],
    "description": "Inspired by the royal courts of Amber, each diya features intricate enamelled floral art in deep crimson, emerald green and gold foil. Finished with hand-strung seed pearls that catch the flicker of warm candlelight.",
    "details": [
      "Set of 4 enamelled metal diyas",
      "Hand-painted Meenakari craftsmanship",
      "Includes 4 soy-wax smokeless tealights",
      "Velvet gift pouch included"
    ],
    "sizes": ["Set of 4", "Set of 8"],
    "colors": ["Crimson & Gold", "Peacock Blue & Gold"],
    "stock_quantity": 28,
    "badge": "Royal Heritage",
    "is_new": True,
    "featured": True
  },
  {
    "slug": "mirror-work-zari-tealight-set",
    "name": "Kutch Mirror Work Zari Diya Holders (Set of 6)",
    "category_slug": "decorative-diyas",
    "price": Decimal("1199.00"),
    "old_price": Decimal("1449.00"),
    "images": ["/images/products/mirror-work-zari-tealight-set.jpg"],
    "description": "Vibrant raw silk and velvet borders embedded with shisha mirror embroidery and golden gota patti lace. The mirrors create a glittering halo around each burning flame, multiplying the festive radiance.",
    "details": [
      "Set of 6 embellished tealight holders",
      "Authentic Gujarat mirror-work & zari lace",
      "Heat-resistant metal inner casing",
      "Diameter: 7.5 cm each"
    ],
    "sizes": ["Set of 6"],
    "colors": ["Festive Jewel Tones", "Maroon & Antique Gold"],
    "stock_quantity": 35,
    "badge": "Festive Edit",
    "is_new": False,
    "featured": False
  },
  {
    "slug": "ghungroo-gemstone-diya-pair",
    "name": "Ghungroo & Gemstone Festive Diya Pair",
    "category_slug": "decorative-diyas",
    "price": Decimal("849.00"),
    "old_price": Decimal("1099.00"),
    "images": ["/images/products/ghungroo-gemstone-diya-pair.jpg"],
    "description": "Faceted teardrop glass crystals and brass ghungroos border a deep metallic bowl. Gentle movement produces a delicate, auspicious chime reminiscent of temple ceremonies.",
    "details": [
      "Pair of 2 decorative brass-plated diyas",
      "Tinkling brass bells and ruby glass stones",
      "Reusable wax or oil basin",
      "Gift-ready gold packaging"
    ],
    "sizes": ["Pair"],
    "colors": ["Gold & Ruby", "Gold & Amber"],
    "stock_quantity": 22,
    "badge": "Trending",
    "is_new": True,
    "featured": False
  },
  {
    "slug": "mayur-peacock-brass-hanging-diya",
    "name": "Mayur Peacock Hanging Brass Diya with Chain",
    "category_slug": "brass-stands",
    "price": Decimal("2499.00"),
    "old_price": Decimal("2999.00"),
    "images": ["/images/products/mayur-peacock-brass-hanging-diya.jpg"],
    "description": "Cast in virgin yellow brass by Aligarh metallurgists, this hanging deepak features an engraved peacock perched proudly atop a lotus cup, suspended from a sturdy 18-inch link chain with brass bell pendants.",
    "details": [
      "Solid virgin brass (Net Weight: ~850g)",
      "Length with chain: 55 cm",
      "Peacock crest with five-wick oil basin",
      "Hand-polished antique golden patina"
    ],
    "sizes": ["Medium (18-inch chain)", "Large (24-inch chain)"],
    "colors": ["Antique Brass"],
    "stock_quantity": 16,
    "badge": "Heirloom",
    "is_new": True,
    "featured": True
  },
  {
    "slug": "ashtalakshmi-brass-oil-lamp",
    "name": "Ashtalakshmi Engraved Brass Diya Stand",
    "category_slug": "brass-stands",
    "price": Decimal("3299.00"),
    "old_price": Decimal("3899.00"),
    "images": ["/images/products/ashtalakshmi-brass-oil-lamp.jpg"],
    "description": "A majestic temple-grade brass oil lamp featuring the eight auspicious forms of Goddess Lakshmi embossed around the base. Designed for heirloom longevity, this lamp serves as the spiritual crown of any pooja altar.",
    "details": [
      "Heavy cast brass construction (Net Weight: ~1.2 kg)",
      "Height: 30 cm, Base: 14 cm",
      "Deep central oil reservoir for long aartis",
      "Coated with clear tarnish-resistant protective finish"
    ],
    "sizes": ["Standard (30 cm)", "Grand (42 cm)"],
    "colors": ["Temple Brass"],
    "stock_quantity": 12,
    "badge": "Temple Grade",
    "is_new": False,
    "featured": True
  },
  {
    "slug": "kamal-brass-pooja-thali-stand",
    "name": "Kamal Petal 3-Tier Brass Diya Stand",
    "category_slug": "brass-stands",
    "price": Decimal("1999.00"),
    "old_price": Decimal("2499.00"),
    "images": ["/images/products/kamal-brass-pooja-thali-stand.jpg"],
    "description": "Three graduated tiers of blooming lotus petals crafted from polished brass. Accommodates 15 individual wicks, creating a spectacular pyramid of living light that dazzles festive gatherings.",
    "details": [
      "3-tiered modular brass lamp stand",
      "Accommodates 15 wicks across 3 levels",
      "Height: 22 cm, Stable weighted base",
      "Easy screw-assembly for cleaning and storage"
    ],
    "sizes": ["3-Tier"],
    "colors": ["Golden Brass"],
    "stock_quantity": 20,
    "badge": "Bestseller",
    "is_new": True,
    "featured": False
  },
  {
    "slug": "sahasrara-thousand-petal-lotus-diya",
    "name": "Sahasrara Lotus Brass & Clay Diya",
    "category_slug": "handmade-artistic",
    "price": Decimal("1149.00"),
    "old_price": Decimal("1399.00"),
    "images": ["/images/products/sahasrara-thousand-petal-lotus-diya.jpg"],
    "description": "A multi-layered sculptural piece where concentric brass petals emerge from a terracotta core, mimicking the Sahasrara crown lotus. Hand-antiqued edges lend a regal vintage character.",
    "details": [
      "Layered sheet-brass petals on clay foundation",
      "Hand-hammered texture with antique patina",
      "Accommodates standard tealight or organic ghee wick",
      "Diameter: 14 cm"
    ],
    "sizes": ["Standard (14 cm)"],
    "colors": ["Antique Brass & Terracotta"],
    "stock_quantity": 26,
    "badge": "Master Artisan",
    "is_new": True,
    "featured": True
  },
  {
    "slug": "shubh-labh-ganesha-carved-diya",
    "name": "Shubh Labh Ganesha Sculpted Diya",
    "category_slug": "handmade-artistic",
    "price": Decimal("949.00"),
    "old_price": Decimal("1199.00"),
    "images": ["/images/products/shubh-labh-ganesha-carved-diya.jpg"],
    "description": "Hand-moulded terracotta and fine stoneware clay depicting Vignaharta Ganesha seated behind an auspicious oil flame, flanked by Shubh-Labh engravings. An essential centerpiece for Diwali pooja rituals.",
    "details": [
      "Hand-sculpted clay with natural mineral pigments",
      "Integrated deep oil bowl for pure ghee burning",
      "Dimensions: 12 cm x 10 cm x 8 cm",
      "Blessed with sacred Kalawa thread"
    ],
    "sizes": ["Standard"],
    "colors": ["Terracotta & Gold Foil"],
    "stock_quantity": 30,
    "badge": "Pooja Special",
    "is_new": False,
    "featured": False
  },
  {
    "slug": "dhokra-tribal-brass-oil-diya",
    "name": "Dhokra Lost-Wax Tribal Brass Diya",
    "category_slug": "handmade-artistic",
    "price": Decimal("1399.00"),
    "old_price": Decimal("1699.00"),
    "images": ["/images/products/dhokra-tribal-brass-oil-diya.jpg"],
    "description": "Created using the 4,000-year-old lost-wax casting technique by Bastar tribal artisans. Every piece is unique, featuring rustic corded wire textures and primitive elephant motifs holding a brass cup.",
    "details": [
      "Authentic Dhokra bell-metal bronze casting",
      "100% handcrafted — no two pieces are identical",
      "Non-toxic, heirloom metallic alloy",
      "Includes artisan authenticity certificate"
    ],
    "sizes": ["Artisan Original"],
    "colors": ["Raw Bell-Metal Patina"],
    "stock_quantity": 15,
    "badge": "GI Certified Craft",
    "is_new": True,
    "featured": False
  },
  {
    "slug": "rajasthani-royal-diwali-box",
    "name": "Royal Rajwada Diya & Dhoop Gift Hamper",
    "category_slug": "gift-hampers",
    "price": Decimal("2899.00"),
    "old_price": Decimal("3499.00"),
    "images": ["/images/products/rajasthani-royal-diwali-box.jpg"],
    "description": "A luxurious maroon velvet keepsake box embossed with golden peacocks. Unveils 4 handcrafted silk thread diyas, a brass pooja bell, organic rose and sandalwood dhoop cones, and a brass wick trimmer.",
    "details": [
      "Maroon velvet & gold foil keepsake box",
      "4 embellished silk thread pearl diyas",
      "1 solid brass pooja bell + pure dhoop cones",
      "50 organic cow ghee wicks + custom gift card"
    ],
    "sizes": ["Royal Rajwada Edition"],
    "colors": ["Maroon & Gold"],
    "stock_quantity": 20,
    "badge": "Luxury Gift",
    "is_new": True,
    "featured": True
  },
  {
    "slug": "shilpakar-terracotta-craft-hamper",
    "name": "Shilpakar Master Potter Gift Hamper",
    "category_slug": "gift-hampers",
    "price": Decimal("1699.00"),
    "old_price": Decimal("2199.00"),
    "images": ["/images/products/shilpakar-terracotta-craft-hamper.jpg"],
    "description": "Curated for lovers of pure organic craftsmanship: 12 assorted village terracotta diyas, a bottle of cold-pressed fragrant sesame lamp oil, hand-spun raw cotton battis, and an artisan brass matchbox case.",
    "details": [
      "12 assorted handcrafted terracotta lamps",
      "100ml cold-pressed pooja oil bottle",
      "100 organic hand-spun cotton wicks",
      "Brass matchbox case in jute basket packaging"
    ],
    "sizes": ["Classic Craft Basket"],
    "colors": ["Organic Jute & Terracotta"],
    "stock_quantity": 25,
    "badge": "Eco-Friendly",
    "is_new": False,
    "featured": False
  },
  {
    "slug": "handcrafted-brass-urli-peacock-handles",
    "name": "Hand-Hammered Brass Urli with Peacock Handles",
    "category_slug": "rangoli-decor",
    "price": Decimal("2799.00"),
    "old_price": Decimal("3299.00"),
    "images": ["/images/products/handcrafted-brass-urli-peacock-handles.jpg"],
    "description": "A 12-inch wide hand-beaten brass urli vessel crowned with sculpted peacock handles. Fill with fresh water, floating marigold petals, and fragrant candles to create an unforgettable welcome at your threshold.",
    "details": [
      "Heavy gauge virgin brass (Weight: ~1.4 kg)",
      "Diameter: 30 cm (12 inches)",
      "Sculpted twin peacock handles with floral rim",
      "Includes 6 floating lotus-shaped tealights"
    ],
    "sizes": ["12-inch Diameter", "14-inch Diameter"],
    "colors": ["Gleaming Antique Brass"],
    "stock_quantity": 14,
    "badge": "Centerpiece",
    "is_new": True,
    "featured": True
  },
  {
    "slug": "kundan-wooden-rangoli-diya-mat",
    "name": "Kundan & Pearl Multi-Piece Rangoli Diya Mat",
    "category_slug": "rangoli-decor",
    "price": Decimal("1399.00"),
    "old_price": Decimal("1799.00"),
    "images": ["/images/products/kundan-wooden-rangoli-diya-mat.jpg"],
    "description": "A 7-piece modular wooden rangoli set encrusted with lustrous kundan gemstones, pearl borders, and vivid green enamel. Arrange in countless geometric formations around your pooja thali or entryway.",
    "details": [
      "7 modular MDF base pieces with kundan work",
      "Includes 6 matching metal tealight diyas",
      "Instant mess-free rangoli — reusable for years",
      "Gift boxed with velvet-lined protective tray"
    ],
    "sizes": ["7-Piece Set (Approx. 40 cm span)"],
    "colors": ["Ruby, Emerald & Gold"],
    "stock_quantity": 30,
    "badge": "Bestseller",
    "is_new": False,
    "featured": True
  }
]

def seed_database(db: Session):
    # 1. Seed Admin
    admin_email = settings.INITIAL_ADMIN_EMAIL.strip().lower()
    admin = db.query(AdminUser).filter(AdminUser.email == admin_email).first()
    if not admin:
        admin = AdminUser(
            email=admin_email,
            password_hash=get_password_hash(settings.INITIAL_ADMIN_PASSWORD),
            role="superadmin",
            is_active=True
        )
        db.add(admin)
        db.commit()

    # 2. Seed Categories
    category_map = {}
    for cat_data in INITIAL_COLLECTIONS:
        cat = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if not cat:
            cat = Category(
                name=cat_data["name"],
                slug=cat_data["slug"],
                description=cat_data["description"],
                is_active=True
            )
            db.add(cat)
            db.commit()
            db.refresh(cat)
        category_map[cat.slug] = cat.id

    # 3. Seed Products
    for prod_data in INITIAL_PRODUCTS:
        prod = db.query(Product).filter(Product.slug == prod_data["slug"]).first()
        if not prod:
            cat_id = category_map.get(prod_data["category_slug"])
            product = Product(
                name=prod_data["name"],
                slug=prod_data["slug"],
                description=prod_data["description"],
                price=prod_data["price"],
                old_price=prod_data.get("old_price"),
                category_id=cat_id,
                stock_quantity=prod_data.get("stock_quantity", 10),
                is_available=prod_data.get("is_available", True),
                badge=prod_data.get("badge"),
                is_new=prod_data.get("is_new", False),
                featured=prod_data.get("featured", False),
                details=prod_data.get("details", []),
                sizes=prod_data.get("sizes", []),
                colors=prod_data.get("colors", [])
            )
            db.add(product)
            db.flush()

            for idx, img_url in enumerate(prod_data.get("images", [])):
                img = ProductImage(
                    product_id=product.id,
                    image_url=img_url,
                    display_order=idx,
                    alt_text=f"{product.name} image {idx + 1}"
                )
                db.add(img)

            db.commit()

    # 4. Seed Demo Customer / Patron User
    demo_patron = db.query(User).filter(User.email == "patron@shubhdeep.in").first()
    if not demo_patron:
        patron = User(
            name="Meera Sharma",
            email="patron@shubhdeep.in",
            phone="9811122233",
            password_hash=get_password_hash("Patron@ShubhDeep2026"),
            delivery_address="Flat 402, Lotus Greens, Sector 78, Noida, Uttar Pradesh 201301",
            is_active=True
        )
        db.add(patron)
        db.commit()

if __name__ == "__main__":
    from app.db.session import SessionLocal
    from app.models.base import Base
    from app.db.session import engine
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_database(session)
        print("Database seeded successfully!")
