import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1LAbc1vBzU7z4brVLRZ3gNFc3AjbPldk",
    authDomain: "show-me-stl.firebaseapp.com",
    projectId: "show-me-stl",
    storageBucket: "show-me-stl.firebasestorage.app",
    messagingSenderId: "915773859776",
    appId: "1:915773859776:web:b1bf9c5f70c35a57b5ca25",
    measurementId: "G-6B7NH1E88R"
  };

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Array of places with updated schema
const places = [
  {
    Title: "High Bar",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F2c99285afaf110f7efaa5e319319ab747f754b18fd676fbbabf6580198768aa2_HighBar-l54OSrk1b2FwMmBVpJjiT0B6thXfau.webp&w=3840&q=75",
    description: "Experience industrial-chic vibes at High Bar Clayton MO, atop the AC Hotel St. Louis. Savor American-style tapas while enjoying breathtaking skyline views.",
    address: "227 S Central Ave 11th Floor, Clayton, MO 63105",
    url: "https://www.highbarclayton.com/",
    Category: [
      "1sW0wombE2v17vr6TaTX", // Night Life
      "UNqc7U8DQaINNOUyZhka", // Drink
      "rMttCRUv4lYUai4O2Cxh"  // Cocktail Lounge
    ],
    metadata: "High Bar is a chic rooftop bar and restaurant located atop the 11-story AC Hotel by Marriott in Clayton, Missouri, at 227 South Central Avenue. Opened in November 2024, it has quickly become a popular destination for both locals and visitors seeking an elevated dining experience. The ambiance at High Bar is industrial-chic, featuring leather, copper, and suspended islands of striated wood, creating a modern yet comfortable setting. Guests can enjoy panoramic views of the Clayton skyline, making it an ideal spot for evening cocktails or intimate gatherings. The menu offers American-style tapas crafted from locally sourced ingredients. Popular dishes include citrus shrimp, baked ricotta, flatbreads, charred zucchini, and a seared tuna stack. Entrées feature hangar steak with chimichurri, grilled chicken thighs, a half-pound white cheddar burger with bacon and caramelized onion, and pesto rigatoni. The beverage program includes 18 classic cocktails and 12 specialty drinks with local flair, such as the Forest Park Fizz, Soulard Sangria, and The 400, honoring the perfect Bar Exam score. High Bar operates Sunday to Thursday from 4:00 PM to 11:00 PM, and on Fridays and Saturdays from 4:00 PM to 12:00 AM. Reservations are recommended and can be made through OpenTable. Overall, High Bar provides a sophisticated atmosphere with quality cuisine and exceptional views, making it a standout addition to Clayton's dining scene.",
    hours: {
      sunday: { open: "4:00 PM", close: "11:00 PM" },
      monday: { open: "4:00 PM", close: "11:00 PM" },
      tuesday: { open: "4:00 PM", close: "11:00 PM" },
      wednesday: { open: "4:00 PM", close: "11:00 PM" },
      thursday: { open: "4:00 PM", close: "11:00 PM" },
      friday: { open: "4:00 PM", close: "12:00 AM" },
      saturday: { open: "4:00 PM", close: "12:00 AM" }
    }
  },
  {
    Title: "Blood & Sand",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F5837ccc7d3ae54bd24dd436c52eb7fed5bf2a9951dbadf706374a5806e4f734f_bloodandsaintlouis-54viw7PEvANr0PYf3w7zY83e9V0QwL.jpg&w=3840&q=75",
    description: "An upscale, members-only parlor serving craft cocktails and inventive New American cuisine in an elegant setting. Reservations are required, and the menu includes vegetarian-friendly options.",
    address: "1500 St Charles St, St. Louis, MO 63103",
    url: "https://www.bloodandsandstl.com/",
    Category: [
      "wSCua4hTEWiDvc3RKIVE", // Fine Dinning
      "QGjfi6bxVEwJa7xz96GP", // Food
      "UNqc7U8DQaINNOUyZhka"  // Drink
    ],
    metadata: "Blood & Sand is a nationally recognized restaurant and bar located at 1500 St Charles Street in downtown St. Louis, Missouri. Known for its innovative cuisine, handcrafted cocktails, and intimate service, the establishment offers a refined and inviting atmosphere for guests seeking a unique dining experience. Dinner hours are Monday–Thursday from 5:00 PM to 9:00 PM and Friday & Saturday from 5:00 PM to 10:00 PM. (Bar hours: Monday–Thursday 5:00 PM–10:00 PM, Friday & Saturday 5:00 PM–11:00 PM.) Reservations are encouraged.",
    hours: {
      monday: { open: "5:00 PM", close: "9:00 PM" },
      tuesday: { open: "5:00 PM", close: "9:00 PM" },
      wednesday: { open: "5:00 PM", close: "9:00 PM" },
      thursday: { open: "5:00 PM", close: "9:00 PM" },
      friday: { open: "5:00 PM", close: "10:00 PM" },
      saturday: { open: "5:00 PM", close: "10:00 PM" },
      sunday: { open: "Closed", close: "Closed" }
    }
  },
  {
    Title: "The Gramophone",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2Fa8d9d18e5c819381a0835d62823c4fbee007347f8640df1b734c89f7d4667e0b_gramophon-aBVU9owbCYvYxVJKfxcG6cUdfErkA5.jpg&w=3840&q=75",
    description: "A lively Grove hotspot serving sandwiches and a wide selection of beer from lunchtime to late night. Enjoy outdoor seating, great cocktails, and a vibrant atmosphere with DJs and live music—no reservations needed.",
    address: "4243 Manchester Ave, St. Louis, MO 63110",
    url: "https://www.gramophonestl.com/",
    Category: [
      "QGjfi6bxVEwJa7xz96GP" // Food
    ],
    metadata: "The Gramophone is a renowned sandwich pub located at 4243 Manchester Avenue in St. Louis's vibrant Grove neighborhood. Originally established as a music venue, it has since transitioned into a popular spot known for its creative sandwiches, extensive craft beer selection, and lively atmosphere. Hours: Tuesday to Saturday: 11:00 AM – 1:30 AM (Kitchen open until 1:00 AM); Sunday: 11:00 AM – 12:00 AM (Kitchen open until 11:30 PM); Monday: Closed.",
    hours: {
      monday: { open: "Closed", close: "Closed" },
      tuesday: { open: "11:00 AM", close: "1:30 AM" },
      wednesday: { open: "11:00 AM", close: "1:30 AM" },
      thursday: { open: "11:00 AM", close: "1:30 AM" },
      friday: { open: "11:00 AM", close: "1:30 AM" },
      saturday: { open: "11:00 AM", close: "1:30 AM" },
      sunday: { open: "11:00 AM", close: "12:00 AM" }
    }
  },
  {
    Title: "Adriana's on the Hill",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2Ff733b394ba55dcdc3789519466713ecd4b5ad1b08d5956dc217c2bdeaaf78a2c_adrianna-YMMKbZ8EKvfLJ7BNaABs06y62MlVis.jpg&w=3840&q=75",
    description: "Longtime family-owned cafe offering Sicilian lunch fare in a quaint, counter-service setting.",
    address: "5101 Shaw Ave, St. Louis, MO 63110",
    url: "https://www.adrianasonthehill.com/",
    Category: [
      "QGjfi6bxVEwJa7xz96GP" // Food
    ],
    metadata: "Adriana's on the Hill is a beloved, family-owned lunch café in St. Louis's historic Italian neighborhood, The Hill. Established in 1992, it offers hearty sandwiches, salads, and sides. Hours: Monday–Saturday: 10:30 AM – 3:00 PM; Sunday: Closed.",
    hours: {
      monday: { open: "10:30 AM", close: "3:00 PM" },
      tuesday: { open: "10:30 AM", close: "3:00 PM" },
      wednesday: { open: "10:30 AM", close: "3:00 PM" },
      thursday: { open: "10:30 AM", close: "3:00 PM" },
      friday: { open: "10:30 AM", close: "3:00 PM" },
      saturday: { open: "10:30 AM", close: "3:00 PM" },
      sunday: { open: "Closed", close: "Closed" }
    }
  },
  {
    Title: "Clementine's Naughty & Nice Ice Cream",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F13f51cd8b3103d334975fe8645df60cdd5a5706988ba4546ecee2ea340b9c699_clementine-g0fcx2pP1pU08me79rcXf1Pla5tt2j.jpg&w=3840&q=75",
    description: "A beloved ice cream shop known for its rich, handcrafted flavors, including boozy 'Naughty' creations and classic 'Nice' options. Offering a mix of indulgent and innovative flavors, Clementine’s is a must-visit for ice cream lovers.",
    address: "308 N Euclid Ave, St. Louis, MO 63108",
    url: "https://www.clementinescreamery.com/pages/central-west-end",
    Category: [
      "QGjfi6bxVEwJa7xz96GP" // Food
    ],
    metadata: "Clementine's Naughty & Nice Creamery is renowned for its handcrafted, small-batch ice creams in categories 'Naughty,' 'Nice,' and vegan. Celebrated for its innovative flavors and national media attention.",
    hours: {
      monday: { open: "11:00 AM", close: "8:00 PM" },
      tuesday: { open: "11:00 AM", close: "8:00 PM" },
      wednesday: { open: "11:00 AM", close: "8:00 PM" },
      thursday: { open: "11:00 AM", close: "8:00 PM" },
      friday: { open: "11:00 AM", close: "8:00 PM" },
      saturday: { open: "11:00 AM", close: "8:00 PM" },
      sunday: { open: "11:00 AM", close: "8:00 PM" }
    }
  },
  {
    Title: "Cafe Napoli",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F33073882ab90d3d2ed71426c6ce9205a9b7df9102f3eda5780e0aaba24ddb8cb_cafenapoli-mPIPLRimKAOBpNKVPEvgEtwKY7k1hv.jpg&w=3840&q=75",
    description: "Nestled in the heart of Clayton, Cafe Napoli is a lively, upscale Italian restaurant known for its house-made pastas, prime steaks, and fresh seafood. With expertly crafted dishes, fine wines, and handcrafted cocktails, it’s the perfect spot for a memorable dining experience.",
    address: "7754 Forsyth Blvd, Clayton, MO 63105",
    url: "https://www.napolistl.com/cafe-napoli-menus/",
    Category: [
      "wSCua4hTEWiDvc3RKIVE", // Fine Dinning
      "QGjfi6bxVEwJa7xz96GP"  // Food
    ],
    metadata: "Café Napoli is a distinguished family-owned Italian restaurant in Clayton, established in 1989. It offers authentic Italian dishes such as Linguine alle Vongole and Veal Marsala. Hours: Monday–Thursday: 5:30 PM – 10:00 PM; Friday–Saturday: 5:30 PM – 11:00 PM; Sunday: Closed.",
    hours: {
      monday: { open: "5:30 PM", close: "10:00 PM" },
      tuesday: { open: "5:30 PM", close: "10:00 PM" },
      wednesday: { open: "5:30 PM", close: "10:00 PM" },
      thursday: { open: "5:30 PM", close: "10:00 PM" },
      friday: { open: "5:30 PM", close: "11:00 PM" },
      saturday: { open: "5:30 PM", close: "11:00 PM" },
      sunday: { open: "Closed", close: "Closed" }
    }
  },
  {
    Title: "Pizzeoli Wood Fired Pizza",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F13201bbec66ff1771cc6517b0674f943b4172401f3680953d7b88da862c91069_Pizzeoli%2520Wood%2520Fired%2520Pizza-w0i8fpOvgwRzhCtrvyoRNLpzopakqC.jpg&w=3840&q=75",
    description: "A laid-back spot specializing in Naples-style pizzas with vegetarian and vegan toppings. Enjoy great cocktails, beer, and wine in a casual setting with family-friendly options, including high chairs.",
    address: "1928 S 12th St, St. Louis, MO 63104",
    url: "https://www.pizzeoli.com/",
    Category: [
      "QGjfi6bxVEwJa7xz96GP" // Food
    ],
    metadata: "Pizzeoli Wood Fired Pizza is a cozy, locally-owned pizzeria in Soulard, known for its Neapolitan-inspired, wood-fired pizzas and inventive topping combinations. Hours: Monday – Sunday: 4:00 PM – 9:30 PM.",
    hours: {
      monday: { open: "4:00 PM", close: "9:30 PM" },
      tuesday: { open: "4:00 PM", close: "9:30 PM" },
      wednesday: { open: "4:00 PM", close: "9:30 PM" },
      thursday: { open: "4:00 PM", close: "9:30 PM" },
      friday: { open: "4:00 PM", close: "9:30 PM" },
      saturday: { open: "4:00 PM", close: "9:30 PM" },
      sunday: { open: "4:00 PM", close: "9:30 PM" }
    }
  },
  {
    Title: "Salt + Smoke",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F386fa22d6df06c406626af122eec2b1cb51ca8d8cbbe52db6aceece73cee1ac9_salt%2520and%2520smoke-HIa6cJWpYVC33s5hdq5LGPloPjp5ab.jpg&w=3840&q=75",
    description: "Salt + Smoke is a St. Louis BBQ favorite, serving award-winning smoked meats, bold flavors, and generous portions. Dine in, cater, or get BBQ shipped nationwide.",
    address: "501 Clark Ave, St. Louis, MO 63102",
    url: "https://www.saltandsmokebbq.com/menu/",
    Category: [
      "QGjfi6bxVEwJa7xz96GP" // Food
    ],
    metadata: "Salt + Smoke BBQ is a renowned barbecue chain in St. Louis, celebrated for its authentic, fall-off-the-bone meats and signature sides. It operates Sunday through Thursday from 11:00 AM to 9:00 PM and Friday & Saturday from 11:00 AM to 10:00 PM.",
    hours: {
      sunday: { open: "11:00 AM", close: "9:00 PM" },
      monday: { open: "11:00 AM", close: "9:00 PM" },
      tuesday: { open: "11:00 AM", close: "9:00 PM" },
      wednesday: { open: "11:00 AM", close: "9:00 PM" },
      thursday: { open: "11:00 AM", close: "9:00 PM" },
      friday: { open: "11:00 AM", close: "10:00 PM" },
      saturday: { open: "11:00 AM", close: "10:00 PM" }
    }
  },
  {
    Title: "Florentin",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2Fae24ec11bc37dce1d5ae25575df0600d41addd89b187fc7d6bf5436146864f72_Florentin-BKmtdh1pm1ukxdC7tse0UgZtmZaJCN.jpg&w=3840&q=75",
    description: "Florentin is an Israeli-inspired eatery serving a mostly vegetarian menu inspired by Tel Aviv’s street food scene. From shakshuka and falafel to smoothies and pastries, it’s an all-day spot for coffee, breakfast, and lunch.",
    address: "5090 Delmar Blvd, St. Louis, MO 63108",
    url: "https://bengelina.com/florentin",
    Category: [
      "QGjfi6bxVEwJa7xz96GP" // Food
    ],
    metadata: "Florentin is an Israeli-inspired restaurant in St. Louis's Delmar Maker District, drawing inspiration from Tel Aviv’s bohemian Florentin neighborhood. It emphasizes vegetarian and vegan dishes like shakshuka and falafel. Operates Tuesday to Sunday from 9:00 AM to 3:00 PM; closed on Mondays.",
    hours: {
      monday: { open: "Closed", close: "Closed" },
      tuesday: { open: "9:00 AM", close: "3:00 PM" },
      wednesday: { open: "9:00 AM", close: "3:00 PM" },
      thursday: { open: "9:00 AM", close: "3:00 PM" },
      friday: { open: "9:00 AM", close: "3:00 PM" },
      saturday: { open: "9:00 AM", close: "3:00 PM" },
      sunday: { open: "9:00 AM", close: "3:00 PM" }
    }
  }
];

// Upload each place to the "Places" collection in Firestore
places.forEach(async (place) => {
  try {
    const docRef = await addDoc(collection(db, "Places"), place);
    console.log(`Uploaded: ${place.Title} with ID: ${docRef.id}`);
  } catch (error) {
    console.error(`Error uploading ${place.Title}:`, error);
  }
});
