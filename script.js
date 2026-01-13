// Family Tree Data
// Note: data is persisted in browser localStorage; we use a dataVersion to safely refresh defaults.
const DEFAULT_DATA_VERSION = 6;

function deepClone(obj) {
    if (typeof structuredClone === 'function') return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
}

const DEFAULT_FAMILY_DATA = {
    dataVersion: DEFAULT_DATA_VERSION,
    generations: [
        // Generation 1
        {
            couples: [
                {
                    people: [
                        { id: 1, name: "Soon Thian Poot", gender: "male", photo: null, passedOn: true, relationshipStatus: "married" },
                        { id: 2, name: "Ah Huat", gender: "female", photo: "Family%20pics/Ah%20Huat.jpg", passedOn: true, relationshipStatus: "married" }
                    ],
                    // Children (Generation 2 bloodline IDs)
                    children: [101, 103, 105, 107, 109, 111, 113, 115, 117, 119, 121, 123]
                }
            ]
        },
        // Generation 2 (children + spouses)
        {
            couples: [
                // 1. Ai Choo (Bloodline) & Curry
                { people: [{ id: 101, name: "Ai Choo", gender: "female", photo: null, relationshipStatus: "married" }, { id: 102, name: "Curry", gender: "male", photo: null, relationshipStatus: "married" }], children: [201, 203, 204, 206, 208] },
                // 2. George (Bloodline) & Helen
                { people: [{ id: 103, name: "George", gender: "male", photo: null, relationshipStatus: "married" }, { id: 104, name: "Helen", gender: "female", photo: "Family%20pics/Helen.jpg", relationshipStatus: "married" }], children: [210, 212, 214] },
                // 3. Da Ee Ee (Bloodline) & Uncle John
                { people: [{ id: 105, name: "Da Ee Ee", gender: "female", photo: "Family%20pics/Da%20E%20E.jpg", relationshipStatus: "married" }, { id: 106, name: "Uncle John", gender: "male", photo: "Family%20pics/Uncle%20John.jpg", relationshipStatus: "married" }], children: [216, 218] },
                // 4. Mah Chye (Bloodline) & Sally
                { people: [{ id: 107, name: "Mah Chye", gender: "female", photo: "Family%20pics/Mah%20Chye.jpg", relationshipStatus: "married" }, { id: 108, name: "Sally", gender: "female", photo: "Family%20pics/Sally.jpg", relationshipStatus: "married" }], children: [220, 222] },
                // 5. Peter Soon (Bloodline) & Sharon
                { people: [{ id: 109, name: "Peter Soon", gender: "male", photo: "Family%20pics/Peter%20Soon.jpg", relationshipStatus: "married" }, { id: 110, name: "Sharon Gan", gender: "female", photo: "Family%20pics/Sharon%20Gan.jpg", relationshipStatus: "married" }], children: [224, 225] },
                // 6. Mah Kok (Bloodline) & Wai Sin
                { people: [{ id: 111, name: "Mah Kok", gender: "male", photo: "Family%20pics/Mah%20Kok.jpg", relationshipStatus: "married" }, { id: 112, name: "Wai Sin", gender: "female", photo: null, relationshipStatus: "married" }], children: [226, 228] },
                // 7. Lian Tee (Bloodline) & Leong Ying (79)
                { people: [{ id: 113, name: "Lian Tee", gender: "female", photo: "Family%20pics/Lian%20Tee.jpg", relationshipStatus: "married" }, { id: 114, name: "Leong Ying", gender: "male", photo: "Family%20pics/LY.jpg", relationshipStatus: "married", birthday: "01/01/1947" }], children: [230] },
                // 8. Mark (Bloodline) & Sherry
                { people: [{ id: 115, name: "Mark", gender: "male", photo: "Family%20pics/Mark%20Soon.jpg", relationshipStatus: "married" }, { id: 116, name: "Sherry", gender: "female", photo: "Family%20pics/Sherry.jpg", relationshipStatus: "married" }], children: [232, 233] },
                // 9. Paul (Bloodline) & Lisa
                { people: [{ id: 117, name: "Paul", gender: "male", photo: "Family%20pics/Paul%20Soon.jpg", relationshipStatus: "married" }, { id: 118, name: "Lisa", gender: "female", photo: "Family%20pics/Lisa.jpg", relationshipStatus: "married" }], children: [235] },
                // 10. David (Bloodline) & Chris
                { people: [{ id: 119, name: "David", gender: "male", photo: "Family%20pics/David%20Soon.jpg", relationshipStatus: "married" }, { id: 120, name: "Chris", gender: "female", photo: "Family%20pics/Chris.jpg", relationshipStatus: "married" }], children: [237, 238, 240] },
                // 11. Steven (Bloodline) & Chuey Mei
                { people: [{ id: 121, name: "Steven", gender: "male", photo: null, relationshipStatus: "married" }, { id: 122, name: "Chuey Mei", gender: "female", photo: "Family%20pics/Cheuy%20Mei.jpg", relationshipStatus: "married" }], children: [241] },
                // 12. May Soon (58) (Bloodline) & Roger (60)
                { people: [{ id: 123, name: "May Soon", gender: "female", photo: "Family%20pics/May%20Soon.jpg", relationshipStatus: "married", birthday: "01/01/1968" }, { id: 124, name: "Roger", gender: "male", photo: "Family%20pics/Roger%20Neo.jpg", relationshipStatus: "married", birthday: "01/01/1966" }], children: [242, 244, 246] }
            ]
        },
        // Generation 3
        {
            couples: [
                // Ai Choo & Curry
                { people: [{ id: 201, name: "Irene", gender: "female", photo: "Family%20pics/Irene.jpg" }, { id: 202, name: "Shermaine", gender: "male", photo: "Family%20pics/Shermaine.jpg" }], children: [301, 302, 303] },
                { people: [{ id: 203, name: "Julia", gender: "female", photo: "Family%20pics/Julia.jpg" }], children: [] },
                { people: [{ id: 204, name: "Alice", gender: "female", photo: null }, { id: 205, name: "David", gender: "male", photo: "Family%20pics/David%203.jpg" }], children: [304, 305] },
                { people: [{ id: 206, name: "Ah San", gender: "male", photo: null }, { id: 207, name: "Wife", gender: "female", photo: null }], children: [306, 307] },
                { people: [{ id: 208, name: "Magdeline", gender: "female", photo: null }, { id: 209, name: "Charles", gender: "male", photo: "Family%20pics/Charles.jpg" }], children: [308, 309] },

                // George & Helen
                { people: [{ id: 210, name: "Lynnette", gender: "female", photo: "Family%20pics/Lynette%20Tan.jpg" }, { id: 211, name: "Thaim Pong", gender: "male", photo: "Family%20pics/Thiam%20Pong.jpg" }], children: [310, 311] },
                { people: [{ id: 212, name: "Samuel", gender: "male", photo: "Family%20pics/Samuel.jpg" }, { id: 213, name: "Susan", gender: "female", photo: "Family%20pics/Susan.jpg" }], children: [312] },
                { people: [{ id: 214, name: "Michelle", gender: "female", photo: "Family%20pics/Michelle%20Tan.jpg" }, { id: 215, name: "Sebastian", gender: "male", photo: null }], children: [313] },

                // Da Ee Ee & Uncle John
                { people: [{ id: 216, name: "Sharon", gender: "female", photo: "Family%20pics/Sharon.jpg" }, { id: 217, name: "Leslie", gender: "male", photo: "Family%20pics/Leslie.jpg" }], children: [314, 315] },
                { people: [{ id: 218, name: "Calvin", gender: "male", photo: "Family%20pics/Calvin.jpg" }, { id: 219, name: "Joyce", gender: "female", photo: "Family%20pics/Joyce.jpg" }], children: [316, 317, 318, 319] },

                // Mah Chye & Sally
                { people: [{ id: 220, name: "Dennis", gender: "male", photo: "Family%20pics/Dennis.jpg" }, { id: 221, name: "Amy", gender: "female", photo: null }], children: [320, 321] },
                { people: [{ id: 222, name: "Edwin", gender: "male", photo: "Family%20pics/Edwin.jpg" }, { id: 223, name: "Joey", gender: "female", photo: "Family%20pics/Joey.jpg" }], children: [] },

                // Peter Soon & Sharon
                { people: [{ id: 224, name: "Ashley", gender: "male", photo: "Family%20pics/Ashley%20soon.jpg", birthday: "01/01/1995" }], children: [] },
                { people: [{ id: 225, name: "Austin", gender: "male", photo: "Family%20pics/Austin%20Soon.jpg", birthday: "01/01/1995" }], children: [] },

                // Mah Kok & Wai Sin
                { people: [{ id: 226, name: "Jonathan", gender: "male", photo: null }, { id: 227, name: "Val", gender: "female", photo: null }], children: [322] },
                { people: [{ id: 228, name: "Grace", gender: "female", photo: "Family%20pics/Grace.jpg" }, { id: 229, name: "Nick", gender: "male", photo: "Family%20pics/Nick.jpg" }], children: [323] },

                // Lian Tee & Leong Ying
                { people: [{ id: 230, name: "Steffi", gender: "female", photo: "Family%20pics/Steffi.jpg", birthday: "01/01/1994" }, { id: 231, name: "Clement", gender: "male", photo: "Family%20pics/Clement.jpg", birthday: "01/01/1994" }], children: [324] },

                // Mark & Sherry
                { people: [{ id: 232, name: "Bryan", gender: "male", photo: "Family%20pics/Bryan.jpg" }], children: [] },
                { people: [{ id: 233, name: "Ben", gender: "male", photo: "Family%20pics/Ben.jpg" }, { id: 234, name: "Vivien", gender: "female", photo: "Family%20pics/Vivian.jpg" }], children: [] },

                // Paul & Lisa
                { people: [{ id: 235, name: "Priscilla", gender: "female", photo: "Family%20pics/Priscilla%20Soon.jpg", birthday: "01/01/1995" }, { id: 236, name: "Keegan", gender: "male", photo: "Family%20pics/Keegan.jpg", birthday: "01/01/1997" }], children: [] },

                // David & Chris
                { people: [{ id: 237, name: "Darren", gender: "male", photo: "Family%20pics/Darren%20soon.jpg", birthday: "01/01/1995" }], children: [] },
                { people: [{ id: 238, name: "Denise", gender: "female", photo: "Family%20pics/Denise%20Soon.jpg", birthday: "01/01/1997" }, { id: 239, name: "Bryle", gender: "male", photo: "Family%20pics/Bryle.jpg" }], children: [] },
                { people: [{ id: 240, name: "Vanessa", gender: "female", photo: "Family%20pics/Vanessa%20Soon.jpg", birthday: "01/01/2000" }], children: [] },

                // Steven & Chuey Mei
                { people: [{ id: 241, name: "Rachel", gender: "female", photo: "Family%20pics/Rachel.jpg" }], children: [] },

                // May Soon & Roger
                { people: [{ id: 242, name: "Martin", gender: "male", photo: "Family%20pics/Martin%20Neo.jpg", birthday: "01/01/1995" }, { id: 243, name: "Rinnah", gender: "female", photo: null, birthday: "01/01/2003" }], children: [] },
                { people: [{ id: 244, name: "Marcus", gender: "male", photo: "Family%20pics/Marcus.jpg", birthday: "01/01/2000" }, { id: 245, name: "Shanna", gender: "female", photo: "Family%20pics/Shanna%20Yan.jpg", birthday: "01/01/2002" }], children: [] },
                { people: [{ id: 246, name: "Marissa", gender: "female", photo: "Family%20pics/Marissa%20Neo.jpg", birthday: "01/01/2001" }, { id: 247, name: "Yuan Zhang", gender: "male", photo: "Family%20pics/Yuan%20Zhang.jpg", birthday: "01/01/2000" }], children: [] }
            ]
        },
        // Generation 4
        {
            couples: [
                // Irene & Shermaine
                { people: [{ id: 301, name: "Alvin", gender: "male", photo: "Family%20pics/Alvin33.jpg" }], children: [] },
                { people: [{ id: 302, name: "Daphene", gender: "female", photo: "Family%20pics/Daphene.jpg" }], children: [] },
                { people: [{ id: 303, name: "Alston", gender: "male", photo: "Family%20pics/Alston.jpg" }], children: [] },
                // Alice & David
                { people: [{ id: 304, name: "Qi Qi", gender: "female", photo: "Family%20pics/Qi%20QI.jpg" }], children: [] },
                { people: [{ id: 305, name: "Ting Ting", gender: "female", photo: "Family%20pics/Ting%20Ting.jpg" }], children: [] },
                // Ah San & Wife
                { people: [{ id: 306, name: "Daughter 1", gender: "female", photo: null }], children: [] },
                { people: [{ id: 307, name: "Daughter 2", gender: "female", photo: null }], children: [] },
                // Magdeline & Charles
                { people: [{ id: 308, name: "Son 1", gender: "male", photo: "Family%20pics/Charles%20son.jpg" }], children: [] },
                { people: [{ id: 309, name: "Son 2", gender: "male", photo: "Family%20pics/Charles%202nd%20son.jpg" }], children: [] },

                // Lynnette & Thaim Pong
                { people: [{ id: 310, name: "Yvette", gender: "female", photo: "Family%20pics/yvvette%20Tan.jpg", birthday: "01/01/1997" }], children: [] },
                { people: [{ id: 311, name: "Gabriel", gender: "male", photo: "Family%20pics/Gabriel.jpg", birthday: "01/01/1999" }], children: [] },
                // Samuel & Susan
                { people: [{ id: 312, name: "Emmanual", gender: "male", photo: "Family%20pics/Emmanuel.jpg", birthday: "01/01/2007" }], children: [] },
                // Michelle & Sebastian
                { people: [{ id: 313, name: "Sarah", gender: "female", photo: "Family%20pics/Sarah%20Tan.jpg", birthday: "01/01/2007" }], children: [] },

                // Sharon & Leslie
                { people: [{ id: 314, name: "Kenzie", gender: "male", photo: "Family%20pics/Kenzie.jpg", birthday: "01/01/1997" }], children: [] },
                { people: [{ id: 315, name: "Jezzrie", gender: "female", photo: "Family%20pics/Jezzrie.jpg", birthday: "01/01/2001" }], children: [] },
                // Calvin & Joyce
                { people: [{ id: 316, name: "Shaniah", gender: "female", photo: "Family%20pics/Shaniah.jpg", birthday: "01/01/2003" }], children: [] },
                { people: [{ id: 317, name: "Nataniah", gender: "female", photo: "Family%20pics/Natania.jpg", birthday: "01/01/2005" }], children: [] },
                { people: [{ id: 318, name: "Adeliah", gender: "female", photo: "Family%20pics/Adelia.jpg", birthday: "01/01/2007" }], children: [] },
                { people: [{ id: 319, name: "Emeliah", gender: "female", photo: "Family%20pics/Emeliah.jpg", birthday: "01/01/2008" }], children: [] },

                // Dennis & Amy
                { people: [{ id: 320, name: "Trixie", gender: "female", photo: "Family%20pics/Trixie.jpg" }], children: [] },
                { people: [{ id: 321, name: "Jovan", gender: "male", photo: "Family%20pics/Jovan.jpg" }], children: [] },

                // Jonathan & Val
                { people: [{ id: 322, name: "Maia", gender: "female", photo: "Family%20pics/Maia.jpg" }], children: [] },
                // Grace & Nick
                { people: [{ id: 323, name: "Hailey", gender: "female", photo: "Family%20pics/Hailey.jpg" }], children: [] },

                // Steffi & Clement
                { people: [{ id: 324, name: "Noah", gender: "male", photo: "Family%20pics/Noah.jpg", birthday: "01/01/2024" }], children: [] }
            ]
        }
    ]
};

