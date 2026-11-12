export const site = {
  name: "The Scone Ranger",
  phoneDisplay: "(509) 953-7343",
  phoneHref: "tel:+15099537343",
  smsHref: "sms:+15099537343",
  email: "SconeRangerOrders@gmail.com",
  place: "Spokane, Washington",
} as const;

export const nav = [
  { href: "/flavors", label: "Flavors" },
  { href: "/find-us", label: "Find Us" },
  { href: "/our-story", label: "Our Story" },
  { href: "/contact", label: "Contact" },
] as const;

export const story = [
  "If you’re not exactly a scone fan, then you’re just exactly the person we’re looking for…to try ours. You see, The Scone Ranger understands and appreciates the reason that scones often get such negative reviews, because they’re DRY.",
  "His wife, Mrs. Scone Ranger, was once one of the pastry’s toughest critics. She understood that the traditional European scone was meant to be consumed with clotted cream and jam, and washed down with tea. And she wasn’t interested. So, he set out on a heroic mission to create the perfect scone…a scone to be desired for its tender texture and phenomenal flavor. And he succeeded. When she tasted his Orange Cranberry scone, it was love at first bite.",
  "Soon thereafter, amidst contented sighs and whispered murmurs of “My Hero,” she christened him “The Scone Ranger,” as he is known to this day. And being much encouraged by her lavish praise, he baked again, and again, and again until he had created over 40 varieties of the mouth-watering treats. And there was much rejoicing in the land.",
] as const;

export const findPrompt =
  "What’s going on right now with the Scone Ranger? Where can I find Scone Ranger scones?";

export const about = [
  "Mr. and Mrs. Scone Ranger (a.k.a. David and Evelyn Ainley) reside in Spokane, Washington…just a “scone’s throw away” from the iconic Milk Bottle Ice Creamery and Garland Theater.",
  "In May 2010, The Scone Ranger first “set up shop” at the North Side Farmer’s Market at Francis and Lidgerwood. The following year, in June 2011, The Scone Ranger moved to the Spokane Public Market, where the delectable treats beckoned customers from a lighted display case, until its closure on March 8, 2014.",
] as const;

export const wholesalePitch =
  "We offer wholesale pricing to coffee shops, restaurants, cafes, etc. If you know of a coffee shop or other venue that might be interested in carrying Scone Ranger scones, please see our Contact Information to set up an appointment complete with plentiful samples.";

export const venuesIntro =
  "As of Spring 2026, Scone Ranger scones are available at the following venues:";

export const marketsIntro =
  "The Scone Ranger is participating in the following Farmers’ Markets during the 2026 season:";

export const stockists = [
  {
    city: "Spokane",
    places: [
      {
        name: "Bean Me Up Espresso",
        address: "12021 N Division St, Spokane, WA 99218",
      },
    ],
  },
  {
    city: "Spokane Valley",
    places: [
      {
        name: "Caffé Perfezione",
        address: "10510 E Sprague Ave, Spokane Valley, WA 99206",
      },
    ],
  },
] as const;

export type Market = {
  name: string;
  address: string;
  when: string;
  days: number[];
  season: [number, number];
};

export const markets: Market[] = [
  {
    name: "Fairwood Farmers’ Market",
    address: "319 W Hastings Rd, Spokane, WA 99218",
    when: "Tuesdays (May – October) 3pm – 7pm",
    days: [2],
    season: [5, 10],
  },
  {
    name: "Kendall Yards Night Market",
    address: "1335 W Summit Pkwy, Spokane, WA 99201",
    when: "Wednesdays (May -September) 5pm – 8pm",
    days: [3],
    season: [5, 9],
  },
  {
    name: "Spokane Farmers’ Market",
    address: "W. 4th Ave & S Chestnut St, Browne’s Addition, Spokane, WA 99201",
    when: "Saturdays and Wednesday (May -October ) 8am – 12pm",
    days: [3, 6],
    season: [5, 10],
  },
  {
    name: "Liberty Lake Farmers’ Market",
    address: "1421 N Meadowwood Lane, Liberty Lake, WA, 99019",
    when: "Saturdays (May – October) 9am – 1pm",
    days: [6],
    season: [5, 10],
  },
];

export const kxlyCaption =
  "Colleen O’Brien of KXLY news interviews The Passionate Produce Professional and The Singing Scone Ranger at the Spokane Public Market, 2012";

export const interviewUrl = "https://youtu.be/vmLuwuCTMSk";

export const interviewEmbed = "https://www.youtube.com/embed/vmLuwuCTMSk";

export const menuNote =
  "Gluten-Free, Sugar-Free, and Vegan available upon request…";

export const menuFollowup =
  "With over 60 flavors, we can’t possibly bring them all to the market at once. Watch The Scone Ranger on Facebook for weekly selections.";

