import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyA1LAbc1vBzU7z4brVLRZ3gNFc3AjbPldk",
  authDomain: "show-me-stl.firebaseapp.com",
  projectId: "show-me-stl",
  storageBucket: "show-me-stl.firebasestorage.app",
  messagingSenderId: "915773859776",
  appId: "1:915773859776:web:b1bf9c5f70c35a57b5ca25",
  measurementId: "G-6B7NH1E88R"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function: creates a uniform hours object for every day.
function generateUniformHours(open, close) {
  return {
    monday: { open, close },
    tuesday: { open, close },
    wednesday: { open, close },
    thursday: { open, close },
    friday: { open, close },
    saturday: { open, close },
    sunday: { open, close },
  };
}

// Define our places with the updated schema.
const places = [
  {
    Title: "Forest Park",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F5ca668f1b7eb06d0038668983c52198b172f1be87a9b206649c71436970f11cc_forest-park-EYE8gk35k7VtCFFcLfxRNR1aJlU9tS.jpg&w=3840&q=75",
    description:
      "Forest Park, which is owned and operated by the City of St. Louis, is considered one of the nation’s greatest urban public parks. Its 1,300 acres feature beautiful landscapes, forests, nature reserves, lakes and streams, plus five major cultural institutions.",
    address: "Forest Park, St. Louis, MO",
    url: "https://www.forestparkforever.org/visit",
    Category: [
      "FFQy6GVmQYRTIvtU1Mia", // Park
      "FQVo149jnoAUstECqwnN", // Museum
      "QGjfi6bxVEwJa7xz96GP", // Food
      "UNqc7U8DQaINNOUyZhka", // Drink
      "9oqf3T1Jq9tpaPaGOFri", // Activity
      "zf11YmiFRd9sdXJrf9Hj"  // Entertainment
    ],
    metadata:
      "World's fair pavilion is an underrated picnic spot in Forest Park. Most people opt for Art Hill which is great, but don't even realize they could have a more private picnic with just as good of a view at Government Hill. Mediterranean architecture. A fountain for children, multiple golf courses, a free zoo, several museums, sports courts, running and biking trails, and an ice rink make this park special.",
    hours: generateUniformHours("6:00 AM", "10:00 PM"),
  },
  {
    Title: "Saint Louis Art Museum",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F934220dc6071dda514ebbca2ccb15be08a3c591c82268806bc17666cdcda9b9a_art-museum-54jICZGxUDwOwdSJWPIlKTQkVg3gmo.jpg&w=3840&q=75",
    description:
      "Located in the heart of Forest Park, the Saint Louis Art Museum is a premier art institution housed in a Beaux-Arts building originally designed for the 1904 World's Fair. Its impressive collection spans 5,000 years and cultures.",
    address: "1 Fine Arts Dr, St. Louis, MO 63110",
    url: "https://www.slam.org/",
    Category: [
      "FQVo149jnoAUstECqwnN", // Museum
      "ZBdHtNWddzKP0v358u28", // Art
      "9oqf3T1Jq9tpaPaGOFri"  // Activity
    ],
    metadata:
      "The SLAM holds around 36,000 objects spanning 5,000 years. Known for free admission, it features diverse works, offers Saturday tours, and is wheelchair accessible.",
    hours: generateUniformHours("10:00 AM", "5:00 PM"),
  },
  {
    Title: "The City Museum",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2Fad7e69d79ab094d7cfbb6e0b60e04ac11d561ac1f28b7e4bee7cd47d84ca07d8_city-museum-zkAAM9D7laqbVQo0V5ZQPooKxfrNqb.jpg&w=3840&q=75",
    description:
      "Housed in a repurposed 10-story shoe factory, The City Museum blends art, architecture, and pure imagination into an immersive, hands-on experience for all ages.",
    address: "750 N 16th St, St. Louis, MO 63103",
    url: "https://citymuseum.org/",
    Category: [
      "FQVo149jnoAUstECqwnN", // Museum
      "ZBdHtNWddzKP0v358u28", // Art
      "9oqf3T1Jq9tpaPaGOFri"  // Activity
    ],
    metadata:
      "Tickets cost $22. The museum features giant slides, tunnels, reclaimed materials, and various attractions. Guided tours are available and the rooftop is open seasonally.",
    hours: generateUniformHours("9:30 AM", "6:00 PM"),
  },
  {
    Title: "Saint Louis Zoo",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F2490c405d07aeb6bfc8fdf83e69b3c1f4132767d209bead2f8cc489b3b92f719_zoo-penguins-9DmPnePNgyj2cy9rGQON3f2uEjZ12z.jpg&w=3840&q=75",
    description:
      "A world-class destination offering free admission, the Saint Louis Zoo in Forest Park is home to over 14,000 animals from nearly 500 species.",
    address: "1 Government Dr, St. Louis, MO 63110",
    url: "https://stlzoo.org/",
    Category: [
      "9oqf3T1Jq9tpaPaGOFri", // Activity
      "FFQy6GVmQYRTIvtU1Mia",  // Park
      "zf11YmiFRd9sdXJrf9Hj"   // Entertainment
    ],
    metadata:
      "The Zoo features state-of-the-art security, interactive exhibits, and multiple dining options. Parking is cashless and guest safety is a top priority.",
    hours: generateUniformHours("9:00 AM", "5:00 PM"),
  },
  {
    Title: "Mural Mile",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F581e5d9f58eeb0a71996aabaf55dc189a69f633859dbf2ec50df4dc636664b11_mural-mile-g9p25FbqFgECmYuHev0FnzcBUb3Dhd.jpg&w=3840&q=75",
    description:
      "An extraordinary outdoor gallery, Mural Mile stretches along the Mississippi River floodwall displaying large-scale murals by local and international artists.",
    address: "South Grand Boulevard, St. Louis, MO 63118",
    url: "https://racstl.org/public-art/the-mural-mile-floodwall/",
    Category: [
      "ZBdHtNWddzKP0v358u28", // Art
      "9oqf3T1Jq9tpaPaGOFri"  // Activity
    ],
    metadata:
      "Located along the Riverfront between Victor and Chouteau Avenues, this project—started in 1997—brings together more than 250 graffiti artists every Labor Day weekend.",
    hours: generateUniformHours("24/7", "24/7"),
  },
  {
    Title: "Missouri Botanical Garden",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F6fcb27cf1141f8b1a80e534a2b628c9083ff21042827e3d91539dd859357b04d_botanical-garden-f5BgdP1iwGRI5LIyk11Cbey9effv5e.webp&w=3840&q=75",
    description:
      "A world-renowned oasis founded in 1859, the Missouri Botanical Garden offers themed gardens and a peaceful escape from the city.",
    address: "4344 Shaw Blvd, St. Louis, MO 63110",
    url: "https://www.missouribotanicalgarden.org/",
    Category: [
      "FFQy6GVmQYRTIvtU1Mia",  // Park
      "9oqf3T1Jq9tpaPaGOFri"   // Activity
    ],
    metadata:
      "Visitors can enjoy the Japanese Garden, Climatron greenhouse, and seasonal exhibits. The garden also provides guidelines regarding picnicking, waste disposal, and group visits.",
    hours: generateUniformHours("9:00 AM", "5:00 PM"),
  },
  {
    Title: "The Foundry",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2Fbed04eb2f841c247cbb610cb15a132028516134e953717f307a375fd646a2ff8_city-foundry-P9I5uQ6DS3vmIgrYwZqDgjyye32Xkj.jpg&w=3840&q=75",
    description:
      "A vibrant mixed-use development blending dining, shopping, entertainment, and creative workspaces in the heart of St. Louis.",
    address: "1400 N Market St, St. Louis, MO 63106",
    url: "https://www.cityfoundrystl.com/",
    Category: [
      "cUwSL9DtdkzLtkQJ3yrb",   // Shopping
      "9oqf3T1Jq9tpaPaGOFri",   // Activity
      "QGjfi6bxVEwJa7xz96GP",   // Food
      "UNqc7U8DQaINNOUyZhka",   // Drink
      "zf11YmiFRd9sdXJrf9Hj"    // Entertainment
    ],
    metadata:
      "City Foundry STL is an adaptive reuse of a historic foundry that now features a food hall, boutique shops, creative offices, and even a tech-infused mini golf course.",
    hours: generateUniformHours("10:00 AM", "9:00 PM"),
  },
  {
    Title: "Science Center",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F3a4e1877345d75f76d14dcdbce6c82ae5442ff5e34c3a0e9b0b2eb0d5090be08_science-center-qH60d7MFJMWbmIlMeHLtzNoTSRcLKs.jpeg&w=3840&q=75",
    description:
      "A dynamic and interactive museum offering hands-on exhibits in science, technology, and space exploration—located in Forest Park.",
    address: "5050 Oakland Ave, St. Louis, MO 63110",
    url: "https://www.slsc.org",
    Category: [
      "FQVo149jnoAUstECqwnN", // Museum
      "zf11YmiFRd9sdXJrf9Hj", // Entertainment
      "9oqf3T1Jq9tpaPaGOFri"  // Activity
    ],
    metadata:
      "General admission is free. Additional ticketed attractions are available on site. The center offers diverse food options and accessible amenities like wheelchair and stroller rentals.",
    hours: generateUniformHours("9:30 AM", "4:30 PM"),
  },
  {
    Title: "801 Chophouse",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F70ffdf3906f9f1462c39964bf67f97b4c7b0f6666157f75b97780dad59fd0729_30829872_999160463579234_7895662036363771904_n-Kcg27aHnhwIT0keMU6GuSUtQwbenNi.jpg&w=3840&q=75",
    description:
      "An elegant chophouse offering prime cuts of beef, seafood, and an extensive wine selection.",
    address: "137 Carondelet Plaza, Clayton, MO 63105",
    url: "https://801chophouse.com/",
    Category: [
      "QGjfi6bxVEwJa7xz96GP",   // Food
      "wSCua4hTEWiDvc3RKIVE",   // Fine Dinning
      "UNqc7U8DQaINNOUyZhka"    // Drink
    ],
    metadata:
      "Since 1993, 801 Chophouse has served USDA prime cuts and signature dishes such as Colossal Shrimp Cocktail, Oysters Rockefeller, and an extensive selection of steaks and soups.",
    hours: generateUniformHours("4:00 PM", "10:00 PM"),
  },
  {
    Title: "Louie",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F1c1fc1c253f85a159121d83c2094462327a162dd3dc49493c760646b1559a7cd_louie-W1REJUfMSK7V3hpjKvJjWYM5da5xvZ.jpg&w=3840&q=75",
    description:
      "A cozy neighborhood spot serving wood-fired pizzas, handmade pasta, and a great wine selection.",
    address: "706 De Mun Ave, Clayton, MO 63105",
    url: "https://www.louiedemun.com/",
    Category: [
      "QGjfi6bxVEwJa7xz96GP",   // Food
      "wSCua4hTEWiDvc3RKIVE",   // Fine Dinning
      "UNqc7U8DQaINNOUyZhka"    // Drink
    ],
    metadata:
      "Louie offers Italian-inspired dishes with varied schedules: Monday–Thursday 5:00–10:00 PM, Friday & Saturday 5:00–11:00 PM, and closed on Sunday.",
    hours: {
      monday: { open: "5:00 PM", close: "10:00 PM" },
      tuesday: { open: "5:00 PM", close: "10:00 PM" },
      wednesday: { open: "5:00 PM", close: "10:00 PM" },
      thursday: { open: "5:00 PM", close: "10:00 PM" },
      friday: { open: "5:00 PM", close: "11:00 PM" },
      saturday: { open: "5:00 PM", close: "11:00 PM" },
      sunday: { open: "Closed", close: "Closed" },
    },
  },
  {
    Title: "SUSHI KOI",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F796f330e13d6ce5215c5c073a9fac6b4657f12b8df5813e4aea0e13c1df7e805_sushi-SOzokb8XDhLpShIh6NUzKmVQE5qkH3.jpg&w=3840&q=75",
    description:
      "A modern sushi bar with vibrant decor offering Japanese small plates, tea, and cocktails, plus outdoor seating and vegetarian options.",
    address: "4 N Euclid Ave, St. Louis, MO 63108",
    url: "https://www.sushikoistl.com/",
    Category: [
      "QGjfi6bxVEwJa7xz96GP",   // Food
      "UNqc7U8DQaINNOUyZhka"    // Drink
    ],
    metadata:
      "SUSHI KOI offers a diverse menu of traditional and specialty sushi. Its schedule is Monday–Thursday 4:00–9:00 PM, Friday–Saturday 4:00–10:00 PM, and closed on Sunday.",
    hours: {
      monday: { open: "4:00 PM", close: "9:00 PM" },
      tuesday: { open: "4:00 PM", close: "9:00 PM" },
      wednesday: { open: "4:00 PM", close: "9:00 PM" },
      thursday: { open: "4:00 PM", close: "9:00 PM" },
      friday: { open: "4:00 PM", close: "10:00 PM" },
      saturday: { open: "4:00 PM", close: "10:00 PM" },
      sunday: { open: "Closed", close: "Closed" },
    },
  },
  {
    Title: "Brasserie by Niche",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F393cf4ff0c2480caf232601aca0db31621973abc95c211e0b20fc170275b4511_niche-1YbSaDtu1s80adbsSyE8rQXfKBVAQ3.jpg&w=3840&q=75",
    description:
      "A classic French brasserie serving dinner and weekend brunch in an elegant space with a wall of windows overlooking the street.",
    address: "4580 Laclede Ave, St. Louis, MO 63108",
    url: "https://brasseriebyniche.com/",
    Category: [
      "QGjfi6bxVEwJa7xz96GP",   // Food
      "UNqc7U8DQaINNOUyZhka"    // Drink
    ],
    metadata:
      "Brasserie by Niche offers traditional French cuisine with dinner served Monday–Saturday 5:00–10:00 PM and Sunday dinner from 5:00–9:00 PM (plus brunch on Sundays from 10:00 AM–2:00 PM).",
    hours: {
      monday: { open: "5:00 PM", close: "10:00 PM" },
      tuesday: { open: "5:00 PM", close: "10:00 PM" },
      wednesday: { open: "5:00 PM", close: "10:00 PM" },
      thursday: { open: "5:00 PM", close: "10:00 PM" },
      friday: { open: "5:00 PM", close: "10:00 PM" },
      saturday: { open: "5:00 PM", close: "10:00 PM" },
      sunday: { open: "5:00 PM", close: "9:00 PM" },
    },
  },
  {
    Title: "Egg@midtown",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2Fcc563bb889cf0b24160a6e2079b1ef67de49c7df90d9abd1d3d14c164f484c6c_egg-5OxqBMipGYuYVn6laGADOHDJwzaZ0q.jpg&w=3840&q=75",
    description:
      "A vibrant eatery with Tunisian influences offering a mix of modern and traditional brunch fare with outdoor seating and creative cocktails.",
    address: "3100 Locust St, St. Louis, MO 63103",
    url: "https://eggstl.com/",
    Category: [
      "QGjfi6bxVEwJa7xz96GP" // Food
    ],
    metadata:
      "Egg@midtown is known for its inventive breakfast and brunch offerings—shakshuka is a standout. It operates Tuesday–Friday from 8:00–2:00 PM, Saturday–Sunday from 9:00–2:00 PM, and is closed on Monday.",
    hours: {
      monday: { open: "Closed", close: "Closed" },
      tuesday: { open: "8:00 AM", close: "2:00 PM" },
      wednesday: { open: "8:00 AM", close: "2:00 PM" },
      thursday: { open: "8:00 AM", close: "2:00 PM" },
      friday: { open: "8:00 AM", close: "2:00 PM" },
      saturday: { open: "9:00 AM", close: "2:00 PM" },
      sunday: { open: "9:00 AM", close: "2:00 PM" },
    },
  },
  {
    Title: "Esca",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2Fbb5c349272aad636d08a490c85d6030d24e8d74497c3a52a5f4ae62cfd154bbb_esca-rcUv8hwJ6TY6vSIeTMiqvayVgwivES.jpg&w=3840&q=75",
    description:
      "A cozy spot serving rustic Mediterranean dishes cooked over charcoal or wood. Enjoy great cocktails and happy hour bites in a warm, inviting setting.",
    address: "5095 Delmar Blvd, St. Louis, MO 63108",
    url: "https://bengelina.com/",
    // Assuming similar categories as other upscale food spots:
    Category: [
      "QGjfi6bxVEwJa7xz96GP",   // Food
      "UNqc7U8DQaINNOUyZhka"    // Drink
    ],
    metadata:
      "Esca is a coastal Mediterranean grill inspired by the French and Italian Rivieras. Operating Tuesday–Sunday from 5:00 PM until close (assumed here as 11:00 PM) with Monday closed.",
    hours: {
      monday: { open: "Closed", close: "Closed" },
      tuesday: { open: "5:00 PM", close: "11:00 PM" },
      wednesday: { open: "5:00 PM", close: "11:00 PM" },
      thursday: { open: "5:00 PM", close: "11:00 PM" },
      friday: { open: "5:00 PM", close: "11:00 PM" },
      saturday: { open: "5:00 PM", close: "11:00 PM" },
      sunday: { open: "5:00 PM", close: "11:00 PM" },
    },
  },
  {
    Title: "Peacemaker Lobster & Crab",
    image: "https://stl.parium.org/_next/image?url=https%3A%2F%2Fjh3ara5st4lltzzi.public.blob.vercel-storage.com%2Fstlparium_assets%2F18c22abedc30d97d77e8f3421667c3a597e39410dae0c99f877c526bb2287af4_peacemaker-AfpW53nncz1aoNMNQtLO8AQvLbF8SE.jpg&w=3840&q=75",
    description:
      "A rustic eatery with retro accents and vintage fishermen photos serving fresh lobster, po' boys, shrimp, and a raw bar in a family-friendly atmosphere.",
    address: "1831 Sidney St, St. Louis, MO 63104",
    url: "https://www.peacemakerlobstercrab.com/st-louis/",
    Category: [
      "QGjfi6bxVEwJa7xz96GP" // Food
    ],
    metadata:
      "Peacemaker Lobster & Crab draws on Northeastern and Louisiana influences. For dinner, Monday–Thursday runs 4:30–9:00 PM, Friday–Saturday 4:30–10:30 PM, and Sunday 1:30–8:30 PM.",
    hours: {
      monday: { open: "4:30 PM", close: "9:00 PM" },
      tuesday: { open: "4:30 PM", close: "9:00 PM" },
      wednesday: { open: "4:30 PM", close: "9:00 PM" },
      thursday: { open: "4:30 PM", close: "9:00 PM" },
      friday: { open: "4:30 PM", close: "10:30 PM" },
      saturday: { open: "4:30 PM", close: "10:30 PM" },
      sunday: { open: "1:30 PM", close: "8:30 PM" },
    },
  },
];

// Upload each place document with an auto-generated document ID.
places.forEach(async (place) => {
  try {
    const docRef = await addDoc(collection(db, "Places"), place);
    console.log(`Document written with ID: ${docRef.id} for ${place.Title}`);
  } catch (error) {
    console.error(`Error adding document for ${place.Title}:`, error);
  }
});
