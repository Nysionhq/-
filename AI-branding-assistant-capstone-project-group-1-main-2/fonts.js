// Tone-to-Font Mapping and Google Fonts Dynamic Loader

const FONTS_BY_TONE = {
    "Minimalist": [
        "Helvetica", "Futura", "Gill Sans", "Inter", "Roboto",
        "Montserrat", "Open Sans", "Lato", "Poppins", "Verdana"
    ],
    "Professional": [
        "Times New Roman", "Georgia", "Cambria", "Garamond", "Baskerville",
        "Merriweather", "Playfair Display", "Lora", "Cinzel", "PT Serif"
    ],
    "Luxury": [
        "Bodoni Moda", "Cinzel", "Cormorant Garamond", "Playfair Display",
        "Didot", "Prata", "Italiana", "Marcellus", "Alex Brush", "Great Vibes"
    ],
    "Bold": [
        "Oswald", "Montserrat", "Bebas Neue", "Anton", "Impact",
        "Syne", "Cinzel Decorative", "Righteous", "Space Grotesk", "Consolas"
    ],
    "Playful": [
        "Fredoka", "Pacifico", "Quicksand", "Comfortaa", "Caveat",
        "Sniglet", "Dancing Script", "Righteous", "Sacramento", "Chewy"
    ]
};

function getFontsForTone(tone) {
    return FONTS_BY_TONE[tone] || FONTS_BY_TONE["Professional"];
}

// Set of loaded Google Fonts to avoid duplicate link elements
const loadedFonts = new Set();

function loadGoogleFont(fontName) {
    if (!fontName || loadedFonts.has(fontName)) return;

    // Standard web safe fonts don't need Google Fonts API call
    const webSafe = ["Helvetica", "Times New Roman", "Georgia", "Verdana", "Arial", "Courier", "Consolas", "Impact"];
    if (webSafe.includes(fontName)) {
        loadedFonts.add(fontName);
        return;
    }

    try {
        const fontUrl = fontName.replace(/\s+/g, '+');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontUrl}:wght@400;600;700&display=swap`;
        document.head.appendChild(link);
        loadedFonts.add(fontName);
    } catch (e) {
        console.warn("Could not load font from Google Fonts:", fontName, e);
    }
}