let familyData = deepClone(DEFAULT_FAMILY_DATA);
let didResetStoredData = false;

let currentZoom = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let lastPanPoint = { x: 0, y: 0 };
let isPinching = false;
let pinchStartDistance = 0;
let pinchStartZoom = 1;
let pinchStartMidpoint = { x: 0, y: 0 };
let selectedPersonId = null;
let bloodlineOnlyFilterEnabled = false;
let bloodlineIdSet = new Set();
let currentSearchQuery = '';
// Quiz mode state (kept in-memory, not persisted)
let quizAssignments = {}; // personId -> photoPath
let quizResults = {};     // personId -> boolean correct
const VIEW_MODES = {
    DISCREET: 'discreet',
    FILLED: 'filled',
    QUIZ: 'quiz'
};
let currentViewMode = VIEW_MODES.DISCREET;

function applyDataFixes() {
    // Apply targeted fixes to existing saved data (so users don't need to wipe localStorage).
    // Gender corrections (by ID):
    // - Shermaine is a guy (202)
    // - Kenzie is a guy (314)
    // - Jezzrie is a girl (315)
    // - Nataniah is a girl (317)
    const genderFixes = [
        { id: 202, gender: 'male' },
        { id: 314, gender: 'male' },
        { id: 315, gender: 'female' },
        { id: 317, gender: 'female' }
    ];

    let changed = false;
    genderFixes.forEach(({ id, gender }) => {
        const person = findPersonById(id);
        if (person && person.gender !== gender) {
            person.gender = gender;
            changed = true;
        }
    });

    if (changed) saveData();
}

function computeBloodlineIdSet() {
    // "Main bloodline" = Gen1 couple's children (bloodline) + all descendants.
    const set = new Set();

    // Main ancestor (Soon Thian Poot) is considered bloodline.
    set.add(1);

    const gen1Couple = familyData?.generations?.[0]?.couples?.[0];
    (gen1Couple?.children || []).forEach(id => set.add(id));

    let changed = true;
    while (changed) {
        changed = false;
        familyData.generations.forEach(gen => {
            gen.couples.forEach(couple => {
                const coupleHasBloodline = couple.people.some(p => set.has(p.id));
                if (!coupleHasBloodline) return;
                (couple.children || []).forEach(childId => {
                    if (!set.has(childId)) {
                        set.add(childId);
                        changed = true;
                    }
                });
            });
        });
    }

    return set;
}

function getEffectiveRelationshipStatus(person) {
    // Rule: if someone has a partner (in a couple) AND they have kids, treat them as "married"
    // even if relationshipStatus was never set (e.g. Dennis & Amy).
    if (person.relationshipStatus) return person.relationshipStatus;

    const couple = findCoupleForPerson(person.id);
    const hasPartner = !!couple && Array.isArray(couple.people) && couple.people.length === 2;
    const hasKids = !!couple && Array.isArray(couple.children) && couple.children.length > 0;
    if (hasPartner && hasKids) return 'married';

    return 'single';
}

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('familyTreeData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (
                parsed &&
                parsed.dataVersion === DEFAULT_DATA_VERSION &&
                Array.isArray(parsed.generations)
            ) {
                familyData = parsed;
                return;
            }
        } catch (e) {
            console.error('Error loading saved data:', e);
        }

        // Saved data exists but is outdated/corrupted; reset to defaults.
        familyData = deepClone(DEFAULT_FAMILY_DATA);
        didResetStoredData = true;
        saveData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('familyTreeData', JSON.stringify(familyData));
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    applyDataFixes();
    const autoAssigned = assignPhotosFromFolder();
    if (didResetStoredData) {
        showToast('Family tree data updated to the latest version (saved data was reset).', 'info');
    }
    if (autoAssigned > 0) {
        showToast(`Automatically assigned ${autoAssigned} photo(s).`, 'info');
    }
    loadDarkModePreference();
    setupEventListeners();
    setViewMode(VIEW_MODES.DISCREET, { silent: true });
    drawConnectionLines();
    showToast('Welcome to your Family Tree!', 'success');
});

function resetQuizState() {
    quizAssignments = {};
    quizResults = {};
}

function updateQuizButtonVisibility() {
    const quizCheckBtn = document.getElementById('quizCheckBtn');
    if (!quizCheckBtn) return;
    const shouldShow = currentViewMode === VIEW_MODES.QUIZ;
    quizCheckBtn.classList.toggle('is-visible', shouldShow);
}

