// Approximate coordinates for major districts
export const districtCoordinates: Record<string, { lat: number; lng: number }> = {
    // Uttar Pradesh
    "Lucknow": { lat: 26.8467, lng: 80.9462 },
    "Kanpur Nagar": { lat: 26.4499, lng: 80.3319 },
    "Varanasi": { lat: 25.3176, lng: 82.9739 },
    "Agra": { lat: 27.1767, lng: 78.0081 },
    "Prayagraj": { lat: 25.4358, lng: 81.8463 },

    // Madhya Pradesh
    "Bhopal": { lat: 23.2599, lng: 77.4126 },
    "Indore": { lat: 22.7196, lng: 75.8577 },
    "Gwalior": { lat: 26.2183, lng: 78.1828 },
    "Jabalpur": { lat: 23.1815, lng: 79.9864 },

    // Maharashtra
    "Mumbai City": { lat: 19.0760, lng: 72.8777 },
    "Pune": { lat: 18.5204, lng: 73.8567 },
    "Nagpur": { lat: 21.1458, lng: 79.0882 },
    "Nashik": { lat: 19.9975, lng: 73.7898 },

    // Gujarat
    "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
    "Surat": { lat: 21.1702, lng: 72.8311 },
    "Vadodara": { lat: 22.3072, lng: 73.1812 },
    "Rajkot": { lat: 22.3039, lng: 70.8022 },

    // Rajasthan
    "Jaipur": { lat: 26.9124, lng: 75.7873 },
    "Jodhpur": { lat: 26.2389, lng: 73.0243 },
    "Udaipur": { lat: 24.5854, lng: 73.7125 },
    "Kota": { lat: 25.2138, lng: 75.8648 },
    "Ajmer": { lat: 26.4499, lng: 74.6399 },
    "Bikaner": { lat: 28.0229, lng: 73.3119 },

    // Andhra Pradesh
    "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
    "Vijayawada": { lat: 16.5062, lng: 80.6480 },
    "Guntur": { lat: 16.3067, lng: 80.4365 },
    "Nellore": { lat: 14.4426, lng: 79.9865 },
    "Kurnool": { lat: 15.8281, lng: 78.0373 },
    "Tirupati": { lat: 13.6288, lng: 79.4192 },

    // Karnataka
    "Bengaluru Urban": { lat: 12.9716, lng: 77.5946 },
    "Mysuru": { lat: 12.2958, lng: 76.6394 },
    "Hubballi": { lat: 15.3647, lng: 75.1240 },
    "Mangaluru": { lat: 12.9141, lng: 74.8560 },
    "Belagavi": { lat: 15.8497, lng: 74.4977 },

    // Tamil Nadu
    "Chennai": { lat: 13.0827, lng: 80.2707 },
    "Coimbatore": { lat: 11.0168, lng: 76.9558 },
    "Madurai": { lat: 9.9252, lng: 78.1198 },
    "Tiruchirappalli": { lat: 10.7905, lng: 78.7047 },
    "Salem": { lat: 11.6643, lng: 78.1460 },

    // Telangana
    "Hyderabad": { lat: 17.3850, lng: 78.4867 },
    "Warangal": { lat: 17.9689, lng: 79.5941 },
    "Nizamabad": { lat: 18.6725, lng: 78.0941 },
    "Karimnagar": { lat: 18.4386, lng: 79.1288 },

    // Default fallback if not found (Center of India)
    "Default": { lat: 20.5937, lng: 78.9629 }
};

export const stateCoordinates: Record<string, { lat: number; lng: number }> = {
    "Andhra Pradesh": { lat: 15.9129, lng: 79.7400 },
    "Arunachal Pradesh": { lat: 28.2180, lng: 94.7278 },
    "Assam": { lat: 26.2006, lng: 92.9376 },
    "Bihar": { lat: 25.0961, lng: 85.3131 },
    "Chhattisgarh": { lat: 21.2787, lng: 81.8661 },
    "Goa": { lat: 15.2993, lng: 74.1240 },
    "Gujarat": { lat: 22.2587, lng: 71.1924 },
    "Haryana": { lat: 29.0588, lng: 76.0856 },
    "Himachal Pradesh": { lat: 31.1048, lng: 77.1734 },
    "Jharkhand": { lat: 23.6102, lng: 85.2799 },
    "Karnataka": { lat: 15.3173, lng: 75.7139 },
    "Kerala": { lat: 10.8505, lng: 76.2711 },
    "Madhya Pradesh": { lat: 22.9734, lng: 78.6569 },
    "Maharashtra": { lat: 19.7515, lng: 75.7139 },
    "Manipur": { lat: 24.6637, lng: 93.9063 },
    "Meghalaya": { lat: 25.4670, lng: 91.3662 },
    "Mizoram": { lat: 23.1645, lng: 92.9376 },
    "Nagaland": { lat: 26.1584, lng: 94.5624 },
    "Odisha": { lat: 20.9517, lng: 85.0985 },
    "Punjab": { lat: 31.1471, lng: 75.3412 },
    "Rajasthan": { lat: 27.0238, lng: 74.2179 },
    "Sikkim": { lat: 27.5330, lng: 88.5122 },
    "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
    "Telangana": { lat: 18.1124, lng: 79.0193 },
    "Tripura": { lat: 23.9408, lng: 91.9882 },
    "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
    "Uttarakhand": { lat: 30.0668, lng: 79.0193 },
    "West Bengal": { lat: 22.9868, lng: 87.8550 },
    "Andaman and Nicobar Islands": { lat: 11.7401, lng: 92.6586 },
    "Chandigarh": { lat: 30.7333, lng: 76.7794 },
    "Dadra and Nagar Haveli and Daman and Diu": { lat: 20.1809, lng: 73.0169 },
    "Delhi": { lat: 28.7041, lng: 77.1025 },
    "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762 },
    "Ladakh": { lat: 34.1526, lng: 77.5770 },
    "Lakshadweep": { lat: 10.5667, lng: 72.6417 },
    "Puducherry": { lat: 11.9416, lng: 79.8083 }
};
