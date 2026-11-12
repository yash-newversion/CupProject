export const INITIAL_USER = {
  name: "Aarav Sharma",
  email: "aarav.sharma@connoisseur.in",
  phone: "+91 98450 12894",
  tier: "Patron Member • Tier III",
  memberSince: "October 2024",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_OW0Qdryn4-7Vt-FfvKj6YyXrvhyHefM69V1uT1ti1quyvataQH7Y46bzMA0RbRNocwcLXuyxv62T0FpKMR7queJ7lMi3vc8NgUwctv7ey-nKnAxaqrIlLN4U-zli7C95dvY15Vf4SnlC-2zlmbUlqGvPIhkMQztISKr5tGWBbJlvI23_F8m4dVZGAX7B5IChi63-IWzfV5KRWyMG7zq4VraTYBTOlgziEapBqpU",
  stats: {
    cupsSaved: 42,
    co2OffsetKg: 3.2,
    rewardPoints: 1450,
    activeBatches: 2
  },
  subscription: {
    title: "Artisanal Assortment Luxury Gifting Box",
    subtitle: "Curated 16-Compartment Reserve Selection",
    frequency: "Every 30 Days",
    nextDispatch: "28 November 2026",
    status: "Active & Secured",
    price: 1899,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSrhENVZR6p4I2B9_iizu0wgJTwaLwtmygcvU2qwERkcn52YX-Gf2Ur02doTFoeeCGGDmwGGQZqQ8J2bOiUXEO_CaFzFrULwxcMKlX9xAxl8vQRuh-cmDF7i_aLA7wKH-c8sksWZKhuQHkK4L2eAkraCYN_3HcRVT0dapyQcUdD4yoMyjZ3HoyWVmfEe-BAsc-ayAbRF80XDKFxRGvrGeZVEjQxA1fVPqlcADQKZs"
  },
  preferences: {
    roastProfile: "Medium-Dark Roast (Chikmagalur / Coorg)",
    rimThickness: "Double-Thick 70% Dark Ganache",
    dietary: ["100% Plant-Based", "Zero Palm Oil", "Eggless Certified"],
    flavorPriority: "Belgian Dark & Salted Caramel"
  },
  addresses: [
    {
      id: "addr-1",
      tag: "Home (Primary)",
      recipient: "Aarav Sharma",
      phone: "+91 98450 12894",
      street: "Villa 14, The Palms Sanctuary, 100 Ft Road",
      locality: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      isDefault: true
    },
    {
      id: "addr-2",
      tag: "Atelier Studio",
      recipient: "Aarav Sharma (Studio Cupping)",
      phone: "+91 98450 12894",
      street: "Unit 402, Loft Creative Hub, 5th Block",
      locality: "Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560034",
      isDefault: false
    }
  ]
};