function evaluateQuizAnswers() {
    const assignmentIds = Object.keys(quizAssignments);
    if (assignmentIds.length === 0) {
        showToast('No photos placed yet. Drag photos onto the cards first.', 'warning');
        return;
    }

    const results = {};
    let correctCount = 0;

    assignmentIds.forEach(idStr => {
        const personId = parseInt(idStr);
        const person = findPersonById(personId);
        if (!person) return;

        const guessPath = quizAssignments[personId];
        const filename = guessPath ? decodeURIComponent(guessPath.split('/').pop() || '') : '';
        const guessKey = normalizeNameForMatch(filename);
        const targetKey = normalizeNameForMatch(person.name);
        const isCorrect = guessKey && targetKey && guessKey === targetKey;

        results[personId] = isCorrect;
        if (isCorrect) correctCount++;
    });

    quizResults = results;
    renderTree();

    const total = assignmentIds.length;
    const message = `${correctCount}/${total} correct. Green = correct, red = wrong.`;
    showToast(message, correctCount === total ? 'success' : 'info');
}

// Setup Event Listeners
function setupEventListeners() {
    const modal = document.getElementById('memberModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('memberForm');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const bloodlineFilterBtn = document.getElementById('bloodlineFilterBtn');
    const galleryPrevBtn = document.getElementById('galleryPrevBtn');
    const galleryNextBtn = document.getElementById('galleryNextBtn');
    const darkModeBtn = document.getElementById('darkModeBtn');
    const statsBtn = document.getElementById('statsBtn');
    const statsModal = document.getElementById('statsModal');
    const statsCloseBtn = document.getElementById('statsCloseBtn');
    const exportBtn = document.getElementById('exportBtn');
    const exportMenu = document.getElementById('exportMenu');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const printBtn = document.getElementById('printBtn');
    const refreshPhotosBtn = document.getElementById('refreshPhotosBtn');
    const modeDiscreetBtn = document.getElementById('modeDiscreetBtn');
    const modeFilledBtn = document.getElementById('modeFilledBtn');
    const modeQuizBtn = document.getElementById('modeQuizBtn');
    const quizCheckBtn = document.getElementById('quizCheckBtn');

    closeBtn.onclick = () => closeModal();
    cancelBtn.onclick = () => closeModal();
    
    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };

    // Profile sidebar event listeners
    const profileSidebar = document.getElementById('profileSidebar');
    const profileCloseBtn = document.querySelector('.profile-close');
    const profileEditForm = document.getElementById('profileEditForm');
    const addChildBtn = document.getElementById('addChildBtn');
    const addSpouseBtn = document.getElementById('addSpouseBtn');

    if (profileCloseBtn) {
        profileCloseBtn.onclick = () => closeProfileSidebar();
    }

    if (profileEditForm) {
        profileEditForm.onsubmit = (e) => {
            e.preventDefault();
            saveProfileFromSidebar();
        };
    }

    if (addChildBtn) {
        addChildBtn.onclick = () => {
            const currentPersonId = parseInt(addChildBtn.dataset.personId);
            if (currentPersonId) {
                openModalForAddChild(currentPersonId);
            }
        };
    }

    if (addSpouseBtn) {
        addSpouseBtn.onclick = () => {
            const currentPersonId = parseInt(addSpouseBtn.dataset.personId);
            if (currentPersonId) {
                openModalForAddSpouse(currentPersonId);
            }
        };
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        saveMember();
    };

    zoomInBtn.onclick = () => {
        currentZoom = Math.min(currentZoom + 0.1, 3);
        applyTransform();
    };

    zoomOutBtn.onclick = () => {
        currentZoom = Math.max(currentZoom - 0.1, 0.3);
        applyTransform();
    };

    fullscreenBtn.onclick = () => {
        const elem = document.body;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    };

    if (bloodlineFilterBtn) {
        bloodlineFilterBtn.onclick = () => {
            bloodlineOnlyFilterEnabled = !bloodlineOnlyFilterEnabled;
            bloodlineFilterBtn.classList.toggle('is-active', bloodlineOnlyFilterEnabled);
            currentSearchQuery = '';
            filterTree(currentSearchQuery);
        };
    }

    [modeDiscreetBtn, modeFilledBtn, modeQuizBtn].forEach(btn => {
        if (!btn) return;
        btn.onclick = () => setViewMode(btn.dataset.mode);
    });

    // Refresh photos button
    if (refreshPhotosBtn) {
        refreshPhotosBtn.onclick = () => {
            refreshPhotos();
        };
    }

    galleryPrevBtn.onclick = () => {
        const gallery = document.getElementById('photoGallery');
        gallery.scrollBy({ left: -200, behavior: 'smooth' });
    };

    galleryNextBtn.onclick = () => {
        const gallery = document.getElementById('photoGallery');
        gallery.scrollBy({ left: 200, behavior: 'smooth' });
    };

    // Dark mode toggle
    if (darkModeBtn) {
        darkModeBtn.onclick = () => {
            toggleDarkMode();
        };
    }

    // Stats modal
    if (statsBtn) {
        statsBtn.onclick = () => {
            openStatsModal();
        };
    }

    if (statsCloseBtn) {
        statsCloseBtn.onclick = () => {
            closeStatsModal();
        };
    }

    if (statsModal) {
        statsModal.onclick = (e) => {
            if (e.target === statsModal) {
                closeStatsModal();
            }
        };
    }

    // Export functionality
    if (exportBtn) {
        exportBtn.onclick = (e) => {
            e.stopPropagation();
            exportMenu.classList.toggle('active');
        };
    }

    if (exportJsonBtn) {
        exportJsonBtn.onclick = () => {
            exportToJson();
            exportMenu.classList.remove('active');
        };
    }

    if (printBtn) {
        printBtn.onclick = () => {
            window.print();
            exportMenu.classList.remove('active');
        };
    }

    if (quizCheckBtn) {
        quizCheckBtn.onclick = () => {
            evaluateQuizAnswers();
        };
    }

    // Close export menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#exportBtn') && !e.target.closest('#exportMenu')) {
            exportMenu.classList.remove('active');
        }
    });

    // Redraw lines on window resize
    window.addEventListener('resize', () => {
        setTimeout(drawConnectionLines, 100);
    });

    // Pan and Zoom handlers
    setupPanAndZoom();
}

function setupPanAndZoom() {
    const treeWrapper = document.getElementById('treeWrapper');
    const treeContainer = document.getElementById('treeContainer');
    const clampZoom = (value) => Math.max(0.3, Math.min(3, value));
    const shouldIgnorePanStart = (target) => (
        target.closest('.person-card') ||
        target.closest('.control-btn') ||
        target.closest('#profileSidebar') ||
        target.closest('.profile-sidebar')
    );

    const getTouchDistance = (e) => {
        if (e.touches.length < 2) return 0;
        const [a, b] = [e.touches[0], e.touches[1]];
        return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    };

    const getTouchMidpoint = (e) => {
        if (e.touches.length < 2) return { x: 0, y: 0 };
        const [a, b] = [e.touches[0], e.touches[1]];
        return {
            x: (a.clientX + b.clientX) / 2,
            y: (a.clientY + b.clientY) / 2
        };
    };

    // Pan handlers
    treeWrapper.addEventListener('mousedown', (e) => {
        // Don't start panning if clicking on a person card or its children
        if (shouldIgnorePanStart(e.target)) {
            return;
        }

        // Only start panning with left mouse button
        if (e.button === 0) {
            isPanning = true;
            treeWrapper.classList.add('panning');
            lastPanPoint.x = e.clientX;
            lastPanPoint.y = e.clientY;
            e.preventDefault();
        }
    });

    treeWrapper.addEventListener('mousemove', (e) => {
        if (isPanning) {
            const deltaX = e.clientX - lastPanPoint.x;
            const deltaY = e.clientY - lastPanPoint.y;

            panX += deltaX;
            panY += deltaY;

            lastPanPoint.x = e.clientX;
            lastPanPoint.y = e.clientY;

            applyTransform();
        }
    });

    treeWrapper.addEventListener('mouseup', (e) => {
        if (isPanning) {
            isPanning = false;
            treeWrapper.classList.remove('panning');
        }
    });

    treeWrapper.addEventListener('mouseleave', () => {
        if (isPanning) {
            isPanning = false;
            treeWrapper.classList.remove('panning');
        }
    });

    // Mouse wheel zoom
    treeWrapper.addEventListener('wheel', (e) => {
        // Don't zoom if scrolling over a person card
        if (e.target.closest('.person-card')) {
            return;
        }

        e.preventDefault();

        const rect = treeWrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.3, Math.min(3, currentZoom * zoomFactor));

        // Calculate zoom point in container coordinates
        const zoomPointX = (mouseX - panX) / currentZoom;
        const zoomPointY = (mouseY - panY) / currentZoom;

        // Adjust pan to zoom towards mouse cursor
        panX = mouseX - zoomPointX * newZoom;
        panY = mouseY - zoomPointY * newZoom;

        currentZoom = clampZoom(newZoom);
        applyTransform();
    });

    // Touch support for pan + pinch zoom
    treeWrapper.addEventListener('touchstart', (e) => {
        if (shouldIgnorePanStart(e.target)) return;

        if (e.touches.length === 1) {
            isPanning = true;
            treeWrapper.classList.add('panning');
            lastPanPoint.x = e.touches[0].clientX;
            lastPanPoint.y = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            isPinching = true;
            pinchStartDistance = getTouchDistance(e);
            pinchStartZoom = currentZoom;
            pinchStartMidpoint = getTouchMidpoint(e);
        }
    }, { passive: false });

    const handleTouchMove = (e) => {
        // Pinch to zoom
        if (isPinching && e.touches.length >= 2) {
            e.preventDefault();
            const newDistance = getTouchDistance(e);
            if (pinchStartDistance > 0) {
                const scale = newDistance / pinchStartDistance;
                const newZoom = clampZoom(pinchStartZoom * scale);

                const rect = treeWrapper.getBoundingClientRect();
                const pinchPoint = {
                    x: pinchStartMidpoint.x - rect.left,
                    y: pinchStartMidpoint.y - rect.top
                };
                const zoomPointX = (pinchPoint.x - panX) / currentZoom;
                const zoomPointY = (pinchPoint.y - panY) / currentZoom;

                panX = pinchPoint.x - zoomPointX * newZoom;
                panY = pinchPoint.y - zoomPointY * newZoom;

                currentZoom = newZoom;
                applyTransform();
            }
            return;
        }

        // One-finger pan
        if (isPanning && e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - lastPanPoint.x;
            const deltaY = touch.clientY - lastPanPoint.y;

            panX += deltaX;
            panY += deltaY;

            lastPanPoint.x = touch.clientX;
            lastPanPoint.y = touch.clientY;

            applyTransform();
        }
    };

    treeWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });

    const handleTouchEnd = (e) => {
        if (e.touches.length === 0) {
            isPanning = false;
            treeWrapper.classList.remove('panning');
        }
        if (e.touches.length < 2) {
            isPinching = false;
            pinchStartDistance = 0;
        }
    };

    treeWrapper.addEventListener('touchend', handleTouchEnd);
    treeWrapper.addEventListener('touchcancel', handleTouchEnd);
}

