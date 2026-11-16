// Card catalog: earning rules and credits for popular US rewards cards.
//
// IMPORTANT: rates, fees and credits change often. This data was written from
// public issuer information and cross-checked on DATA_AS_OF against search
// results (issuer pages, Doctor of Credit, NerdWallet, TPG and similar; see
// docs/research/card-rewards-app/06-* and 07-*). Issuer pages could not be
// opened directly, so it has NOT been checked line-by-line against them. Every card links to its
// issuer page; confirm there before relying on a number. Users can add their
// own credits and custom cards in the app to correct or extend this list.

export const DATA_AS_OF = '2026-11-16';

// Spending categories the engine understands.
export const CATEGORIES = {
  dining: 'Dining & restaurants',
  groceries: 'Grocery stores / supermarkets',
  superstore: 'Superstores (Walmart, Target)',
  wholesale: 'Wholesale clubs (Costco, Sam\'s, BJ\'s)',
  gas: 'Gas stations & EV charging',
  flights: 'Flights (booked with airline)',
  hotels: 'Hotels (booked with hotel)',
  travel: 'Other travel (car rental, cruises, etc.)',
  transit: 'Transit & rideshare',
  streaming: 'Streaming services',
  drugstores: 'Drugstores & pharmacies',
  online: 'Online shopping (general)',
  amazon: 'Amazon',
  entertainment: 'Entertainment & events',
  home_improvement: 'Home improvement',
  phone: 'Phone & internet plans',
  other: 'Everything else',
};

// Rewards currencies. `defaultCents` = default value of one point in cents.
// These are editable estimates, not facts: what a point is worth depends on
// how you redeem it. `boostedBy` lists cards whose presence in your wallet
// unlocks transfers/better redemptions, raising the default to `boostedCents`.
export const CURRENCIES = {
  cash: { name: 'Cash back', defaultCents: 1.0 },
  chase_ur: { name: 'Chase Ultimate Rewards', defaultCents: 1.0, boostedCents: 1.25, boostedBy: ['chase_sapphire_preferred', 'chase_sapphire_reserve'] },
  amex_mr: { name: 'Amex Membership Rewards', defaultCents: 1.25 },
  c1_miles: { name: 'Capital One Miles', defaultCents: 1.25 },
  citi_ty: { name: 'Citi ThankYou Points', defaultCents: 1.0, boostedCents: 1.25, boostedBy: ['citi_strata_premier', 'citi_strata_elite'] },
  wf_points: { name: 'Wells Fargo Rewards', defaultCents: 1.0 },
  usb_points: { name: 'U.S. Bank Points', defaultCents: 1.0 },
  amazon_points: { name: 'Amazon Rewards', defaultCents: 1.0 },
};

// Rule shapes:
//   { rate, categories: [...] }                     earns `rate` in those categories
//   { rate, merchants: [...] }                      earns `rate` at specific merchants (ids in merchants.js)
//   { rate, categories, condition: '...' }          only if booked a certain way (shown as a tip, not ranked)
//   { rate, rotating: true, quarters: {...} }       quarterly 5% categories; needs activation
//   { rate, choice: [...], defaultChoice }          user picks one category
//   { rate, topCategory: [...] }                    auto-applies to your top eligible category each cycle
//   cap: human-readable cap note (the app does not track spend toward caps)
//
// Credit shapes:
//   { id, name, amount, cadence, note? }
//   cadence: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'cardmember_year'
//   monthOverrides: { 12: 35 } -> different amount in a given month (1-12)