export const INITIAL_ORDERS = [
  {
    orderId: "C2E-89241",
    date: "12 Nov 2026",
    status: "Baking in Atelier",
    statusCode: "processing",
    trackingId: "BD-99482014",
    courier: "BlueDart Express Air",
    estimatedDelivery: "Thursday, 14 Nov • By 2:00 PM",
    totalAmount: 1897,
    itemsSummary: "Artisanal Assortment (12 Cups) + Signature Dark (6 Cups)",
    items: [
      {
        id: "artisanal-assortment-12",
        title: "Artisanal Assortment Tasting Box (12 Cups)",
        variant: "12 Cups • 4 Flavors",
        price: 1299,
        quantity: 1,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuADQZ4owNEogp5FCHyZLTPcKFdqragfnrIjdYJvCgUblHlahkJa6MGRvonGSri6f7LMKt4J_PhT16rm-jDLUDL-OKfczkesAQI5VRA8P6e6IjjYduBKMFJBI8uI89D5n2hxvUr8wwixCT2fQN3zjSSVp7mkGJaic3dtSnrTte7W_j_Z9e4qg1b9K79tCj8Pg11px6u_enX5p7x9bq0pFW6IgcvtC49zpJ-BHhQlwIg"
      },
      {
        id: "signature-belgian-dark-6",
        title: "Signature Belgian Dark Chocolate (6 Cups)",
        variant: "6 Cups • 60ml Espresso",
        price: 749,
        quantity: 1,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDorONUg1DfOLFEiqSn40Y6F7eIBSdKX5A4u1sTzfQSvYNhR2CDC93eszsVzYsqYO7rfZ0e14svA6eHm9-8C64Jkjn1tYXayu25c0Hc6IIzQU110mak5sU-vVsJdF7c5JPE3CGZ_amtYPkqFlCBTDRHspb2TrUJ4Kpu4r4Sl1DBq7Hgz9uZKlFEK8y2KThxiHY58bEL7jN0R3F2XenSXARM4MLnvf0PCOIM2SYMADQ"
      }
    ],
    pricing: {
      subtotal: 2048,
      packaging: 0,
      discount: 151,
      shipping: 0,
      tax: 0,
      total: 1897
    },
    deliveryAddress: {
      recipient: "Aarav Sharma",
      street: "Villa 14, The Palms Sanctuary, 100 Ft Road",
      locality: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038"
    },
    steps: [
      { step: 1, label: "1. Order Placed & Secured", desc: "Payment confirmed via Razorpay. Batch assigned to Atelier oven queue #04.", time: "12 Nov, 10:15 AM", status: "completed" },
      { step: 2, label: "2. Recipe Formulated & Inspected", desc: "Ancient oat grain blend measured and stone-milled to precise micron gauge.", time: "12 Nov, 11:30 AM", status: "completed" },
      { step: 3, label: "3. Fresh Baking & Cocoa Glaze", desc: "Currently baking at 175°C. Hot vessels will receive tempered Belgian 70% dark chocolate inner lining.", time: "12 Nov, 02:45 PM", status: "active" },
      { step: 4, label: "4. Nitrogen Air-Seal & Courier Handover", desc: "Individual nitrogen flush foil sealing for guaranteed 6-month artisanal crunchiness.", time: "Est. 12 Nov, 06:00 PM", status: "pending" },
      { step: 5, label: "5. BlueDart Temperature-Monitored Transit", desc: "Dispatched from Bengaluru Atelier Hub via climate-controlled air transit.", time: "Est. 13 Nov, 08:30 AM", status: "pending" },
      { step: 6, label: "6. Delivered & Ready to Savor", desc: "Contactless doorstep delivery to Indiranagar address with tasting instruction booklet.", time: "Est. 14 Nov, By 2:00 PM", status: "pending" }
    ]
  },
  {
    orderId: "C2E-78103",
    date: "18 Oct 2026",
    status: "Delivered & Savored",
    statusCode: "delivered",
    trackingId: "BD-88410291",
    courier: "BlueDart Express Air",
    estimatedDelivery: "Delivered on 20 Oct 2026",
    totalAmount: 1499,
    itemsSummary: "Salted Caramel Crisp (12 Cups) • 150ml Flat White",
    items: [
      {
        id: "salted-caramel-crisp-6",
        title: "Salted Caramel Crisp Cups (12 Cups)",
        variant: "12 Cups • 150ml Cortado",
        price: 1499,
        quantity: 1,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZe-uTep-jVr5cFmb-znzdY9yMG-70RAofIotBLK8dC-0YzxZslScWDC5uAkp7Piyt8Li61_8Oj6ZB9ePhPAxQNIGXSMJ4xTzypXok4Ym5awPJrQaWyjOxoEYC9IJx1Tvph_62jh-H0LMjDbKKoMRpfTGsNty67niD07GGTyN6rOBJ1OguDX3G1vIXmh8YAKIDjV1kBrr2VHJ6PlJWbudfmaVNBfTemlf7TWszhaE"
      }
    ],
    pricing: {
      subtotal: 1499,
      packaging: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 1499
    }
  },
  {
    orderId: "C2E-65492",
    date: "04 Sep 2026",
    status: "Delivered & Savored",
    statusCode: "delivered",
    trackingId: "BD-77123904",
    courier: "BlueDart Express Air",
    estimatedDelivery: "Delivered on 06 Sep 2026",
    totalAmount: 2248,
    itemsSummary: "Ruby Raspberry Velvet (6 Cups) + Hazelnut Praline (12 Cups)",
    items: [
      {
        id: "ruby-raspberry-velvet-6",
        title: "Ruby Raspberry Velvet Cups (6 Cups)",
        variant: "6 Cups • 60ml",
        price: 849,
        quantity: 1,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjPzX_rZ8VLDoPHAszX60TinAwyv3tRfr53alXYUS8qKohwH0txKJIgmIdB22cx7KzlziWXX_-g0ShlKdyjR4PZ1zun-0DlFK1wdJg_V3bbVoblXNde7V3mC32IIUmDRSnt7d8RaIm-r5liFS6LywCC1MBL3AxRM4a215LuFADEYeo_HoU40nhMnpf1ft8CWVlfSdE56sd7e9vZ7GyQvk-bEkYDjIuqFuIJ1Jiu4U"
      },
      {
        id: "hazelnut-praline-lined-6",
        title: "Hazelnut Praline Lined Cups (6 Cups)",
        variant: "6 Cups • 150ml",
        price: 1399,
        quantity: 1,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2nM9JGI6-LIP4sKezGwDBQCDd7FHFLxzwqb7JoM_KLw6iA3x6GGdCPg27rLrDYDOeW_zLWT0rhwVw0kk80y7W58vOodVIVxITYkWR9_KUwn8AIWYDTGcgp2R2FtCS_eyR5CMDi7LzFkthCYaQJbgRNvglz7ilusEvPATpnuWGW_hXfteMsxy-3_2ttRXQv51cdv0DTt2NJxoa0UryybRdLruZBaDHTCl_tNBPohI"
      }
    ],
    pricing: {
      subtotal: 2248,
      packaging: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 2248
    }
  }
];