function applyTransform() {
    const treeContainer = document.getElementById('treeContainer');
    treeContainer.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
    treeContainer.style.transformOrigin = '0 0';
    setTimeout(drawConnectionLines, 100);
}

function filterTree(query) {
    const cards = document.querySelectorAll('.person-card');
    cards.forEach(card => {
        const name = card.querySelector('.person-name').textContent.toLowerCase();
        const isBloodline = card.dataset.isBloodline === '1';

        const matchesSearch = name.includes(query) || query === '';
        const matchesBloodline = !bloodlineOnlyFilterEnabled || isBloodline;

        if (matchesSearch && matchesBloodline) {
            card.style.opacity = '1';
            card.classList.remove('dimmed-by-filter');
        } else {
            // Keep layout stable; just dim cards that are filtered out.
            card.style.opacity = matchesSearch ? '0.15' : '0.3';
            card.classList.add('dimmed-by-filter');
        }
    });
}

function applyModeButtonState() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        const mode = btn.dataset.mode;
        btn.classList.toggle('is-active', mode === currentViewMode);
    });
}

function setViewMode(mode, options = {}) {
    if (!Object.values(VIEW_MODES).includes(mode)) return;
    currentViewMode = mode;
    applyModeButtonState();
    updateQuizButtonVisibility();
    if (mode !== VIEW_MODES.QUIZ) {
        resetQuizState();
    } else {
        // Fresh quiz session whenever entering quiz mode
        resetQuizState();
    }
    
    // Hide/show gallery section based on mode
    const gallerySection = document.querySelector('.photo-gallery');
    const mainWrapper = document.querySelector('.main-content-wrapper');
    if (gallerySection) {
        gallerySection.classList.toggle('mode-discreet', mode === VIEW_MODES.DISCREET);
    }
    if (mainWrapper) {
        mainWrapper.classList.toggle('mode-discreet', mode === VIEW_MODES.DISCREET);
    }
    
    renderTree();
    renderPhotoGallery();

    if (!options.silent) {
        const messageMap = {
            [VIEW_MODES.DISCREET]: 'Discreet mode: photos hidden from tree and gallery.',
            [VIEW_MODES.FILLED]: 'Filled mode: photos displayed on tree and gallery.',
            [VIEW_MODES.QUIZ]: 'Quiz mode: tree photos hidden and gallery shuffled.'
        };
        showToast(messageMap[mode] || `Switched to ${mode} mode`, 'info');
    }
}

// Get all people as flat array
function getAllPeople() {
    const people = [];
    familyData.generations.forEach(gen => {
        gen.couples.forEach(couple => {
            couple.people.forEach(person => {
                people.push(person);
            });
        });
    });
    return people;
}

// Find person by ID
function findPersonById(id) {
    const allPeople = getAllPeople();
    return allPeople.find(p => p.id === id);
}

// Find the couple that a person belongs to
function findCoupleForPerson(personId) {
    for (const generation of familyData.generations) {
        for (const couple of generation.couples) {
            if (couple.people.some(p => p.id === personId)) {
                return couple;
            }
        }
    }
    return null;
}

// Find generation index and couple index for a person
function findGenerationAndCoupleIndex(personId) {
    for (let genIndex = 0; genIndex < familyData.generations.length; genIndex++) {
        const generation = familyData.generations[genIndex];
        for (let coupleIndex = 0; coupleIndex < generation.couples.length; coupleIndex++) {
            const couple = generation.couples[coupleIndex];
            if (couple.people.some(p => p.id === personId)) {
                return { genIndex, coupleIndex, couple };
            }
        }
    }
    return null;
}

// Find parents of a person (the couple that has this person as a child)
function findParentsOfPerson(personId) {
    for (const generation of familyData.generations) {
        for (const couple of generation.couples) {
            if (couple.children && couple.children.includes(personId)) {
                return couple.people;
            }
        }
    }
    return [];
}

// Get children of a person
function getChildrenOfPerson(personId) {
    const couple = findCoupleForPerson(personId);
    if (!couple || !couple.children) {
        return [];
    }
    return couple.children.map(childId => findPersonById(childId)).filter(p => p !== undefined);
}

// Get grandchildren of a person (children of children)
function getGrandchildrenOfPerson(personId) {
    const children = getChildrenOfPerson(personId);
    const grandchildren = [];
    children.forEach(child => {
        if (child) {
            const childsChildren = getChildrenOfPerson(child.id);
            grandchildren.push(...childsChildren);
        }
    });
    return grandchildren;
}

// Count sons and daughters for a person
function countChildrenByGender(personId) {
    const couple = findCoupleForPerson(personId);
    if (!couple || !couple.children || couple.children.length === 0) {
        return { sons: 0, daughters: 0 };
    }
    
    let sons = 0;
    let daughters = 0;
    
    couple.children.forEach(childId => {
        const child = findPersonById(childId);
        if (child) {
            if (child.gender === 'male') {
                sons++;
            } else if (child.gender === 'female') {
                daughters++;
            }
        }
    });
    
    return { sons, daughters };
}

// Render Tree
function renderTree() {
    const treeContainer = document.getElementById('familyTree');
    bloodlineIdSet = computeBloodlineIdSet();
    const allCouples = [];
    familyData.generations.forEach((generation, genIndex) => {
        generation.couples.forEach((couple, coupleIndex) => {
            allCouples.push({ genIndex, coupleIndex, couple, key: getCoupleKey(genIndex, coupleIndex) });
        });
    });

    // Roots = any couple that is not referenced as a child-couple of another couple
    const referencedKeys = new Set();
    allCouples.forEach(({ couple }) => {
        getChildCoupleLocations(couple).forEach(loc => referencedKeys.add(loc.key));
    });

    const roots = allCouples.filter(c => !referencedKeys.has(c.key));
    const html = roots.map(renderCoupleSubtree).join('');

    treeContainer.innerHTML = html;
    
    // Add click handlers and drop zones
    setTimeout(() => {
        document.querySelectorAll('.person-card').forEach(card => {
            const personId = parseInt(card.dataset.personId);
            
            // Click on photo or placeholder opens profile
            const photo = card.querySelector('.person-photo');
            const placeholder = card.querySelector('.person-placeholder');
            
            if (photo) {
                photo.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openProfileSidebar(personId);
                });
                
                // Add drop zone to photo
                setupDropZone(photo, personId);
            }
            
            if (placeholder) {
                placeholder.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openProfileSidebar(personId);
                });
                
                // Add drop zone to placeholder
                setupDropZone(placeholder, personId);
            }
            
            // Add drop zone to the entire card as a fallback (important for quiz mode)
            setupDropZone(card, personId);
            
            // Click on card (but not edit button) opens profile sidebar
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.edit-btn')) {
                    openProfileSidebar(personId);
                }
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const personId = parseInt(this.closest('.person-card').dataset.personId);
                editPerson(personId);
            });
        });
        
        drawConnectionLines();
        // Re-apply current filters after re-render (tree is rebuilt).
        if (currentSearchQuery || bloodlineOnlyFilterEnabled) {
            filterTree(currentSearchQuery);
        }
    }, 100);
}

function getCoupleKey(genIndex, coupleIndex) {
    return `${genIndex}-${coupleIndex}`;
}

function getChildCoupleLocations(couple) {
    const seen = new Set();
    const locations = [];
    const children = couple?.children || [];

    children.forEach(childId => {
        const loc = findGenerationAndCoupleIndex(childId);
        if (!loc) return;
        const key = getCoupleKey(loc.genIndex, loc.coupleIndex);
        if (seen.has(key)) return;
        seen.add(key);
        locations.push({ genIndex: loc.genIndex, coupleIndex: loc.coupleIndex, couple: loc.couple, key });
    });

    return locations;
}

