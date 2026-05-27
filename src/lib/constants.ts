export const AREA_DEFAULTS = [
  { id: 'nasr', name: 'Nasr City', tagline: 'Lowest entry cost, biggest captive population', defaultRent: 25000, defaultKeyMoney: 250000, budgetMin: 1.2, budgetRange: '1.2–2.5M', rentRange: '15,000–35,000', keyMoneyRange: '0–500,000', buyRange: '1–3M', bestSpots: 'Side streets near Abbas El Akkad, Makram Ebeid Square, behind City Stars', pros: ['Cheapest entry in Cairo', 'Massive captive population (~1M)', 'Low indie café competition'], cons: ['Price-sensitive crowd', 'Brutal traffic on main streets'] },
  { id: 'east', name: 'East Cairo Corridor', tagline: 'Highest long-term appreciation', defaultRent: 18000, defaultKeyMoney: 150000, budgetMin: 1.5, budgetRange: '1.5–3.5M', rentRange: '8,000–25,000', keyMoneyRange: '0–300,000', buyRange: '2–6.5M', bestSpots: 'Shorouk Club District, near BUE campus', pros: ['Cheapest rents in Greater Cairo', 'Massive growth trajectory'], cons: ['Car-dependent', 'Weekend-heavy demand'] },
  { id: 'heliopolis', name: 'Heliopolis', tagline: 'Best vibe-to-cost ratio', defaultRent: 45000, defaultKeyMoney: 1000000, budgetMin: 2, budgetRange: '2–4M', rentRange: '30,000–70,000', keyMoneyRange: '500,000–2,000,000', buyRange: '3.5–8M', bestSpots: 'Korba side streets, Ard El Golf, Almazah', pros: ['Walkable — rare in Cairo', 'Existing café culture'], cons: ['Prime Korba is expensive', 'Parking is brutal'] },
  { id: 'maadi', name: 'Maadi Degla', tagline: 'Most balanced safe bet', defaultRent: 50000, defaultKeyMoney: 1000000, budgetMin: 2.5, budgetRange: '2.5–6M', rentRange: '35,000–60,000', keyMoneyRange: '500,000–2,000,000', buyRange: '5–10M', bestSpots: 'Tier 2: Street 250, 218, 206, 213', pros: ['Strong community', 'Expat crowd knows specialty'], cons: ['Key money brutal on Road 9', 'Quiet weekday mornings'] },
  { id: 'october', name: '6th of October', tagline: 'Most competitive battlefield', defaultRent: 35000, defaultKeyMoney: 500000, budgetMin: 4, budgetRange: '4–8M', rentRange: '20,000–50,000', keyMoneyRange: '300,000–1,000,000', buyRange: '5–15M', bestSpots: 'Off-axis near schools/compounds, Hadayek October', pros: ['Large growing population', 'Cheaper off-axis options'], cons: ['Developer-dominated', 'Car-dependent'] },
  { id: 'dahshour', name: 'Waslat Dahshour', tagline: 'Hottest growth strip right now', defaultRent: 85000, defaultKeyMoney: 1000000, budgetMin: 4, budgetRange: '4–8M', rentRange: '70,000–120,000', keyMoneyRange: '500,000–2,000,000', buyRange: '6–22M', bestSpots: 'City Walk Strip (proven)', pros: ['F&B destination', 'Outdoor seating norm', 'Modern infrastructure'], cons: ['Pricing caught up', 'Pure car-traffic'] },
  { id: 'zamalek', name: 'Zamalek', tagline: 'Highest prestige + highest tickets', defaultRent: 75000, defaultKeyMoney: 5000000, budgetMin: 6, budgetRange: '6–14M', rentRange: '50,000–100,000', keyMoneyRange: '2,000,000–8,000,000', buyRange: '8–15M', bestSpots: 'Side streets off 26th July or Abou Al Feda', pros: ['Highest spending customers', 'Walkable', 'Brand value'], cons: ['Brutal key money', 'Almost no supply'] },
  { id: 'settlement', name: '5th Settlement', tagline: 'Highest spending power per customer', defaultRent: 120000, defaultKeyMoney: 2000000, budgetMin: 8, budgetRange: '8–15M', rentRange: '50,000–200,000', keyMoneyRange: '1,000,000–5,000,000', buyRange: '7–22M', bestSpots: 'Bait El Watan, outside compound walls', pros: ['Highest ticket prices', 'Modern infrastructure'], cons: ['Most expensive in Egypt', 'Developer mall lock-in'] },
] as const;

export type AreaId = typeof AREA_DEFAULTS[number]['id'];
export type Area = typeof AREA_DEFAULTS[number] & { id: string };

export const MENU_DEFAULTS = {
  espresso: { name: 'Espresso', category: 'hot', price: 45, cost: 8 },
  americano: { name: 'Americano', category: 'hot', price: 55, cost: 9 },
  latte: { name: 'Latte', category: 'hot', price: 70, cost: 16 },
  cappuccino: { name: 'Cappuccino', category: 'hot', price: 65, cost: 14 },
  flatWhite: { name: 'Flat White', category: 'hot', price: 75, cost: 15 },
  turkish: { name: 'Turkish Coffee', category: 'hot', price: 40, cost: 6 },
  hotChoc: { name: 'Hot Chocolate', category: 'hot', price: 65, cost: 12 },
  tea: { name: 'Tea', category: 'hot', price: 38, cost: 4 },
  icedLatte: { name: 'Iced Latte', category: 'cold', price: 80, cost: 20 },
  icedAm: { name: 'Iced Americano', category: 'cold', price: 60, cost: 10 },
  coldBrew: { name: 'Cold Brew', category: 'cold', price: 75, cost: 6 },
  icedMocha: { name: 'Iced Mocha', category: 'cold', price: 80, cost: 18 },
  oj: { name: 'Fresh OJ', category: 'fresh', price: 50, cost: 18 },
  lemon: { name: 'Lemon Mint', category: 'fresh', price: 45, cost: 12 },
  croissant: { name: 'Croissant', category: 'food', price: 40, cost: 15 },
  cookie: { name: 'Cookie', category: 'food', price: 35, cost: 10 },
  cake: { name: 'Cake Slice', category: 'food', price: 65, cost: 25 },
  sandwich: { name: 'Sandwich', category: 'food', price: 80, cost: 30 },
} as const;

export type MenuItemKey = keyof typeof MENU_DEFAULTS;