export const INITIAL_CART = [
  {
    id: "artisanal-assortment-12",
    title: "Artisanal Assortment Tasting Box (12 Cups)",
    variant: "12 Cups",
    unitPrice: 1299,
    price: 1299,
    quantity: 1,
    image: "https://lh3.googleusercontent.com/aida/ALJJyrBP03O-v_zU-1gwJJ-NzaQYTGY-FF9BUOVEQw8VrYYGx0-u-NikO7yBni0dGsLJ2jIV-PKTDUXwuG8mRr6sAsn6tIwrx1nfgFY65nkz9_ujeIVGXDc742WqGEeJTAA1pQvjilocpetq3al-G0jpfbpHgdAkwyiVshgWjlIvGWyviWEU337CuIZULzbFTv-TPTLlq5ZUA8ppPXm7K4EEIDkbrN7ekdxYwFmZwj2-w1s"
  },
  {
    id: "signature-belgian-dark-6",
    title: "Signature Belgian Dark Chocolate (6 Cups)",
    variant: "6 Cups",
    unitPrice: 749,
    price: 749,
    quantity: 1,
    image: "https://lh3.googleusercontent.com/aida/ALJJyrBBaiGCNdoYlBN9b8N7v95Dlik2SK4-NwApHTbOYMXHXRqDLJBPjsn9sMDgLKbuIqwm5vqH90f5vZDt7cWiQPdBtxB84deyL3qRrSiP465yyMGN78Rxomox9CbWAUSmtE0KAczqhLrp5VtR8L7E3ofX4BFo4mYFhB1TMJxbxsI4hYtuS9j8I9QDC8PH8MuUOLNWe_3rBRnS0HkDAJ1ILYjATiudujYm5zT7iJOLGKXv"
  }
];