function renderCoupleSubtree(location) {
    const { genIndex, coupleIndex, couple } = location;
    const key = location.key || getCoupleKey(genIndex, coupleIndex);

    let html = `<div class="org-tree">`;

    html += `<div class="org-node" data-couple-key="${key}" data-gen-index="${genIndex}">`;
    html += `<div class="couple-container">`;
    couple.people.forEach(person => {
        html += renderPersonCard(person);
    });
    html += `</div>`;
    html += `</div>`;

    const childLocations = getChildCoupleLocations(couple);
    if (childLocations.length > 0) {
        html += `<div class="org-children">`;
        html += childLocations.map(renderCoupleSubtree).join('');
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

// Generate initials from name
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Get generation class for person
function getGenerationClass(personId) {
    for (let genIndex = 0; genIndex < familyData.generations.length; genIndex++) {
        const generation = familyData.generations[genIndex];
        for (const couple of generation.couples) {
            if (couple.people.some(p => p.id === personId)) {
                return `generation-${genIndex + 1}`;
            }
        }
    }
    return 'generation-1';
}

function getRelationshipLabel(status) {
    switch (status) {
        case 'bf_gf':
            return 'BF/GF';
        case 'married':
            return 'Married';
        case 'dating':
            return 'Dating';
        default:
            return 'Single';
    }
}

function shouldShowPhotoOnTree(person) {
    if (!person) return false;
    // In quiz mode, show the guessed photo (if any)
    if (currentViewMode === VIEW_MODES.QUIZ) {
        return !!quizAssignments[person.id];
    }
    // In filled mode, show stored photo
    return currentViewMode === VIEW_MODES.FILLED && !!person.photo;
}

function renderPersonCard(person) {
    const initials = getInitials(person.name);
    const generationClass = getGenerationClass(person.id);
    const genderClass = person.gender || 'male';
    const relationshipStatus = getEffectiveRelationshipStatus(person);
    const relationshipLabel = getRelationshipLabel(relationshipStatus);
    const showRelationshipPill = relationshipStatus === 'married' || relationshipStatus === 'dating' || relationshipStatus === 'bf_gf';
    const genderIcon = person.gender === 'female' ? 'fa-venus' : 'fa-mars';
    const genderBadge = `
        <div class="gender-badge ${genderClass}" title="${person.gender === 'female' ? 'Female' : 'Male'}">
            <i class="fas ${genderIcon}"></i>
        </div>
    `;
    const passedOnBadge = person.passedOn 
        ? `<div class="passed-on-indicator" title="Passed on"><i class="fas fa-dove"></i></div>` 
        : '';

    const isBloodline = bloodlineIdSet.has(person.id);
    const bloodlineBadge = isBloodline
        ? `<div class="bloodline-badge" title="Main bloodline (Soon)"><span>孙</span></div>`
        : '';
    
    const quizGuessPhoto = quizAssignments[person.id];
    const showPhoto = shouldShowPhotoOnTree(person);
    const photoSrc = currentViewMode === VIEW_MODES.QUIZ ? quizGuessPhoto : person.photo;
    const photoHtml = showPhoto && photoSrc
        ? `<img src="${photoSrc}" alt="${person.name}" class="person-photo">`
        : `<div class="person-placeholder ${genderClass} ${generationClass}">${initials}</div>`;
    
    // Count children
    const childCounts = countChildrenByGender(person.id);
    const name = person.name.toLowerCase().trim();
    const isGpa = name === 'gpa';
    const isGma = name === 'gma';
    
    // Generate dots based on gender and name
    let genderDotsHtml = '<div class="gender-indicators">';
    let dotCount = 0;
    let dotClass = '';
    
    if (isGpa) {
        // Gpa only shows blue dots for sons
        dotCount = childCounts.sons;
        dotClass = 'son-dot';
    } else if (isGma) {
        // Gma only shows pink dots for daughters
        dotCount = childCounts.daughters;
        dotClass = 'daughter-dot';
    } else if (person.gender === 'male') {
        // Males show blue dots for sons
        dotCount = childCounts.sons;
        dotClass = 'son-dot';
    } else {
        // Females show pink dots for daughters
        dotCount = childCounts.daughters;
        dotClass = 'daughter-dot';
    }
    
    // Generate dots
    for (let i = 0; i < dotCount; i++) {
        genderDotsHtml += `<span class="gender-dot ${dotClass}"></span>`;
    }
    
    genderDotsHtml += '</div>';
    
    // Calculate age from birthday if available, otherwise use stored age
    let age = person.age;
    let birthdayDisplay = '';
    if (person.birthday) {
        const calculatedAge = calculateAgeFromBirthday(person.birthday);
        if (calculatedAge !== null) {
            age = calculatedAge;
        }
        birthdayDisplay = person.birthday;
    } else if (!age && person.birthDate) {
        const formattedBirthday = formatBirthdayToDDMMYYYY(person.birthDate);
        const calculatedAge = calculateAgeFromBirthday(formattedBirthday);
        if (calculatedAge !== null) {
            age = calculatedAge;
        }
        birthdayDisplay = formattedBirthday;
    }
    
    // Format birthday and age display
    let ageDisplay = '';
    if (age) {
        ageDisplay = `${age} years`;
    }
    
    // Quiz status badge
    const hasQuizResult = currentViewMode === VIEW_MODES.QUIZ && (person.id in quizResults);
    const quizStatus = hasQuizResult
        ? `<div class="quiz-status ${quizResults[person.id] ? 'quiz-correct' : 'quiz-wrong'}">
                <i class="fas ${quizResults[person.id] ? 'fa-check' : 'fa-times'}"></i>
           </div>`
        : '';

    return `
        <div class="person-card" data-person-id="${person.id}" data-is-bloodline="${isBloodline ? '1' : '0'}">
            ${passedOnBadge}
            ${genderBadge}
            ${bloodlineBadge}
            ${quizStatus}
            <button class="edit-btn"><i class="fas fa-pencil-alt"></i></button>
            ${photoHtml}
            <div class="person-name">${person.name}</div>
            ${showRelationshipPill ? `<div class="relationship-pill ${relationshipStatus}">${relationshipLabel}</div>` : ''}
            ${ageDisplay ? `<div class="person-age">${ageDisplay}</div>` : ''}
            ${birthdayDisplay ? `<div class="person-birthday"><i class="fas fa-birthday-cake"></i>${birthdayDisplay}</div>` : ''}
            ${genderDotsHtml}
        </div>
    `;
}

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${iconMap[type] || iconMap.info} toast-icon"></i>
        <div class="toast-message">${message}</div>
        <i class="fas fa-times toast-close"></i>
    `;
    
    container.appendChild(toast);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.onclick = () => removeToast(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => removeToast(toast), 5000);
}

function removeToast(toast) {
    toast.classList.add('removing');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    const icon = document.querySelector('#darkModeBtn i');
    if (isDarkMode) {
        icon.className = 'fas fa-sun';
        showToast('Dark mode enabled', 'success');
    } else {
        icon.className = 'fas fa-moon';
        showToast('Light mode enabled', 'success');
    }
}

function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#darkModeBtn i');
        if (icon) {
            icon.className = 'fas fa-sun';
        }
    }
}

// Statistics Modal
function openStatsModal() {
    const modal = document.getElementById('statsModal');
    modal.classList.add('active');
    generateStats();
}

function closeStatsModal() {
    const modal = document.getElementById('statsModal');
    modal.classList.remove('active');
}

function generateStats() {
    const allPeople = getAllPeople();
    const bloodlineSet = computeBloodlineIdSet();
    const totalMembers = allPeople.length;
    
    // Count by gender
    const males = allPeople.filter(p => p.gender === 'male').length;
    const females = allPeople.filter(p => p.gender === 'female').length;
    const bloodlineMembers = allPeople.filter(p => bloodlineSet.has(p.id)).length;
    
    // Calculate average age
    const peopleWithAge = allPeople.filter(p => p.age);
    const avgAge = peopleWithAge.length > 0 
        ? Math.round(peopleWithAge.reduce((sum, p) => sum + p.age, 0) / peopleWithAge.length)
        : 0;
    
    // Count marriages (couples)
    let marriages = 0;
    familyData.generations.forEach(gen => {
        gen.couples.forEach(couple => {
            if (couple.people.length === 2) {
                marriages++;
            }
        });
    });
    
    // Count children
    let totalChildren = 0;
    familyData.generations.forEach(gen => {
        gen.couples.forEach(couple => {
            if (couple.children) {
                totalChildren += couple.children.length;
            }
        });
    });
    
    // Generate stats cards
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-users"></i></div>
            <div class="stat-value">${totalMembers}</div>
            <div class="stat-label">Total Members</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-seedling"></i></div>
            <div class="stat-value">${bloodlineMembers}</div>
            <div class="stat-label">Main Bloodline</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-male"></i></div>
            <div class="stat-value">${males}</div>
            <div class="stat-label">Males</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-female"></i></div>
            <div class="stat-value">${females}</div>
            <div class="stat-label">Females</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-birthday-cake"></i></div>
            <div class="stat-value">${avgAge}</div>
            <div class="stat-label">Average Age</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-heart"></i></div>
            <div class="stat-value">${marriages}</div>
            <div class="stat-label">Marriages</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-baby"></i></div>
            <div class="stat-value">${totalChildren}</div>
            <div class="stat-label">Children</div>
        </div>
    `;
    
    // Generate generation breakdown
    const generationStats = document.getElementById('generationStats');
    let genHtml = '';
    familyData.generations.forEach((gen, index) => {
        const genPeople = [];
        gen.couples.forEach(couple => {
            genPeople.push(...couple.people);
        });
        genHtml += `
            <div class="generation-stat-item">
                <div class="generation-stat-label">${getGenerationLabel(index)} Generation</div>
                <div class="generation-stat-value">${genPeople.length} members</div>
            </div>
        `;
    });
    generationStats.innerHTML = genHtml;
}

function getGenerationLabel(index) {
    const labels = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
    return labels[index] || `${index + 1}th`;
}

// Export to JSON
function exportToJson() {
    const dataStr = JSON.stringify(familyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'family-tree-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Family tree data exported successfully!', 'success');
}

// Refresh Photos - Remove all photos from tree
function refreshPhotos() {
    const allPeople = getAllPeople();
    let removedCount = 0;
    
    allPeople.forEach(person => {
        if (person.photo) {
            person.photo = null;
            removedCount++;
        }
    });
    
    saveData();
    renderTree();
    renderPhotoGallery();
    
    if (selectedPersonId) {
        setTimeout(() => openProfileSidebar(selectedPersonId), 100);
    }
    
    showToast(`Removed ${removedCount} photo(s) from the tree`, 'success');
}

function highlightPerson(personId) {
    document.querySelectorAll('.person-card').forEach(card => {
        card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    });
    
    const card = document.querySelector(`[data-person-id="${personId}"]`);
    if (card) {
        card.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// List of all photos from Family pics folder
const NAME_MATCH_OVERRIDES = {
    adelia: 'adeliah',
    natania: 'nataniah',
    emmanuel: 'emmanual',
    vivian: 'vivien',
    yvvettetan: 'yvette',
    lynettetan: 'lynnette',
    ly: 'leongying',
    ashleysoon: 'ashley',
    austinsoon: 'austin',
    marksoon: 'mark',
    marissaneo: 'marissa',
    martinneo: 'martin',
    shannayan: 'shanna',
    vanessasoon: 'vanessa',
    rogerneo: 'roger',
    priscillasoon: 'priscilla',
    david3: 'david'
};

function normalizeNameForMatch(value) {
    if (!value) return '';
    const normalized = value
        .toLowerCase()
        .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
        .replace(/[^a-z0-9]/g, '');
    return NAME_MATCH_OVERRIDES[normalized] || normalized;
}

// Return people in the current tree order (roots → leaves) so the gallery can mirror the branch layout.
function getTreeOrderedPeople() {
    const allCouples = [];
    familyData.generations.forEach((generation, genIndex) => {
        generation.couples.forEach((couple, coupleIndex) => {
            allCouples.push({ genIndex, coupleIndex, couple, key: getCoupleKey(genIndex, coupleIndex) });
        });
    });

    const referencedKeys = new Set();
    allCouples.forEach(({ couple }) => {
        getChildCoupleLocations(couple).forEach(loc => referencedKeys.add(loc.key));
    });

    const roots = allCouples.filter(c => !referencedKeys.has(c.key));
    const orderedPeople = [];
    const visited = new Set();

    function traverse(location) {
        const { couple } = location;
        couple.people.forEach(person => {
            if (!visited.has(person.id)) {
                orderedPeople.push(person);
                visited.add(person.id);
            }
        });
        const childLocations = getChildCoupleLocations(couple);
        childLocations.forEach(traverse);
    }

    roots.forEach(traverse);
    return orderedPeople;
}

function buildPhotoLookup() {
    const map = new Map();
    FAMILY_PHOTO_FILES.forEach(fileName => {
        const normalizedName = normalizeNameForMatch(fileName);
        if (!normalizedName) return;
        const encodedName = encodeURIComponent(fileName);
        map.set(normalizedName, `Family%20pics/${encodedName}`);
    });
    return map;
}

// Auto-assign any missing photos by matching names to files in the folder.
function assignPhotosFromFolder() {
    const photoLookup = buildPhotoLookup();
    let assignedCount = 0;

    getAllPeople().forEach(person => {
        if (person.photo) return;
        const key = normalizeNameForMatch(person.name);
        if (!key) return;
        const match = photoLookup.get(key);
        if (match) {
            person.photo = match;
            assignedCount++;
        }
    });

    if (assignedCount > 0) {
        saveData();
    }

    return assignedCount;
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// List of all photos from Family pics folder (kept in sync with the folder contents)
const FAMILY_PHOTO_FILES = [
    'Adelia.jpg',
    'Ah Huat.jpg',
    'Alston.jpg',
    'Alvin33.jpg',
    'Ashley soon.jpg',
    'Austin Soon.jpg',
    'Baby.jpg',
    'Ben.jpg',
    'Bryan.jpg',
    'Bryle.jpg',
    'Calvin.jpg',
    'Charles 2nd son.jpg',
    'Charles son.jpg',
    'Charles.jpg',
    'Cheuy Mei.jpg',
    'Chris.jpg',
    'Clement.jpg',
    'Da E E.jpg',
    'Daphene.jpg',
    'Darren soon.jpg',
    'David 3.jpg',
    'David Soon.jpg',
    'Denise Soon.jpg',
    'Dennis.jpg',
    'Edwin.jpg',
    'Emeliah.jpg',
    'Emmanuel.jpg',
    'Gabriel.jpg',
    'Grace.jpg',
    'Hailey.jpg',
    'Helen.jpg',
    'Irene.jpg',
    'Jezzrie.jpg',
    'Jing Jie.jpg',
    'Joey.jpg',
    'Jonathan.jpg',
    'Jovan.jpg',
    'Joyce.jpg',
    'Julia.jpg',
    'Keegan.jpg',
    'Kenzie.jpg',
    'Leslie.jpg',
    'Lian Tee.jpg',
    'Lisa.jpg',
    'LY.jpg',
    'Lynette Tan.jpg',
    'Mah Chye.jpg',
    'Mah Kok.jpg',
    'Maia.jpg',
    'Marcus.jpg',
    'Marissa Neo.jpg',
    'Mark Soon.jpg',
    'Martin Neo.jpg',
    'May Soon.jpg',
    'Michelle Tan.jpg',
    'Natania.jpg',
    'Nick.jpg',
    'Noah.jpg',
    'Paul Soon.jpg',
    'Peter Soon.jpg',
    'Priscilla Soon.jpg',
    'Qi QI.jpg',
    'Rachel.jpg',
    'Rinnah.jpg',
    'Roger Neo.jpg',
    'sakim.jpg',
    'Sally.jpg',
    'Samuel.jpg',
    'Sarah Tan.jpg',
    'Shaniah.jpg',
    'Shanna Yan.jpg',
    'Sharon Gan.jpg',
    'Sharon.jpg',
    'Shermaine.jpg',
    'Sherry.jpg',
    'Soon Thian Poot.jpg',
    'Steffi.jpg',
    'Susan.jpg',
    'Thiam Pong.jpg',
    'Ting Ting.jpg',
    'Trixie.jpg',
    'Twa kim.jpg',
    'Uncle John.jpg',
    'Vanessa Soon.jpg',
    'Vivian.jpg',
    'Wai Sin.jpg',
    'Yuan Zhang.jpg',
    'yvvette Tan.jpg'
];

// Render Photo Gallery
function renderPhotoGallery() {
    const gallery = document.getElementById('photoGallery');
    
    if (currentViewMode === VIEW_MODES.DISCREET) {
        gallery.innerHTML = '';
        return;
    }
    
    // Get all currently used photos (normalize to filename to catch encoded/unencoded)
    const allPeople = getAllPeople();
    const usedPhotoNames = new Set();
    allPeople.forEach(person => {
        if (!person.photo) return;
        const parts = person.photo.split('/');
        const filename = parts[parts.length - 1];
        if (filename) {
            usedPhotoNames.add(normalizeNameForMatch(decodeURIComponent(filename)));
        }
    });
    
    // Order gallery by the same branch order shown in the tree for quick matching
    const treeOrder = getTreeOrderedPeople().map(p => normalizeNameForMatch(p.name));
    const treeOrderIndex = new Map();
    treeOrder.forEach((name, idx) => {
        if (!treeOrderIndex.has(name)) {
            treeOrderIndex.set(name, idx);
        }
    });

    const photoEntries = FAMILY_PHOTO_FILES.map(fileName => {
        const normalizedName = normalizeNameForMatch(fileName);
        const treeIndex = treeOrderIndex.has(normalizedName)
            ? treeOrderIndex.get(normalizedName)
            : Number.MAX_SAFE_INTEGER;
        return { fileName, normalizedName, treeIndex };
    });

    if (currentViewMode === VIEW_MODES.QUIZ) {
        // Shuffle completely for quiz mode
        photoEntries.splice(0, photoEntries.length, ...shuffleArray(photoEntries));
    } else {
        // Sort so photos follow the displayed tree order; unmatched files are grouped alphabetically at the end
        photoEntries.sort((a, b) => {
            if (a.treeIndex !== b.treeIndex) return a.treeIndex - b.treeIndex;
            return a.normalizedName.localeCompare(b.normalizedName);
        });
    }

    const knownPhotoNames = new Set(photoEntries.map(p => p.normalizedName));
    let html = '';
    
    // Add all photos from Family pics folder
    photoEntries.forEach(({ fileName, normalizedName }) => {
        // Use the encoded folder path so it matches stored person.photo values
        const encodedName = encodeURIComponent(fileName);
        const photoPath = `Family%20pics/${encodedName}`;
        const isUsed = currentViewMode !== VIEW_MODES.QUIZ && usedPhotoNames.has(normalizedName);
        const usedClass = isUsed ? ' photo-used' : '';
        html += `
            <img src="${photoPath}" 
                 alt="${fileName.replace('.jpg', '')}" 
                 class="gallery-photo draggable-photo${usedClass}" 
                 draggable="true"
                 data-photo-path="${photoPath}">
        `;
    });
    
    // Also add photos that are already assigned to people (if any)
    allPeople.forEach(person => {
        if (!person.photo) return;
        const parts = person.photo.split('/');
        const filename = parts[parts.length - 1] || '';
        const normalizedName = normalizeNameForMatch(decodeURIComponent(filename));
        if (knownPhotoNames.has(normalizedName)) return;
        
        const isUsed = currentViewMode !== VIEW_MODES.QUIZ && usedPhotoNames.has(normalizedName);
        const usedClass = isUsed ? ' photo-used' : '';
        html += `
            <img src="${person.photo}" 
                 alt="${person.name}" 
                 class="gallery-photo${usedClass}" 
                 data-person-id="${person.id}"
                 onclick="openProfileSidebar(${person.id})">
        `;
    });
    
    gallery.innerHTML = html;
    
    // Setup drag event listeners for gallery photos
    setupPhotoDragAndDrop();
}

// Setup drag and drop for gallery photos
function setupPhotoDragAndDrop() {
    document.querySelectorAll('.draggable-photo').forEach(photo => {
        photo.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.photoPath);
            e.dataTransfer.effectAllowed = 'copy';
            this.style.opacity = '0.5';
        });
        
        photo.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
        });
    });
}

