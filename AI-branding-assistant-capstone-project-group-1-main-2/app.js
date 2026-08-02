// ============================================================================
// AI Brand Architect — Cinematic Immersive Application Core
// Preserves ALL AI logic, API calls, state management, export functions
// Adds: Gradient Engine, Phase Controller, Question Flow, Results Dashboard,
//        AI Assistant Chat with Mascot
// ============================================================================

const DEFAULT_API_KEY = atob("aGZfT3pFbkFnYXpFZnVvWnNyTU56aU9NZkNUcFBmbGV4VGt5bw==");

// ── Application State Store ──
const state = {
    apiKey: localStorage.getItem('hf_api_key') || DEFAULT_API_KEY,
    user: null,
    db: null,
    auth: null,

    profiles: [],
    activeProfileId: 'default',

    company: '',
    industry: 'Technology',
    stage: 'Just Starting Out',
    progress: 'Blank Canvas (0%)',
    archetype: 'The Innovator (Tech / Frontier)',
    marketTier: 'High-Tier Enterprise',
    tone: 'Minimalist',
    product: '',
    audience: [],
    channels: [],
    usp: '',
    avoid: '',
    goal: '',
    desc: '',

    brand: null,
    finalSlogan: '',
    finalFont: '',

    campaign: null,
    finalCaption: '',

    strategy: '',
    hrPlan: '',
    logisticsPlan: '',
    marketingPlan: '',
    outreachPlan: '',
    socialPlan: '',
    translations: null,

    logoImageDataUrl: '',
    logoDesc: '',

    activeTab: 'tab-brand',
    currentPhase: 'welcome',
    currentQuestion: 0
};

let canvasAnimationId = null;
let animationFrameCount = 0;



// ============================================================================
// SECTION 1: 1:1 LOVABLE.DEV EXACT COLOR MESH GRADIENT ENGINE
// Recreates the EXACT color placement, wave positions, and dark top vignette from Lovable.dev.
// 7 Anchor Blobs (Upper Blue Arms -> Mid Neon Pink -> Lower Coral Horizon) with 60fps color morphing.
// ============================================================================
const GradientEngine = (() => {
    let canvas, ctx;
    let width, height;
    let animFrame;
    let time = 0;

    // 7 Anchor Color Nodes matching Lovable.dev reference image 1:1
    const defaultPalette = [
        { r: 35, g: 95, b: 230 },   // 0: Upper Left Royal Blue
        { r: 240, g: 50, b: 160 },  // 1: Mid Left Neon Pink
        { r: 255, g: 60, b: 85 },   // 2: Lower Left Coral Red
        { r: 30, g: 110, b: 245 },  // 3: Upper Right Sapphire Blue
        { r: 245, g: 60, b: 175 },  // 4: Mid Right Hot Magenta
        { r: 255, g: 95, b: 40 },   // 5: Lower Right Coral Orange
        { r: 255, g: 70, b: 45 }    // 6: Bottom Center Horizon
    ];

    let currentNodes = defaultPalette.map(c => ({ ...c }));
    let targetNodes = defaultPalette.map(c => ({ ...c }));

    let transitionProgress = 1;
    let transitionSpeed = 0.008;

    // Tonal Color Map variations (All preserving Lovable's exact spatial layout)
    const PALETTES = {
        welcome: defaultPalette,
        motivation: defaultPalette,
        Playful: defaultPalette,
        results: [
            { r: 20, g: 30, b: 85 },   // 0: Upper Left Deep Sapphire Glow
            { r: 60, g: 18, b: 55 },   // 1: Mid Left Deep Midnight Violet Glow
            { r: 75, g: 22, b: 35 },   // 2: Lower Left Deep Dark Plum Glow
            { r: 15, g: 38, b: 90 },   // 3: Upper Right Deep Royal Blue Glow
            { r: 65, g: 20, b: 60 },   // 4: Mid Right Deep Amethyst Glow
            { r: 70, g: 25, b: 30 },   // 5: Lower Right Deep Obsidian Amber Glow
            { r: 50, g: 20, b: 45 }    // 6: Bottom Center Deep Dark Horizon Glow
        ],
        warm: [
            { r: 90, g: 40, b: 190 },
            { r: 210, g: 50, b: 150 },
            { r: 245, g: 80, b: 60 },
            { r: 80, g: 50, b: 210 },
            { r: 230, g: 60, b: 130 },
            { r: 255, g: 110, b: 40 },
            { r: 255, g: 90, b: 50 }
        ],
        Minimalist: [
            { r: 40, g: 65, b: 110 },
            { r: 75, g: 115, b: 165 },
            { r: 130, g: 170, b: 210 },
            { r: 50, g: 85, b: 130 },
            { r: 105, g: 145, b: 190 },
            { r: 165, g: 195, b: 225 },
            { r: 140, g: 175, b: 215 }
        ],
        Professional: [
            { r: 15, g: 55, b: 165 },
            { r: 25, g: 115, b: 225 },
            { r: 85, g: 65, b: 215 },
            { r: 20, g: 75, b: 185 },
            { r: 35, g: 135, b: 235 },
            { r: 105, g: 55, b: 225 },
            { r: 55, g: 105, b: 235 }
        ],
        Luxury: [
            { r: 20, g: 30, b: 90 },
            { r: 150, g: 25, b: 80 },
            { r: 212, g: 140, b: 30 },
            { r: 25, g: 40, b: 110 },
            { r: 170, g: 35, b: 90 },
            { r: 245, g: 175, b: 60 },
            { r: 225, g: 130, b: 40 }
        ],
        Bold: [
            { r: 120, g: 20, b: 170 },
            { r: 220, g: 30, b: 80 },
            { r: 255, g: 60, b: 20 },
            { r: 140, g: 30, b: 190 },
            { r: 240, g: 40, b: 60 },
            { r: 255, g: 110, b: 10 },
            { r: 255, g: 80, b: 15 }
        ],
        Technology: defaultPalette,
        Fashion: defaultPalette,
        'Food & Beverage': defaultPalette,
        Health: defaultPalette,
        Education: defaultPalette,
        'Real Estate': defaultPalette
    };

    function init() {
        canvas = document.getElementById('gradientCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);

        currentNodes = PALETTES.welcome.map(c => ({ ...c }));
        targetNodes = currentNodes.map(c => ({ ...c }));

        animate();
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function setPalette(paletteName, duration) {
        if (state.hasReachedResults && paletteName !== 'results') {
            return;
        }
        const pal = PALETTES[paletteName] || defaultPalette;
        targetNodes = pal.map(c => ({ ...c }));
        transitionProgress = 0;
        transitionSpeed = duration ? (1 / (duration * 60)) : 0.008;
    }

    function lerpColor(a, b, t) {
        return {
            r: a.r + (b.r - a.r) * t,
            g: a.g + (b.g - a.g) * t,
            b: a.b + (b.b - a.b) * t
        };
    }

    let isProcessingMode = false;

    function setProcessingMode(active) {
        isProcessingMode = active;
    }

    function animate() {
        if (isProcessingMode) {
            time += 0.035;
            for (let i = 0; i < currentNodes.length; i++) {
                currentNodes[i].r = 120 + 110 * Math.sin(time * 2 + i * 1.2);
                currentNodes[i].g = 100 + 100 * Math.sin(time * 2.5 + i * 1.5);
                currentNodes[i].b = 180 + 75 * Math.cos(time * 3 + i * 1.8);
            }
        } else {
            time += 0.005;

            // Smooth 60fps color lerp across tone changes
            if (transitionProgress < 1) {
                transitionProgress = Math.min(1, transitionProgress + transitionSpeed);
                const ease = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
                for (let i = 0; i < currentNodes.length; i++) {
                    if (targetNodes[i]) currentNodes[i] = lerpColor(currentNodes[i], targetNodes[i], ease * 0.08);
                }
            }
        }

        // 1. Dark Vignetted Atmosphere Base (Upper 35% dark charcoal header as in Lovable)
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#07080d');
        bgGrad.addColorStop(0.35, '#0a0b12');
        bgGrad.addColorStop(1, '#0c0d16');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. 7 Spatial Anchor Blobs matching Lovable 1:1
        const blobPositions = [
            { x: 0.12, y: 0.38, rx: 0.55, ry: 0.50, phase: 0 },       // 0: Upper Left Blue Arm
            { x: 0.18, y: 0.58, rx: 0.58, ry: 0.52, phase: 1.2 },     // 1: Mid Left Neon Pink
            { x: 0.25, y: 0.82, rx: 0.65, ry: 0.55, phase: 2.4 },     // 2: Lower Left Coral Red
            { x: 0.88, y: 0.38, rx: 0.55, ry: 0.50, phase: 3.6 },     // 3: Upper Right Blue Arm
            { x: 0.82, y: 0.58, rx: 0.58, ry: 0.52, phase: 4.8 },     // 4: Mid Right Hot Magenta
            { x: 0.75, y: 0.82, rx: 0.65, ry: 0.55, phase: 6.0 },     // 5: Lower Right Coral Orange
            { x: 0.50, y: 0.90, rx: 0.70, ry: 0.55, phase: 7.2 }      // 6: Lower Center Horizon
        ];

        ctx.globalCompositeOperation = 'screen';

        blobPositions.forEach((pos, i) => {
            const color = currentNodes[i] || currentNodes[0];
            const cx = width * (pos.x + Math.sin(time * 0.5 + pos.phase) * 0.03);
            const cy = height * (pos.y + Math.cos(time * 0.4 + pos.phase) * 0.03);
            const radius = Math.max(width, height) * (pos.rx * 0.75 + Math.sin(time * 0.3 + pos.phase) * 0.02);

            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
            const r = Math.round(color.r);
            const g = Math.round(color.g);
            const b = Math.round(color.b);

            grad.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, 0.92)`);
            grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.60)`);
            grad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, 0.22)`);
            grad.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0)`);

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        });

        // 3. Top-Center Dark Wedge (Maintains Lovable's dark center heading area)
        ctx.globalCompositeOperation = 'multiply';
        const topDarkGrad = ctx.createRadialGradient(width * 0.5, height * 0.15, 0, width * 0.5, height * 0.15, width * 0.45);
        topDarkGrad.addColorStop(0.0, 'rgba(7, 8, 13, 0.95)');
        topDarkGrad.addColorStop(0.5, 'rgba(7, 8, 13, 0.65)');
        topDarkGrad.addColorStop(1.0, 'rgba(7, 8, 13, 0)');
        ctx.fillStyle = topDarkGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'source-over';

        animFrame = requestAnimationFrame(animate);
    }

    return { init, setPalette, setProcessingMode, PALETTES };
})();





// ============================================================================
// SECTION 1.5: FIREBASE AUTH & FIRESTORE STORAGE ENGINE
// ============================================================================

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAuYwaW8lGA5cmb5gJ9i1Side5oZPzZa14",
    authDomain: "nysion-hq.firebaseapp.com",
    projectId: "nysion-hq",
    storageBucket: "nysion-hq.firebasestorage.app",
    messagingSenderId: "653430304808",
    appId: "1:653430304808:web:627e1c2fa318ade36b851d",
    measurementId: "G-4EML1E8RTT"
};

let db = null;
let auth = null;

function initFirebase() {
    try {
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
            auth = firebase.auth();
            db = firebase.firestore();

            auth.onAuthStateChanged(async (user) => {
                state.user = user;
                renderUserProfileCorner();
                if (user) {
                    logDebug('SUCCESS', `User authenticated with Google: ${user.email}`);
                    await loadUserDataFromFirestore(user.uid);
                } else {
                    logDebug('SYSTEM', 'User signed out.');
                }
                if (state.currentPhase === 'results') {
                    ResultsDashboard.render();
                }
            });
        }
    } catch (e) {
        logDebug('WARN', 'Firebase initialization note:', e.message);
    }
}

function openAuthModal() {
    const modal = document.getElementById('googleAuthModal');
    if (modal) modal.classList.add('active');
}

function closeAuthModal() {
    const modal = document.getElementById('googleAuthModal');
    if (modal) modal.classList.remove('active');
}

async function signInWithGoogle() {
    if (!auth) {
        initFirebase();
    }
    if (!auth) {
        alert("Firebase Auth is initializing. Please try again.");
        return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        closeAuthModal();
        logDebug('SUCCESS', 'Logged in as ' + (result.user.displayName || result.user.email));
        if (state.company) {
            await saveUserDataToFirestore();
        }
    } catch (err) {
        logDebug('ERROR', 'Google Sign-In failed', err.message);
        alert('Google Sign-In Notice: ' + err.message);
    }
}

async function signOutUser() {
    if (auth) {
        await auth.signOut();
        state.user = null;
        renderUserProfileCorner();
        ResultsDashboard.render();
    }
}

function renderUserProfileCorner() {
    const corner = document.getElementById('userProfileCorner');
    if (!corner) return;

    if (state.user) {
        const photo = state.user.photoURL || 'https://via.placeholder.com/32';
        const name = state.user.displayName || state.user.email || 'User';
        corner.innerHTML = `
            <div class="user-profile-badge">
                <img src="${photo}" alt="${escapeHtml(name)}" class="user-avatar" onerror="this.src='https://via.placeholder.com/32'">
                <span style="font-size:0.75rem; font-weight:600;">${escapeHtml(name)}</span>
                <button onclick="signOutUser()" style="background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:0.75rem; margin-left:4px;" title="Sign Out">✕</button>
            </div>
        `;
    } else {
        corner.innerHTML = `
            <button class="settings-btn" onclick="openAuthModal()" style="border-color:rgba(74,222,128,0.4); color:#4ade80;">
                🔒 Sign in with Google
            </button>
        `;
    }
}