export const CARDS = [
  {
    id: 'chase_sapphire_preferred',
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 95,
    currency: 'chase_ur',
    baseRate: 1,
    url: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred',
    rules: [
      { rate: 3, categories: ['dining'] },
      { rate: 3, categories: ['streaming'], note: 'select streaming services' },
      { rate: 3, categories: ['groceries'], condition: 'online grocery purchases only (not Target, Walmart or wholesale clubs)' },
      { rate: 3, categories: ['gas'], note: 'gas stations and EV charging' },
      { rate: 3, merchants: ['airbnb'], note: 'vacation rentals booked directly' },
      { rate: 5, merchants: ['lyft'], note: 'Lyft promo through Sept 30, 2027' },
      { rate: 2, categories: ['flights', 'hotels', 'travel', 'transit'] },
      { rate: 5, categories: ['flights', 'hotels', 'travel'], condition: 'booked through Chase Travel' },
    ],
    credits: [
      { id: 'hotel', name: 'Chase Travel hotel credit', amount: 100, cadence: 'cardmember_year', note: 'Hotel stays booked through Chase Travel' },
    ],
  },
  {
    id: 'chase_sapphire_reserve',
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 795,
    currency: 'chase_ur',
    baseRate: 1,
    url: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve',
    rules: [
      { rate: 3, categories: ['dining'] },
      { rate: 4, categories: ['flights', 'hotels'], note: 'booked directly with the airline or hotel' },
      { rate: 1, categories: ['travel', 'transit'] },
      { rate: 5, merchants: ['lyft'], note: 'Lyft promo through Sept 30, 2027' },
      { rate: 8, categories: ['flights', 'hotels', 'travel'], condition: 'booked through Chase Travel' },
    ],
    credits: [
      { id: 'travel', name: 'Annual travel credit', amount: 300, cadence: 'cardmember_year', note: 'Applies automatically to travel purchases' },
      { id: 'edit', name: 'The Edit hotel credit', amount: 500, cadence: 'annual', note: 'Up to $250 on each of two prepaid 2+ night stays booked through The Edit by Chase Travel' },
      { id: 'dining', name: 'Sapphire Reserve Exclusive Tables dining credit', amount: 150, cadence: 'semiannual', note: 'Participating restaurants via OpenTable' },
      { id: 'stubhub', name: 'StubHub / viagogo credit', amount: 150, cadence: 'semiannual', note: 'Requires activation' },
      { id: 'apple', name: 'Apple TV+ and Apple Music', amount: 250, cadence: 'annual', note: 'Complimentary subscriptions; requires activation (sources value it at $250-$288)' },
      { id: 'doordash', name: 'DoorDash promos', amount: 35, cadence: 'monthly', note: '$15 promo on any eligible order + two $10 non-restaurant promos, with DashPass' },
      { id: 'lyft', name: 'Lyft in-app credit', amount: 10, cadence: 'monthly' },
      { id: 'peloton', name: 'Peloton membership credit', amount: 10, cadence: 'monthly', note: 'Requires activation' },
    ],
  },
  {
    id: 'chase_freedom_unlimited',
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    currency: 'chase_ur',
    baseRate: 1.5,
    url: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited',
    rules: [
      { rate: 3, categories: ['dining', 'drugstores'] },
      { rate: 5, categories: ['flights', 'hotels', 'travel'], condition: 'booked through Chase Travel' },
    ],
    credits: [],
  },
  {
    id: 'chase_freedom_flex',
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    network: 'mastercard',
    annualFee: 0,
    currency: 'chase_ur',
    baseRate: 1,
    url: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/flex',
    rules: [
      {
        rate: 5,
        rotating: true,
        cap: 'Up to $1,500 in combined purchases per quarter; activate each quarter',
        // Q4 2026 per Chase's announcement (media.chase.com). Confirm each quarter.
        quarters: { '2026-Q4': ['groceries', 'dining'], '2027-Q1': ['groceries', 'streaming'] },
        quarterNotes: {
          '2026-Q4': 'Grocery stores (not Walmart or Target), restaurants, American Red Cross',
          '2027-Q1': 'Grocery stores and select streaming services',
        },
      },
      { rate: 3, categories: ['dining', 'drugstores'] },
      { rate: 5, categories: ['flights', 'hotels', 'travel'], condition: 'booked through Chase Travel' },
    ],
    credits: [],
  },
  {
    id: 'chase_prime_visa',
    name: 'Prime Visa',
    issuer: 'Chase',
    network: 'visa',
    annualFee: 0,
    currency: 'amazon_points',
    baseRate: 1,
    url: 'https://www.amazon.com/dp/BT00LN946S',
    rules: [
      { rate: 5, merchants: ['amazon', 'whole_foods'], note: 'with an eligible Prime membership' },
      { rate: 5, categories: ['amazon'], note: 'with an eligible Prime membership' },
      { rate: 2, categories: ['dining', 'gas', 'transit'] },
      { rate: 5, categories: ['flights', 'hotels', 'travel'], condition: 'booked through Chase Travel' },
    ],
    credits: [],
  },
  {
    id: 'amex_platinum',
    name: 'American Express Platinum Card',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 895,
    currency: 'amex_mr',
    baseRate: 1,
    url: 'https://www.americanexpress.com/us/credit-cards/card/platinum/',
    rules: [
      { rate: 5, categories: ['flights'], note: 'booked directly with airlines or via Amex Travel; up to $500K per year' },
      { rate: 5, categories: ['hotels'], condition: 'prepaid hotels booked via Amex Travel' },
    ],
    credits: [
      { id: 'hotel', name: 'Lodging credit (Fine Hotels + Resorts / Hotel Collection / Airbnb Luxe)', amount: 300, cadence: 'semiannual', note: 'Prepaid bookings via Amex Travel; 2-night minimum for Fine Hotels + Resorts from Jan 1, 2027' },
      { id: 'resy', name: 'Resy restaurant credit', amount: 100, cadence: 'quarterly', note: 'Enrollment required' },
      { id: 'lululemon', name: 'lululemon credit', amount: 75, cadence: 'quarterly', note: 'U.S. lululemon stores and online; enrollment required' },
      { id: 'digital', name: 'Digital entertainment credit', amount: 25, cadence: 'monthly', note: 'Select streaming/news services (Peacock bundles no longer qualify since Aug 1, 2026); enrollment required' },
      { id: 'uber', name: 'Uber Cash', amount: 15, cadence: 'monthly', monthOverrides: { 12: 35 }, note: '$15/month plus an extra $20 in December; card must be in Uber app' },
      { id: 'airline', name: 'Airline fee credit', amount: 200, cadence: 'annual', note: 'Incidental fees on one selected airline' },
      { id: 'uber_one', name: 'Uber One membership credit', amount: 120, cadence: 'annual' },
      { id: 'clear', name: 'CLEAR+ credit', amount: 219, cadence: 'annual' },
      { id: 'walmart', name: 'Walmart+ membership credit', amount: 12.95, cadence: 'monthly', note: 'Covers a monthly Walmart+ membership' },
      { id: 'oura', name: 'Oura Ring credit', amount: 200, cadence: 'annual', note: 'Enrollment required' },
      { id: 'equinox', name: 'Equinox credit', amount: 300, cadence: 'annual', note: 'Enrollment required' },
    ],
  },
  {
    id: 'amex_gold',
    name: 'American Express Gold Card',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 325,
    currency: 'amex_mr',
    baseRate: 1,
    url: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
    rules: [
      { rate: 4, categories: ['dining'], cap: 'Up to $50,000 per year, then 1x' },
      { rate: 4, categories: ['groceries'], note: 'U.S. supermarkets', cap: 'Up to $25,000 per year, then 1x' },
      { rate: 3, categories: ['flights'], note: 'booked directly with airlines or on amextravel.com' },
      { rate: 5, categories: ['hotels'], condition: 'prepaid hotels booked on AmexTravel.com' },
    ],
    credits: [
      { id: 'dining', name: 'Dining credit', amount: 10, cadence: 'monthly', note: 'Grubhub, The Cheesecake Factory, Five Guys, Buffalo Wild Wings, Wonder; enrollment required' },
      { id: 'uber', name: 'Uber Cash', amount: 10, cadence: 'monthly', note: 'Card must be in Uber app' },
      { id: 'resy', name: 'Resy credit', amount: 50, cadence: 'semiannual', note: 'Enrollment required' },
      { id: 'dunkin', name: "Dunkin' credit", amount: 7, cadence: 'monthly', note: 'Enrollment required' },
    ],
  },
  {
    id: 'amex_blue_cash_preferred',
    name: 'Blue Cash Preferred (Amex)',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 95,
    currency: 'cash',
    baseRate: 1,
    url: 'https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/',
    rules: [
      { rate: 6, categories: ['groceries'], note: 'U.S. supermarkets', cap: 'Up to $6,000 per year, then 1%' },
      { rate: 6, categories: ['streaming'], note: 'select U.S. streaming subscriptions' },
      { rate: 3, categories: ['gas'], note: 'U.S. gas stations' },
      { rate: 3, categories: ['transit'] },
    ],
    credits: [
      { id: 'disney', name: 'Disney Streaming credit', amount: 10, cadence: 'monthly', note: 'Disney+, Hulu or ESPN bundle subscriptions; enrollment required' },
    ],
  },
  {
    id: 'amex_blue_cash_everyday',
    name: 'Blue Cash Everyday (Amex)',
    issuer: 'American Express',
    network: 'amex',
    annualFee: 0,
    currency: 'cash',
    baseRate: 1,
    url: 'https://www.americanexpress.com/us/credit-cards/card/blue-cash-everyday/',
    rules: [
      { rate: 3, categories: ['groceries'], note: 'U.S. supermarkets', cap: 'Up to $6,000 per year, then 1%' },
      { rate: 3, categories: ['online', 'amazon'], note: 'U.S. online retail', cap: 'Up to $6,000 per year, then 1%' },
      { rate: 3, categories: ['gas'], note: 'U.S. gas stations', cap: 'Up to $6,000 per year, then 1%' },
    ],
    credits: [
      { id: 'disney', name: 'Disney Streaming credit', amount: 7, cadence: 'monthly', note: 'Disney+, Hulu or ESPN bundle subscriptions; enrollment required' },
      { id: 'home_chef', name: 'Home Chef credit', amount: 15, cadence: 'monthly', note: 'Enrollment required' },
    ],
  },
  {
    id: 'capital_one_venture_x',
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    network: 'visa',
    annualFee: 395,
    currency: 'c1_miles',
    baseRate: 2,
    url: 'https://www.capitalone.com/credit-cards/venture-x/',
    rules: [
      { rate: 10, categories: ['hotels', 'travel'], condition: 'hotels and rental cars booked through Capital One Travel' },
      { rate: 5, categories: ['flights', 'travel'], condition: 'flights and vacation rentals booked through Capital One Travel' },
    ],
    credits: [
      { id: 'travel', name: 'Capital One Travel credit', amount: 300, cadence: 'cardmember_year', note: 'Bookings through Capital One Travel' },
    ],
  },
  {
    id: 'capital_one_venture',
    name: 'Capital One Venture',
    issuer: 'Capital One',
    network: 'visa',
    annualFee: 95,
    currency: 'c1_miles',
    baseRate: 2,
    url: 'https://www.capitalone.com/credit-cards/venture/',
    rules: [
      { rate: 5, categories: ['hotels', 'travel'], condition: 'hotels and rental cars booked through Capital One Travel' },
    ],
    credits: [],
  },
  {
    id: 'capital_one_savor',
    name: 'Capital One Savor (no annual fee)',
    issuer: 'Capital One',
    network: 'mastercard', // some new accounts are issued on the Discover network
    annualFee: 0,
    currency: 'cash',
    baseRate: 1,
    url: 'https://www.capitalone.com/credit-cards/savor/',
    rules: [
      { rate: 3, categories: ['dining', 'entertainment', 'streaming'] },
      { rate: 3, categories: ['groceries'], note: 'excludes superstores like Walmart and Target' },
      { rate: 8, categories: ['entertainment'], condition: 'Capital One Entertainment purchases' },
      { rate: 5, categories: ['hotels', 'travel'], condition: 'hotels, vacation rentals and rental cars booked through Capital One Travel' },
    ],
    credits: [],
  },
  {
    id: 'discover_it',
    name: 'Discover it Cash Back',
    issuer: 'Discover',
    network: 'discover',
    annualFee: 0,
    currency: 'cash',
    baseRate: 1,
    url: 'https://www.discover.com/credit-cards/cash-back/it-card.html',
    rules: [
      {
        rate: 5,
        rotating: true,
        cap: 'Up to $1,500 in purchases per quarter; activate each quarter',
        quarters: { '2026-Q4': ['dining', 'entertainment'] },
        quarterNotes: { '2026-Q4': 'Restaurants, entertainment, utilities' },
      },
    ],
    credits: [],
  },
  {
    id: 'citi_double_cash',
    name: 'Citi Double Cash',
    issuer: 'Citi',
    network: 'mastercard',
    annualFee: 0,
    currency: 'citi_ty',
    baseRate: 2,
    url: 'https://www.citi.com/credit-cards/citi-double-cash-credit-card',
    rules: [
      { rate: 5, categories: ['hotels', 'travel'], condition: 'hotels, car rentals and attractions booked on Citi Travel (reported permanent in 2025; verify)' },
    ],
    credits: [],
  },
  {
    id: 'citi_custom_cash',
    name: 'Citi Custom Cash',
    // Closed to new applicants since May 28, 2026; existing cardholders keep these terms.
    issuer: 'Citi',
    network: 'mastercard',
    annualFee: 0,
    currency: 'citi_ty',
    baseRate: 1,
    url: 'https://www.citi.com/credit-cards/citi-custom-cash-credit-card',
    rules: [
      {
        rate: 5,
        topCategory: ['dining', 'groceries', 'gas', 'flights', 'hotels', 'travel', 'transit', 'streaming', 'drugstores', 'home_improvement', 'entertainment'],
        cap: 'Only your single top eligible category each billing cycle, up to $500 spent',
      },
    ],
    credits: [],
  },
  {
    id: 'citi_strata_premier',
    name: 'Citi Strata Premier',
    issuer: 'Citi',
    network: 'mastercard',
    annualFee: 95,
    currency: 'citi_ty',
    baseRate: 1,
    url: 'https://www.citi.com/credit-cards/citi-strata-premier-credit-card',
    rules: [
      { rate: 3, categories: ['flights', 'hotels', 'dining', 'groceries', 'gas'], note: 'supermarkets; gas and EV charging' },
      { rate: 10, categories: ['hotels', 'travel'], condition: 'hotels, car rentals and attractions booked on cititravel.com' },
    ],
    credits: [
      { id: 'hotel', name: 'Annual hotel benefit', amount: 100, cadence: 'annual', note: '$100 off a single hotel stay of $500+ booked via Citi Travel' },
    ],
  },
  {
    id: 'citi_strata_elite',
    name: 'Citi Strata Elite',
    issuer: 'Citi',
    network: 'mastercard', // not confirmed by a source in research; verify
    annualFee: 595,
    currency: 'citi_ty',
    baseRate: 1.5,
    url: 'https://www.citi.com/credit-cards/citi-strata-elite-credit-card',
    rules: [
      { rate: 3, categories: ['dining'] },
      { rate: 6, categories: ['dining'], condition: 'Friday and Saturday 6pm-6am ET ("Citi Nights")' },
      { rate: 12, categories: ['hotels', 'travel'], condition: 'hotels, car rentals and attractions booked on Citi Travel' },
      { rate: 6, categories: ['flights'], condition: 'booked on Citi Travel' },
    ],
    credits: [
      { id: 'hotel', name: 'Hotel credit', amount: 300, cadence: 'annual', note: '2+ night stays booked on Citi Travel' },
      { id: 'splurge', name: 'Splurge credit', amount: 200, cadence: 'annual', note: 'Up to two of: 1stDibs, American Airlines, Best Buy, Future Personal Training, Live Nation' },
      { id: 'blacklane', name: 'Blacklane credit', amount: 100, cadence: 'semiannual' },
    ],
  },
  {
    id: 'citi_costco',
    name: 'Costco Anywhere Visa (Citi)',
    issuer: 'Citi',
    network: 'visa',
    annualFee: 0,
    currency: 'cash',
    baseRate: 1,
    url: 'https://www.citi.com/credit-cards/citi-costco-anywhere-visa-credit-card',
    rules: [
      { rate: 5, merchants: ['costco_gas'], note: 'gas at Costco', cap: '4%/5% gas combined up to $7,000 per year, then 1%' },
      { rate: 4, categories: ['gas'], cap: 'Gas combined up to $7,000 per year, then 1%' },
      { rate: 3, categories: ['dining', 'flights', 'hotels', 'travel'] },
      { rate: 2, merchants: ['costco', 'costco_online'] },
    ],
    credits: [],
  },
  {
    id: 'wells_fargo_active_cash',
    name: 'Wells Fargo Active Cash',
    issuer: 'Wells Fargo',
    network: 'visa',
    annualFee: 0,
    currency: 'cash',
    baseRate: 2,
    url: 'https://creditcards.wellsfargo.com/active-cash-credit-card/',
    rules: [],
    credits: [],
  },
  {
    id: 'wells_fargo_autograph',
    name: 'Wells Fargo Autograph',
    issuer: 'Wells Fargo',
    network: 'visa',
    annualFee: 0,
    currency: 'wf_points',
    baseRate: 1,
    url: 'https://creditcards.wellsfargo.com/autograph-visa-credit-card/',
    rules: [
      { rate: 3, categories: ['dining', 'flights', 'hotels', 'travel', 'gas', 'transit', 'streaming', 'phone'] },
    ],
    credits: [],
  },
  {
    id: 'boa_customized_cash',
    name: 'Bank of America Customized Cash Rewards',
    issuer: 'Bank of America',
    network: 'visa',
    annualFee: 0,
    currency: 'cash',
    baseRate: 1,
    url: 'https://www.bankofamerica.com/credit-cards/products/cash-back-credit-card/',
    rules: [
      {
        rate: 3,
        choice: ['gas', 'online', 'dining', 'travel', 'drugstores', 'home_improvement'],
        // 'online' also covers cable, streaming, internet and phone plans.
        defaultChoice: 'gas',
        cap: '3% and 2% categories share $2,500 in purchases per quarter, then 1%',
      },
      { rate: 2, categories: ['groceries', 'wholesale'], cap: 'Shares the $2,500 quarterly cap with the 3% category' },
    ],
    credits: [],
  },
  {
    id: 'usbank_altitude_go',
    name: 'U.S. Bank Altitude Go',
    issuer: 'U.S. Bank',
    network: 'visa',
    annualFee: 0,
    currency: 'usb_points',
    baseRate: 1,
    url: 'https://www.usbank.com/credit-cards/altitude-go-visa-signature-credit-card.html',
    rules: [
      { rate: 4, categories: ['dining'], note: 'includes takeout and delivery', cap: 'Up to $2,000 per quarter, then 1x' },
      { rate: 2, categories: ['groceries', 'gas', 'streaming'] },
    ],
    credits: [],
  },
];

export const NETWORK_NAMES = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
};