// Setup drop zone for a photo element (person card photo or profile photo)
function setupDropZone(element, personId) {
    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.classList.add('drag-over');
    });
    
    element.addEventListener('dragleave', function(e) {
        this.classList.remove('drag-over');
    });
    
    element.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const photoPath = e.dataTransfer.getData('text/plain');
        if (photoPath) {
            handlePhotoDrop(personId, photoPath);
        }
    });
}

// Handle photo drop on a person
function handlePhotoDrop(personId, photoPath) {
    const person = findPersonById(personId);
    if (!person) return;

    if (currentViewMode === VIEW_MODES.QUIZ) {
        // Do not persist; store guess in-memory
        quizAssignments[personId] = photoPath;
        // Clear prior result for this person (they're trying again)
        if (quizResults[personId] !== undefined) {
            delete quizResults[personId];
        }
        renderTree();
        renderPhotoGallery();
        showToast(`Guess saved for ${person.name}.`, 'info');
        return;
    }
    
    // Update person's photo (normal modes)
    person.photo = photoPath;
    
    // Save data
    saveData();
    
    // Re-render tree and gallery
    renderTree();
    renderPhotoGallery();
    
    // Update profile sidebar if it's open for this person
    if (selectedPersonId === personId) {
        setTimeout(() => openProfileSidebar(personId), 100);
    }
    
    showToast(`Photo assigned to ${person.name}!`, 'success');
}