async function saveUserDataToFirestore() {
    const profileId = state.activeProfileId || 'default';
    const dataToSave = {
        id: profileId,
        company: state.company,
        industry: state.industry,
        stage: state.stage,
        progress: state.progress,
        archetype: state.archetype,
        marketTier: state.marketTier,
        tone: state.tone,
        product: state.product,
        audience: state.audience,
        channels: state.channels,
        usp: state.usp,
        avoid: state.avoid,
        desc: state.desc,
        finalSlogan: state.finalSlogan,
        finalFont: state.finalFont,
        brand: state.brand ? JSON.stringify(state.brand) : null,
        strategy: state.strategy || '',
        hrPlan: state.hrPlan || '',
        logisticsPlan: state.logisticsPlan || '',
        marketingPlan: state.marketingPlan || '',
        outreachPlan: state.outreachPlan || '',
        socialPlan: state.socialPlan || '',
        updatedAt: new Date().toISOString()
    };

    // Always cache locally first for offline instant access
    try {
        localStorage.setItem(`nysion_profile_${profileId}`, JSON.stringify(dataToSave));
    } catch(err){}

    if (!state.user || !db) return;
    try {
        const userDocRef = db.collection('users').doc(state.user.uid).collection('profiles').doc(profileId);
        await userDocRef.set({
            ...dataToSave,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        logDebug('SUCCESS', `Saved brand profile "${profileId}" to Firestore for ${state.user.email}`);
    } catch (e) {
        logDebug('WARN', 'Cloud Firestore sync note:', e.message);
    }
}

function applyProfileDataToState(data) {
    if (!data) return;
    if (data.company) state.company = data.company;
    if (data.industry) state.industry = data.industry;
    if (data.stage) state.stage = data.stage;
    if (data.progress) state.progress = data.progress;
    if (data.archetype) state.archetype = data.archetype;
    if (data.marketTier) state.marketTier = data.marketTier;
    if (data.tone) state.tone = data.tone;
    if (data.product) state.product = data.product;
    if (data.audience) state.audience = data.audience;
    if (data.channels) state.channels = data.channels;
    if (data.usp) state.usp = data.usp;
    if (data.avoid) state.avoid = data.avoid;
    if (data.desc) state.desc = data.desc;
    if (data.finalSlogan) state.finalSlogan = data.finalSlogan;
    if (data.finalFont) state.finalFont = data.finalFont;
    if (data.brand) {
        try { state.brand = typeof data.brand === 'string' ? JSON.parse(data.brand) : data.brand; } catch(err){}
    } else {
        state.brand = null;
    }
    state.strategy = data.strategy || '';
    state.hrPlan = data.hrPlan || '';
    state.logisticsPlan = data.logisticsPlan || '';
    state.marketingPlan = data.marketingPlan || '';
    state.outreachPlan = data.outreachPlan || '';
    state.socialPlan = data.socialPlan || '';
}

async function loadUserDataFromFirestore(uid) {
    // Try restoring local cache first for zero-latency load
    try {
        const localCached = localStorage.getItem(`nysion_profile_${state.activeProfileId || 'default'}`);
        if (localCached) {
            applyProfileDataToState(JSON.parse(localCached));
        }
    } catch(err){}

    if (db && uid) {
        try {
            const snapshot = await db.collection('users').doc(uid).collection('profiles').get();
            if (!snapshot.empty) {
                state.profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const activeDoc = state.profiles.find(p => p.id === state.activeProfileId) || state.profiles[0];
                state.activeProfileId = activeDoc.id;
                applyProfileDataToState(activeDoc);
                logDebug('SUCCESS', `Restored ${state.profiles.length} brand profile(s) from Firestore!`, { activeCompany: state.company });
            } else {
                const doc = await db.collection('users').doc(uid).get();
                if (doc.exists) {
                    const data = doc.data();
                    applyProfileDataToState(data);
                    state.profiles = [{ id: 'default', company: state.company || 'Default Profile' }];
                    state.activeProfileId = 'default';
                }
            }
        } catch (e) {
            logDebug('WARN', 'Firestore load note (using local cache):', e.message);
        }
    }

    if (state.company) {
        state.hasReachedResults = true;
        if (state.currentPhase !== 'results' && typeof PhaseController !== 'undefined' && PhaseController.showResults) {
            PhaseController.showResults();
        }
    }
    renderSidebar();
}

// ── Left Sidebar & Multi-Profile Management Handlers ──
function toggleLeftSidebar() {
    const panel = document.getElementById('leftSidebarPanel');
    const overlay = document.getElementById('sidebarOverlay');
    if (panel) panel.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    renderSidebar();
}

function closeLeftSidebar() {
    const panel = document.getElementById('leftSidebarPanel');
    const overlay = document.getElementById('sidebarOverlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
}

function renderSidebar() {
    const avatar = document.getElementById('sidebarUserAvatar');
    const nameEl = document.getElementById('sidebarUserName');
    const emailEl = document.getElementById('sidebarUserEmail');
    const select = document.getElementById('profileSelect');
    const blocksContainer = document.getElementById('sidebarFeatureBlocks');

    if (state.user) {
        if (avatar) avatar.src = state.user.photoURL || 'mascot.png';
        if (nameEl) nameEl.textContent = state.user.displayName || 'User Profile';
        if (emailEl) emailEl.textContent = state.user.email || '';
    } else {
        if (avatar) avatar.src = 'mascot.png';
        if (nameEl) nameEl.textContent = 'Guest User';
        if (emailEl) emailEl.textContent = 'Sign in to sync brand profiles';
    }

    if (select) {
        select.innerHTML = '';
        if (state.profiles && state.profiles.length > 0) {
            state.profiles.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = p.company || 'Brand Empire';
                if (p.id === state.activeProfileId) opt.selected = true;
                select.appendChild(opt);
            });
        } else {
            const opt = document.createElement('option');
            opt.value = 'default';
            opt.textContent = state.company || 'Default Brand';
            select.appendChild(opt);
        }
    }

    if (blocksContainer) {
        blocksContainer.innerHTML = '';
        const allFeatures = [
            { title: 'Brand Identity Suite', stateCheck: () => !!state.brand, onView: () => renderBrandDetailPanel() },
            { title: 'Executive Growth Roadmap', stateCheck: () => !!state.strategy, onView: () => renderStrategyDetailPanel() },
            { title: 'AI Logo Studio', stateCheck: () => !!state.logoImageDataUrl, onView: () => renderLogoDetailPanel() },
            { title: 'HR & Talent Architecture', stateCheck: () => !!state.hrPlan, onView: () => renderHRDetailPanel() },
            { title: 'Logistics & Operations Plan', stateCheck: () => !!state.logisticsPlan, onView: () => renderLogisticsDetailPanel() },
            { title: 'Comprehensive Marketing Plan', stateCheck: () => !!state.marketingPlan, onView: () => renderMarketingDetailPanel() },
            { title: 'Outreach & Prospecting Strategy', stateCheck: () => !!state.outreachPlan, onView: () => renderOutreachDetailPanel() },
            { title: 'Social Media Strategy & Content Plan', stateCheck: () => !!state.socialPlan, onView: () => renderSocialDetailPanel() }
        ];

        let count = 0;
        allFeatures.forEach(feat => {
            if (feat.stateCheck()) {
                count++;
                const block = document.createElement('div');
                block.className = 'sidebar-feature-block';
                block.innerHTML = `
                    <div class="sidebar-feature-title">${feat.title}</div>
                    <div class="sidebar-feature-badge">✓ Ready</div>
                `;
                block.addEventListener('click', () => {
                    closeLeftSidebar();
                    feat.onView();
                });
                blocksContainer.appendChild(block);
            }
        });

        if (count === 0) {
            blocksContainer.innerHTML = `<p style="font-size:0.75rem; color:rgba(255,255,255,0.4); text-align:center; padding:1rem 0;">No features generated yet.</p>`;
        }
    }
}

async function createNewProfile() {
    closeLeftSidebar();
    const name = prompt("Enter name for the new Brand Profile:", "New Brand Empire");
    if (!name || name.trim() === '') return;

    const newId = 'profile_' + Date.now();
    state.activeProfileId = newId;
    state.company = name.trim();

    // Reset questionnaire state
    state.industry = 'Technology';
    state.stage = 'Just Starting Out';
    state.progress = 'Blank Canvas (0%)';
    state.archetype = 'The Innovator (Tech / Frontier)';
    state.marketTier = 'High-Tier Enterprise';
    state.tone = 'Minimalist';
    state.product = '';
    state.audience = [];
    state.channels = [];
    state.usp = '';
    state.avoid = '';
    state.desc = '';

    state.brand = null;
    state.finalSlogan = '';
    state.finalFont = '';
    state.strategy = '';
    state.hrPlan = '';
    state.logisticsPlan = '';
    state.marketingPlan = '';
    state.outreachPlan = '';
    state.socialPlan = '';

    const newProf = { id: newId, company: state.company };
    if (!state.profiles) state.profiles = [];
    state.profiles.push(newProf);

    if (state.user && db) {
        await saveUserDataToFirestore();
    }

    renderSidebar();
    restartFlow();
}

async function renameActiveProfile() {
    const currentName = state.company || 'My Brand';
    const newName = prompt("Edit Brand Profile Name:", currentName);
    if (!newName || newName.trim() === '' || newName.trim() === currentName) return;

    state.company = newName.trim();
    const prof = state.profiles.find(p => p.id === state.activeProfileId);
    if (prof) prof.company = state.company;

    if (state.company && state.hasReachedResults) {
        const greeting = document.getElementById('resultsGreeting');
        if (greeting) {
            greeting.innerHTML = `Brand Empire: <span class="brand-name-highlight">${escapeHtml(state.company)}</span>`;
        }
    }

    if (state.user && db) {
        await saveUserDataToFirestore();
    }

    renderSidebar();
    ResultsDashboard.render();
}

async function deleteActiveProfile() {
    const profileName = state.company || 'Active Profile';
    if (!confirm(`Are you sure you want to delete profile "${profileName}"?`)) return;

    if (state.user && db && state.activeProfileId) {
        try {
            await db.collection('users').doc(state.user.uid).collection('profiles').doc(state.activeProfileId).delete();
            logDebug('SUCCESS', `Deleted profile ${state.activeProfileId}`);
        } catch (e) {
            logDebug('WARN', 'Error deleting profile:', e.message);
        }
    }

    state.profiles = state.profiles.filter(p => p.id !== state.activeProfileId);

    if (state.profiles.length > 0) {
        await switchActiveProfile(state.profiles[0].id);
    } else {
        await createNewProfile();
    }
}

async function switchActiveProfile(profileId) {
    if (!profileId) return;
    state.activeProfileId = profileId;

    if (state.user && db) {
        try {
            const doc = await db.collection('users').doc(state.user.uid).collection('profiles').doc(profileId).get();
            if (doc.exists) {
                applyProfileDataToState(doc.data());
            }
        } catch (e) {
            logDebug('WARN', 'Error switching profile:', e.message);
        }
    } else {
        const prof = state.profiles.find(p => p.id === profileId);
        if (prof) applyProfileDataToState(prof);
    }

    if (state.company && state.hasReachedResults) {
        const greeting = document.getElementById('resultsGreeting');
        if (greeting) {
            greeting.innerHTML = `Brand Empire: <span class="brand-name-highlight">${escapeHtml(state.company)}</span>`;
        }
    }

    renderSidebar();
    ResultsDashboard.render();
}

function downloadBrandPDF() {
    closeLeftSidebar();
    if (state.brand) {
        downloadBrandIdentityPDF();
    } else if (state.strategy || state.hrPlan || state.marketingPlan) {
        downloadBrandZip();
    } else {
        alert("Please generate your Brand Identity Suite or plans first before downloading the Brand Book.");
    }
}


// ============================================================================
// SECTION 2: PHASE CONTROLLER — Cinematic flow orchestration
// ============================================================================
const PhaseController = (() => {
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    let activeFlowId = 0;

    const HUMOROUS_TEXTS = [
        "⚡ Cooking up something legendary...",
        "🧠 Stealing branding secrets from Fortune 500 CEOs...",
        "📊 Brewing high-grade corporate synergy...",
        "🎨 Polishing logo pixels and trademarking ambition...",
        "💼 Calculating your future billion-dollar valuation...",
        "👑 Assembling your empire brand identity..."
    ];

    function hideAllPhases() {
        document.querySelectorAll('.fullscreen-phase').forEach(p => {
            p.classList.add('hidden');
            p.style.display = 'none';
        });
    }

    async function start() {
        const flowId = ++activeFlowId;
        if (state.company || state.hasReachedResults) {
            logDebug('SYSTEM', 'Existing brand profile detected. Jumping directly to Results Dashboard.', { company: state.company });
            await showResults();
            return;
        }
        hideAllPhases();
        state.currentPhase = 'welcome';
        await showWelcome(flowId);
    }

    async function showWelcome(flowId) {
        if (flowId !== activeFlowId) return;
        hideAllPhases();
        const screen = document.getElementById('welcomeScreen');
        const text = document.getElementById('welcomeText');
        screen.classList.remove('hidden');
        screen.style.display = 'flex';

        GradientEngine.setPalette('welcome', 2);

        // First intro text
        text.textContent = 'For Those Destined to Lead.';
        await sleep(400);
        if (flowId !== activeFlowId) return;
        text.classList.add('visible');

        await sleep(2800);
        if (flowId !== activeFlowId) return;

        text.classList.remove('visible');
        text.classList.add('fade-away');

        await sleep(800);
        if (flowId !== activeFlowId) return;
        text.classList.remove('fade-away');

        // Second intro text
        text.textContent = 'welcome to Nysion';
        text.classList.add('visible');

        await sleep(2800);
        if (flowId !== activeFlowId) return;

        text.classList.remove('visible');
        text.classList.add('fade-away');

        await sleep(800);
        if (flowId !== activeFlowId) return;
        screen.classList.add('hidden');
        screen.style.display = 'none';
        text.classList.remove('fade-away');

        await showMotivation(flowId);
    }

    async function showMotivation(flowId) {
        if (flowId !== activeFlowId) return;
        hideAllPhases();
        state.currentPhase = 'motivation';
        const screen = document.getElementById('motivationScreen');
        const text = document.getElementById('motivationText');
        const sub = document.getElementById('motivationSub');
        const btn = document.getElementById('letsGoBtn');

        GradientEngine.setPalette('motivation', 2);

        screen.classList.remove('hidden');
        screen.style.display = 'flex';
        await sleep(300);
        if (flowId !== activeFlowId) return;
        text.classList.add('visible');
        sub.classList.add('visible');
        btn.classList.add('visible');

        await new Promise(resolve => {
            btn.addEventListener('click', async () => {
                text.classList.remove('visible');
                text.classList.add('fade-away');
                sub.classList.remove('visible');
                sub.classList.add('fade-away');
                btn.classList.remove('visible');
                btn.classList.add('fade-away');

                await sleep(600);
                if (flowId !== activeFlowId) { resolve(); return; }
                screen.classList.add('hidden');
                screen.style.display = 'none';
                text.classList.remove('fade-away');
                sub.classList.remove('fade-away');
                btn.classList.remove('fade-away');
                resolve();
            }, { once: true });
        });

        if (flowId !== activeFlowId) return;
        await startQuestionFlow(flowId);
    }

    async function startQuestionFlow(flowId) {
        if (flowId && flowId !== activeFlowId) return;
        hideAllPhases();
        state.currentPhase = 'questions';

        const screen = document.getElementById('questionFlow');
        if (screen) {
            screen.classList.remove('hidden');
            screen.style.display = 'flex';
        }

        GradientEngine.setPalette('warm', 2);

        await QuestionFlow.run();

        if (flowId && flowId !== activeFlowId) return;

        if (screen) {
            screen.classList.add('hidden');
            screen.style.display = 'none';
        }

        await showResults();
    }

    async function showResults() {
        activeFlowId++; // Cancel any background intro/motivation sleep flows!
        hideAllPhases();
        state.currentPhase = 'results';
        state.hasReachedResults = true;
        const screen = document.getElementById('resultsDashboard');

        GradientEngine.setPalette('results', 2.5);

        screen.classList.remove('hidden');
        screen.style.display = 'flex';

        await sleep(300);

        const greeting = document.getElementById('resultsGreeting');
        const companyName = state.company || 'APEX VISION';
        greeting.innerHTML = `Brand Empire: <span class="brand-name-highlight">${escapeHtml(companyName)}</span>`;
        greeting.classList.add('visible');

        const subtitle = document.getElementById('resultsSubtitle');
        if (subtitle) {
            const sloganOrDesc = state.finalSlogan || 'Explore your generated brand identity package step-by-step below.';
            subtitle.textContent = sloganOrDesc;
            subtitle.classList.add('visible');
        }

        await sleep(300);
        ResultsDashboard.render();
    }

    return { start, showResults };
})();


// ============================================================================
// SECTION 3: QUESTION FLOW (One at a time, Enter key submits)
// ============================================================================
const QuestionFlow = (() => {
    const QUESTIONS = [
        {
            id: 'companyName',
            label: 'Step 1 of 12',
            title: 'What is the name of your company?',
            subtitle: 'Crafting something legendary starts here. Enter your business name.',
            type: 'text',
            placeholder: 'e.g. Apex Vision',
            gradient: 'warm',
            stateKey: 'company',
            required: true
        },
        {
            id: 'industry',
            label: 'Step 2 of 12',
            title: 'Which industry is your company in?',
            subtitle: 'Pick the arena where you plan to take over, or enter a custom industry.',
            type: 'pills',
            hasOther: true,
            options: ['Technology', 'Fashion', 'Food & Beverage', 'Health', 'Education', 'Real Estate'],
            gradient: null,
            stateKey: 'industry'
        },
        {
            id: 'stage',
            label: 'Step 3 of 12',
            title: 'What stage is your brand foundation currently in?',
            subtitle: 'This helps the AI calibrate foundational vs enterprise scaling strategy.',
            type: 'slider',
            options: [
                { label: 'Just Starting Out', tick: 'Idea' },
                { label: 'Early Prototype', tick: 'Prototype' },
                { label: 'Somewhat Defined', tick: 'Defined' },
                { label: 'Established Essentials', tick: 'Essentials' },
                { label: 'Fully Operating Empire', tick: 'Empire' }
            ],
            gradient: null,
            stateKey: 'stage'
        },
        {
            id: 'progress',
            label: 'Step 4 of 12',
            title: 'How much execution progress have you made so far?',
            subtitle: 'Tells the AI where your brand currently stands so it can build the exact next phase.',
            type: 'slider',
            options: [
                { label: 'Blank Canvas (0%)', tick: '0%' },
                { label: 'Early Draft (25%)', tick: '25%' },
                { label: 'Halfway There (50%)', tick: '50%' },
                { label: 'Strong Traction (75%)', tick: '75%' },
                { label: 'Full Dominance (100%)', tick: '100%' }
            ],
            gradient: null,
            stateKey: 'progress'
        },
        {
            id: 'archetype',
            label: 'Step 5 of 12',
            title: 'Which brand archetype defines your company\'s spirit?',
            subtitle: 'Aligns slogans, tone, and campaign messaging with proven storytelling frameworks.',
            type: 'pills',
            options: ['The Innovator (Tech / Frontier)', 'The Ruler (Prestige / Luxury)', 'The Hero (High Performance)', 'The Guardian (Trust / Reliability)', 'The Outlaw (Disruptor / Rebel)', 'The Sage (Wisdom / Intelligence)'],
            gradient: 'warm',
            stateKey: 'archetype'
        },
        {
            id: 'marketTier',
            label: 'Step 6 of 12',
            title: 'Where does your brand sit on the market pricing spectrum?',
            subtitle: 'Refines typography recommendations, palette contrast, and value proposition framing.',
            type: 'slider',
            options: [
                { label: 'Value / Accessible', tick: 'Value' },
                { label: 'Mid-Market Premium', tick: 'Mid-Tier' },
                { label: 'High-Tier Enterprise', tick: 'Enterprise' },
                { label: 'Ultra-Luxury / Exclusive', tick: 'Luxury' }
            ],
            gradient: null,
            stateKey: 'marketTier'
        },
        {
            id: 'tone',
            label: 'Step 7 of 12',
            title: 'What aesthetic tone defines your brand?',
            subtitle: 'How loud do you want your brand to flex?',
            type: 'slider',
            options: ['Minimalist', 'Professional', 'Luxury', 'Bold', 'Playful'],
            gradient: null,
            stateKey: 'tone'
        },
        {
            id: 'product',
            label: 'Step 8 of 12',
            title: 'What key product or core service do you offer?',
            subtitle: "Explain what you do like you're telling a smart 10-year-old.",
            type: 'text',
            placeholder: 'e.g. AI-powered analytics platform for enterprise scalability',
            gradient: 'warm',
            stateKey: 'product',
            required: true
        },
        {
            id: 'audience',
            label: 'Step 9 of 12',
            title: 'Who is your primary target audience?',
            subtitle: 'Select one or more target audiences who are paying the bills.',
            type: 'pills',
            multiSelect: true,
            options: ['B2B Enterprises', 'Gen Z & Youth', 'Luxury Consumers', 'Everyday Shoppers', 'Small Businesses', 'High-Net-Worth Individuals'],
            gradient: 'warm',
            stateKey: 'audience'
        },
        {
            id: 'channels',
            label: 'Step 10 of 12',
            title: 'Where will your brand engage its target audience first?',
            subtitle: 'Tailors generated editorial captions and campaign KPIs to your distribution channels.',
            type: 'pills',
            multiSelect: true,
            options: ['B2B LinkedIn & Direct Email', 'Social Media & Influencer (IG/TikTok)', 'Search & Organic Content (SEO)', 'PR, Keynotes & Investor Decks', 'Direct Sales & VIP Concierge'],
            gradient: 'warm',
            stateKey: 'channels'
        },
        {
            id: 'usp',
            label: 'Step 11 of 12',
            title: 'What is your brand\'s secret sauce or competitive edge?',
            subtitle: "Your secret weapon. We won't leak it on Instagram.",
            type: 'text',
            placeholder: 'e.g. 10x faster insight generation with zero setup complexity',
            gradient: 'warm',
            stateKey: 'usp'
        },
        {
            id: 'avoid',
            label: 'Step 12 of 12',
            title: 'What do you NOT want your brand to look or sound like?',
            subtitle: 'Specify styles, clichés, or anti-patterns you want to strictly avoid.',
            type: 'text',
            placeholder: 'e.g. Traditional coaching centers / Generic corporate banks / Cheap SaaS',
            gradient: 'warm',
            stateKey: 'avoid'
        }
    ];

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function run(startFromStep = 0) {
        let i = startFromStep;
        while (i < QUESTIONS.length) {
            state.currentQuestion = i;
            const action = await showQuestion(QUESTIONS[i], i);
            if (action === 'back') {
                i = Math.max(0, i - 1);
            } else {
                i++;
            }
        }

        // Synthesize state.desc for AI prompts with clean structured mapping
        const audienceVal = Array.isArray(state.audience)
            ? (state.audience.length > 0 ? state.audience.join(', ') : 'B2B Enterprises')
            : (state.audience || 'B2B Enterprises');

        const channelsVal = Array.isArray(state.channels)
            ? (state.channels.length > 0 ? state.channels.join(', ') : 'B2B LinkedIn & Direct Email')
            : (state.channels || 'B2B LinkedIn & Direct Email');

        state.desc = `Company Name: ${state.company || 'Enterprise'}. Industry Sector: ${state.industry || 'Technology'}. Brand Foundation Stage: ${state.stage || 'Just Starting Out'}. Execution Progress: ${state.progress || 'Blank Canvas (0%)'}. Brand Archetype: ${state.archetype || 'The Innovator'}. Market Pricing Tier: ${state.marketTier || 'High-Tier Enterprise'}. Aesthetic Tone: ${state.tone || 'Minimalist'}. Core Product / Service: ${state.product || 'High-performance AI platform'}. Target Audience: ${audienceVal}. Distribution Channels: ${channelsVal}. Competitive Edge / USP: ${state.usp || 'Unmatched quality'}. Style Anti-Pattern (To Avoid): ${state.avoid || 'Generic branding'}.`;

        await saveUserDataToFirestore();
    }

    function showQuestion(q, index) {
        return new Promise(resolve => {
            const container = document.getElementById('questionContainer');

            // Initialize default values for slider/pill state keys if missing
            if (q.type === 'slider' && !state[q.stateKey]) {
                const firstOpt = q.options[0];
                state[q.stateKey] = typeof firstOpt === 'object' ? firstOpt.label : firstOpt;
            } else if (q.type === 'pills' && !state[q.stateKey]) {
                state[q.stateKey] = q.multiSelect ? [q.options[0]] : q.options[0];
            }

            if (q.gradient) {
                GradientEngine.setPalette(q.gradient, 1.5);
            } else if (q.type === 'pills' && q.stateKey === 'industry') {
                GradientEngine.setPalette(state.industry, 1.5);
            } else if (q.type === 'slider') {
                GradientEngine.setPalette(state.tone, 1.5);
            }

            let inputHtml = '';

            if (q.type === 'text') {
                inputHtml = `<input type="text" class="q-input" id="qInput" placeholder="${q.placeholder}" value="${escapeHtml(state[q.stateKey] || '')}" autofocus>`;
            } else if (q.type === 'textarea') {
                inputHtml = `<textarea class="q-textarea" id="qInput" placeholder="${q.placeholder}">${escapeHtml(state[q.stateKey] || '')}</textarea>`;
            } else if (q.type === 'pills') {
                const currentVal = state[q.stateKey];
                const selectedList = q.multiSelect
                    ? (Array.isArray(currentVal) ? currentVal : (currentVal ? [currentVal] : []))
                    : (currentVal ? [currentVal] : []);

                const allOptions = q.hasOther ? [...q.options, 'Other...'] : q.options;
                const isCustomSelected = q.hasOther && currentVal && !q.options.includes(currentVal);

                const placeholderTxt = q.stateKey === 'industry' ? 'Enter your custom industry...' : 'Enter your custom objective...';
                inputHtml = `<div class="pill-grid">
                    ${allOptions.map(opt => {
                        const isSel = (opt === 'Other...' && isCustomSelected) || selectedList.includes(opt);
                        return `<div class="pill-option ${isSel ? 'selected' : ''}" data-value="${escapeHtml(opt)}">${escapeHtml(opt)}</div>`;
                    }).join('')}
                </div>
                ${q.hasOther ? `
                    <div id="otherPillWrap" style="margin-top: 14px; display: ${isCustomSelected ? 'block' : 'none'};">
                        <input type="text" class="q-input" id="otherPillInput" placeholder="${placeholderTxt}" value="${isCustomSelected ? escapeHtml(currentVal) : ''}">
                    </div>
                ` : ''}`;
            } else if (q.type === 'slider') {
                const rawOptions = q.options;
                const optionValues = rawOptions.map(opt => typeof opt === 'object' ? opt.label : opt);
                const tickLabels = rawOptions.map(opt => typeof opt === 'object' ? opt.tick : opt);

                const currentVal = state[q.stateKey] || optionValues[0];
                const currentIdx = optionValues.indexOf(currentVal) >= 0 ? optionValues.indexOf(currentVal) : 0;
                const maxStep = optionValues.length - 1;

                inputHtml = `
                    <div class="q-slider-wrap">
                        <input type="range" class="q-slider" id="qSlider" min="0" max="${maxStep}" step="1" value="${currentIdx}">
                        <div class="tone-label-display" id="toneLabelDisplay">${escapeHtml(currentVal)}</div>
                        <div class="slider-scale-grid" id="sliderScaleGrid">
                            ${tickLabels.map((tickText, idx) => {
                                const leftPct = maxStep > 0 ? (idx / maxStep) * 100 : 0;
                                let alignClass = '';
                                if (idx === 0) alignClass = 'align-start';
                                else if (idx === maxStep) alignClass = 'align-end';
                                return `
                                    <div class="scale-item ${idx === currentIdx ? 'active' : ''} ${alignClass}" data-idx="${idx}" style="left: ${leftPct}%;">
                                        <div class="scale-tick"></div>
                                        <div class="scale-label">${escapeHtml(tickText)}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>`;
            }

            const dotsHtml = `<div class="step-dots">
                ${QUESTIONS.map((_, di) => `<div class="step-dot ${di < index ? 'completed' : ''} ${di === index ? 'active' : ''}"></div>`).join('')}
            </div>`;

            const backBtnHtml = index > 0 ? `<button class="q-back-btn" id="qBackBtn">← Back</button>` : '';

            container.innerHTML = `
                <div class="question-card visible" id="qCard">
                    <div class="question-label">${q.label}</div>
                    <div class="question-title">${q.title}</div>
                    <div class="question-subtitle">${q.subtitle || ''}</div>
                    ${inputHtml}
                    <div class="q-button-row">
                        ${backBtnHtml}
                        <button class="q-next-btn" id="qNextBtn">${index === QUESTIONS.length - 1 ? 'Build My Brand →' : 'Next →'}</button>
                    </div>
                    ${dotsHtml}
                </div>
            `;

            requestAnimationFrame(() => {
                const card = document.getElementById('qCard');
                if (card) card.classList.add('visible');
                const inp = document.getElementById('qInput') || document.getElementById('otherPillInput');
                if (inp && inp.style.display !== 'none') inp.focus();
            });

            if (q.type === 'pills') {
                const otherWrap = container.querySelector('#otherPillWrap');
                const otherInput = container.querySelector('#otherPillInput');

                container.querySelectorAll('.pill-option').forEach(pill => {
                    pill.addEventListener('click', () => {
                        const val = pill.dataset.value;

                        if (val === 'Other...' && q.hasOther) {
                            container.querySelectorAll('.pill-option').forEach(p => p.classList.remove('selected'));
                            pill.classList.add('selected');
                            if (otherWrap) otherWrap.style.display = 'block';
                            if (otherInput) {
                                otherInput.value = '';
                                state[q.stateKey] = '';
                                otherInput.focus();
                            }
                            return;
                        }

                        if (otherWrap) otherWrap.style.display = 'none';

                        if (q.multiSelect) {
                            let currentList = Array.isArray(state[q.stateKey])
                                ? [...state[q.stateKey]]
                                : (state[q.stateKey] ? [state[q.stateKey]] : []);

                            if (currentList.includes(val)) {
                                currentList = currentList.filter(item => item !== val);
                                pill.classList.remove('selected');
                            } else {
                                currentList.push(val);
                                pill.classList.add('selected');
                            }
                            state[q.stateKey] = currentList;
                        } else {
                            container.querySelectorAll('.pill-option').forEach(p => p.classList.remove('selected'));
                            pill.classList.add('selected');
                            state[q.stateKey] = val;
                            if (q.stateKey === 'industry') {
                                GradientEngine.setPalette(state.industry, 1.5);
                            }
                        }
                    });
                });

                if (otherInput) {
                    otherInput.addEventListener('input', () => {
                        state[q.stateKey] = otherInput.value.trim();
                    });
                }
            }

            if (q.type === 'slider') {
                const slider = document.getElementById('qSlider');
                const label = document.getElementById('toneLabelDisplay');
                const scaleGrid = document.getElementById('sliderScaleGrid');

                const rawOptions = q.options;
                const optionValues = rawOptions.map(opt => typeof opt === 'object' ? opt.label : opt);

                function updateSliderState(idx) {
                    slider.value = idx;
                    const fullVal = optionValues[idx] || optionValues[0];
                    state[q.stateKey] = fullVal;
                    if (label) label.textContent = fullVal;

                    if (q.stateKey === 'tone') {
                        GradientEngine.setPalette(fullVal, 1.5);
                    }

                    if (scaleGrid) {
                        scaleGrid.querySelectorAll('.scale-item').forEach(item => {
                            if (parseInt(item.dataset.idx, 10) === parseInt(idx, 10)) {
                                item.classList.add('active');
                            } else {
                                item.classList.remove('active');
                            }
                        });
                    }
                }

                slider.addEventListener('input', () => updateSliderState(slider.value));

                if (scaleGrid) {
                    scaleGrid.querySelectorAll('.scale-item').forEach(item => {
                        item.addEventListener('click', () => updateSliderState(item.dataset.idx));
                    });
                }
            }

            let isSubmitted = false;

            // Clean, isolated Submit handler
            async function submitAnswer(action = 'next') {
                if (isSubmitted) return;

                if (action === 'next') {
                    if (q.type === 'text' || q.type === 'textarea') {
                        const input = document.getElementById('qInput');
                        if (input) {
                            const val = input.value.trim();
                            if (q.required && !val) {
                                input.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                                input.focus();
                                return;
                            }
                            state[q.stateKey] = val;
                        }
                    } else if (q.type === 'pills' && q.hasOther) {
                        const otherPill = container.querySelector('.pill-option.selected[data-value="Other..."]');
                        if (otherPill) {
                            const otherInput = container.querySelector('#otherPillInput');
                            if (otherInput && otherInput.value.trim()) {
                                state[q.stateKey] = otherInput.value.trim();
                            }
                        }
                    }
                }

                isSubmitted = true;
                if (onKeyDown) window.removeEventListener('keydown', onKeyDown);

                const card = document.getElementById('qCard');
                if (card) {
                    card.classList.remove('visible');
                    card.classList.add('fade-away');
                }

                await sleep(400);
                resolve(action);
            }

            function onKeyDown(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    const activeElem = document.activeElement;
                    if (activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA' || activeElem.classList.contains('q-next-btn'))) {
                        e.preventDefault();
                        submitAnswer('next');
                    }
                }
            }

            window.addEventListener('keydown', onKeyDown);

            const nextBtn = document.getElementById('qNextBtn');
            if (nextBtn) {
                nextBtn.onclick = () => submitAnswer('next');
            }

            const backBtn = document.getElementById('qBackBtn');
            if (backBtn) {
                backBtn.onclick = () => submitAnswer('back');
            }
        });
    }

    return { run };
})();


// ============================================================================
// SECTION 4: RESULTS DASHBOARD (Vertical scrolling step-by-step layout)
// ============================================================================
const ResultsDashboard = (() => {
    const FEATURES = [
        {
            id: 'brand-identity',
            icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 2.5 6.5 6 6.5 1 0 1.5-.5 1.5-1 0-.5-.2-.9-.4-1.4-.2-.5-.4-1-.4-1.6 0-1.1.9-2 2-2h1.8c3.3 0 6-2.7 6-6 0-4.4-3.8-6.5-8.5-6.5z"/></svg>`,
            title: 'Brand Identity Suite',
            desc: 'Slogans, typography pairings, and curated color palettes tailored to your brand tone.',
            stateCheck: () => !!state.brand,
            onGenerate: () => generateBrandIdentityWrapped(),
            onView: () => renderBrandDetailPanel()
        },
        {
            id: 'strategy',
            icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
            title: 'Executive Growth Roadmap',
            desc: 'Comprehensive market positioning and strategic roadmap analysis.',
            stateCheck: () => !!state.strategy,
            onGenerate: () => generateStrategyWrapped(),
            onView: () => renderStrategyDetailPanel()
        },
        {
            id: 'logo',
            icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
            title: 'AI Logo Studio',
            desc: 'Generate a high-resolution static emblem for your brand.',
            stateCheck: () => !!state.logoImageDataUrl,
            onGenerate: () => generateLogoWrapped(),
            onView: () => renderLogoDetailPanel()
        },
        {
            id: 'hr',
            icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
            title: 'HR & Talent Architecture',
            desc: 'Talent acquisition pipeline, compensation structures, team roles, and culture scaling.',
            stateCheck: () => !!state.hrPlan,
            onGenerate: () => generateHRPlanWrapped(),
            onView: () => renderHRDetailPanel()
        },
        {
            id: 'logistics',
            icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
            title: 'Logistics & Operations Plan',
            desc: 'End-to-end pipeline, fulfillment tools, operational SOPs, and monthly execution targets.',
            stateCheck: () => !!state.logisticsPlan,
            onGenerate: () => generateLogisticsPlanWrapped(),
            onView: () => renderLogisticsDetailPanel()
        },
        {
            id: 'marketing',
            icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
            title: 'Comprehensive Marketing Plan',
            desc: 'Growth funnel architecture, channel breakdown, ROI metrics, and monthly launch roadmap.',
            stateCheck: () => !!state.marketingPlan,
            onGenerate: () => generateMarketingPlanWrapped(),
            onView: () => renderMarketingDetailPanel()
        },
        {
            id: 'outreach',
            icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
            title: 'Outreach & Prospecting Strategy',
            desc: 'B2B target prospect profiles, email/LinkedIn channels, pitch scripts, and weekly targets.',
            stateCheck: () => !!state.outreachPlan,
            onGenerate: () => generateOutreachPlanWrapped(),
            onView: () => renderOutreachDetailPanel()
        },
        {
            id: 'social',
            icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
            title: 'Social Media Strategy & Content Plan',
            desc: 'Content pillars, platform strategy, virality hooks, monthly calendar, and growth KPIs.',
            stateCheck: () => !!state.socialPlan,
            onGenerate: () => generateSocialMediaPlanWrapped(),
            onView: () => renderSocialDetailPanel()
        },
        {
            id: 'export',
            icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
            title: 'Export Full Empire Brand Kit',
            desc: 'Download your collated Brand Kit ZIP package containing all feature PDFs and high-res assets.',
            stateCheck: () => !!state.brand,
            onGenerate: null,
            onView: () => renderExportDetailPanel()
        }
    ];

    function render() {
        const grid = document.getElementById('resultsGrid');
        grid.innerHTML = '';

        const isLocked = !state.user;

        FEATURES.forEach((feat, i) => {
            const isGenerated = feat.stateCheck();
            const card = document.createElement('div');
            card.className = `result-card ${isLocked ? 'locked' : ''}`;
            card.style.animationDelay = `${i * 0.1}s`;

            const arrowIcon = isLocked ? '🔒' : '→';
            const statusText = isLocked 
                ? '🔒 Login Required to Access' 
                : (isGenerated ? '✓ Ready to view' : '○ Click to generate');

            card.innerHTML = `
                <div class="result-card-header">
                    <div class="result-card-icon">${feat.icon}</div>
                    <div class="result-card-arrow">${arrowIcon}</div>
                </div>
                <div class="result-card-body">
                    <div class="result-card-title">${feat.title}</div>
                    <div class="result-card-desc">${feat.desc}</div>
                </div>
                <div class="result-card-footer">
                    <div class="result-card-status ${isLocked ? 'locked-status' : (isGenerated ? 'generated' : '')}">${statusText}</div>
                </div>
            `;

            card.addEventListener('click', () => {
                if (isLocked) {
                    openAuthModal();
                    return;
                }
                if (isGenerated) {
                    feat.onView();
                } else if (feat.onGenerate) {
                    feat.onGenerate();
                } else {
                    feat.onView();
                }
            });

            grid.appendChild(card);
            setTimeout(() => card.classList.add('visible'), 100 + i * 100);
        });

        renderSidebar();
    }

    return { render, FEATURES };
})();


// ============================================================================
// SECTION 5: DETAIL PANELS
// ============================================================================

function formatMarkdown(text) {
    if (!text) return '';
    let raw = text;

    // 1. Process Markdown Tables (| Col 1 | Col 2 |) into glassmorphic HTML tables
    const lines = raw.split('\n');
    const processedLines = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();
        if (line.includes('|') && (line.match(/\|/g) || []).length >= 2) {
            const tableLines = [];
            while (i < lines.length && lines[i].trim().includes('|') && (lines[i].trim().match(/\|/g) || []).length >= 2) {
                tableLines.push(lines[i].trim());
                i++;
            }

            // Filter out separator lines (|---|---|)
            const validRows = tableLines.filter(row => !/^\|?[\s\-:|=]+\|?$/.test(row));
            if (validRows.length > 0) {
                const parsedRows = validRows.map(row => {
                    let cells = row.split('|');
                    if (cells.length > 0 && cells[0].trim() === '') cells.shift();
                    if (cells.length > 0 && cells[cells.length - 1].trim() === '') cells.pop();
                    return cells.map(cell => cell.trim());
                });

                let tableHtml = '<div class="glass-table-wrapper"><table class="glass-table">';
                parsedRows.forEach((rowCells, rIdx) => {
                    if (rIdx === 0) {
                        tableHtml += '<thead><tr>';
                        rowCells.forEach(cell => {
                            tableHtml += `<th>${cell}</th>`;
                        });
                        tableHtml += '</tr></thead><tbody>';
                    } else {
                        tableHtml += '<tr>';
                        rowCells.forEach(cell => {
                            tableHtml += `<td>${cell}</td>`;
                        });
                        tableHtml += '</tr>';
                    }
                });
                tableHtml += '</tbody></table></div>';
                processedLines.push(tableHtml);
            }
            continue;
        }

        processedLines.push(lines[i]);
        i++;
    }

    let html = processedLines.join('\n');

    // Convert Numbered bold titles: 3. **Title** -> <h4 ...>3. Title</h4>
    html = html.replace(/^(\d+[\.\)])\s*\*\*(.*?)\*\*/gim, '<h4 style="color:#ffffff; font-family:var(--font-heading); margin-top:1.4rem; margin-bottom:0.5rem; font-size:1rem; font-weight:700; letter-spacing:0.5px;">$1 $2</h4>');

    // Convert Markdown bold: **text** -> <strong style="color:#ffffff; font-weight:700;">$1</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ffffff; font-weight:700;">$1</strong>');

    // Convert Markdown italic: *text* or _text_ -> <em>text</em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert Markdown headings: ### Header, ## Header, # Header
    html = html.replace(/^### (.*$)/gim, '<h4 style="color:#ffffff; font-family:var(--font-heading); margin-top:1.4rem; margin-bottom:0.5rem; font-size:0.95rem; font-weight:700; letter-spacing:0.8px; text-transform:uppercase;">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 style="color:#ffffff; font-family:var(--font-heading); margin-top:1.6rem; margin-bottom:0.6rem; font-size:1.05rem; font-weight:800; letter-spacing:1px; text-transform:uppercase;">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 style="color:#ffffff; font-family:var(--font-heading); margin-top:1.8rem; margin-bottom:0.8rem; font-size:1.25rem; font-weight:800; letter-spacing:1px; text-transform:uppercase;">$1</h2>');

    // Convert bullet points: - item or * item or • item
    html = html.replace(/^\s*[\-\*•]\s+(.*$)/gim, '<li style="margin-left:1.2rem; margin-bottom:8px; color:rgba(255,255,255,0.85);">$1</li>');

    // Wrap consecutive <li> items in a styled <ul> container
    html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul style="margin-top:0.6rem; margin-bottom:1.2rem; padding-left:0; list-style-type:disc;">$1</ul>');

    // Convert double newlines into clean paragraph spacing blocks
    html = html.replace(/\n\n/g, '<div style="margin-bottom:1rem;"></div>');
    html = html.replace(/\n/g, '<br>');

    return html;
}

function openFeaturePage(title, contentHtml, preserveScroll = false) {
    const page = document.getElementById('featurePage');
    const savedScroll = (preserveScroll && page) ? page.scrollTop : 0;
    const savedWinScroll = preserveScroll ? window.scrollY : 0;

    document.querySelectorAll('.fullscreen-phase').forEach(p => {
        if (!preserveScroll || p !== page) {
            p.classList.add('hidden');
            p.style.display = 'none';
        }
    });

    const badge = document.getElementById('featureHeaderBadge');
    const mainTitle = document.getElementById('featureMainTitle');
    const content = document.getElementById('featurePageContent');

    if (badge) badge.textContent = title;
    if (mainTitle) mainTitle.textContent = title;
    if (content) content.innerHTML = contentHtml;

    if (page) {
        page.classList.remove('hidden');
        page.style.display = 'flex';
        page.scrollTop = savedScroll;
    }
    if (!preserveScroll) {
        window.scrollTo(0, 0);
    } else {
        window.scrollTo(0, savedWinScroll);
    }

    if (contentHtml.includes('logoCanvas')) {
        setTimeout(() => {
            initLogoCanvas();
            startLogoCanvasLoop();
        }, 100);
    }
}

function closeFeaturePage() {
    document.querySelectorAll('.fullscreen-phase').forEach(p => {
        p.classList.add('hidden');
        p.style.display = 'none';
    });

    const resultsDashboard = document.getElementById('resultsDashboard');
    if (resultsDashboard) {
        resultsDashboard.classList.remove('hidden');
        resultsDashboard.style.display = 'flex';
        resultsDashboard.scrollTop = 0;
    }

    ResultsDashboard.render();
    window.scrollTo(0, 0);
}

function openDetailPanel(title, contentHtml, preserveScroll = false) {
    openFeaturePage(title, contentHtml, preserveScroll);
}

function closeDetailPanel() {
    closeFeaturePage();
}

function renderBrandDetailPanel(preserveScroll = false) {
    if (!state.brand) {
        openDetailPanel('BRAND IDENTITY', `
            <p class="text-muted" style="margin-bottom:1rem;">Generate your brand identity suite to see slogans, fonts, and colors.</p>
            <button class="btn-generate" onclick="generateBrandIdentityWrapped()">Generate Brand Identity</button>
        `, preserveScroll);
        return;
    }

    const doc = buildBrandIdentityPDFDoc();
    const pdfDataUrl = doc.output('datauristring');
    const pdfViewerHtml = `
        <div class="glass-card" style="margin-bottom:1.5rem; padding:1.2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:0.78rem; font-weight:700; letter-spacing:1px; color:#94a3b8; text-transform:uppercase;">📄 INDIVIDUAL FEATURE PDF: BRAND IDENTITY CHARTER</span>
                <a href="${pdfDataUrl}" download="${(state.company || 'Brand').replace(/\s+/g, '_')}_Brand_Identity_Charter.pdf" class="btn-primary" style="padding:6px 14px; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Download Feature PDF ↓</a>
            </div>
            <iframe src="${pdfDataUrl}" style="width:100%; height:480px; border-radius:8px; border:1px solid rgba(255,255,255,0.15);" title="Brand Identity PDF"></iframe>
        </div>
    `;

    const slogansHtml = state.brand.slogans.map((slogan) => `
        <div class="radio-chip ${slogan === state.finalSlogan ? 'selected' : ''}" onclick="selectSlogan('${escapeHtml(slogan)}')">
            <div class="chip-circle"></div>
            <div><strong class="chip-title">"${escapeHtml(slogan)}"</strong></div>
        </div>
    `).join('');

    const fontsHtml = state.brand.fonts.map(font => {
        if (typeof loadGoogleFont === 'function') loadGoogleFont(font);
        return `
        <div class="radio-chip ${font === state.finalFont ? 'selected' : ''}" onclick="selectFont('${escapeHtml(font)}')">
            <div class="chip-circle"></div>
            <div style="flex:1;">
                <div class="chip-title" style="font-family:'${font}', sans-serif; font-size:18px;">${escapeHtml(font)}</div>
                <div class="chip-desc" style="font-family:'${font}', sans-serif; font-size:11px;">The quick brown fox jumps over the lazy dog.</div>
            </div>
        </div>
    `}).join('');

    const paletteHtml = state.brand.palette.map(hex => `
        <div class="swatch-card">
            <div class="swatch-block" style="background:${hex};"></div>
            <div class="swatch-code">${hex}</div>
        </div>
    `).join('');

    openDetailPanel('BRAND IDENTITY ARCHITECTURE', `
        <div class="success-banner">BRAND IDENTITY SPECIFICATION GENERATED</div>

        ${pdfViewerHtml}

        <div class="glass-card">
            <h3>CORPORATE SLOGANS</h3>
            <p class="text-muted" style="margin-bottom:10px; font-size:0.8rem;">Select primary slogan for final Brand Guidelines:</p>
            <div class="radio-group">${slogansHtml}</div>
        </div>

        <div class="glass-card">
            <h3>TYPOGRAPHY SPECIFICATION</h3>
            <p class="text-muted" style="margin-bottom:10px; font-size:0.8rem;">Select primary font typeface:</p>
            <div class="radio-group">${fontsHtml}</div>
        </div>

        <div class="glass-card">
            <h3>COLOR PALETTE</h3>
            <div class="palette-grid">${paletteHtml}</div>
        </div>

        <div class="refine-container">
            <h4>REFINE BRAND SPECIFICATIONS</h4>
            <p class="text-muted" style="font-size:0.75rem;">Describe tweaks or adjustments:</p>
            <div class="refine-input-group">
                <input type="text" id="brandRefineInput" class="input-field" placeholder="e.g. Make slogans more formal...">
                <button id="brandRefineBtn" class="btn-generate">Refine</button>
            </div>
        </div>
    `, preserveScroll);

    bindRefineInput('brandRefineInput', 'brandRefineBtn', refineBrandIdentity);
}

function renderCampaignDetailPanel(preserveScroll = false) {
    if (!state.campaign) {
        openDetailPanel('CAMPAIGN STRATEGY', `
            <p class="text-muted" style="margin-bottom:1rem;">Generate your campaign strategy to see marketing concepts and KPIs.</p>
            <button class="btn-generate" onclick="generateCampaignWrapped()">Generate Campaign</button>
        `, preserveScroll);
        return;
    }

    const compSlug = getCompanySlug();
    const doc = buildCampaignPDFDoc();
    const pdfDataUrl = doc.output('datauristring');
    const pdfViewerHtml = `
        <div class="glass-card" style="margin-bottom:1.5rem; padding:1.2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:0.78rem; font-weight:700; letter-spacing:1px; color:#94a3b8; text-transform:uppercase;">📄 INDIVIDUAL FEATURE PDF: CAMPAIGN SUITE</span>
                <a href="${pdfDataUrl}" download="${compSlug}_Campaign_Suite.pdf" class="btn-primary" style="padding:6px 14px; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Download Feature PDF ↓</a>
            </div>
            <iframe src="${pdfDataUrl}" style="width:100%; height:480px; border-radius:8px; border:1px solid rgba(255,255,255,0.15);" title="Campaign PDF"></iframe>
        </div>
    `;

    const captionsHtml = state.campaign.captions.map(cap => `
        <div class="radio-chip ${cap === state.finalCaption ? 'selected' : ''}" onclick="selectCaption('${escapeHtml(cap)}')">
            <div class="chip-circle"></div>
            <div class="chip-title">${escapeHtml(cap)}</div>
        </div>
    `).join('');

    openDetailPanel('CAMPAIGN STRATEGY & METRICS', `
        <div class="success-banner">MARKETING CAMPAIGN SPECIFICATION COMPLETE</div>

        ${pdfViewerHtml}

        <div class="glass-card">
            <h3>EDITORIAL CONCEPTS & CAPTIONS</h3>
            <p class="text-muted" style="margin-bottom:10px; font-size:0.8rem;">Select primary campaign editorial:</p>
            <div class="radio-group">${captionsHtml}</div>
        </div>

        <div class="glass-card">
            <h3>PERFORMANCE METRICS & TARGET KPIs</h3>
            <div style="font-size:0.95rem; color:rgba(255,255,255,0.8); line-height:1.6;">${formatMarkdown(state.campaign.metrics)}</div>
        </div>

        <div class="refine-container">
            <h4>REFINE CAMPAIGN</h4>
            <div class="refine-input-group">
                <input type="text" id="campaignRefineInput" class="input-field" placeholder="e.g. Focus on enterprise clients...">
                <button id="campaignRefineBtn" class="btn-generate">Refine</button>
            </div>
        </div>
    `, preserveScroll);

    bindRefineInput('campaignRefineInput', 'campaignRefineBtn', refineCampaign);
}

function renderStrategyDetailPanel(preserveScroll = false) {
    if (!state.strategy) {
        openDetailPanel('EXECUTIVE STRATEGY', `
            <p class="text-muted" style="margin-bottom:1rem;">Generate a comprehensive strategy roadmap.</p>
            <button class="btn-generate" onclick="generateStrategyWrapped()">Generate Strategy</button>
        `, preserveScroll);
        return;
    }

    const compSlug = getCompanySlug();
    const doc = buildStrategyPDFDoc();
    const pdfDataUrl = doc.output('datauristring');
    const pdfViewerHtml = `
        <div class="glass-card" style="margin-bottom:1.5rem; padding:1.2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:0.78rem; font-weight:700; letter-spacing:1px; color:#94a3b8; text-transform:uppercase;">📄 INDIVIDUAL FEATURE PDF: STRATEGY ROADMAP</span>
                <a href="${pdfDataUrl}" download="${compSlug}_Strategic_Growth_Roadmap.pdf" class="btn-primary" style="padding:6px 14px; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Download Feature PDF ↓</a>
            </div>
            <iframe src="${pdfDataUrl}" style="width:100%; height:480px; border-radius:8px; border:1px solid rgba(255,255,255,0.15);" title="Strategy PDF"></iframe>
        </div>
    `;

    const formatted = formatMarkdown(state.strategy);

    openDetailPanel('EXECUTIVE BRAND STRATEGY', `
        <div class="success-banner">EXECUTIVE STRATEGY COMPILED</div>
        ${pdfViewerHtml}
        <div class="glass-card" style="font-size:0.95rem; line-height:1.7; color:rgba(255,255,255,0.85);">${formatted}</div>
        <div class="refine-container">
            <h4>REFINE STRATEGY</h4>
            <div class="refine-input-group">
                <input type="text" id="strategyRefineInput" class="input-field" placeholder="e.g. Expand on global expansion...">
                <button id="strategyRefineBtn" class="btn-generate">Refine</button>
            </div>
        </div>
    `, preserveScroll);

    bindRefineInput('strategyRefineInput', 'strategyRefineBtn', refineStrategy);
}

function renderHRDetailPanel(preserveScroll = false) {
    if (!state.hrPlan) {
        openDetailPanel('HR & TALENT ARCHITECTURE', `
            <p class="text-muted" style="margin-bottom:1rem;">Generate your HR & Talent Plan to see recruitment pipelines, compensation models, and team roles.</p>
            <button class="btn-generate" onclick="generateHRPlanWrapped()">Generate HR Plan</button>
        `, preserveScroll);
        return;
    }

    const compSlug = getCompanySlug();
    const doc = buildHRPDFDoc();
    const pdfDataUrl = doc.output('datauristring');
    const pdfViewerHtml = `
        <div class="glass-card" style="margin-bottom:1.5rem; padding:1.2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:0.78rem; font-weight:700; letter-spacing:1px; color:#94a3b8; text-transform:uppercase;">📄 INDIVIDUAL FEATURE PDF: HR & TALENT PLAN</span>
                <a href="${pdfDataUrl}" download="${compSlug}_HR_Talent_Plan.pdf" class="btn-primary" style="padding:6px 14px; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Download Feature PDF ↓</a>
            </div>
            <iframe src="${pdfDataUrl}" style="width:100%; height:480px; border-radius:8px; border:1px solid rgba(255,255,255,0.15);" title="HR Plan PDF"></iframe>
        </div>
    `;

    const formatted = formatMarkdown(state.hrPlan);

    openDetailPanel('HR & TALENT ARCHITECTURE', `
        <div class="success-banner">HR & TALENT SPECIFICATION COMPLETE</div>
        ${pdfViewerHtml}
        <div class="glass-card" style="font-size:0.95rem; line-height:1.7; color:rgba(255,255,255,0.85);">${formatted}</div>
        <div class="refine-container">
            <h4>REFINE HR PLAN</h4>
            <div class="refine-input-group">
                <input type="text" id="hrRefineInput" class="input-field" placeholder="e.g. Add details on remote engineering compensation...">
                <button id="hrRefineBtn" class="btn-generate">Refine</button>
            </div>
        </div>
    `, preserveScroll);

    bindRefineInput('hrRefineInput', 'hrRefineBtn', refineHRPlan);
}

function renderLogisticsDetailPanel(preserveScroll = false) {
    if (!state.logisticsPlan) {
        openDetailPanel('LOGISTICS & OPERATIONS PLAN', `
            <p class="text-muted" style="margin-bottom:1rem;">Generate your Logistics & Operations Plan to see end-to-end pipelines, fulfillment SOPs, and tracking tools.</p>
            <button class="btn-generate" onclick="generateLogisticsPlanWrapped()">Generate Logistics Plan</button>
        `, preserveScroll);
        return;
    }

    const compSlug = getCompanySlug();
    const doc = buildLogisticsPDFDoc();
    const pdfDataUrl = doc.output('datauristring');
    const pdfViewerHtml = `
        <div class="glass-card" style="margin-bottom:1.5rem; padding:1.2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:0.78rem; font-weight:700; letter-spacing:1px; color:#94a3b8; text-transform:uppercase;">📄 INDIVIDUAL FEATURE PDF: LOGISTICS & OPERATIONS PLAN</span>
                <a href="${pdfDataUrl}" download="${compSlug}_Logistics_Operations_Plan.pdf" class="btn-primary" style="padding:6px 14px; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Download Feature PDF ↓</a>
            </div>
            <iframe src="${pdfDataUrl}" style="width:100%; height:480px; border-radius:8px; border:1px solid rgba(255,255,255,0.15);" title="Logistics PDF"></iframe>
        </div>
    `;

    const formatted = formatMarkdown(state.logisticsPlan);

    openDetailPanel('LOGISTICS & OPERATIONS EXECUTION', `
        <div class="success-banner">LOGISTICS & OPERATIONS SPECIFICATION COMPLETE</div>
        ${pdfViewerHtml}
        <div class="glass-card" style="font-size:0.95rem; line-height:1.7; color:rgba(255,255,255,0.85);">${formatted}</div>
        <div class="refine-container">
            <h4>REFINE LOGISTICS PLAN</h4>
            <div class="refine-input-group">
                <input type="text" id="logisticsRefineInput" class="input-field" placeholder="e.g. Add 24-hour response SLAs...">
                <button id="logisticsRefineBtn" class="btn-generate">Refine</button>
            </div>
        </div>
    `, preserveScroll);

    bindRefineInput('logisticsRefineInput', 'logisticsRefineBtn', refineLogisticsPlan);
}

function renderMarketingDetailPanel(preserveScroll = false) {
    if (!state.marketingPlan) {
        openDetailPanel('COMPREHENSIVE MARKETING PLAN', `
            <p class="text-muted" style="margin-bottom:1rem;">Generate your Marketing Plan to see growth funnel architecture, channel breakdowns, and campaign roadmaps.</p>
            <button class="btn-generate" onclick="generateMarketingPlanWrapped()">Generate Marketing Plan</button>
        `, preserveScroll);
        return;
    }

    const compSlug = getCompanySlug();
    const doc = buildMarketingPDFDoc();
    const pdfDataUrl = doc.output('datauristring');
    const pdfViewerHtml = `
        <div class="glass-card" style="margin-bottom:1.5rem; padding:1.2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:0.78rem; font-weight:700; letter-spacing:1px; color:#94a3b8; text-transform:uppercase;">📄 INDIVIDUAL FEATURE PDF: COMPREHENSIVE MARKETING PLAN</span>
                <a href="${pdfDataUrl}" download="${compSlug}_Marketing_Growth_Plan.pdf" class="btn-primary" style="padding:6px 14px; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Download Feature PDF ↓</a>
            </div>
            <iframe src="${pdfDataUrl}" style="width:100%; height:480px; border-radius:8px; border:1px solid rgba(255,255,255,0.15);" title="Marketing PDF"></iframe>
        </div>
    `;

    const formatted = formatMarkdown(state.marketingPlan);

    openDetailPanel('COMPREHENSIVE MARKETING PLAN', `
        <div class="success-banner">MARKETING PLAN SPECIFICATION COMPLETE</div>
        ${pdfViewerHtml}
        <div class="glass-card" style="font-size:0.95rem; line-height:1.7; color:rgba(255,255,255,0.85);">${formatted}</div>
        <div class="refine-container">
            <h4>REFINE MARKETING PLAN</h4>
            <div class="refine-input-group">
                <input type="text" id="marketingRefineInput" class="input-field" placeholder="e.g. Include influencer partnership channels...">
                <button id="marketingRefineBtn" class="btn-generate">Refine</button>
            </div>
        </div>
    `, preserveScroll);

    bindRefineInput('marketingRefineInput', 'marketingRefineBtn', refineMarketingPlan);
}

function renderOutreachDetailPanel(preserveScroll = false) {
    if (!state.outreachPlan) {
        openDetailPanel('OUTREACH & PROSPECTING STRATEGY', `
            <p class="text-muted" style="margin-bottom:1rem;">Generate your Outreach Plan to see B2B target personas, pitch scripts, and weekly prospecting cadences.</p>
            <button class="btn-generate" onclick="generateOutreachPlanWrapped()">Generate Outreach Plan</button>
        `, preserveScroll);
        return;
    }

    const compSlug = getCompanySlug();
    const doc = buildOutreachPDFDoc();
    const pdfDataUrl = doc.output('datauristring');
    const pdfViewerHtml = `
        <div class="glass-card" style="margin-bottom:1.5rem; padding:1.2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:0.78rem; font-weight:700; letter-spacing:1px; color:#94a3b8; text-transform:uppercase;">📄 INDIVIDUAL FEATURE PDF: OUTREACH & PROSPECTING STRATEGY</span>
                <a href="${pdfDataUrl}" download="${compSlug}_Outreach_Strategy_Plan.pdf" class="btn-primary" style="padding:6px 14px; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Download Feature PDF ↓</a>
            </div>
            <iframe src="${pdfDataUrl}" style="width:100%; height:480px; border-radius:8px; border:1px solid rgba(255,255,255,0.15);" title="Outreach PDF"></iframe>
        </div>
    `;

    const formatted = formatMarkdown(state.outreachPlan);

    openDetailPanel('OUTREACH & PROSPECTING STRATEGY', `
        <div class="success-banner">OUTREACH SPECIFICATION COMPLETE</div>
        ${pdfViewerHtml}
        <div class="glass-card" style="font-size:0.95rem; line-height:1.7; color:rgba(255,255,255,0.85);">${formatted}</div>
        <div class="refine-container">
            <h4>REFINE OUTREACH PLAN</h4>
            <div class="refine-input-group">
                <input type="text" id="outreachRefineInput" class="input-field" placeholder="e.g. Focus outreach on seed-stage founders in NYC...">
                <button id="outreachRefineBtn" class="btn-generate">Refine</button>
            </div>
        </div>
    `, preserveScroll);

    bindRefineInput('outreachRefineInput', 'outreachRefineBtn', refineOutreachPlan);
}

function renderSocialDetailPanel(preserveScroll = false) {
    if (!state.socialPlan) {
        openDetailPanel('SOCIAL MEDIA STRATEGY', `
            <p class="text-muted" style="margin-bottom:1rem;">Generate your Social Media Plan to see content pillars, platform strategies, virality hooks, and calendars.</p>
            <button class="btn-generate" onclick="generateSocialMediaPlanWrapped()">Generate Social Media Plan</button>
        `, preserveScroll);
        return;
    }

    const compSlug = getCompanySlug();
    const doc = buildSocialMediaPDFDoc();
    const pdfDataUrl = doc.output('datauristring');
    const pdfViewerHtml = `
        <div class="glass-card" style="margin-bottom:1.5rem; padding:1.2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:0.78rem; font-weight:700; letter-spacing:1px; color:#94a3b8; text-transform:uppercase;">📄 INDIVIDUAL FEATURE PDF: SOCIAL MEDIA STRATEGY PLAN</span>
                <a href="${pdfDataUrl}" download="${compSlug}_Social_Media_Strategy_Plan.pdf" class="btn-primary" style="padding:6px 14px; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Download Feature PDF ↓</a>
            </div>
            <iframe src="${pdfDataUrl}" style="width:100%; height:480px; border-radius:8px; border:1px solid rgba(255,255,255,0.15);" title="Social Media PDF"></iframe>
        </div>
    `;

    const formatted = formatMarkdown(state.socialPlan);

    openDetailPanel('SOCIAL MEDIA STRATEGY & CONTENT PLAN', `
        <div class="success-banner">SOCIAL MEDIA SPECIFICATION COMPLETE</div>
        ${pdfViewerHtml}
        <div class="glass-card" style="font-size:0.95rem; line-height:1.7; color:rgba(255,255,255,0.85);">${formatted}</div>
        <div class="refine-container">
            <h4>REFINE SOCIAL MEDIA PLAN</h4>
            <div class="refine-input-group">
                <input type="text" id="socialRefineInput" class="input-field" placeholder="e.g. Focus heavy on LinkedIn founder thought leadership...">
                <button id="socialRefineBtn" class="btn-generate">Refine</button>
            </div>
        </div>
    `, preserveScroll);

    bindRefineInput('socialRefineInput', 'socialRefineBtn', refineSocialMediaPlan);
}

function renderLogoDetailPanel() {
    if (!state.logoImageDataUrl) {
        openDetailPanel('AI LOGO STUDIO', `
            <p class="text-muted" style="margin-bottom:1.2rem;">Generate a high-resolution, static corporate AI logo mark for ${escapeHtml(state.company || 'your brand')}.</p>
            <button class="btn-generate" onclick="generateLogoWrapped()">Generate Static AI Logo</button>
        `);
        return;
    }

    const compSlug = getCompanySlug();
    const doc = buildLogoPDFDoc();
    const pdfDataUrl = doc.output('datauristring');
    const pdfViewerHtml = `
        <div class="glass-card" style="margin-bottom:1.5rem; padding:1.2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:0.78rem; font-weight:700; letter-spacing:1px; color:#94a3b8; text-transform:uppercase;">📄 INDIVIDUAL FEATURE PDF: LOGO EMBLEM SPECIFICATIONS</span>
                <a href="${pdfDataUrl}" download="${compSlug}_Logo_Specifications.pdf" class="btn-primary" style="padding:6px 14px; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Download Feature PDF ↓</a>
            </div>
            <iframe src="${pdfDataUrl}" style="width:100%; height:480px; border-radius:8px; border:1px solid rgba(255,255,255,0.15);" title="Logo PDF"></iframe>
        </div>
    `;

    openDetailPanel('AI LOGO STUDIO', `
        <div class="success-banner">STATIC BRAND MARK GENERATED</div>
        <p class="text-muted" style="margin-bottom:1.2rem;">High-resolution static emblem crafted for ${escapeHtml(state.company || 'your brand')}.</p>

        ${pdfViewerHtml}

        <div class="glass-card" style="display:flex; flex-direction:column; align-items:center; padding:2.5rem 2rem;">
            <div class="logo-preview-box" style="width:280px; height:280px; border-radius:var(--radius-xl); overflow:hidden; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.15); box-shadow:0 12px 36px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center;">
                <img src="${state.logoImageDataUrl}" style="width:100%; height:100%; object-fit:contain;" alt="AI Generated Brand Logo">
            </div>
            <div style="margin-top:1.8rem; display:flex; gap:14px; flex-wrap:wrap; justify-content:center;">
                <a href="${state.logoImageDataUrl}" download="${compSlug}_Logo.png" class="btn-primary" style="padding:14px 28px; text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
                    ⬇ Download Logo PNG
                </a>
                <button class="btn-secondary-glass" onclick="generateLogoWrapped()" style="padding:14px 24px;">
                    ✨ Regenerate AI Logo
                </button>
            </div>
        </div>
    `);
}

function renderExportDetailPanel() {
    const hasData = !!state.brand;
    const compSlug = getCompanySlug();

    let pdfViewerHtml = '';
    if (hasData) {
        const doc = buildBrandPDFDoc();
        const pdfDataUrl = doc.output('datauristring');
        pdfViewerHtml = `
            <div class="glass-card" style="margin-bottom:1.5rem; padding:1.2rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <span style="font-size:0.78rem; font-weight:700; letter-spacing:1px; color:#94a3b8; text-transform:uppercase;">📄 MASTER EXECUTIVE BRAND BOOK PDF</span>
                    <a href="${pdfDataUrl}" download="${compSlug}_Brand_Book.pdf" class="btn-primary" style="padding:6px 14px; font-size:0.78rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Download Master PDF ↓</a>
                </div>
                <iframe src="${pdfDataUrl}" style="width:100%; height:480px; border-radius:8px; border:1px solid rgba(255,255,255,0.15);" title="Executive Brand Book PDF"></iframe>
            </div>
        `;
    }

    openDetailPanel('BRAND ASSET EXPORT', `
        ${hasData ? `
            <div class="glass-card">
                <h3>FINALIZED SPECIFICATIONS</h3>
                <p style="font-size:0.85rem; color:rgba(255,255,255,0.7); margin-bottom:6px;"><strong>Company:</strong> ${escapeHtml(state.company)} (${escapeHtml(state.industry)})</p>
                <p style="font-size:0.85rem; color:rgba(255,255,255,0.7); margin-bottom:6px;"><strong>Tone:</strong> ${escapeHtml(state.tone)}</p>
                <p style="font-size:0.85rem; color:rgba(255,255,255,0.7); margin-bottom:6px;"><strong>Slogan:</strong> "${escapeHtml(state.finalSlogan || (state.brand && state.brand.slogans[0]) || '')}"</p>
                <p style="font-size:0.85rem; color:rgba(255,255,255,0.7); margin-bottom:6px;"><strong>Font:</strong> ${escapeHtml(state.finalFont || (state.brand && state.brand.fonts[0]) || '')}</p>
                <p style="font-size:0.85rem; color:rgba(255,255,255,0.7);"><strong>Palette:</strong> ${state.brand.palette.join(', ')}</p>
            </div>

            ${pdfViewerHtml}

            <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:1rem;">
                <button class="btn-generate" onclick="downloadBrandPDF()">📄 Download Brand Book (PDF)</button>
                <button class="btn-secondary-glass" onclick="downloadBrandZip()">📦 Download Brand Package (ZIP)</button>
            </div>
        ` : `
            <p class="text-muted">No brand specification generated yet. Please generate Brand Identity first.</p>
        `}
    `);
}


// ============================================================================
// SECTION 6: WRAPPED GENERATOR FUNCTIONS
// ============================================================================

async function generateBrandIdentityWrapped() {
    closeDetailPanel();
    openDetailPanel('BRAND IDENTITY', '<p style="color:rgba(255,255,255,0.6);">⏳ Generating brand identity<span class="loading-dots"></span></p>');
    await generateBrandIdentity();
    closeDetailPanel();
    renderBrandDetailPanel();
}

async function generateCampaignWrapped() {
    closeDetailPanel();
    openDetailPanel('CAMPAIGN STRATEGY', '<p style="color:rgba(255,255,255,0.6);">⏳ Formulating campaign<span class="loading-dots"></span></p>');
    await generateCampaign();
    closeDetailPanel();
    renderCampaignDetailPanel();
}

async function generateStrategyWrapped() {
    closeDetailPanel();
    openDetailPanel('EXECUTIVE STRATEGY', '<p style="color:rgba(255,255,255,0.6);">⏳ Generating strategy<span class="loading-dots"></span></p>');
    await generateStrategy();
    closeDetailPanel();
    renderStrategyDetailPanel();
}

async function generateHRPlanWrapped() {
    closeDetailPanel();
    openDetailPanel('HR & TALENT ARCHITECTURE', '<p style="color:rgba(255,255,255,0.6); text-align:center; padding:2rem 0;">⏳ Architecting HR & Talent Plan...<span class="loading-dots"></span></p>');
    await generateHRPlan();
    closeDetailPanel();
    renderHRDetailPanel();
}

async function generateLogisticsPlanWrapped() {
    closeDetailPanel();
    openDetailPanel('LOGISTICS & OPERATIONS PLAN', '<p style="color:rgba(255,255,255,0.6); text-align:center; padding:2rem 0;">⏳ Formulating Operations & Logistics Pipeline...<span class="loading-dots"></span></p>');
    await generateLogisticsPlan();
    closeDetailPanel();
    renderLogisticsDetailPanel();
}

async function generateMarketingPlanWrapped() {
    closeDetailPanel();
    openDetailPanel('COMPREHENSIVE MARKETING PLAN', '<p style="color:rgba(255,255,255,0.6); text-align:center; padding:2rem 0;">⏳ Building Growth Funnel & Marketing Roadmap...<span class="loading-dots"></span></p>');
    await generateMarketingPlan();
    closeDetailPanel();
    renderMarketingDetailPanel();
}

async function generateOutreachPlanWrapped() {
    closeDetailPanel();
    openDetailPanel('OUTREACH & PROSPECTING STRATEGY', '<p style="color:rgba(255,255,255,0.6); text-align:center; padding:2rem 0;">⏳ Crafting Prospecting Matrix & Pitch Scripts...<span class="loading-dots"></span></p>');
    await generateOutreachPlan();
    closeDetailPanel();
    renderOutreachDetailPanel();
}

async function generateSocialMediaPlanWrapped() {
    closeDetailPanel();
    openDetailPanel('SOCIAL MEDIA STRATEGY', '<p style="color:rgba(255,255,255,0.6); text-align:center; padding:2rem 0;">⏳ Building Content Pillars & Growth Calendar...<span class="loading-dots"></span></p>');
    await generateSocialMediaPlan();
    closeDetailPanel();
    renderSocialDetailPanel();
}

async function translateSloganWrapped() {
    const l1 = document.getElementById('lang1');
    const l2 = document.getElementById('lang2');
    const l3 = document.getElementById('lang3');
    if (l1) state.lang1 = l1.value || 'Spanish';
    if (l2) state.lang2 = l2.value || 'French';
    if (l3) state.lang3 = l3.value || 'Japanese';

    closeDetailPanel();
    openDetailPanel('LOCALIZATION', '<p style="color:rgba(255,255,255,0.6);">⏳ Translating slogan<span class="loading-dots"></span></p>');
    await translateSlogan();
    closeDetailPanel();
    renderTranslateDetailPanel();
}

async function generateLogoImage() {
    try {
        logDebug('SYSTEM', 'Generating static AI logo mark...');
        const paletteStr = (state.brand && state.brand.palette) ? state.brand.palette.join(', ') : '#000000, #ffffff';
        
        const prompt = `vector minimalist luxury emblem logo mark for "${state.company || 'Brand'}", ${state.industry} company, ${state.tone} aesthetic, colors ${paletteStr}, clean modern graphic design icon, centered on solid dark background, 8k resolution, flat 2d vector icon`;

        logDebug('API REQ', 'Requesting static AI logo generation...', { prompt });

        let imageDataUrl = null;
        const seed = Math.floor(Math.random() * 999999);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
        
        try {
            const imgRes = await fetch(imageUrl);
            if (imgRes.ok) {
                const blob = await imgRes.blob();
                imageDataUrl = await new Promise((res) => {
                    const reader = new FileReader();
                    reader.onloadend = () => res(reader.result);
                    reader.readAsDataURL(blob);
                });
            } else {
                imageDataUrl = imageUrl;
            }
        } catch (err) {
            imageDataUrl = imageUrl;
        }

        state.logoImageDataUrl = imageDataUrl;
        state.logoDesc = `Static AI Emblem generated for ${state.company} (${state.tone} ${state.industry})`;
        logDebug('SUCCESS', 'Static AI Logo generated successfully!');
    } catch (e) {
        logDebug('ERROR', 'AI Logo Generation failed', { error: e.message });
        alert(`Logo Generation Error: ${e.message}`);
    }
}

async function generateLogoWrapped() {
    closeDetailPanel();
    openDetailPanel('AI LOGO STUDIO', '<p style="color:rgba(255,255,255,0.7); text-align:center; padding:2rem 0;">✨ Generating high-resolution AI logo mark...<span class="loading-dots"></span></p>');
    await generateLogoImage();
    closeDetailPanel();
    renderLogoDetailPanel();
}

function generateLogoCodeWrapped() {
    generateLogoWrapped();
}


// ============================================================================
// SECTION 7: AI MASCOT ASSISTANT CHAT
// ============================================================================

function toggleAssistantChat() {
    const chat = document.getElementById('assistantChat');
    const speechBubble = document.getElementById('assistantSpeechBubble');
    chat.classList.toggle('open');
    if (chat.classList.contains('open')) {
        document.getElementById('chatInput').focus();
        if (speechBubble) speechBubble.style.display = 'none';
    } else {
        if (speechBubble) speechBubble.style.display = 'block';
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const body = document.getElementById('chatBody');

    body.innerHTML += `<div class="chat-msg user">${escapeHtml(msg)}</div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;

    body.innerHTML += `<div class="chat-msg bot" id="typingMsg">Thinking<span class="loading-dots"></span></div>`;
    body.scrollTop = body.scrollHeight;

    try {
        const promptText = `
        You are Brand Buddy, a friendly mascot assistant for corporate brand building.
        Current brand state:
        - Company: ${state.company}
        - Tone: ${state.tone}
        - Slogan: ${state.finalSlogan}
        - Has brand identity: ${!!state.brand}
        - Has campaign: ${!!state.campaign}
        - Has strategy: ${!!state.strategy}

        User says: "${msg}"

        Respond in JSON ONLY:
        {"action": "refine_brand|refine_campaign|refine_strategy|generate_brand|generate_campaign|generate_strategy|translate|info", "suggestion": "the refinement text to pass", "reply": "friendly response to user"}
        `;

        const raw = await callHuggingFaceAI(promptText);
        const data = extractJSON(raw);

        const typing = document.getElementById('typingMsg');
        if (typing) typing.remove();

        if (data) {
            body.innerHTML += `<div class="chat-msg bot">${escapeHtml(data.reply || 'On it!')}</div>`;
            body.scrollTop = body.scrollHeight;

            if (data.action === 'refine_brand' && state.brand && data.suggestion) {
                setTimeout(async () => {
                    const fontsAvailable = typeof getFontsForTone === 'function' ? getFontsForTone(state.tone).join(", ") : "Helvetica, Times New Roman, Cinzel";
                    const refinePrompt = `
                    Refine current brand identity.
                    CURRENT BRAND: ${JSON.stringify(state.brand)}
                    USER SUGGESTION: "${data.suggestion}"
                    COMPANY: ${state.company} (${state.industry}, ${state.tone})
                    Return ONLY JSON: {"slogans":["","","","",""], "fonts":["","",""], "palette":["#HEX","#HEX","#HEX","#HEX"]}
                    For fonts choose 3 from: ${fontsAvailable}.
                    `;
                    const rawRes = await callHuggingFaceAI(refinePrompt);
                    const brandData = extractJSON(rawRes);
                    if (brandData) {
                        state.brand = brandData;
                        state.finalSlogan = brandData.slogans ? brandData.slogans[0] : '';
                        state.finalFont = brandData.fonts ? brandData.fonts[0] : '';
                        body.innerHTML += `<div class="chat-msg bot">✨ Brand identity updated! Check the Brand Identity card.</div>`;
                        ResultsDashboard.render();
                    }
                }, 100);
            } else if (data.action === 'generate_brand') {
                generateBrandIdentityWrapped();
            } else if (data.action === 'generate_campaign') {
                generateCampaignWrapped();
            } else if (data.action === 'generate_strategy') {
                generateStrategyWrapped();
            } else if (data.action === 'translate') {
                translateSloganWrapped();
            } else if (data.action === 'refine_campaign' && state.campaign && data.suggestion) {
                const refinePrompt = `
                Refine campaign:
                CURRENT: ${JSON.stringify(state.campaign)}
                SUGGESTION: "${data.suggestion}"
                Return ONLY JSON: {"captions":["","",""], "metrics":""}
                `;
                const rawRes = await callHuggingFaceAI(refinePrompt);
                const campaignData = extractJSON(rawRes);
                if (campaignData) {
                    state.campaign = campaignData;
                    state.finalCaption = campaignData.captions[0];
                    body.innerHTML += `<div class="chat-msg bot">✨ Campaign updated!</div>`;
                    ResultsDashboard.render();
                }
            } else if (data.action === 'refine_strategy' && state.strategy && data.suggestion) {
                const refinePrompt = `
                Refine strategy report:
                CURRENT: ${state.strategy}
                SUGGESTION: "${data.suggestion}"
                Return updated report with headers and bullet points.
                `;
                state.strategy = await callHuggingFaceAI(refinePrompt);
                body.innerHTML += `<div class="chat-msg bot">✨ Strategy updated!</div>`;
                ResultsDashboard.render();
            }
        } else {
            body.innerHTML += `<div class="chat-msg bot">I understood your request, but I'm having trouble parsing the response. Try being more specific!</div>`;
        }
    } catch (e) {
        const typing = document.getElementById('typingMsg');
        if (typing) typing.remove();
        body.innerHTML += `<div class="chat-msg bot">Sorry, I ran into an error: ${escapeHtml(e.message)}</div>`;
    }

    body.scrollTop = body.scrollHeight;
}




// ============================================================================
// SECTION 8: RESTART FLOW
// ============================================================================
function restartFlow() {
    if (!confirm('Restart the branding flow? All generated data will be cleared.')) return;

    state.hasReachedResults = false;
    state.company = '';
    state.industry = 'Technology';
    state.stage = 'Just Starting Out';
    state.progress = 'Blank Canvas (0%)';
    state.archetype = 'The Innovator (Tech / Frontier)';
    state.marketTier = 'High-Tier Enterprise';
    state.tone = 'Minimalist';
    state.product = '';
    state.audience = [];
    state.channels = [];
    state.usp = '';
    state.avoid = '';
    state.desc = '';

    state.brand = null;
    state.finalSlogan = '';
    state.finalFont = '';
    state.strategy = '';
    state.hrPlan = '';
    state.logisticsPlan = '';
    state.marketingPlan = '';
    state.outreachPlan = '';
    state.socialPlan = '';
    state.translations = null;
    state.logoImageDataUrl = '';
    state.logoDesc = '';
    state.logoCode = '';

    document.querySelectorAll('.fullscreen-phase').forEach(p => {
        p.classList.add('hidden');
        p.style.display = '';
    });

    closeDetailPanel();
    document.getElementById('assistantChat').classList.remove('open');

    PhaseController.start();
}


// ============================================================================
// SECTION 9: LOGGING HELPER
// ============================================================================

function logDebug(type, message, data = null) {
    if (data) console.log(`[${type}] ${message}`, data);
    else console.log(`[${type}] ${message}`);
}

async function testApiConnection() {
    logDebug('SYSTEM', 'Testing API connection...');
    try {
        const res = await callHuggingFaceAI("Ping test. Return ONLY JSON: {\"status\":\"ok\"}");
        logDebug('SUCCESS', 'API Connection test succeeded!', { response: res });
        alert("✨ API Connection Test Succeeded!\n" + res);
    } catch (e) {
        logDebug('ERROR', 'API Connection test failed!', { error: e.message });
        alert("❌ API Connection Test Failed:\n" + e.message);
    }
}

function initApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    const closeBtn = document.getElementById('closeApiKeyModal');
    const saveBtn = document.getElementById('saveApiKeyBtn');
    const input = document.getElementById('apiKeyInput');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            state.apiKey = input.value.trim();
            localStorage.setItem('hf_api_key', state.apiKey);
            modal.classList.remove('active');
            logDebug('SYSTEM', 'API Credentials updated.', { hasKey: !!state.apiKey });
            alert(state.apiKey ? "API Credentials saved." : "API Credentials cleared.");
        });
    }
}

