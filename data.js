const image = (id, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=84`;

export const categories = [
  { value: 'All', label: 'All gear', mark: 'ALL' },
  { value: 'Cameras', label: 'Cameras', mark: '01' },
  { value: 'Gaming', label: 'Gaming', mark: '02' },
  { value: 'Technology', label: 'Laptops & tech', mark: '03' },
  { value: 'Mobility', label: 'Bikes', mark: '04' },
  { value: 'Audio', label: 'Audio', mark: '05' },
  { value: 'Outdoor', label: 'Outdoor', mark: '06' },
  { value: 'Events', label: 'Party & events', mark: '07' },
];

const specs = (items) => items.map(([label, value]) => ({ label, value }));
const dateOffset = (days) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const seedProducts = [
  { id: 1, name: 'Mirrorless Camera Kit', brand: 'Sony', category: 'Cameras', price: 899, deposit: 3500, image: image('photo-1516035069371-29a1b244cc32'), tag: 'Popular', rating: 4.9, reviews: 28, stock: 2, condition: 'Excellent', description: 'A lightweight full-frame kit for travel, portraits, and polished creator work.', included: ['Sony A7 III body', '28–70mm lens', '2 batteries', '64GB SD card'], specifications: specs([['Sensor', '24.2MP full frame'], ['Video', '4K at 30fps'], ['Weight', '650g']]) },
  { id: 2, name: 'Professional DSLR Camera', brand: 'Canon', category: 'Cameras', price: 749, deposit: 3000, image: image('photo-1502920917128-1aa500764cbd'), tag: 'Best value', rating: 4.8, reviews: 19, stock: 3, condition: 'Very good', description: 'A dependable DSLR setup for stills, events, and learning the craft.', included: ['Canon 90D body', '18–135mm lens', 'Battery charger', 'Camera strap'], specifications: specs([['Sensor', '32.5MP APS-C'], ['Video', '4K at 30fps'], ['Lens', '18–135mm']]) },
  { id: 3, name: 'Pocket Creator Camera', brand: 'Fujifilm', category: 'Cameras', price: 699, deposit: 2800, image: image('photo-1512790182412-b19e6d62bc39'), tag: 'New', rating: 4.7, reviews: 12, stock: 2, condition: 'Excellent', description: 'A compact everyday camera with character-rich colour and fast autofocus.', included: ['Fujifilm X-T30 II', '15–45mm lens', '2 batteries', 'Wrist strap'], specifications: specs([['Sensor', '26.1MP APS-C'], ['Display', '3-inch tilting'], ['Video', '4K']]) },
  { id: 4, name: 'PlayStation Gaming Console', brand: 'Sony', category: 'Gaming', price: 599, deposit: 2500, image: image('photo-1606144042614-b2417e99c4e3'), tag: 'Trending', rating: 4.9, reviews: 36, stock: 4, condition: 'Excellent', description: 'A complete living-room setup for weekend co-op, racing, and story games.', included: ['PS5 console', 'DualSense controller', 'HDMI cable', 'Power cable'], specifications: specs([['Storage', '825GB SSD'], ['Output', '4K HDR'], ['Players', 'Up to 4']]) },
  { id: 5, name: 'Wireless Gaming Controller', brand: 'Xbox', category: 'Gaming', price: 199, deposit: 700, image: image('photo-1592840496694-26d035b52b48'), tag: 'Popular', rating: 4.6, reviews: 21, stock: 7, condition: 'Very good', description: 'A responsive wireless controller for console or PC sessions.', included: ['Controller', 'USB-C cable', 'AA batteries'], specifications: specs([['Connectivity', 'Bluetooth / USB-C'], ['Battery', '40 hours'], ['Compatibility', 'PC, Xbox']]) },
  { id: 6, name: 'Nintendo Switch OLED Set', brand: 'Nintendo', category: 'Gaming', price: 449, deposit: 1800, image: image('photo-1578303512597-81e6cc155b3e'), tag: 'Weekend pick', rating: 4.8, reviews: 18, stock: 3, condition: 'Excellent', description: 'A portable multiplayer kit for holidays, commutes, and relaxed evenings.', included: ['Switch OLED', '2 Joy-Con controllers', 'Dock', 'Travel case'], specifications: specs([['Display', '7-inch OLED'], ['Storage', '64GB'], ['Mode', 'Handheld / TV']]) },
  { id: 7, name: 'Premium Laptop', brand: 'Apple', category: 'Technology', price: 1099, deposit: 5000, image: image('photo-1496181133206-80ce9b88a853'), tag: 'Top rated', rating: 4.9, reviews: 31, stock: 2, condition: 'Excellent', description: 'A fast, quiet laptop for editing, presentations, and focused project work.', included: ['MacBook Pro 14-inch', 'USB-C charger', 'Protective sleeve'], specifications: specs([['Processor', 'Apple M2 Pro'], ['Memory', '16GB RAM'], ['Storage', '512GB SSD']]) },
  { id: 8, name: 'Portable Work Laptop', brand: 'Lenovo', category: 'Technology', price: 699, deposit: 3000, image: image('photo-1517336714731-489689fd1ca8'), tag: 'Popular', rating: 4.7, reviews: 24, stock: 4, condition: 'Very good', description: 'A practical, light Windows laptop for work sprints, classes, and travel.', included: ['ThinkPad X1 Carbon', 'USB-C charger', 'Laptop sleeve'], specifications: specs([['Processor', 'Intel Core i7'], ['Memory', '16GB RAM'], ['Storage', '512GB SSD']]) },
  { id: 9, name: 'Creator Laptop Studio', brand: 'Dell', category: 'Technology', price: 949, deposit: 4000, image: image('photo-1496181133206-80ce9b88a853'), tag: 'For creators', rating: 4.6, reviews: 15, stock: 2, condition: 'Excellent', description: 'Colour-accurate power for design software, video edits, and 3D experiments.', included: ['XPS 15 laptop', 'Power adapter', 'USB-C hub'], specifications: specs([['Display', '15-inch 4K'], ['Memory', '32GB RAM'], ['GPU', 'RTX graphics']]) },
  { id: 10, name: 'Mountain Bicycle', brand: 'Trek', category: 'Mobility', price: 349, deposit: 1500, image: image('photo-1485965120184-e220f721d03e'), tag: 'Weekend pick', rating: 4.8, reviews: 27, stock: 3, condition: 'Good', description: 'A capable hardtail for city edges, forest trails, and active weekends.', included: ['Helmet', 'Lock', 'Front light', 'Repair kit'], specifications: specs([['Frame', 'Aluminium'], ['Wheels', '29-inch'], ['Gears', '18 speed']]) },
  { id: 11, name: 'City Cruiser Bicycle', brand: 'Cannondale', category: 'Mobility', price: 249, deposit: 1000, image: image('photo-1576435728678-68d0fbf94e91'), tag: 'Easy ride', rating: 4.7, reviews: 22, stock: 5, condition: 'Very good', description: 'An easy, comfortable city bike for errands, exploring, and daily movement.', included: ['Helmet', 'Basket', 'Lock', 'Lights'], specifications: specs([['Frame', 'Step-through alloy'], ['Gears', '7 speed'], ['Brakes', 'Disc']]) },
  { id: 12, name: 'Electric Commuter Bike', brand: 'Giant', category: 'Mobility', price: 799, deposit: 3500, image: image('photo-1558981806-ec527fa84c39'), tag: 'Popular', rating: 4.8, reviews: 16, stock: 2, condition: 'Excellent', description: 'A smooth electric assist for longer commutes and discovering more of the city.', included: ['E-bike', 'Charger', 'Helmet', 'Lock'], specifications: specs([['Range', 'Up to 70km'], ['Motor', '250W assist'], ['Frame', 'Aluminium']]) },
  { id: 13, name: 'Portable Bluetooth Speaker', brand: 'JBL', category: 'Audio', price: 299, deposit: 1000, image: image('photo-1608043152269-423dbba4e7e1'), tag: 'Popular', rating: 4.8, reviews: 33, stock: 6, condition: 'Excellent', description: 'Room-filling sound for picnics, pool days, and small gatherings.', included: ['Speaker', 'USB-C cable', 'Carry strap'], specifications: specs([['Battery', 'Up to 20 hours'], ['Output', '30W'], ['Waterproof', 'IP67']]) },
  { id: 14, name: 'Studio Headphones', brand: 'Sony', category: 'Audio', price: 249, deposit: 900, image: image('photo-1505740420928-5e560c06d30e'), tag: 'Top rated', rating: 4.9, reviews: 41, stock: 5, condition: 'Excellent', description: 'Comfortable noise-cancelling headphones for focus, flights, and deep listening.', included: ['Headphones', 'Audio cable', 'Hard case'], specifications: specs([['Type', 'Over-ear ANC'], ['Battery', '30 hours'], ['Connection', 'Bluetooth 5.2']]) },
  { id: 15, name: 'Podcast Microphone Kit', brand: 'Rode', category: 'Audio', price: 399, deposit: 1400, image: image('photo-1590602847861-f357a9332bbc'), tag: 'For creators', rating: 4.7, reviews: 14, stock: 2, condition: 'Very good', description: 'A simple, polished setup for podcasts, voiceovers, and live conversations.', included: ['USB microphone', 'Boom arm', 'Pop filter', 'USB cable'], specifications: specs([['Pattern', 'Cardioid'], ['Connection', 'USB-C'], ['Sample rate', '48kHz']]) },
  { id: 16, name: 'HD Video Projector', brand: 'Epson', category: 'Events', price: 649, deposit: 2500, image: image('photo-1478720568477-152d9b164e26'), tag: 'New', rating: 4.6, reviews: 11, stock: 2, condition: 'Excellent', description: 'Turn a blank wall into a cinema for presentations, screenings, and celebrations.', included: ['Projector', 'Remote', 'HDMI cable', 'Carry case'], specifications: specs([['Resolution', '1080p'], ['Brightness', '3,000 lumens'], ['Input', 'HDMI / USB']]) },
  { id: 17, name: 'Portable PA Speaker', brand: 'Bose', category: 'Events', price: 899, deposit: 3500, image: image('photo-1524368535928-5b5e00ddc76b'), tag: 'Event ready', rating: 4.8, reviews: 9, stock: 2, condition: 'Very good', description: 'A portable speaker system for small celebrations, workshops, and announcements.', included: ['PA speaker', 'Wireless mic', 'Power cable', 'Stand'], specifications: specs([['Coverage', 'Up to 100 guests'], ['Battery', '8 hours'], ['Inputs', 'Mic / Bluetooth']]) },
  { id: 18, name: 'Warm String Light Set', brand: 'RENTIFY', category: 'Events', price: 149, deposit: 500, image: image('photo-1519167758481-83f550bb49b3'), tag: 'Easy add-on', rating: 4.5, reviews: 8, stock: 10, condition: 'Good', description: 'Add a warm, considered glow to dinner tables, balconies, and intimate events.', included: ['20m light string', 'Power adapter', 'Storage bag'], specifications: specs([['Length', '20 metres'], ['Bulbs', 'Warm LED'], ['Power', 'Mains']]) },
  { id: 19, name: 'Camping Adventure Tent', brand: 'Coleman', category: 'Outdoor', price: 449, deposit: 2000, image: image('photo-1478131143081-80f7f84ca84d'), tag: 'Weekend pick', rating: 4.7, reviews: 20, stock: 3, condition: 'Good', description: 'A dependable two-person shelter for an easy first night outdoors.', included: ['Tent body', 'Rainfly', 'Poles', 'Groundsheet'], specifications: specs([['Capacity', '2 people'], ['Set-up', '10 minutes'], ['Weather', '3-season']]) },
  { id: 20, name: 'Day Hike Backpack', brand: 'Osprey', category: 'Outdoor', price: 199, deposit: 700, image: image('photo-1551632811-561732d1e306'), tag: 'Lightweight', rating: 4.8, reviews: 17, stock: 6, condition: 'Very good', description: 'A comfortable carry for day hikes, camera gear, and slow travel.', included: ['Backpack', 'Rain cover', 'Hydration sleeve'], specifications: specs([['Capacity', '24 litres'], ['Fit', 'Adjustable torso'], ['Features', 'Rain cover']]) },
  { id: 21, name: 'Inflatable Paddleboard', brand: 'Decathlon', category: 'Outdoor', price: 549, deposit: 2200, image: image('photo-1502680390469-be75c86b636f'), tag: 'Summer pick', rating: 4.6, reviews: 13, stock: 2, condition: 'Good', description: 'A stable board for relaxed lake days and first-time paddlers.', included: ['Board', 'Paddle', 'Pump', 'Leash'], specifications: specs([['Length', '10 feet'], ['Capacity', 'Up to 100kg'], ['Pack', 'Backpack']]) },
  { id: 22, name: 'Instant Print Camera', brand: 'Fujifilm', category: 'Cameras', price: 179, deposit: 600, image: image('photo-1526170375885-4d8ecf77b99f'), tag: 'Fun pick', rating: 4.7, reviews: 29, stock: 5, condition: 'Excellent', description: 'Make the moment tangible with a cheerful instant camera for events and trips.', included: ['Camera', '2 film packs', 'Wrist strap'], specifications: specs([['Film', 'Instax Mini'], ['Lens', '60mm'], ['Power', 'AA batteries']]) },
  { id: 23, name: 'Action Camera Adventure Kit', brand: 'GoPro', category: 'Cameras', price: 349, deposit: 1400, image: image('photo-1516035069371-29a1b244cc32'), tag: 'Adventure', rating: 4.8, reviews: 23, stock: 3, condition: 'Very good', description: 'Capture rides, hikes, and water days with a small camera built for movement.', included: ['Action camera', 'Chest mount', 'Head strap', '3 batteries'], specifications: specs([['Video', '5.3K'], ['Waterproof', '10m'], ['Stabilisation', 'HyperSmooth']]) },
  { id: 24, name: 'Folding Picnic Table Set', brand: 'RENTIFY', category: 'Outdoor', price: 229, deposit: 800, image: image('photo-1473445361085-b9a07f55608b'), tag: 'Gather together', rating: 4.5, reviews: 7, stock: 4, condition: 'Good', description: 'A compact table and seating set for picnics, markets, and outdoor meals.', included: ['Folding table', '4 stools', 'Carry case'], specifications: specs([['Seats', '4 people'], ['Material', 'Aluminium'], ['Packed size', '90cm']]) },
];

export const heroImage = image('photo-1498049794561-7780e7231661');

export const categoryImages = {
  Cameras: image('photo-1516035069371-29a1b244cc32'),
  Gaming: image('photo-1606144042614-b2417e99c4e3'),
  Technology: image('photo-1496181133206-80ce9b88a853'),
  Mobility: image('photo-1485965120184-e220f721d03e'),
  Audio: image('photo-1505740420928-5e560c06d30e'),
  Outdoor: image('photo-1478131143081-80f7f84ca84d'),
  Events: image('photo-1519167758481-83f550bb49b3'),
};

const demoBookings = () => {
  const product = (id) => seedProducts.find((item) => item.id === id);
  const makeBooking = ({ id, productId, userId, name, email, startOffset, endOffset, quantity, status }) => {
    const item = product(productId);
    const rentalDays = endOffset - startOffset + 1;
    const subtotal = item.price * rentalDays * quantity;
    const deposit = item.deposit * quantity;
    return {
      id,
      productId,
      userId,
      name,
      email,
      start: dateOffset(startOffset),
      end: dateOffset(endOffset),
      quantity,
      subtotal,
      deposit,
      total: subtotal + deposit,
      rentalDays,
      status,
      demo: true,
    };
  };

  return [
    makeBooking({ id: 1001, productId: 1, userId: 'demo-customer', name: 'Demo customer', email: 'customer@rentify.demo', startOffset: -14, endOffset: -12, quantity: 1, status: 'Completed' }),
    makeBooking({ id: 1002, productId: 4, userId: 'demo-customer-2', name: 'Priya Demo', email: 'priya@rentify.demo', startOffset: 0, endOffset: 2, quantity: 1, status: 'Active' }),
    makeBooking({ id: 1003, productId: 7, userId: 'demo-customer-3', name: 'Arjun Demo', email: 'arjun@rentify.demo', startOffset: 4, endOffset: 6, quantity: 1, status: 'Approved' }),
    makeBooking({ id: 1004, productId: 10, userId: 'demo-customer', name: 'Demo customer', email: 'customer@rentify.demo', startOffset: 8, endOffset: 10, quantity: 1, status: 'Pending' }),
    makeBooking({ id: 1005, productId: 16, userId: 'demo-customer-2', name: 'Priya Demo', email: 'priya@rentify.demo', startOffset: 12, endOffset: 13, quantity: 1, status: 'Rejected' }),
    makeBooking({ id: 1006, productId: 19, userId: 'demo-customer-3', name: 'Arjun Demo', email: 'arjun@rentify.demo', startOffset: -30, endOffset: -28, quantity: 1, status: 'Cancelled' }),
    makeBooking({ id: 1011, productId: 2, userId: 'demo-customer', name: 'Demo customer', email: 'customer@rentify.demo', startOffset: -6, endOffset: -5, quantity: 1, status: 'Completed' }),
    makeBooking({ id: 1012, productId: 5, userId: 'demo-customer-2', name: 'Priya Demo', email: 'priya@rentify.demo', startOffset: -5, endOffset: -4, quantity: 1, status: 'Completed' }),
    makeBooking({ id: 1013, productId: 8, userId: 'demo-customer-3', name: 'Arjun Demo', email: 'arjun@rentify.demo', startOffset: -4, endOffset: -3, quantity: 1, status: 'Completed' }),
    makeBooking({ id: 1014, productId: 11, userId: 'demo-customer', name: 'Demo customer', email: 'customer@rentify.demo', startOffset: -3, endOffset: -2, quantity: 1, status: 'Completed' }),
    makeBooking({ id: 1015, productId: 14, userId: 'demo-customer-2', name: 'Priya Demo', email: 'priya@rentify.demo', startOffset: -2, endOffset: -1, quantity: 1, status: 'Completed' }),
    makeBooking({ id: 1016, productId: 17, userId: 'demo-customer-3', name: 'Arjun Demo', email: 'arjun@rentify.demo', startOffset: -1, endOffset: -1, quantity: 1, status: 'Completed' }),
  ];
};

export const createInitialState = () => ({
  products: seedProducts.map((product) => ({ ...product })),
  bookings: demoBookings(),
  wishlist: [],
});
