// Real Brand Slogans Dataset for AI Prompt Context

const BRAND_SLOGANS_SAMPLE = [
    "Costa Coffee: For coffee lovers.",
    "Evian: Evian. Live young.",
    "Dasani: Designed to make a difference.",
    "Heineken: It's all about the beer.",
    "Gatorade: The Legend Continues.",
    "Belvedere Vodka: Belvedere Always Goes Down Smoothly.",
    "Nike: Just Do It.",
    "Apple: Think Different.",
    "BMW: The Ultimate Driving Machine.",
    "L'Oreal: Because You're Worth It.",
    "Mastercard: There are some things money can't buy. For everything else, there's Mastercard.",
    "Airbnb: Belong Anywhere.",
    "De Beers: A Diamond is Forever.",
    "Red Bull: Gives You Wings.",
    "Rolex: A Crown for Every Achievement.",
    "Porsche: There is No Substitute.",
    "Chanel: In Order to be Irreplaceable One Must Always be Different.",
    "Tesla: Accelerating the World's Transition to Sustainable Energy.",
    "Gucci: Quality is remembered long after price is forgotten.",
    "Mercedes-Benz: The Best or Nothing."
];

function getRandomSloganExamples(count = 5) {
    const shuffled = [...BRAND_SLOGANS_SAMPLE].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).join(" | ");
}