async function callHuggingFaceAI(promptText) {
    logDebug('API REQ', 'Preparing AI request...', { promptSnippet: promptText.substring(0, 120) + '...' });

    if (!state.apiKey) {
        state.apiKey = DEFAULT_API_KEY;
    }

    const endpoint = "https://router.huggingface.co/v1/chat/completions";
    const startTime = Date.now();

    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            logDebug('API REQ', `Sending request to HF Router (Attempt ${attempt + 1}/3)...`, { endpoint, model: "openai/gpt-oss-20b" });

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${state.apiKey}`
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    messages: [
                        { role: "system", content: "You are an elite corporate branding strategist and graphic designer." },
                        { role: "user", content: promptText }
                    ],
                    max_tokens: 3000,
                    temperature: 0.7
                })
            });

            const latency = Date.now() - startTime;

            if (!response.ok) {
                const errText = await response.text();
                const err = new Error(`API Error (HTTP ${response.status}): ${errText}`);
                logDebug('ERROR', `Attempt ${attempt + 1} failed with status ${response.status}`, { status: response.status, body: errText, latencyMs: latency });
                if (attempt === 2) throw err;
                await new Promise(r => setTimeout(r, 1500));
                continue;
            }

            const data = await response.json();
            const aiContent = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : null;

            if (!aiContent) {
                throw new Error("Received empty completion from AI model.");
            }

            logDebug('API RES', `Response received in ${latency}ms`, { latencyMs: latency, responseSnippet: aiContent.substring(0, 150) + '...' });
            return aiContent;

        } catch (err) {
            logDebug('WARN', `Attempt ${attempt + 1} exception: ${err.message}`, { error: err.message });
            if (attempt === 2) {
                logDebug('ERROR', 'All 3 attempts failed.', { lastError: err.message });
                throw err;
            }
            await new Promise(r => setTimeout(r, 1500));
        }
    }
}

function extractJSON(text) {
    if (!text) return null;
    try {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
    } catch (e) {
        logDebug('WARN', 'Failed to parse JSON from AI output', { rawText: text, error: e.message });
    }
    return null;
}

async function generateBrandIdentity() {
    try {
        const sloganExamples = typeof getRandomSloganExamples === 'function' ? getRandomSloganExamples(5) : "Just Do It, Think Different";
        const fontsAvailable = typeof getFontsForTone === 'function' ? getFontsForTone(state.tone).join(", ") : "Helvetica, Times New Roman, Cinzel";

        const promptText = `
        Return ONLY JSON.
        {"slogans":["","","","",""], "fonts":["","",""], "palette":["#HEX","#HEX","#HEX","#HEX"]}
        Company: ${state.company}
        Industry: ${state.industry}
        Tone: ${state.tone}
        Description: ${state.desc}

        Slogan inspiration style (DO NOT copy, create original ones): ${sloganExamples}.
        For fonts, you MUST choose exactly 3 fonts from this approved list only: ${fontsAvailable}.
        Create 5 unique memorable slogans tailored specifically to this brand.
        `;

        logDebug('SYSTEM', 'Triggering Brand Identity Generation...');
        const rawRes = await callHuggingFaceAI(promptText);
        const data = extractJSON(rawRes);

        if (data) {
            state.brand = data;
            state.finalSlogan = data.slogans ? data.slogans[0] : '';
            state.finalFont = data.fonts ? data.fonts[0] : '';
            logDebug('SUCCESS', 'Brand Identity generated!', { brand: data });
        } else {
            alert("Could not parse AI response. Enable Debug Mode to see raw output.");
        }
    } catch (err) {
        logDebug('ERROR', 'Brand Identity generation failed', { error: err.message });
        alert(`Generation Failed: ${err.message}`);
    }
}

function selectSlogan(slogan) {
    state.finalSlogan = slogan;
    renderBrandDetailPanel(true);
    logDebug('SYSTEM', 'Selected slogan', { slogan });
}

function selectFont(font) {
    state.finalFont = font;
    renderBrandDetailPanel(true);
    logDebug('SYSTEM', 'Selected font', { font });
}

async function refineBrandIdentity() {
    const input = document.getElementById('brandRefineInput');
    const suggestion = input ? input.value.trim() : '';
    if (!suggestion) return;

    try {
        const fontsAvailable = typeof getFontsForTone === 'function' ? getFontsForTone(state.tone).join(", ") : "Helvetica, Times New Roman, Cinzel";
        const promptText = `
        Refine current brand identity.
        CURRENT BRAND: ${JSON.stringify(state.brand)}
        USER SUGGESTION: "${suggestion}"
        COMPANY: ${state.company} (${state.industry}, ${state.tone})
        Return ONLY JSON: {"slogans":["","","","",""], "fonts":["","",""], "palette":["#HEX","#HEX","#HEX","#HEX"]}
        For fonts choose 3 from: ${fontsAvailable}.
        `;

        logDebug('SYSTEM', 'Refining Brand Identity...', { suggestion });
        const raw = await callHuggingFaceAI(promptText);
        const data = extractJSON(raw);
        if (data) {
            state.brand = data;
            state.finalSlogan = data.slogans ? data.slogans[0] : '';
            state.finalFont = data.fonts ? data.fonts[0] : '';
            renderBrandDetailPanel(true);
            logDebug('SUCCESS', 'Brand refined!', { brand: data });
        }
    } catch (e) {
        logDebug('ERROR', 'Refinement failed', { error: e.message });
        alert(`Refinement error: ${e.message}`);
    }
}

async function generateCampaign() {
    try {
        const promptText = `
        Return ONLY JSON:
        {"captions":["","",""], "metrics":""}
        Company: ${state.company}
        Industry: ${state.industry}
        Tone: ${state.tone}
        Description: ${state.desc}
        Create 3 engaging marketing captions and a brief summary of campaign KPIs and metrics.
        `;

        logDebug('SYSTEM', 'Triggering Campaign Generation...');
        const raw = await callHuggingFaceAI(promptText);
        const data = extractJSON(raw);

        if (data) {
            state.campaign = data;
            state.finalCaption = data.captions ? data.captions[0] : '';
            logDebug('SUCCESS', 'Campaign generated!', { campaign: data });
        }
    } catch (err) {
        logDebug('ERROR', 'Campaign Generation failed', { error: err.message });
        alert(`Campaign Error: ${err.message}`);
    }
}

function selectCaption(caption) {
    state.finalCaption = caption;
    renderCampaignDetailPanel(true);
    logDebug('SYSTEM', 'Selected caption', { caption });
}

async function refineCampaign() {
    const suggestion = document.getElementById('campaignRefineInput').value.trim();
    if (!suggestion) return;

    try {
        const promptText = `
        Refine campaign:
        CURRENT: ${JSON.stringify(state.campaign)}
        SUGGESTION: "${suggestion}"
        Return ONLY JSON: {"captions":["","",""], "metrics":""}
        `;
        logDebug('SYSTEM', 'Refining Campaign...', { suggestion });
        const raw = await callHuggingFaceAI(promptText);
        const data = extractJSON(raw);
        if (data) {
            state.campaign = data;
            state.finalCaption = data.captions[0];
            renderCampaignDetailPanel();
            logDebug('SUCCESS', 'Campaign refined!');
        }
    } catch (e) {
        logDebug('ERROR', 'Campaign refinement failed', { error: e.message });
        alert(`Error: ${e.message}`);
    }
}

async function generateStrategy() {
    try {
        const promptText = `
        Create a professional executive brand strategy report for ${state.company} (${state.industry}).
        Tone: ${state.tone}. Description: ${state.desc}.
        FORMATTING RULES:
        - Use clear headers (e.g. ## Executive Summary, ## Market Positioning, ## Growth Pillars).
        - Use clear bullet points.
        - DO NOT use Markdown tables.
        - Write strictly in readable paragraphs and bullet points.
        `;

        logDebug('SYSTEM', 'Triggering Strategy Generation...');
        const report = await callHuggingFaceAI(promptText);
        state.strategy = report;
        logDebug('SUCCESS', 'Strategy generated!', { length: report.length });
    } catch (e) {
        logDebug('ERROR', 'Strategy Generation failed', { error: e.message });
        alert(`Strategy Error: ${e.message}`);
    }
}

async function refineStrategy() {
    const suggestion = document.getElementById('strategyRefineInput').value.trim();
    if (!suggestion) return;

    try {
        const promptText = `
        Refine strategy report:
        CURRENT: ${state.strategy}
        SUGGESTION: "${suggestion}"
        Return updated report with headers and bullet points.
        `;
        logDebug('SYSTEM', 'Refining Strategy...', { suggestion });
        state.strategy = await callHuggingFaceAI(promptText);
        renderStrategyDetailPanel();
        logDebug('SUCCESS', 'Strategy refined!');
    } catch (e) {
        logDebug('ERROR', 'Strategy refinement failed', { error: e.message });
        alert(`Error: ${e.message}`);
    }
}

function getCompanySlug() {
    return (state.company || 'Brand').replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_');
}

async function handleRefineAction(btnElement, inputElement, refineFn) {
    if (!btnElement || !inputElement) return;
    const userPrompt = inputElement.value.trim();
    if (!userPrompt) return;

    const originalBtnText = btnElement.innerHTML;
    btnElement.disabled = true;
    inputElement.disabled = true;
    btnElement.innerHTML = `<span class="btn-spinner"></span> Refining with AI...`;

    try {
        await refineFn(userPrompt);
        inputElement.value = '';
    } catch (err) {
        logDebug('ERROR', 'Refine Action Failed', { error: err.message });
    } finally {
        btnElement.disabled = false;
        inputElement.disabled = false;
        btnElement.innerHTML = originalBtnText;
    }
}

function bindRefineInput(inputId, btnId, refineFn) {
    setTimeout(() => {
        const inputEl = document.getElementById(inputId);
        const btnEl = document.getElementById(btnId);
        if (!inputEl || !btnEl) return;

        const triggerAction = async () => {
            await handleRefineAction(btnEl, inputEl, refineFn);
        };

        btnEl.onclick = triggerAction;
        inputEl.onkeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                triggerAction();
            }
        };
    }, 50);
}

function createPlanPrompt(planTitle, planFocusDescription) {
    const audienceStr = Array.isArray(state.audience) ? state.audience.join(', ') : (state.audience || 'Target Market');
    const channelStr = Array.isArray(state.channels) ? state.channels.join(', ') : (state.channels || 'Core Channels');

    return `
    Company: ${state.company || 'Enterprise'}
    Industry: ${state.industry || 'Technology'}
    Foundation Stage: ${state.stage || 'Initial Build'}
    Execution Progress: ${state.progress || 'In Progress'}
    Brand Archetype: ${state.archetype || 'Leader'}
    Pricing Tier: ${state.marketTier || 'Enterprise'}
    Aesthetic Tone: ${state.tone || 'Modern'}
    Core Product / Service: ${state.product || state.desc || 'High performance solution'}
    Target Audience: ${audienceStr}
    Growth Channels: ${channelStr}
    Competitive Edge / USP: ${state.usp || 'Market Leader'}
    Style Anti-Pattern (To Avoid): ${state.avoid || 'Mediocrity'}

    Task: Write an executive founder brief and operational document for ${state.company}: "${planTitle}".
    Focus: ${planFocusDescription}

    Format & Structure (MATCH FOUNDER BRIEF REFERENCE SPECIFICATIONS):
    Header Title: ${state.company} - ${planTitle} | Founder brief for the team | 2026

    Include the following 9 sections:
    # 1. Why This Plan
    Explain the strategic necessity, reputational protection, and operational context.

    # 2. Target Goals (by December 2026)
    Provide 5 clear, quantifiable bullet point goals.

    # 3. Core Strategy & Focus
    Detailed strategic priorities.

    # 4. End-to-End Pipeline Matrix
    Provide a detailed Markdown Table:
    | Stage | What Happens | Tool / Artifact | Owner |
    (Provide 6-8 detailed rows).

    # 5. Execution Framework & Rules
    Key operational guidelines and protocols.

    # 6. Tools & Systems Matrix
    Provide a Markdown Table:
    | Category / Need | Tool (Free/Low-Cost) | Operational Notes |
    (Provide 5-6 rows).

    # 7. Monthly Roadmap (Jul-Dec 2026)
    Provide a Markdown Table:
    | Month | Focus Area | What "Done" Looks Like |
    (Provide 6 rows: Jul, Aug, Sep, Oct, Nov, Dec).

    # 8. Team Roles & Ownership Matrix
    Provide a Markdown Table:
    | Role | Responsibility | Weekly Commitment |
    (Provide 4-5 rows).

    # 9. Risk Contingencies & Synthesis
    Problem handling rules and synthesis.
    `;
}

// ── HR Plan Generator ──
async function generateHRPlan(refinePrompt = '') {
    try {
        logDebug('SYSTEM', 'Triggering HR Plan Generation...');
        let promptText = createPlanPrompt('HR & Talent Architecture Plan', 'Talent acquisition, student/fellow vetting, team onboarding, compensation models, role definitions, and culture scaling.');
        if (refinePrompt) {
            promptText += `\nREFINEMENT INSTRUCTION: "${refinePrompt}"`;
        }
        state.hrPlan = await callHuggingFaceAI(promptText);
        logDebug('SUCCESS', 'HR Plan generated!');
    } catch (e) {
        logDebug('ERROR', 'HR Plan Generation failed', { error: e.message });
        alert(`HR Plan Error: ${e.message}`);
    }
}
async function refineHRPlan(prompt) {
    await generateHRPlan(prompt);
    renderHRDetailPanel(true);
}

// ── Logistics Plan Generator ──
async function generateLogisticsPlan(refinePrompt = '') {
    try {
        logDebug('SYSTEM', 'Triggering Logistics Plan Generation...');
        let promptText = createPlanPrompt('Logistics & Operations Plan', 'End-to-end operational pipeline, vetting, matching logic, placement agreements, tracking tools, and monthly execution roadmap.');
        if (refinePrompt) {
            promptText += `\nREFINEMENT INSTRUCTION: "${refinePrompt}"`;
        }
        state.logisticsPlan = await callHuggingFaceAI(promptText);
        logDebug('SUCCESS', 'Logistics Plan generated!');
    } catch (e) {
        logDebug('ERROR', 'Logistics Plan Generation failed', { error: e.message });
        alert(`Logistics Plan Error: ${e.message}`);
    }
}
async function refineLogisticsPlan(prompt) {
    await generateLogisticsPlan(prompt);
    renderLogisticsDetailPanel(true);
}

// ── Marketing Plan Generator ──
async function generateMarketingPlan(refinePrompt = '') {
    try {
        logDebug('SYSTEM', 'Triggering Marketing Plan Generation...');
        let promptText = createPlanPrompt('Comprehensive Marketing Plan', 'Growth funnel architecture, customer acquisition channels, campaign launch cadence, brand positioning, and monthly ROI metrics.');
        if (refinePrompt) {
            promptText += `\nREFINEMENT INSTRUCTION: "${refinePrompt}"`;
        }
        state.marketingPlan = await callHuggingFaceAI(promptText);
        logDebug('SUCCESS', 'Marketing Plan generated!');
    } catch (e) {
        logDebug('ERROR', 'Marketing Plan Generation failed', { error: e.message });
        alert(`Marketing Plan Error: ${e.message}`);
    }
}
async function refineMarketingPlan(prompt) {
    await generateMarketingPlan(prompt);
    renderMarketingDetailPanel(true);
}

// ── Outreach Plan Generator ──
async function generateOutreachPlan(refinePrompt = '') {
    try {
        logDebug('SYSTEM', 'Triggering Outreach Plan Generation...');
        let promptText = createPlanPrompt('Startup & Investor Outreach Plan', 'B2B lead generation, target prospect profiling, channel focus (co-working, accelerators, LinkedIn), weekly cadence, pitch scripts, and conversion metrics.');
        if (refinePrompt) {
            promptText += `\nREFINEMENT INSTRUCTION: "${refinePrompt}"`;
        }
        state.outreachPlan = await callHuggingFaceAI(promptText);
        logDebug('SUCCESS', 'Outreach Plan generated!');
    } catch (e) {
        logDebug('ERROR', 'Outreach Plan Generation failed', { error: e.message });
        alert(`Outreach Plan Error: ${e.message}`);
    }
}
async function refineOutreachPlan(prompt) {
    await generateOutreachPlan(prompt);
    renderOutreachDetailPanel(true);
}

// ── Social Media Plan Generator ──
async function generateSocialMediaPlan(refinePrompt = '') {
    try {
        logDebug('SYSTEM', 'Triggering Social Media Plan Generation...');
        let promptText = createPlanPrompt('Social Media & Content Strategy Plan', 'Content pillars, platform strategy (LinkedIn, Twitter/X, Instagram, YouTube), virality hooks, weekly posting schedule, monthly growth targets, and analytics.');
        if (refinePrompt) {
            promptText += `\nREFINEMENT INSTRUCTION: "${refinePrompt}"`;
        }
        state.socialPlan = await callHuggingFaceAI(promptText);
        logDebug('SUCCESS', 'Social Media Plan generated!');
    } catch (e) {
        logDebug('ERROR', 'Social Media Plan Generation failed', { error: e.message });
        alert(`Social Media Plan Error: ${e.message}`);
    }
}
async function refineSocialMediaPlan(prompt) {
    await generateSocialMediaPlan(prompt);
    renderSocialDetailPanel(true);
}

async function translateSlogan() {
    const slogan = state.finalSlogan || (state.brand && state.brand.slogans[0]);
    if (!slogan) {
        alert("Please generate Brand Identity first to get a slogan!");
        return;
    }

    const l1 = state.lang1 || 'Spanish';
    const l2 = state.lang2 || 'French';
    const l3 = state.lang3 || 'Japanese';

    try {
        const promptText = `
        Translate brand slogan: '${slogan}' into ${l1}, ${l2}, and ${l3}.
        Return ONLY JSON:
        {"${l1}": "...", "${l2}": "...", "${l3}": "..."}
        Preserve prestige and brand tone.
        `;

        logDebug('SYSTEM', 'Translating...', { slogan, languages: [l1, l2, l3] });
        const raw = await callHuggingFaceAI(promptText);
        const data = extractJSON(raw);
        if (data) {
            state.translations = data;
            logDebug('SUCCESS', 'Translations generated!', { translations: data });
        }
    } catch (e) {
        logDebug('ERROR', 'Translation failed', { error: e.message });
        alert(`Translation error: ${e.message}`);
    }
}

function initLogoCanvas() {
    const canvas = document.getElementById('logoCanvas');
    if (!canvas) return;

    const playBtn = document.getElementById('playLogoAnim');
    if (playBtn) {
        playBtn.onclick = () => toggleLogoPlay();
    }

    const speedSlider = document.getElementById('logoSpeed');
    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            state.logoAnimSpeed = parseFloat(e.target.value);
        });
    }
}

function toggleLogoPlay() {
    state.logoIsPlaying = !state.logoIsPlaying;
    const btn = document.getElementById('playLogoAnim');
    if (btn) btn.textContent = state.logoIsPlaying ? 'PAUSE' : 'PLAY';
    logDebug('SYSTEM', 'Toggled logo animation', { isPlaying: state.logoIsPlaying });
}

function startLogoCanvasLoop() {
    const canvas = document.getElementById('logoCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function draw() {
        if (state.logoIsPlaying) {
            animationFrameCount += state.logoAnimSpeed;
        }

        const width = canvas.width;
        const height = canvas.height;
        const time = animationFrameCount * 0.03;

        ctx.fillStyle = '#090a0f';
        ctx.fillRect(0, 0, width, height);

        const cGold = '#d4af37';
        const cGoldLight = '#f5e6ab';
        const centerX = width / 2;
        const centerY = height / 2 - 25;

        ctx.save();
        ctx.translate(centerX, centerY);

        ctx.strokeStyle = cGold;
        ctx.lineWidth = 2;
        ctx.save();
        ctx.rotate(time * 0.4);
        ctx.strokeRect(-55, -55, 110, 110);
        ctx.restore();

        ctx.strokeStyle = cGoldLight;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const sides = 6;
        const radius = 42 + Math.sin(time * 0.8) * 3;
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI / sides) - time * 0.6;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = cGold;
        ctx.save();
        ctx.rotate(Math.PI / 4);
        const dim = 16 + Math.cos(time * 1.2) * 4;
        ctx.fillRect(-dim/2, -dim/2, dim, dim);
        ctx.restore();

        const orbitAngle = time * 0.8;
        const ox = 70 * Math.cos(orbitAngle);
        const oy = 70 * Math.sin(orbitAngle);
        ctx.fillStyle = cGoldLight;
        ctx.fillRect(ox - 3, oy - 3, 6, 6);

        ctx.restore();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#f5e6ab';
        ctx.font = `700 20px "Cinzel", serif`;
        ctx.fillText((state.company || 'APEX VISION').toUpperCase(), centerX, centerY + 105);

        const sloganText = (state.finalSlogan || 'EXCELLENCE IN INNOVATION').toUpperCase();
        ctx.fillStyle = '#cbd5e1';
        ctx.font = `500 10px "Montserrat", sans-serif`;
        ctx.fillText(sloganText, centerX, centerY + 130);

        canvasAnimationId = requestAnimationFrame(draw);
    }

    if (canvasAnimationId) cancelAnimationFrame(canvasAnimationId);
    draw();
}

async function generateLogoCode() {
    try {
        const palette = (state.brand && state.brand.palette) ? state.brand.palette.join(', ') : '#d4af37, #0f172a';
        const slogan = state.finalSlogan || 'Excellence';
        const promptText = `
        Company: ${state.company}
        Tagline: ${slogan}
        Industry: ${state.industry}
        Tone: ${state.tone}
        Palette: ${palette}

        Task: Architect geometric animated mark concepts for this luxury brand.
        Describe the geometric ratio concept and kinetic properties.
        <desc>Description of central emblem and kinetic motion.</desc>
        <code>
        // Geometric Canvas Animation Vector Core
        ctx.rotate(time);
        ctx.strokeRect(-50, -50, 100, 100);
        </code>
        `;

        logDebug('SYSTEM', 'Architecting Brand Mark...');
        const raw = await callHuggingFaceAI(promptText);
        const descMatch = raw.match(/<desc>([\s\S]*?)<\/desc>/i);
        const codeMatch = raw.match(/<code>([\s\S]*?)<\/code>/i);

        state.logoDesc = descMatch ? descMatch[1].trim() : "Kinetic geometric mark with rotating square frame and diamond core.";
        state.logoCode = codeMatch ? codeMatch[1].trim() : "// Animation logic loaded into canvas";

        logDebug('SUCCESS', 'Brand Mark concept generated!');
    } catch (e) {
        logDebug('ERROR', 'Brand Mark generation failed', { error: e.message });
        alert(`Logo Error: ${e.message}`);
    }
}

function sanitizeForPDF(str) {
    if (!str) return '';
    return String(str)
        .replace(/[\u2012\u2013\u2014\u2015\u2212]/g, '-')
        .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
        .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
        .replace(/[\u2022\u2023\u2043\u204B\u25C9\u25E6\u25A0\u25AA]/g, '-')
        .replace(/\u2026/g, '...')
        .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, ' ')
        .replace(/[^\x00-\x7F]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function createBasePDFHelper(doc) {
    let y = 25;

    function checkAddPage(neededHeight = 10) {
        if (y + neededHeight > 272) {
            doc.addPage();
            y = 25;
        }
    }

    function renderPdfBlock(text, opts = {}) {
        if (!text) return;
        const isBold = opts.isBold || false;
        const fontSize = opts.fontSize || 9.5;
        const color = opts.color || [51, 65, 85];
        const x = (opts.x || 20) + (opts.indent || 0);
        const maxW = opts.maxW ? Math.min(opts.maxW, 140 - (opts.indent || 0)) : (140 - (opts.indent || 0));
        const lineGap = opts.lineGap || 5.5;
        const isBullet = opts.isBullet || false;

        const fontStyle = isBold ? "bold" : "normal";
        doc.setFont("helvetica", fontStyle);
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);

        if (typeof doc.setCharSpace === 'function') {
            doc.setCharSpace(0);
        }

        let cleanText = sanitizeForPDF(text);
        if (!cleanText) return;

        if (cleanText.startsWith('#')) {
            cleanText = cleanText.replace(/^#+\s*/, '');
        }

        const prefix = isBullet ? "- " : "";
        const fullText = prefix + cleanText;

        const lines = doc.splitTextToSize(fullText, maxW);
        lines.forEach(l => {
            checkAddPage(lineGap);
            doc.setFont("helvetica", fontStyle);
            doc.setFontSize(fontSize);
            doc.setTextColor(color[0], color[1], color[2]);
            if (typeof doc.setCharSpace === 'function') {
                doc.setCharSpace(0);
            }
            const cleanLine = sanitizeForPDF(l);
            if (cleanLine) {
                doc.text(cleanLine, x, y);
                y += lineGap;
            }
        });
    }

    function renderPdfTable(tableLines) {
        if (!tableLines || tableLines.length === 0) return;

        const validRows = tableLines.filter(row => !/^\|?[\s\-:|=]+\|?$/.test(row));
        if (validRows.length === 0) return;

        const parsedRows = validRows.map(row => {
            let cells = row.split('|');
            if (cells.length > 0 && cells[0].trim() === '') cells.shift();
            if (cells.length > 0 && cells[cells.length - 1].trim() === '') cells.pop();
            return cells.map(cell => sanitizeForPDF(cell));
        });

        if (parsedRows.length === 0) return;

        const numCols = Math.max(...parsedRows.map(r => r.length));
        if (numCols === 0) return;

        const tableX = 20;
        const totalWidth = 140;
        const colWidth = totalWidth / numCols;

        checkAddPage(15);
        y += 2;

        parsedRows.forEach((rowCells, rowIndex) => {
            const isHeader = rowIndex === 0;
            const fontSize = isHeader ? 9 : 8.5;
            const fontStyle = isHeader ? "bold" : "normal";

            doc.setFont("helvetica", fontStyle);
            doc.setFontSize(fontSize);
            if (typeof doc.setCharSpace === 'function') doc.setCharSpace(0);

            const wrappedCells = rowCells.map(cellText => {
                return doc.splitTextToSize(cellText || '', colWidth - 4);
            });

            const maxCellLines = Math.max(1, ...wrappedCells.map(c => c.length));
            const rowHeight = Math.max(8, maxCellLines * 4.5 + 4);

            checkAddPage(rowHeight);

            const currentY = y;

            if (isHeader) {
                doc.setFillColor(241, 245, 249);
                doc.rect(tableX, currentY, totalWidth, rowHeight, 'F');
            }

            wrappedCells.forEach((lines, colIdx) => {
                const cellX = tableX + colIdx * colWidth + 2;
                let cellY = currentY + (isHeader ? 5 : 4);

                doc.setFont("helvetica", fontStyle);
                doc.setFontSize(fontSize);
                doc.setTextColor(isHeader ? 15 : 51, isHeader ? 23 : 65, isHeader ? 42 : 85);
                if (typeof doc.setCharSpace === 'function') doc.setCharSpace(0);

                lines.forEach(lineStr => {
                    const cleanLine = sanitizeForPDF(lineStr);
                    if (cleanLine) {
                        doc.text(cleanLine, cellX, cellY);
                        cellY += 4.2;
                    }
                });
            });

            doc.setDrawColor(isHeader ? 203 : 226, isHeader ? 213 : 232, isHeader ? 225 : 240);
            doc.setLineWidth(isHeader ? 0.5 : 0.3);
            doc.line(tableX, currentY + rowHeight, tableX + totalWidth, currentY + rowHeight);

            y = currentY + rowHeight;
        });

        y += 4;
    }

    function renderMarkdownContent(markdownText) {
        if (!markdownText) return;
        const lines = String(markdownText).split('\n');

        let i = 0;
        while (i < lines.length) {
            const rawLine = lines[i];
            const trimmed = rawLine.trim();

            if (!trimmed) {
                y += 3;
                i++;
                continue;
            }

            if (trimmed.includes('|') && (trimmed.match(/\|/g) || []).length >= 2) {
                const tableLines = [];
                while (i < lines.length && lines[i].trim().includes('|') && (lines[i].trim().match(/\|/g) || []).length >= 2) {
                    tableLines.push(lines[i].trim());
                    i++;
                }
                renderPdfTable(tableLines);
                continue;
            }

            if (trimmed.startsWith('#')) {
                const level = (trimmed.match(/^#+/)[0] || '#').length;
                const text = trimmed.replace(/^#+\s*/, '');
                const size = level === 1 ? 14 : level === 2 ? 11.5 : 10;
                checkAddPage(12);
                y += 2;
                renderPdfBlock(text, { isBold: true, fontSize: size, color: [15, 23, 42], lineGap: size * 0.55 });
                y += 1;
                i++;
                continue;
            }

            const numberedBoldMatch = trimmed.match(/^(\d+[\.\)])\s*\*\*([^*]+)\*\*\s*:?\s*(.*)$/);
            if (numberedBoldMatch) {
                const num = numberedBoldMatch[1];
                const label = numberedBoldMatch[2].trim();
                const value = numberedBoldMatch[3].trim();
                checkAddPage(10);
                y += 2;
                if (value) {
                    renderPdfBlock(`${num} ${label}: ${value}`, { isBold: true, fontSize: 10, color: [15, 23, 42], lineGap: 5.5 });
                } else {
                    renderPdfBlock(`${num} ${label}`, { isBold: true, fontSize: 10, color: [15, 23, 42], lineGap: 5.5 });
                }
                i++;
                continue;
            }

            const boldFieldMatch = trimmed.match(/^([\-\*•])?\s*\*\*([^*]+)\*\*\s*:?\s*(.*)$/);
            if (boldFieldMatch) {
                const isBullet = !!boldFieldMatch[1];
                const label = boldFieldMatch[2].trim();
                const value = boldFieldMatch[3].trim();

                if (value) {
                    renderPdfBlock(`${label}: ${value}`, { fontSize: 9.5, color: [51, 65, 85], indent: isBullet ? 4 : 0, isBullet: isBullet, lineGap: 5.2 });
                } else {
                    renderPdfBlock(label, { isBold: true, fontSize: 10, color: [15, 23, 42], indent: isBullet ? 4 : 0, isBullet: isBullet, lineGap: 5.5 });
                }
                i++;
                continue;
            }

            if (/^[\-\*•]/.test(trimmed)) {
                const text = trimmed.replace(/^[\-\*•]\s*/, '');
                renderPdfBlock(text, { fontSize: 9.5, color: [51, 65, 85], indent: 4, isBullet: true, lineGap: 5.2 });
                i++;
                continue;
            }

            renderPdfBlock(trimmed, { fontSize: 9.5, color: [51, 65, 85], lineGap: 5.2 });
            i++;
        }
    }

    function renderHeader(title, subtitle) {
        renderPdfBlock(title, { isBold: true, fontSize: 16, color: [15, 23, 42], lineGap: 7 });
        renderPdfBlock(subtitle, { fontSize: 9.5, color: [100, 116, 139], lineGap: 8 });
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;
    }

    function renderFoundationSection() {
        checkAddPage(20);
        renderPdfBlock("1. CORPORATE FOUNDATION & SPECIFICATIONS", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 7 });
        y += 2;

        const inputs = [
            `Company Name: ${state.company || 'N/A'}`,
            `Industry Sector: ${state.industry || 'N/A'}`,
            `Brand Foundation Stage: ${state.stage || 'N/A'}`,
            `Execution Progress: ${state.progress || 'N/A'}`,
            `Brand Archetype: ${state.archetype || 'N/A'}`,
            `Market Pricing Tier: ${state.marketTier || 'N/A'}`,
            `Brand Aesthetic Tone: ${state.tone || 'N/A'}`,
            `Core Product / Service: ${state.product || state.desc || 'N/A'}`,
            `Target Audience: ${Array.isArray(state.audience) ? state.audience.join(', ') : (state.audience || 'N/A')}`,
            `Growth & Engagement Channels: ${Array.isArray(state.channels) ? state.channels.join(', ') : (state.channels || 'N/A')}`,
            `Competitive Edge / USP: ${state.usp || 'N/A'}`,
            `Style Anti-Pattern (To Avoid): ${state.avoid || 'N/A'}`
        ];

        inputs.forEach(item => {
            renderPdfBlock(item, { fontSize: 9.5, color: [51, 65, 85], lineGap: 5.5 });
        });
        y += 5;
    }

    function addFooters(documentTitle) {
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            if (typeof doc.setCharSpace === 'function') doc.setCharSpace(0);
            doc.text(`Confidential • Nysion AI ${documentTitle}`, 20, 287);
            doc.text(`Page ${i} of ${totalPages}`, 190, 287, { align: 'right' });
        }
    }

    return { renderPdfBlock, renderMarkdownContent, renderPdfTable, renderHeader, renderFoundationSection, addFooters, getY: () => y, setY: (val) => { y = val; }, checkAddPage };
}

function buildBrandIdentityPDFDoc() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const helper = createBasePDFHelper(doc);

    helper.renderHeader(`${(state.company || 'BRAND').toUpperCase()} - BRAND IDENTITY CHARTER`, `Slogans, Typography, and Color Palette Specifications | Nysion AI`);
    helper.renderFoundationSection();

    if (state.brand) {
        helper.checkAddPage(20);
        helper.renderPdfBlock("2. BRAND IDENTITY & TYPOGRAPHY SUITE", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 7 });
        helper.setY(helper.getY() + 2);

        const brandSpecs = [
            `Primary Slogan: "${state.finalSlogan || state.brand.slogans[0]}"`,
            `Alternative Slogans: ${state.brand.slogans.map(s => `"${s}"`).join(' | ')}`,
            `Primary Typeface: ${state.finalFont || state.brand.fonts[0]}`,
            `Font Suite Recommendations: ${state.brand.fonts.join(', ')}`,
            `Color Palette HEX Specifications: ${state.brand.palette.join(', ')}`
        ];

        brandSpecs.forEach(spec => {
            helper.renderPdfBlock(spec, { fontSize: 9.5, color: [51, 65, 85], lineGap: 5.5 });
        });
    }

    helper.addFooters("Brand Identity Charter");
    return doc;
}

function buildCampaignPDFDoc() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const helper = createBasePDFHelper(doc);

    helper.renderHeader(`${(state.company || 'BRAND').toUpperCase()} - MARKETING CAMPAIGN SUITE`, `Editorial Concepts, Captions, and Performance Target KPIs | Nysion AI`);
    helper.renderFoundationSection();

    if (state.campaign) {
        helper.checkAddPage(20);
        helper.renderPdfBlock("2. MARKETING CAMPAIGN CONCEPTS & TARGET KPIs", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 7 });
        helper.setY(helper.getY() + 2);

        const campaignSpecs = [
            `Primary Campaign Editorial: "${state.finalCaption || state.campaign.captions[0]}"`,
            `Campaign Concepts: ${state.campaign.captions.map(c => `"${c}"`).join(' | ')}`
        ];

        campaignSpecs.forEach(spec => {
            helper.renderPdfBlock(spec, { fontSize: 9.5, color: [51, 65, 85], lineGap: 5.5 });
        });

        if (state.campaign.metrics) {
            helper.setY(helper.getY() + 2);
            helper.renderPdfBlock("Performance Metrics & Target KPIs:", { isBold: true, fontSize: 10, color: [15, 23, 42], lineGap: 5.5 });
            helper.renderMarkdownContent(state.campaign.metrics);
        }
    }

    helper.addFooters("Campaign Suite");
    return doc;
}

function buildStrategyPDFDoc() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const helper = createBasePDFHelper(doc);

    helper.renderHeader(`${(state.company || 'BRAND').toUpperCase()} - STRATEGIC GROWTH ROADMAP`, `Executive Market Positioning & Brand Strategy Analysis | Nysion AI`);
    helper.renderFoundationSection();

    if (state.strategy) {
        helper.checkAddPage(20);
        helper.renderPdfBlock("2. EXECUTIVE STRATEGY & MARKET POSITIONING", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 8 });
        helper.setY(helper.getY() + 2);
        helper.renderMarkdownContent(state.strategy);
    }

    helper.addFooters("Strategy Roadmap");
    return doc;
}

function buildLogoPDFDoc() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const helper = createBasePDFHelper(doc);

    helper.renderHeader(`${(state.company || 'BRAND').toUpperCase()} - BRAND EMBLEM SPECIFICATIONS`, `Geometric Vector Emblem Mark & Visual Identity Specs | Nysion AI`);
    helper.renderFoundationSection();

    if (state.logoImageDataUrl && state.logoImageDataUrl.startsWith('data:image')) {
        helper.checkAddPage(65);
        helper.renderPdfBlock("2. PRIMARY BRAND EMBLEM MARK", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 8 });
        helper.setY(helper.getY() + 4);
        try {
            doc.addImage(state.logoImageDataUrl, 'PNG', 20, helper.getY(), 50, 50);
            helper.setY(helper.getY() + 55);
        } catch (e) {
            logDebug('WARNING', 'Could not render logo in PDF', { error: e.message });
        }
    }

    if (state.logoDesc) {
        helper.renderPdfBlock("Geometric Vector Specifications:", { isBold: true, fontSize: 10, color: [15, 23, 42], lineGap: 5.5 });
        helper.renderPdfBlock(state.logoDesc, { fontSize: 9.5, color: [51, 65, 85], lineGap: 5.2 });
    }

    helper.addFooters("Logo Emblem Specifications");
    return doc;
}

function buildBrandPDFDoc() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const helper = createBasePDFHelper(doc);

    helper.renderHeader(`${(state.company || 'BRAND').toUpperCase()} - EXECUTIVE BRAND BOOK`, `Corporate Specifications & Brand Overview | Nysion AI`);
    helper.renderFoundationSection();

    helper.checkAddPage(20);
    helper.renderPdfBlock("2. BRAND OVERVIEW & DESCRIPTION", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 7 });
    helper.setY(helper.getY() + 2);

    const descriptionText = state.desc || state.product || `${state.company || 'The company'} is a high-performance enterprise operating in the ${state.industry || 'technology'} sector, engineered with a ${state.tone || 'modern'} aesthetic tone and positioning for market leadership.`;

    helper.renderPdfBlock(descriptionText, { fontSize: 9.5, color: [51, 65, 85], lineGap: 5.5 });

    helper.addFooters("Executive Brand Book");
    return doc;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function generateColorPaletteImage(paletteHexes) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0B0F19';
    ctx.fillRect(0, 0, 1200, 360);

    const swatchLabels = ['Primary Brand', 'Accent Tone', 'Surface Highlight', 'Muted Secondary', 'Background Dark'];
    const numSwatches = paletteHexes.length;
    const swatchWidth = Math.floor((1200 - (40 * (numSwatches + 1))) / numSwatches);

    paletteHexes.forEach((hex, i) => {
        const x = 40 + i * (swatchWidth + 40);
        const y = 50;
        const width = swatchWidth;
        const height = 180;
        const radius = 16;

        ctx.fillStyle = hex;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(hex.toUpperCase(), x + 15, y + 248);

        const label = swatchLabels[i] || `Color Tone ${i + 1}`;
        ctx.font = '11px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(label, x + 15, y + 270);
    });

    return canvas.toDataURL('image/png');
}

function buildHRPDFDoc() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const helper = createBasePDFHelper(doc);

    helper.renderHeader(`${(state.company || 'BRAND').toUpperCase()} - HR & TALENT ARCHITECTURE`, `Talent Acquisition, Team Roles & Compensation Framework | Nysion AI`);
    helper.renderFoundationSection();

    if (state.hrPlan) {
        helper.checkAddPage(20);
        helper.renderPdfBlock("2. HR & TALENT ACQUISITION PLAN", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 8 });
        helper.setY(helper.getY() + 2);
        helper.renderMarkdownContent(state.hrPlan);
    }

    helper.addFooters("HR & Talent Architecture");
    return doc;
}

function buildLogisticsPDFDoc() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const helper = createBasePDFHelper(doc);

    helper.renderHeader(`${(state.company || 'BRAND').toUpperCase()} - LOGISTICS & OPERATIONS PLAN`, `End-to-End Pipeline, Operational SOPs & Tools | Nysion AI`);
    helper.renderFoundationSection();

    if (state.logisticsPlan) {
        helper.checkAddPage(20);
        helper.renderPdfBlock("2. LOGISTICS & OPERATIONS EXECUTION", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 8 });
        helper.setY(helper.getY() + 2);
        helper.renderMarkdownContent(state.logisticsPlan);
    }

    helper.addFooters("Logistics & Operations Plan");
    return doc;
}

function buildMarketingPDFDoc() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const helper = createBasePDFHelper(doc);

    helper.renderHeader(`${(state.company || 'BRAND').toUpperCase()} - COMPREHENSIVE MARKETING PLAN`, `Growth Funnel Architecture, Launch Roadmap & ROI Targets | Nysion AI`);
    helper.renderFoundationSection();

    if (state.marketingPlan) {
        helper.checkAddPage(20);
        helper.renderPdfBlock("2. MARKETING & BRAND GROWTH PLAN", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 8 });
        helper.setY(helper.getY() + 2);
        helper.renderMarkdownContent(state.marketingPlan);
    }

    helper.addFooters("Comprehensive Marketing Plan");
    return doc;
}

function buildOutreachPDFDoc() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const helper = createBasePDFHelper(doc);

    helper.renderHeader(`${(state.company || 'BRAND').toUpperCase()} - OUTREACH & PROSPECTING STRATEGY`, `B2B Lead Generation, Pitch Scripts & Partnership Outreach | Nysion AI`);
    helper.renderFoundationSection();

    if (state.outreachPlan) {
        helper.checkAddPage(20);
        helper.renderPdfBlock("2. STRATEGIC OUTREACH PLAN", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 8 });
        helper.setY(helper.getY() + 2);
        helper.renderMarkdownContent(state.outreachPlan);
    }

    helper.addFooters("Outreach Strategy Plan");
    return doc;
}

function buildSocialMediaPDFDoc() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const helper = createBasePDFHelper(doc);

    helper.renderHeader(`${(state.company || 'BRAND').toUpperCase()} - SOCIAL MEDIA & CONTENT PLAN`, `Platform Focus, Content Pillars, Virality Hooks & Monthly Targets | Nysion AI`);
    helper.renderFoundationSection();

    if (state.socialPlan) {
        helper.checkAddPage(20);
        helper.renderPdfBlock("2. SOCIAL MEDIA & CONTENT STRATEGY", { isBold: true, fontSize: 12, color: [15, 23, 42], lineGap: 8 });
        helper.setY(helper.getY() + 2);
        helper.renderMarkdownContent(state.socialPlan);
    }

    helper.addFooters("Social Media Strategy Plan");
    return doc;
}

async function downloadBrandZip() {
    if (!state.brand) {
        alert("Please generate brand identity first.");
        return;
    }

    logDebug('SYSTEM', 'Bundling Empire Brand Kit Package...');
    const zip = new JSZip();
    const compSlug = getCompanySlug();

    const rootFolder = zip.folder(`${compSlug}_Brand_Kit`);
    const pdfFolder = rootFolder.folder("PDFs");
    const assetsFolder = rootFolder.folder("Assets");

    // 1. Executive Brand Book PDF
    const masterDoc = buildBrandPDFDoc();
    pdfFolder.file(`${compSlug}_Brand_Book.pdf`, masterDoc.output('blob'));

    // 2. Brand Identity Charter PDF
    const identityDoc = buildBrandIdentityPDFDoc();
    pdfFolder.file(`${compSlug}_Brand_Identity_Charter.pdf`, identityDoc.output('blob'));

    // 3. Strategic Brand Roadmap PDF (if generated)
    if (state.strategy) {
        const strategyDoc = buildStrategyPDFDoc();
        pdfFolder.file(`${compSlug}_Strategic_Growth_Roadmap.pdf`, strategyDoc.output('blob'));
    }

    // 4. Logo Mark Specifications PDF (if generated)
    if (state.logoImageDataUrl) {
        const logoPdfDoc = buildLogoPDFDoc();
        pdfFolder.file(`${compSlug}_Logo_Specifications.pdf`, logoPdfDoc.output('blob'));
    }

    // 6. HR & Talent Plan PDF (if generated)
    if (state.hrPlan) {
        const hrDoc = buildHRPDFDoc();
        pdfFolder.file(`${compSlug}_HR_Talent_Plan.pdf`, hrDoc.output('blob'));
    }

    // 7. Logistics & Operations Plan PDF (if generated)
    if (state.logisticsPlan) {
        const logisticsDoc = buildLogisticsPDFDoc();
        pdfFolder.file(`${compSlug}_Logistics_Operations_Plan.pdf`, logisticsDoc.output('blob'));
    }

    // 8. Comprehensive Marketing Plan PDF (if generated)
    if (state.marketingPlan) {
        const marketingDoc = buildMarketingPDFDoc();
        pdfFolder.file(`${compSlug}_Marketing_Growth_Plan.pdf`, marketingDoc.output('blob'));
    }

    // 9. Outreach & Prospecting Strategy PDF (if generated)
    if (state.outreachPlan) {
        const outreachDoc = buildOutreachPDFDoc();
        pdfFolder.file(`${compSlug}_Outreach_Strategy_Plan.pdf`, outreachDoc.output('blob'));
    }

    // 10. Social Media & Content Plan PDF (if generated)
    if (state.socialPlan) {
        const socialDoc = buildSocialMediaPDFDoc();
        pdfFolder.file(`${compSlug}_Social_Media_Strategy_Plan.pdf`, socialDoc.output('blob'));
    }

    // 11. High-Res PNG Color Swatch Image
    if (state.brand.palette && state.brand.palette.length > 0) {
        const paletteDataUrl = generateColorPaletteImage(state.brand.palette);
        const paletteBase64 = paletteDataUrl.replace(/^data:image\/png;base64,/, "");
        assetsFolder.file("color_palette_samples.png", paletteBase64, { base64: true });
    }

    // 12. Kinetic Vector Mark Logo PNG
    const canvas = document.getElementById('logoCanvas');
    if (canvas) {
        const logoDataUrl = canvas.toDataURL('image/png');
        const base64Data = logoDataUrl.replace(/^data:image\/png;base64,/, "");
        assetsFolder.file("logo_mark.png", base64Data, { base64: true });
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${compSlug}_Brand_Kit.zip`);
    logDebug('SUCCESS', 'Brand Kit ZIP downloaded!');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
}



// ============================================================================
// SECTION 10: INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    GradientEngine.init();
    initApiKeyModal();

    // Restore local cache immediately for zero-delay startup check
    try {
        const localCached = localStorage.getItem(`nysion_profile_${state.activeProfileId || 'default'}`);
        if (localCached) {
            applyProfileDataToState(JSON.parse(localCached));
        }
    } catch(err){}

    initFirebase();

    logDebug('SYSTEM', 'Cinematic application v2 initialized.', {
        state: { company: state.company, tone: state.tone, hasApiKey: !!state.apiKey }
    });

    if (state.company) {
        logDebug('SYSTEM', 'Existing brand profile detected on startup. Loading Results Dashboard directly.');
        PhaseController.showResults();
    } else {
        PhaseController.start();
    }
});