export const flavorNames = [
  "Almond Joy",
  "Almond Poppy Seed",
  "Apple Pie",
  "Blackberry",
  "Café Mocha",
  "Salted Caramel Scotchies",
  "Cherry Almond",
  "Cherry Almond Bordeaux",
  "Chocotella",
  "Chocolate Chip Mint",
  "Chocolate Peanut Butter",
  "Chocolate Peanut Butter Bliss",
  "Chocolate Orange",
  "Cinnamon Roll",
  "Coconut Chocolate Chip",
  "Egg Nog (Seasonal)",
  "English Toffee",
  "German Sweet Chocolate",
  "Gingerbread",
  "Hallowicious",
  "Greek Fetish",
  "Huckleberry",
  "Jalapeño Cheddar",
  "Jalapeño Lemon",
  "Jalapeño Lime",
  "Lemon Blueberry",
  "Lemon Huckleberry",
  "Lemon Lavender",
  "Lemon Poppy Seed",
  "Maple Bacon",
  "Maple Pecan",
  "Mixed Berry",
  "Orange Cranberry",
  "Peach Almond",
  "Peanut Butter Chip",
  "Peppermint Bark",
  "Piña Colada",
  "Pumpkin Cream Cheese",
  "Pumpkin Spice",
  "Raspberry",
  "Raspberry Lemonade",
  "Reese’s",
  "Smoky Cheddar n' Chive",
  "Strawberry",
  "Strawberry Lemonade",
  "Strawberry Rhubarb",
  "Triple Cheese Garlic",
  "Tropical Paradise",
] as const;

export function flavorSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const testimonies = [
  "“Best scones I’ve ever had! Their gluten free scones are amazing! You can’t even tell that they’re gluten free! The owners are awesome too, they always greet you like a friend and make you feel valued”, said Jayne Jackson",
  "“This scone may have just changed my whole life!” -Amy after tasting the Peppermint Bark scone.",
  "“Ohhhh baby”, Rennie said with her first bite of the Pina Colada scone.",
  "“Yesterday I had one of your Lemon Blueberry scones…you are a genius!” -Chris",
  "“These sugar-free scones are AWESOME!!! I think they are the best sugar-free yet! I shared them with with my co-workers and everybody loved them and said they couldn’t tell that they were sugar-free.” -Jami",
  "“That’s like paradise in my mouth…oh my god, that is so frickin’ good!” -Rebecca",
  "“My taste buds are like jumping in my mouth!” -Brian",
  "“This is phenomenal!” -Kaitlin",
  "“Yummers!” -Kendal",
  "“The creative zeal is in the scone.” -Lon",
  "“They are surprisingly moist, mmmm (eyes rolling dreamily), this is wonderful” -Christy",
  "“They’re so sinful…but I NEED one!” -Eileen",
  "“Wow, that’s really good…heaven exploded in my mouth!” -James",
  "“Not the dry, icky ones!” -Jamie",
  "“Best scones I’ve ever eaten!” -Jay",
  "“Not like any scone I’ve ever had!” -Tai",
  "“They are not dried out!” -Arrow",
  "“Oh, oh this is wonderful!” -Kristy",
  "“It’s like eatin’ your own personal birthday cake!” -Roger (the Passionate Produce Professional)",
  "“They’re so addicting…they’re pretty amazing.” – Judy",
  "“I’ve never experienced such deliciousness.” – Michael",
  "Q: “How’s that scone treating you? A: “Ridiculously” – Ty",
  "“I’ll have Pumpkin Cream Cheese, Gingerbread, and oh-my-god Orange Cranberry” – Jessica",
  "“They’re frickin’ amazing.” – Erin",
  "“Ohhhh…..Ohhhh” with eyes rolling, closing, and face turning heavenward – Jeric As for what he said next? Well…it’s a family site. But he thought it was THAT good.",
  "“I don’t think I’ll ever forget that bite”, Laura said upon tasting the German Sweet Chocolate scone for the very first time.",
  "“These strawberry scones are delicious!!! Very moist and the frosting is the perfect touch of sweetness…Yummy!!! This flavor is definitely a keeper.” -Jami",
] as const;

export const featured = [
  { name: "Orange Cranberry", quote: testimonies[22] },
  { name: "Lemon Blueberry", quote: testimonies[3] },
  { name: "Peppermint Bark", quote: testimonies[1] },
  { name: "Piña Colada", quote: testimonies[2] },
  { name: "German Sweet Chocolate", quote: testimonies[25] },
  { name: "Strawberry", quote: testimonies[26] },
] as const;

export const orderHeading =
  "Contact The Scone Ranger with your order (6 scone minimum per flavor)";

export const volumeNote =
  "Ask about volume discounts. Larger orders are not charged at the full per-dozen price.";

export const callLine = "Call or text: (509) 953-7343";

export const emailLine = "Email: SconeRangerOrders@gmail.com";

export const wholesalePrices =
  "Coffee shops: Wholesale prices are $32/dozen for standard scones and $36/premium scones";

export const retailHeading = "Retail prices:";

export const retailLines = [
  "Standard scones and Vegan scones are priced at $50/dozen",
  "Gluten-free, cheese filled and sugar-free scones are $60/dozen",
  "Huckleberry scones are priced at $75/dozen",
] as const;

export const deliveryFee = "Delivery fee: $6";

export const deliveryDetail =
  "(within a 5 mile radius of downtown Spokane) (Smaller sized scones made-to-order. Ask for details and pricing)";

export function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