// Draw Connection Lines
function drawConnectionLines() {
    const svg = document.getElementById('connectionLines');
    const treeContainer = document.getElementById('treeContainer');
    const treeElement = document.getElementById('familyTree');
    
    // Clear existing lines
    svg.innerHTML = '';
    
    // Get container dimensions (post-transform) for coordinate conversion
    const containerRect = treeContainer.getBoundingClientRect();

    // Size SVG to the *untransformed* content size so connectors exist everywhere
    // (org chart can be wider/taller than the viewport).
    const originalWidth = Math.max(treeElement.scrollWidth, treeElement.offsetWidth);
    const originalHeight = Math.max(treeElement.scrollHeight, treeElement.offsetHeight);
    
    // Set SVG size to match container size
    svg.setAttribute('width', originalWidth);
    svg.setAttribute('height', originalHeight);
    svg.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`);
    
    // Helper function to get element position relative to SVG coordinate space
    function getCardPosition(card) {
        const cardRect = card.getBoundingClientRect();
        const x = (cardRect.left - containerRect.left) / currentZoom;
        const y = (cardRect.top - containerRect.top) / currentZoom;
        const width = cardRect.width / currentZoom;
        const height = cardRect.height / currentZoom;
        
        return {
            centerX: x + width / 2,
            centerY: y + height / 2,
            topY: y,
            bottomY: y + height,
            leftX: x,
            rightX: x + width,
            width: width,
            height: height
        };
    }
    
    function getNodeMetrics(nodeEl) {
        const cards = Array.from(nodeEl.querySelectorAll('.person-card'));
        if (cards.length === 0) return null;
        const positions = cards.map(getCardPosition);

        const midX = positions.reduce((sum, p) => sum + p.centerX, 0) / positions.length;
        const topY = Math.min(...positions.map(p => p.topY));
        const bottomY = Math.max(...positions.map(p => p.bottomY));

        return { cards, positions, midX, topY, bottomY };
    }

    // Draw spouse connectors (between the two people in a couple)
    document.querySelectorAll('.org-node').forEach(nodeEl => {
        const metrics = getNodeMetrics(nodeEl);
        if (!metrics || metrics.positions.length !== 2) return;

        const [a, b] = metrics.positions;
        const left = a.centerX <= b.centerX ? a : b;
        const right = a.centerX <= b.centerX ? b : a;
        const y = (left.centerY + right.centerY) / 2;
        drawStraightLine(svg, left.rightX, y, right.leftX, y);
    });

    // Draw parent -> children connectors (org chart style)
    familyData.generations.forEach((generation, genIndex) => {
        generation.couples.forEach((couple, coupleIndex) => {
            const parentKey = getCoupleKey(genIndex, coupleIndex);
            const parentNode = document.querySelector(`.org-node[data-couple-key="${parentKey}"]`);
            if (!parentNode) return;

            const childLocations = getChildCoupleLocations(couple);
            if (!childLocations || childLocations.length === 0) return;

            const parentMetrics = getNodeMetrics(parentNode);
            if (!parentMetrics) return;

            const childMetrics = childLocations
                .map(loc => {
                    const childNode = document.querySelector(`.org-node[data-couple-key="${loc.key}"]`);
                    if (!childNode) return null;
                    const metrics = getNodeMetrics(childNode);
                    return metrics ? { key: loc.key, metrics } : null;
                })
                .filter(Boolean);

            if (childMetrics.length === 0) return;

            // Sort children by X for clean left-to-right connector bars
            childMetrics.sort((x, y) => x.metrics.midX - y.metrics.midX);

            const parentMidX = parentMetrics.midX;
            const parentBottomY = parentMetrics.bottomY;
            const childTopY = Math.min(...childMetrics.map(c => c.metrics.topY));

            // Ensure connector sits between parent and children, with a minimum gap
            const verticalGap = childTopY - parentBottomY;
            const connectorY = parentBottomY + Math.max(30, verticalGap * 0.45);

            const leftmostChildX = childMetrics[0].metrics.midX;
            const rightmostChildX = childMetrics[childMetrics.length - 1].metrics.midX;

            // Parent down to connector bar
            drawStraightLine(svg, parentMidX, parentBottomY, parentMidX, connectorY);

            // Connector bar across all children
            drawStraightLine(svg, leftmostChildX, connectorY, rightmostChildX, connectorY);

            // Down-stems into each child group
            childMetrics.forEach(({ metrics }) => {
                drawStraightLine(svg, metrics.midX, connectorY, metrics.midX, metrics.topY);
            });
        });
    });
}

function drawStraightLine(svg, x1, y1, x2, y2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    
    // Round coordinates to avoid sub-pixel rendering issues
    line.setAttribute('x1', Math.round(x1 * 10) / 10);
    line.setAttribute('y1', Math.round(y1 * 10) / 10);
    line.setAttribute('x2', Math.round(x2 * 10) / 10);
    line.setAttribute('y2', Math.round(y2 * 10) / 10);
    const styles = getComputedStyle(document.body);
    const stroke = (styles.getPropertyValue('--connector-color') || '#111827').trim();
    const opacity = parseFloat(styles.getPropertyValue('--connector-opacity')) || 1;

    line.setAttribute('stroke', stroke);
    line.setAttribute('stroke-width', '2.5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('opacity', `${opacity}`);
    
    svg.appendChild(line);
}

// Modal Functions
function openModal(person = null) {
    const modal = document.getElementById('memberModal');
    const form = document.getElementById('memberForm');
    const title = document.getElementById('modalTitle');
    const relationField = document.getElementById('relation').closest('.form-group');
    const relationshipSelect = document.getElementById('relationshipStatus');
    const passedOnCheckbox = document.getElementById('passedOn');

    form.reset();
    
    // Show relation field
    if (relationField) relationField.style.display = 'block';
    
    if (person) {
        title.textContent = 'Edit Family Member';
        document.getElementById('name').value = person.name;
        document.getElementById('age').value = person.age || '';
        document.getElementById('gender').value = person.gender || 'male';
        document.getElementById('photo').value = person.photo || '';
        if (relationshipSelect) {
            relationshipSelect.value = person.relationshipStatus || 'single';
        }
        if (passedOnCheckbox) {
            passedOnCheckbox.checked = !!person.passedOn;
        }
        form.dataset.editId = person.id;
        delete form.dataset.relation;
        delete form.dataset.parentId;
        delete form.dataset.personId;
    } else {
        title.textContent = 'Add Family Member';
        if (relationshipSelect) {
            relationshipSelect.value = 'single';
        }
        if (passedOnCheckbox) {
            passedOnCheckbox.checked = false;
        }
        delete form.dataset.editId;
        delete form.dataset.relation;
        delete form.dataset.parentId;
        delete form.dataset.personId;
    }

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('memberModal').style.display = 'none';
}

// Open modal for adding a child
function openModalForAddChild(parentId) {
    const modal = document.getElementById('memberModal');
    const form = document.getElementById('memberForm');
    const title = document.getElementById('modalTitle');
    const relationshipSelect = document.getElementById('relationshipStatus');
    const passedOnCheckbox = document.getElementById('passedOn');
    
    form.reset();
    title.textContent = 'Add Child';
    
    // Hide relation field since we're adding a child
    const relationField = document.getElementById('relation').closest('.form-group');
    if (relationField) relationField.style.display = 'none';
    if (relationshipSelect) {
        relationshipSelect.value = 'single';
    }
    if (passedOnCheckbox) {
        passedOnCheckbox.checked = false;
    }
    
    form.dataset.parentId = parentId;
    form.dataset.relation = 'child';
    delete form.dataset.editId;
    
    modal.style.display = 'block';
}

// Open modal for adding a spouse
function openModalForAddSpouse(personId) {
    const modal = document.getElementById('memberModal');
    const form = document.getElementById('memberForm');
    const title = document.getElementById('modalTitle');
    const person = findPersonById(personId);
    const relationshipSelect = document.getElementById('relationshipStatus');
    const passedOnCheckbox = document.getElementById('passedOn');
    
    form.reset();
    title.textContent = 'Add Spouse';
    
    // Hide relation field since we're adding a spouse
    const relationField = document.getElementById('relation').closest('.form-group');
    if (relationField) relationField.style.display = 'none';
    
    // Set opposite gender by default
    if (person) {
        const genderSelect = document.getElementById('gender');
        genderSelect.value = person.gender === 'male' ? 'female' : 'male';
    }
    
    if (relationshipSelect) {
        relationshipSelect.value = 'married';
    }
    if (passedOnCheckbox) {
        passedOnCheckbox.checked = false;
    }
    
    form.dataset.personId = personId;
    form.dataset.relation = 'spouse';
    delete form.dataset.editId;
    
    modal.style.display = 'block';
}

function editPerson(personId) {
    // Edit button now opens the sidebar with the profile
    openProfileSidebar(personId);
}

// Helper function to split name into first and last name
function splitName(fullName) {
    if (!fullName) return { firstName: '', lastName: '' };
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
        return { firstName: parts[0], lastName: '' };
    }
    const lastName = parts.pop();
    const firstName = parts.join(' ');
    return { firstName, lastName };
}

// Helper function to join first and last name
function joinName(firstName, lastName) {
    if (!firstName && !lastName) return '';
    if (!lastName) return firstName;
    if (!firstName) return lastName;
    return `${firstName} ${lastName}`;
}

// Convert birthday (dd/mm/yyyy) to age
function calculateAgeFromBirthday(birthday) {
    if (!birthday) return null;
    const parts = birthday.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
    const year = parseInt(parts[2]);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    
    const birthDate = new Date(year, month, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Convert age to birthday format (dd/mm/yyyy) - approximate
function calculateBirthdayFromAge(age) {
    if (!age) return '';
    const currentDate = new Date();
    const birthYear = currentDate.getFullYear() - age;
    // Use a default date of June 15th
    return `15/06/${birthYear}`;
}

// Format birthday from yyyy-mm-dd to dd/mm/yyyy
function formatBirthdayToDDMMYYYY(birthday) {
    if (!birthday) return '';
    // If already in dd/mm/yyyy format, return as is
    if (birthday.includes('/')) {
        return birthday;
    }
    // If in yyyy-mm-dd format, convert
    if (birthday.includes('-')) {
        const parts = birthday.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
    }
    return birthday;
}

// Profile Sidebar Functions
function openProfileSidebar(personId) {
    const person = findPersonById(personId);
    if (!person) return;
    
    selectedPersonId = personId;

    const profileSidebar = document.getElementById('profileSidebar');
    const profilePhoto = document.getElementById('profilePhoto');
    const profilePhotoPlaceholder = document.getElementById('profilePhotoPlaceholder');
    const profilePhotoContainer = document.querySelector('.profile-photo-container');
    const profileFirstName = document.getElementById('profileFirstName');
    const profileLastName = document.getElementById('profileLastName');
    const profileBirthday = document.getElementById('profileBirthday');
    const profileGender = document.getElementById('profileGender');
    const profileBiography = document.getElementById('profileBiography');
    const addChildBtn = document.getElementById('addChildBtn');
    const addSpouseBtn = document.getElementById('addSpouseBtn');
    const profileEditForm = document.getElementById('profileEditForm');
    const profileRelationship = document.getElementById('profileRelationship');
    const profilePassedOn = document.getElementById('profilePassedOn');

    // Set photo or placeholder with initials
    if (person.photo) {
        profilePhoto.src = person.photo;
        profilePhoto.style.display = 'block';
        profilePhotoPlaceholder.style.display = 'none';
        // Setup drop zone on photo
        setupDropZone(profilePhoto, personId);
    } else {
        profilePhoto.style.display = 'none';
        profilePhotoPlaceholder.style.display = 'flex';
        const initials = getInitials(person.name);
        const generationClass = getGenerationClass(person.id);
        const genderClass = person.gender || 'male';
        profilePhotoPlaceholder.innerHTML = initials;
        profilePhotoPlaceholder.className = `profile-photo-placeholder ${genderClass} ${generationClass}`;
        // Setup drop zone on placeholder
        setupDropZone(profilePhotoPlaceholder, personId);
    }
    
    // Also setup drop zone on the container as fallback
    if (profilePhotoContainer) {
        setupDropZone(profilePhotoContainer, personId);
    }

    // Split name into first and last
    const nameParts = splitName(person.name);
    profileFirstName.value = nameParts.firstName;
    profileLastName.value = nameParts.lastName;

    // Set birthday - convert from existing formats
    let birthday = '';
    if (person.birthday) {
        birthday = formatBirthdayToDDMMYYYY(person.birthday);
    } else if (person.birthDate) {
        birthday = formatBirthdayToDDMMYYYY(person.birthDate);
    } else if (person.age) {
        birthday = calculateBirthdayFromAge(person.age);
    }
    profileBirthday.value = birthday;

    // Set gender
    profileGender.value = person.gender || 'male';

    // Set relationship status and passed-on flag
    if (profileRelationship) {
        profileRelationship.value = person.relationshipStatus || 'single';
    }
    if (profilePassedOn) {
        profilePassedOn.checked = !!person.passedOn;
    }

    // Set biography
    profileBiography.value = person.biography || '';

    // Store person ID in form and buttons for actions
    profileEditForm.dataset.personId = personId;
    addChildBtn.dataset.personId = personId;
    addSpouseBtn.dataset.personId = personId;

    // Display family members
    displayFamilyMembers(personId);

    // Show sidebar
    profileSidebar.classList.add('active');
}

// Display family members in the profile sidebar
function displayFamilyMembers(personId) {
    const parentsContainer = document.getElementById('profileParents');
    const childrenContainer = document.getElementById('profileChildren');
    const grandchildrenContainer = document.getElementById('profileGrandchildren');
    
    // Get parents
    const parents = findParentsOfPerson(personId);
    if (parentsContainer) {
        if (parents.length > 0) {
            parentsContainer.innerHTML = parents.map(parent => 
                `<div class="family-member-item" onclick="openProfileSidebar(${parent.id})">${parent.name}</div>`
            ).join('');
        } else {
            parentsContainer.innerHTML = '<div class="family-member-item empty">No parents</div>';
        }
    }
    
    // Get children
    const children = getChildrenOfPerson(personId);
    if (childrenContainer) {
        if (children.length > 0) {
            childrenContainer.innerHTML = children.map(child => 
                `<div class="family-member-item" onclick="openProfileSidebar(${child.id})">${child.name}</div>`
            ).join('');
        } else {
            childrenContainer.innerHTML = '<div class="family-member-item empty">No children</div>';
        }
    }
    
    // Get grandchildren
    const grandchildren = getGrandchildrenOfPerson(personId);
    if (grandchildrenContainer) {
        if (grandchildren.length > 0) {
            grandchildrenContainer.innerHTML = grandchildren.map(grandchild => 
                `<div class="family-member-item" onclick="openProfileSidebar(${grandchild.id})">${grandchild.name}</div>`
            ).join('');
        } else {
            grandchildrenContainer.innerHTML = '<div class="family-member-item empty">No grandchildren</div>';
        }
    }
}

function closeProfileSidebar() {
    const profileSidebar = document.getElementById('profileSidebar');
    profileSidebar.classList.remove('active');
}

function saveProfileFromSidebar() {
    const form = document.getElementById('profileEditForm');
    const personId = parseInt(form.dataset.personId);
    if (!personId) return;

    const person = findPersonById(personId);
    if (!person) return;

    const firstName = document.getElementById('profileFirstName').value.trim();
    const lastName = document.getElementById('profileLastName').value.trim();
    const birthday = document.getElementById('profileBirthday').value.trim();
    const gender = document.getElementById('profileGender').value;
    const biography = document.getElementById('profileBiography').value.trim();
    const relationshipStatus = document.getElementById('profileRelationship')?.value || 'single';
    const passedOn = document.getElementById('profilePassedOn')?.checked || false;

    // Update person data
    person.name = joinName(firstName, lastName);
    person.birthday = birthday;
    person.gender = gender;
    person.biography = biography;
    person.relationshipStatus = relationshipStatus;
    person.passedOn = passedOn;
    
    // Calculate age from birthday if provided
    if (birthday) {
        const age = calculateAgeFromBirthday(birthday);
        if (age !== null) {
            person.age = age;
        }
    }

    saveData();
    renderTree();
    showToast('Profile updated successfully!', 'success');
    // Don't close sidebar - keep it open so user can see the changes
    // Refresh the sidebar to show updated data
    setTimeout(() => openProfileSidebar(personId), 100);
}

// Save Member
function saveMember() {
    const form = document.getElementById('memberForm');
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value) || 0;
    const gender = document.getElementById('gender').value;
    const photo = document.getElementById('photo').value;
    const relationshipStatus = document.getElementById('relationshipStatus').value || 'single';
    const passedOn = document.getElementById('passedOn').checked || false;

    if (form.dataset.editId) {
        // Edit existing person
        const person = findPersonById(parseInt(form.dataset.editId));
        if (person) {
            person.name = name;
            person.age = age;
            person.gender = gender;
            person.photo = photo || null;
            person.relationshipStatus = relationshipStatus;
            person.passedOn = passedOn;
            showToast('Member updated successfully!', 'success');
        }
    } else if (form.dataset.relation === 'child' && form.dataset.parentId) {
        // Add child
        const parentId = parseInt(form.dataset.parentId);
        const location = findGenerationAndCoupleIndex(parentId);
        if (location) {
            const newId = Math.max(...getAllPeople().map(p => p.id), 0) + 1;
            const newChild = {
                id: newId,
                name: name,
                age: age,
                gender: gender,
                photo: photo || null,
                relationshipStatus,
                passedOn
            };
            
            // Add child to parent's children array
            location.couple.children = location.couple.children || [];
            location.couple.children.push(newId);
            
            // Add child to next generation
            const nextGenIndex = location.genIndex + 1;
            if (nextGenIndex >= familyData.generations.length) {
                // Create new generation if needed
                familyData.generations.push({ couples: [] });
            }
            
            const nextGen = familyData.generations[nextGenIndex];
            nextGen.couples.push({
                people: [newChild],
                children: []
            });
            showToast('Child added successfully!', 'success');
        }
    } else if (form.dataset.relation === 'spouse' && form.dataset.personId) {
        // Add spouse
        const personId = parseInt(form.dataset.personId);
        const location = findGenerationAndCoupleIndex(personId);
        if (location) {
            const newId = Math.max(...getAllPeople().map(p => p.id), 0) + 1;
            const newSpouse = {
                id: newId,
                name: name,
                age: age,
                gender: gender,
                photo: photo || null,
                relationshipStatus,
                passedOn
            };
            
            // Add spouse to the same couple
            location.couple.people.push(newSpouse);
            showToast('Spouse added successfully!', 'success');
        }
    } else {
        // Add new person (simplified - add to last generation)
        const lastGen = familyData.generations[familyData.generations.length - 1];
        const newId = Math.max(...getAllPeople().map(p => p.id), 0) + 1;
        
        lastGen.couples.push({
            people: [{
                id: newId,
                name: name,
                age: age,
                gender: gender,
                photo: photo || null,
                relationshipStatus,
                passedOn
            }],
            children: []
        });
        showToast('New member added successfully!', 'success');
    }

    saveData();
    renderTree();
    renderPhotoGallery();
    closeModal();
    
    // Reopen profile sidebar if it was open
    if (form.dataset.parentId || form.dataset.personId) {
        const personId = parseInt(form.dataset.parentId || form.dataset.personId);
        setTimeout(() => openProfileSidebar(personId), 100);
    }
}

// Add some additional sample photos for variety
const samplePhotos = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/1.jpg",
    "https://randomuser.me/api/portraits/women/32.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/65.jpg",
    "https://randomuser.me/api/portraits/men/22.jpg",
    "https://randomuser.me/api/portraits/men/45.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg"
];
