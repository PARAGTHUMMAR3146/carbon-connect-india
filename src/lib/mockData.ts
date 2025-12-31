// Mock data for the carbon credit marketplace

export const INDIAN_STATES = [
  { id: 'PB', name: 'Punjab', nameHi: 'पंजाब', lat: 31.1471, lng: 75.3412 },
  { id: 'HR', name: 'Haryana', nameHi: 'हरियाणा', lat: 29.0588, lng: 76.0856 },
  { id: 'UP', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', lat: 26.8467, lng: 80.9462 },
  { id: 'MP', name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश', lat: 22.9734, lng: 78.6569 },
  { id: 'MH', name: 'Maharashtra', nameHi: 'महाराष्ट्र', lat: 19.7515, lng: 75.7139 },
  { id: 'RJ', name: 'Rajasthan', nameHi: 'राजस्थान', lat: 27.0238, lng: 74.2179 },
  { id: 'GJ', name: 'Gujarat', nameHi: 'गुजरात', lat: 22.2587, lng: 71.1924 },
  { id: 'KA', name: 'Karnataka', nameHi: 'कर्नाटक', lat: 15.3173, lng: 75.7139 },
];

export const INDUSTRIES = [
  { id: 'steel', name: 'Steel & Iron', nameHi: 'इस्पात एवं लोहा' },
  { id: 'cement', name: 'Cement', nameHi: 'सीमेंट' },
  { id: 'power', name: 'Power Generation', nameHi: 'बिजली उत्पादन' },
  { id: 'textile', name: 'Textile', nameHi: 'वस्त्र' },
  { id: 'chemicals', name: 'Chemicals', nameHi: 'रसायन' },
  { id: 'automotive', name: 'Automotive', nameHi: 'ऑटोमोटिव' },
  { id: 'it', name: 'IT & Services', nameHi: 'आईटी एवं सेवाएं' },
  { id: 'manufacturing', name: 'Manufacturing', nameHi: 'विनिर्माण' },
];

export const CREDIT_TYPES = [
  { id: 'verra', name: 'Verra VCS', nameHi: 'वेर्रा VCS', color: 'emerald', premium: 1.0 },
  { id: 'gold', name: 'Gold Standard', nameHi: 'गोल्ड स्टैंडर्ड', color: 'gold', premium: 1.15 },
  { id: 'cdm', name: 'CDM Credits', nameHi: 'CDM क्रेडिट', color: 'blue', premium: 0.95 },
  { id: 'india', name: 'India VCS', nameHi: 'इंडिया VCS', color: 'orange', premium: 0.9 },
];

export const CROPS = [
  { id: 'rice', name: 'Rice (Paddy)', nameHi: 'धान', carbonMultiplier: 1.2 },
  { id: 'wheat', name: 'Wheat', nameHi: 'गेहूं', carbonMultiplier: 1.0 },
  { id: 'cotton', name: 'Cotton', nameHi: 'कपास', carbonMultiplier: 0.9 },
  { id: 'sugarcane', name: 'Sugarcane', nameHi: 'गन्ना', carbonMultiplier: 1.5 },
  { id: 'maize', name: 'Maize', nameHi: 'मक्का', carbonMultiplier: 1.1 },
  { id: 'soybean', name: 'Soybean', nameHi: 'सोयाबीन', carbonMultiplier: 1.3 },
  { id: 'pulses', name: 'Pulses', nameHi: 'दालें', carbonMultiplier: 1.4 },
  { id: 'vegetables', name: 'Vegetables', nameHi: 'सब्जियां', carbonMultiplier: 0.8 },
];

export const SOIL_TYPES = [
  { id: 'alluvial', name: 'Alluvial', nameHi: 'जलोढ़', multiplier: 1.1 },
  { id: 'black', name: 'Black Soil', nameHi: 'काली मिट्टी', multiplier: 1.2 },
  { id: 'red', name: 'Red Soil', nameHi: 'लाल मिट्टी', multiplier: 0.9 },
  { id: 'laterite', name: 'Laterite', nameHi: 'लैटेराइट', multiplier: 0.85 },
  { id: 'loam', name: 'Loam', nameHi: 'दोमट', multiplier: 1.0 },
];

export const FARMING_PRACTICES = [
  { id: 'organic', name: 'Organic Farming', nameHi: 'जैविक खेती', bonus: 1.5 },
  { id: 'zero_till', name: 'Zero Tillage', nameHi: 'शून्य जुताई', bonus: 1.3 },
  { id: 'crop_rotation', name: 'Crop Rotation', nameHi: 'फसल चक्र', bonus: 1.2 },
  { id: 'cover_crops', name: 'Cover Crops', nameHi: 'आवरण फसलें', bonus: 1.25 },
  { id: 'mulching', name: 'Mulching', nameHi: 'मल्चिंग', bonus: 1.15 },
  { id: 'composting', name: 'Composting', nameHi: 'खाद बनाना', bonus: 1.2 },
];

export const RESIDUE_MANAGEMENT = [
  { id: 'no_burn', name: 'No Burning', nameHi: 'कोई जलना नहीं', multiplier: 1.5 },
  { id: 'incorporation', name: 'Soil Incorporation', nameHi: 'मिट्टी में मिलाना', multiplier: 1.3 },
  { id: 'composting', name: 'Composting', nameHi: 'खाद बनाना', multiplier: 1.2 },
  { id: 'burning', name: 'Burning', nameHi: 'जलाना', multiplier: 0.5 },
];

export const IRRIGATION_TYPES = [
  { id: 'drip', name: 'Drip Irrigation', nameHi: 'ड्रिप सिंचाई', multiplier: 1.3 },
  { id: 'sprinkler', name: 'Sprinkler', nameHi: 'स्प्रिंकलर', multiplier: 1.2 },
  { id: 'canal', name: 'Canal Irrigation', nameHi: 'नहर सिंचाई', multiplier: 1.0 },
  { id: 'tubewell', name: 'Tube Well', nameHi: 'ट्यूबवेल', multiplier: 0.9 },
  { id: 'rain', name: 'Rain-fed', nameHi: 'वर्षा आधारित', multiplier: 1.4 },
];

// Fraction units for buying credits
export const FRACTION_UNITS = [
  { value: 0.25, label: '0.25 tonnes (250 kg)' },
  { value: 0.5, label: '0.5 tonnes (500 kg)' },
  { value: 1, label: '1 tonne' },
  { value: 2.5, label: '2.5 tonnes' },
  { value: 5, label: '5 tonnes' },
  { value: 10, label: '10 tonnes' },
  { value: 25, label: '25 tonnes' },
  { value: 50, label: '50 tonnes' },
  { value: 100, label: '100 tonnes' },
];

// Base price per tonne in INR
export const BASE_CARBON_PRICE = 800;

// Mock listings
export const MOCK_LISTINGS = [
  {
    id: 'LST001',
    sellerId: 'FRM001',
    sellerName: 'Rajesh Kumar',
    location: { state: 'Punjab', district: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
    cropType: 'rice',
    creditType: 'verra',
    amount: 50,
    pricePerTonne: 850,
    verified: true,
    createdAt: '2024-01-15',
    farmSize: 12,
    practices: ['zero_till', 'crop_rotation'],
  },
  {
    id: 'LST002',
    sellerId: 'FRM002',
    sellerName: 'Anita Desai',
    location: { state: 'Maharashtra', district: 'Nagpur', lat: 21.1458, lng: 79.0882 },
    cropType: 'cotton',
    creditType: 'gold',
    amount: 120,
    pricePerTonne: 920,
    verified: true,
    createdAt: '2024-01-12',
    farmSize: 25,
    practices: ['organic', 'mulching'],
  },
  {
    id: 'LST003',
    sellerId: 'FRM003',
    sellerName: 'Suresh Patel',
    location: { state: 'Gujarat', district: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    cropType: 'sugarcane',
    creditType: 'india',
    amount: 75,
    pricePerTonne: 720,
    verified: true,
    createdAt: '2024-01-10',
    farmSize: 18,
    practices: ['drip_irrigation', 'composting'],
  },
  {
    id: 'LST004',
    sellerId: 'FRM004',
    sellerName: 'Meena Sharma',
    location: { state: 'Haryana', district: 'Karnal', lat: 29.6857, lng: 76.9905 },
    cropType: 'wheat',
    creditType: 'cdm',
    amount: 35,
    pricePerTonne: 760,
    verified: true,
    createdAt: '2024-01-08',
    farmSize: 8,
    practices: ['zero_till'],
  },
  {
    id: 'LST005',
    sellerId: 'FRM005',
    sellerName: 'Vikram Singh',
    location: { state: 'Uttar Pradesh', district: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    cropType: 'maize',
    creditType: 'verra',
    amount: 200,
    pricePerTonne: 800,
    verified: true,
    createdAt: '2024-01-05',
    farmSize: 45,
    practices: ['crop_rotation', 'cover_crops', 'composting'],
  },
];

// Mock transactions
export const MOCK_TRANSACTIONS = [
  {
    id: 'TXN001',
    type: 'SELL',
    creditType: 'verra',
    amount: 50,
    pricePerTonne: 850,
    totalValue: 42500,
    buyerName: 'Tata Steel Ltd',
    sellerName: 'Rajesh Kumar',
    status: 'completed',
    createdAt: '2024-01-20T10:30:00',
  },
  {
    id: 'TXN002',
    type: 'BUY',
    creditType: 'gold',
    amount: 25.5,
    pricePerTonne: 920,
    totalValue: 23460,
    buyerName: 'Reliance Industries',
    sellerName: 'Anita Desai',
    status: 'completed',
    createdAt: '2024-01-19T14:15:00',
  },
  {
    id: 'TXN003',
    type: 'BUY',
    creditType: 'cdm',
    amount: 100,
    pricePerTonne: 760,
    totalValue: 76000,
    buyerName: 'ACC Cement',
    sellerName: 'Multiple Farmers',
    status: 'processing',
    createdAt: '2024-01-18T09:00:00',
  },
  {
    id: 'TXN004',
    type: 'SELL',
    creditType: 'india',
    amount: 10.25,
    pricePerTonne: 720,
    totalValue: 7380,
    buyerName: 'Mahindra & Mahindra',
    sellerName: 'Suresh Patel',
    status: 'pending',
    createdAt: '2024-01-17T16:45:00',
  },
];

// Price history for the chart (last 30 days)
export const PRICE_HISTORY = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const basePrice = 800;
  const variation = Math.sin(i * 0.3) * 50 + Math.random() * 30;
  return {
    date: date.toISOString().split('T')[0],
    price: Math.round(basePrice + variation),
  };
});

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate carbon credits based on farm data
export function calculateCarbonCredits(data: {
  landSize: number;
  cropType: string;
  soilType: string;
  practices: string[];
  residueManagement: string;
  irrigationType: string;
}): { credits: number; earnings: number } {
  const crop = CROPS.find(c => c.id === data.cropType) || CROPS[0];
  const soil = SOIL_TYPES.find(s => s.id === data.soilType) || SOIL_TYPES[0];
  const residue = RESIDUE_MANAGEMENT.find(r => r.id === data.residueManagement) || RESIDUE_MANAGEMENT[0];
  const irrigation = IRRIGATION_TYPES.find(i => i.id === data.irrigationType) || IRRIGATION_TYPES[0];
  
  // Base credits per hectare
  const baseCredits = 2.5;
  
  // Calculate practice bonus
  let practiceBonus = 1;
  data.practices.forEach(p => {
    const practice = FARMING_PRACTICES.find(fp => fp.id === p);
    if (practice) practiceBonus *= practice.bonus;
  });
  
  // Final calculation
  const credits = data.landSize * baseCredits * crop.carbonMultiplier * soil.multiplier * residue.multiplier * irrigation.multiplier * practiceBonus;
  const roundedCredits = Math.round(credits * 100) / 100;
  const earnings = roundedCredits * BASE_CARBON_PRICE;
  
  return { credits: roundedCredits, earnings };
}
