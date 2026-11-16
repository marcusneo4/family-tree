/**
 * Family Tree – core: data, pure helpers, family graph and kinship logic.
 * No DOM access in this file, so it can be unit tested in the browser or in Node.
 * Classic script (no modules) so index.html still works when opened from disk.
 */
const DEFAULT_DATA_VERSION = 7;


/**
 * Deep-clones a plain object. Uses structuredClone when available.
 * @param {unknown} obj
 * @returns {unknown}
 */
function deepClone(obj) {
    if (typeof structuredClone === 'function') return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Escapes HTML special characters to prevent XSS when inserting user content.
 * @param {string | null | undefined} str
 * @returns {string}
 */
function escapeHtml(str) {
    if (str == null || typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Sanitizes a photo URL: allows relative paths, https, http, and data:image only.
 * @param {string | null | undefined} url
 * @returns {string}
 */
function sanitizePhotoUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const s = url.trim();
    if (!s) return '';
    const lower = s.toLowerCase();
    if (lower.startsWith('javascript:') || lower.startsWith('vbscript:') || lower.startsWith('data:text/html')) return '';
    if (lower.startsWith('data:image/')) return s;
    if (lower.startsWith('https://') || lower.startsWith('http://')) return s;
    if (s.startsWith('/') || s.startsWith('./') || !s.includes(':')) return s;
    return '';
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
                // 1. SOON Ai Choo (Bloodline) & Tan Chye Huat
                { people: [{ id: 101, name: "SOON Ai Choo", gender: "female", photo: null, relationshipStatus: "married" }, { id: 102, name: "Tan Chye Huat", gender: "male", photo: null, relationshipStatus: "married" }], children: [201, 203, 204, 206, 208] },
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
                // SOON Ai Choo & Tan Chye Huat (left side)
                { people: [{ id: 201, name: "Tan Swee Hoon", gender: "female", photo: "Family%20pics/Irene.jpg" }, { id: 202, name: "Yap Hwee Jeck", gender: "male", photo: "Family%20pics/Shermaine.jpg" }], children: [301, 302, 303] },
                { people: [{ id: 203, name: "Tan Geok Lan", gender: "female", photo: "Family%20pics/Julia.jpg" }], children: [] },
                { people: [{ id: 204, name: "Tan Swee Choon", gender: "female", photo: null }, { id: 205, name: "David Chan", gender: "male", photo: "Family%20pics/David%203.jpg" }], children: [304, 305] },
                { people: [{ id: 206, name: "Tan Poh Sang", gender: "male", photo: null }, { id: 207, name: "Foo Wan Jiao", gender: "female", photo: null }], children: [306, 307] },
                { people: [{ id: 208, name: "Tan Geok Yong", gender: "female", photo: null }, { id: 209, name: "Charles Lim", gender: "male", photo: "Family%20pics/Charles.jpg" }], children: [308, 309] },

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
                // Tan Swee Hoon & Yap Hwee Jeck
                { people: [{ id: 301, name: "Alvin Yap", gender: "male", photo: "Family%20pics/Alvin33.jpg" }], children: [] },
                { people: [{ id: 302, name: "Daphne Yap", gender: "female", photo: "Family%20pics/Daphene.jpg" }], children: [] },
                { people: [{ id: 303, name: "Alston Yap", gender: "male", photo: "Family%20pics/Alston.jpg" }], children: [] },
                // Tan Swee Choon & David Chan
                { people: [{ id: 304, name: "Liqi Chan", gender: "female", photo: "Family%20pics/Qi%20QI.jpg" }], children: [] },
                { people: [{ id: 305, name: "Liting Chan", gender: "female", photo: "Family%20pics/Ting%20Ting.jpg" }], children: [] },
                // Tan Poh Sang & Foo Wan Jiao
                { people: [{ id: 306, name: "Tan Jiahui", gender: "female", photo: null }], children: [] },
                { people: [{ id: 307, name: "Tan JiaQian", gender: "female", photo: null }], children: [] },
                // Tan Geok Yong & Charles Lim
                { people: [{ id: 308, name: "Caleb Lim", gender: "male", photo: "Family%20pics/Charles%20son.jpg" }], children: [] },
                { people: [{ id: 309, name: "Caden Lim", gender: "male", photo: "Family%20pics/Charles%202nd%20son.jpg" }], children: [] },

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

function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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

/**
 * Validates that parsed JSON has the expected family tree structure (generations, couples, people with ids).
 * @param {unknown} parsed
 * @returns {boolean}
 */
function isValidFamilyData(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    if (!Array.isArray(parsed.generations)) return false;
    for (const gen of parsed.generations) {
        if (!gen || !Array.isArray(gen.couples)) return false;
        for (const couple of gen.couples) {
            if (!couple || !Array.isArray(couple.people)) return false;
            for (const p of couple.people) {
                if (!p || typeof p.id === 'undefined') return false;
            }
        }
    }
    return true;
}

/* =====================================================================
 * Store and family graph
 * ===================================================================== */

const STORAGE_KEY = 'familyTreeData';

let familyData = deepClone(DEFAULT_FAMILY_DATA);
let _index = null;

function invalidateIndex() { _index = null; }

function setFamilyData(data) {
    familyData = data;
    invalidateIndex();
}

function getIndex() {
    if (_index) return _index;
    const people = new Map();       // personId -> { person, genIndex, coupleIndex, couple }
    const parentCouple = new Map(); // childId -> couple that lists the child
    familyData.generations.forEach((gen, genIndex) => {
        gen.couples.forEach((couple, coupleIndex) => {
            couple.people.forEach(person => people.set(person.id, { person, genIndex, coupleIndex, couple }));
            (couple.children || []).forEach(childId => parentCouple.set(childId, couple));
        });
    });
    _index = { people, parentCouple };
    return _index;
}

function getAllPeople() {
    return Array.from(getIndex().people.values(), entry => entry.person);
}

function findPersonById(id) {
    const entry = getIndex().people.get(id);
    return entry ? entry.person : undefined;
}

function findCoupleForPerson(id) {
    const entry = getIndex().people.get(id);
    return entry ? entry.couple : null;
}

function findGenerationAndCoupleIndex(id) {
    const entry = getIndex().people.get(id);
    return entry ? { genIndex: entry.genIndex, coupleIndex: entry.coupleIndex, couple: entry.couple } : null;
}

function getGenerationIndex(id) {
    const entry = getIndex().people.get(id);
    return entry ? entry.genIndex : -1;
}

/** The couple that lists this person as a child, or null. */
function getParentCouple(id) {
    return getIndex().parentCouple.get(id) || null;
}

function findParentsOfPerson(id) {
    const couple = getParentCouple(id);
    return couple ? couple.people.slice() : [];
}

function getSpouse(id) {
    const couple = findCoupleForPerson(id);
    if (!couple) return null;
    return couple.people.find(p => p.id !== id) || null;
}

function getChildrenOfPerson(id) {
    const couple = findCoupleForPerson(id);
    if (!couple || !couple.children) return [];
    return couple.children.map(findPersonById).filter(Boolean);
}

/** Siblings in listed order (oldest first), not including the person. */
function getSiblings(id) {
    const couple = getParentCouple(id);
    if (!couple) return [];
    return couple.children.filter(cid => cid !== id).map(findPersonById).filter(Boolean);
}

function getNextPersonId() {
    const ids = getAllPeople().map(p => p.id).filter(n => Number.isFinite(n));
    return ids.length ? Math.max(...ids) + 1 : 1;
}

function coupleKey(couple) {
    return couple.people.map(p => p.id).join('-');
}

/** Couples that appear below this couple (one per child that has a couple record). */
function getChildCouples(couple) {
    const seen = new Set();
    const result = [];
    (couple.children || []).forEach(childId => {
        const entry = getIndex().people.get(childId);
        if (!entry || seen.has(entry.couple)) return;
        seen.add(entry.couple);
        result.push(entry.couple);
    });
    return result;
}

function getTreeRoots() {
    const referenced = new Set();
    const all = [];
    familyData.generations.forEach(gen => gen.couples.forEach(couple => {
        all.push(couple);
        getChildCouples(couple).forEach(c => referenced.add(c));
    }));
    return all.filter(couple => !referenced.has(couple));
}

function getDescendantCouples(couple) {
    const result = [];
    const walk = c => getChildCouples(c).forEach(child => { result.push(child); walk(child); });
    walk(couple);
    return result;
}

/** Everyone from this couple downward (including the couple itself). */
function getCoupleSubtreeIds(couple) {
    const ids = new Set();
    [couple, ...getDescendantCouples(couple)].forEach(c => c.people.forEach(p => ids.add(p.id)));
    return ids;
}

/**
 * Main bloodline = the founding couple's children and everyone descended from them
 * who is listed as a child. Spouses who married in are not bloodline.
 */
function computeBloodlineIdSet() {
    const set = new Set();
    const root = familyData?.generations?.[0]?.couples?.[0];
    if (!root) return set;
    if (root.people[0]) set.add(root.people[0].id);
    const walk = couple => {
        (couple.children || []).forEach(childId => {
            set.add(childId);
            const entry = getIndex().people.get(childId);
            if (entry) walk(entry.couple);
        });
    };
    walk(root);
    return set;
}

/** The founding couple's children and what each branch contains. */
function getBranches() {
    const root = familyData?.generations?.[0]?.couples?.[0];
    if (!root) return [];
    return getChildCouples(root).map(couple => {
        const link = couple.people.find(p => (root.children || []).includes(p.id)) || couple.people[0];
        return { key: coupleKey(couple), label: link.name, link, couple, ids: getCoupleSubtreeIds(couple) };
    });
}

function getEffectiveRelationshipStatus(person) {
    if (person.relationshipStatus) return person.relationshipStatus;
    const couple = findCoupleForPerson(person.id);
    if (couple && couple.people.length === 2 && (couple.children || []).length > 0) return 'married';
    return 'single';
}

/** Order people the way the tree reads: roots first, then each branch in turn. */
function getTreeOrderedPeople() {
    const ordered = [];
    const seen = new Set();
    const walk = couple => {
        couple.people.forEach(p => { if (!seen.has(p.id)) { seen.add(p.id); ordered.push(p); } });
        getChildCouples(couple).forEach(walk);
    };
    getTreeRoots().forEach(walk);
    return ordered;
}

/** Person.photo is matched by name to files in "Family pics" when it is missing. */
function buildPhotoLookup() {
    const map = new Map();
    FAMILY_PHOTO_FILES.forEach(fileName => {
        const key = normalizeNameForMatch(fileName);
        if (key) map.set(key, `Family%20pics/${encodeURIComponent(fileName)}`);
    });
    return map;
}

/** @param {boolean} [force] also match people whose photo was removed on purpose */
function assignPhotosFromFolder(force = false) {
    const lookup = buildPhotoLookup();
    let count = 0;
    getAllPeople().forEach(person => {
        if (person.photo || (person.noPhoto && !force)) return;
        const match = lookup.get(normalizeNameForMatch(person.name));
        if (match) { person.photo = match; delete person.noPhoto; count++; }
    });
    return count;
}

/** Targeted fixes for saved data from older versions (gender mix-ups). */
function applyDataFixes() {
    let changed = false;
    [{ id: 202, gender: 'male' }, { id: 314, gender: 'male' }, { id: 315, gender: 'female' }, { id: 317, gender: 'female' }]
        .forEach(({ id, gender }) => {
            const person = findPersonById(id);
            if (person && person.gender !== gender) { person.gender = gender; changed = true; }
        });
    return changed;
}

/* ---------- Persistence ---------- */

/** @returns {{ reset: boolean }} */
function loadFamilyData(storage) {
    const saved = storage.getItem(STORAGE_KEY);
    if (!saved) return { reset: false };
    try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.dataVersion === DEFAULT_DATA_VERSION && isValidFamilyData(parsed)) {
            setFamilyData(parsed);
            return { reset: false };
        }
    } catch (err) {
        console.error('[FamilyTree] could not read saved data:', err?.message ?? String(err));
    }
    setFamilyData(deepClone(DEFAULT_FAMILY_DATA));
    return { reset: true };
}

/** @returns {{ ok: boolean, quota?: boolean }} */
function saveFamilyData(storage) {
    try {
        storage.setItem(STORAGE_KEY, JSON.stringify(familyData));
        return { ok: true };
    } catch (err) {
        const quota = err && (err.name === 'QuotaExceededError' || err.code === 22);
        return { ok: false, quota: !!quota };
    }
}

/* =====================================================================
 * Dates and ages
 * ===================================================================== */

function parseBirthday(value) {
    if (!value || typeof value !== 'string') return null;
    const parts = value.split('/');
    if (parts.length !== 3) return null;
    const d = parseInt(parts[0], 10), m = parseInt(parts[1], 10), y = parseInt(parts[2], 10);
    if (![d, m, y].every(Number.isFinite) || m < 1 || m > 12 || d < 1 || d > 31 || y < 1700) return null;
    return { d, m, y };
}

/** 01/01/yyyy is used in the data when only the year is known. */
function isYearOnlyBirthday(b) {
    return !!b && b.d === 1 && b.m === 1;
}

function getBirthYear(person) {
    const b = parseBirthday(person.birthday) || parseBirthday(formatBirthdayToDDMMYYYY(person.birthDate));
    if (b) return b.y;
    if (Number.isFinite(person.age)) return new Date().getFullYear() - person.age;
    return null;
}

function getPersonAge(person, today = new Date()) {
    const b = parseBirthday(person.birthday) || parseBirthday(formatBirthdayToDDMMYYYY(person.birthDate));
    if (b) {
        let age = today.getFullYear() - b.y;
        if (today.getMonth() + 1 < b.m || (today.getMonth() + 1 === b.m && today.getDate() < b.d)) age--;
        return age >= 0 ? age : null;
    }
    return Number.isFinite(person.age) ? person.age : null;
}

/** "1947 – 2020", "31 years", or '' when nothing is known. */
function getLifeSummary(person) {
    const year = getBirthYear(person);
    if (person.passedOn) {
        if (year && person.deathYear) return `${year} – ${person.deathYear}`;
        if (person.deathYear) return `d. ${person.deathYear}`;
        return year ? `b. ${year}` : '';
    }
    const age = getPersonAge(person);
    return age === null ? '' : `${age} years`;
}

/** Birthdays within the next `days` days. Skips people who have passed on and year-only dates. */
function getUpcomingBirthdays(days = 60, today = new Date()) {
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const out = [];
    getAllPeople().forEach(person => {
        if (person.passedOn) return;
        const b = parseBirthday(person.birthday);
        if (!b || isYearOnlyBirthday(b)) return;
        let next = new Date(start.getFullYear(), b.m - 1, b.d);
        if (next < start) next = new Date(start.getFullYear() + 1, b.m - 1, b.d);
        const daysAway = Math.round((next - start) / 86400000);
        if (daysAway <= days) out.push({ person, date: next, daysAway, turning: next.getFullYear() - b.y });
    });
    return out.sort((a, b) => a.daysAway - b.daysAway);
}

/** Negative = a is older, positive = a is younger, 0 = unknown. */
function compareAge(a, b) {
    const ya = getBirthYear(a), yb = getBirthYear(b);
    if (ya === null || yb === null) return 0;
    if (ya !== yb) return ya < yb ? -1 : 1;
    const ba = parseBirthday(a.birthday), bb = parseBirthday(b.birthday);
    if (ba && bb && !isYearOnlyBirthday(ba) && !isYearOnlyBirthday(bb)) {
        const da = ba.m * 100 + ba.d, db = bb.m * 100 + bb.d;
        if (da !== db) return da < db ? -1 : 1;
    }
    return 0;
}

/* =====================================================================
 * Editing (pure data changes; the UI handles undo and saving)
 * ===================================================================== */

const EDITABLE_FIELDS = ['name', 'chineseName', 'nickname', 'callName', 'gender', 'birthday', 'passedOn', 'deathYear', 'relationshipStatus', 'photo', 'bio'];

function cleanFields(fields) {
    const out = {};
    EDITABLE_FIELDS.forEach(key => {
        if (!(key in fields)) return;
        let v = fields[key];
        if (typeof v === 'string') v = v.trim();
        if (key === 'photo') v = sanitizePhotoUrl(v) || null;
        if (key === 'passedOn') v = !!v;
        if (key === 'deathYear') { v = parseInt(v, 10); if (!Number.isFinite(v)) v = null; }
        if (v === '') v = null;
        out[key] = v;
    });
    return out;
}

function updatePerson(id, fields) {
    const person = findPersonById(id);
    if (!person) return null;
    const clean = cleanFields(fields);
    Object.keys(clean).forEach(key => {
        if (clean[key] === null || clean[key] === false) {
            if (key === 'photo') { person.photo = null; person.noPhoto = true; } else delete person[key];
        } else {
            person[key] = clean[key];
            if (key === 'photo') delete person.noPhoto;
        }
    });
    if (!person.name) person.name = 'Unnamed';
    invalidateIndex();
    return person;
}

function addChildTo(parentId, fields) {
    const entry = getIndex().people.get(parentId);
    if (!entry) return null;
    const person = { id: getNextPersonId(), gender: 'male', photo: null };
    Object.assign(person, cleanFields(fields));
    if (!person.name) person.name = 'Unnamed';
    if (!entry.couple.children) entry.couple.children = [];
    entry.couple.children.push(person.id);
    const genIndex = entry.genIndex + 1;
    if (!familyData.generations[genIndex]) familyData.generations[genIndex] = { couples: [] };
    familyData.generations[genIndex].couples.push({ people: [person], children: [] });
    invalidateIndex();
    return person;
}

/** @returns {object|null} the new person, or null when the person already has a partner. */
function addSpouseTo(personId, fields) {
    const entry = getIndex().people.get(personId);
    if (!entry || entry.couple.people.length >= 2) return null;
    const existing = entry.person;
    const person = { id: getNextPersonId(), gender: existing.gender === 'female' ? 'male' : 'female', photo: null, relationshipStatus: 'married' };
    Object.assign(person, cleanFields(fields));
    if (!person.name) person.name = 'Unnamed';
    if (!existing.relationshipStatus) existing.relationshipStatus = person.relationshipStatus;
    entry.couple.people.push(person);
    invalidateIndex();
    return person;
}

/**
 * What removing a person would do. The founding couple cannot be removed.
 * A person who is listed as a child takes their couple and descendants with them;
 * a spouse who married in is removed on their own.
 */
function planRemoval(personId) {
    const entry = getIndex().people.get(personId);
    if (!entry) return null;
    const foundingCouple = familyData.generations[0]?.couples?.[0];
    if (entry.couple === foundingCouple) return { allowed: false, reason: 'The founding couple cannot be removed.' };
    const isLink = !!getParentCouple(personId);
    if (!isLink) return { allowed: true, mode: 'person', ids: [personId] };
    return { allowed: true, mode: 'subtree', ids: Array.from(getCoupleSubtreeIds(entry.couple)) };
}

function removePerson(personId) {
    const plan = planRemoval(personId);
    if (!plan || !plan.allowed) return plan;
    if (plan.mode === 'person') {
        const couple = findCoupleForPerson(personId);
        couple.people = couple.people.filter(p => p.id !== personId);
        familyData.generations.forEach(gen => { gen.couples = gen.couples.filter(c => c.people.length > 0); });
    } else {
        const doomed = new Set(plan.ids);
        familyData.generations.forEach(gen => {
            gen.couples.forEach(c => { c.people = c.people.filter(p => !doomed.has(p.id)); });
            gen.couples = gen.couples.filter(c => c.people.length > 0);
        });
        familyData.generations.forEach(gen => gen.couples.forEach(c => {
            c.children = (c.children || []).filter(id => !doomed.has(id));
        }));
    }
    invalidateIndex();
    return plan;
}

/* =====================================================================
 * Kinship: "how am I related to them, and what do I call them?"
 * ===================================================================== */

const PINYIN = {
    '爸爸': 'bàba', '妈妈': 'māma', '爷爷': 'yéye', '奶奶': 'nǎinai', '外公': 'wàigōng', '外婆': 'wàipó',
    '曾祖父': 'zēngzǔfù', '曾祖母': 'zēngzǔmǔ', '儿子': 'érzi', '女儿': 'nǚ\'ér', '孙子': 'sūnzi', '孙女': 'sūnnǚ',
    '外孙': 'wàisūn', '外孙女': 'wàisūnnǚ', '哥哥': 'gēge', '姐姐': 'jiějie', '弟弟': 'dìdi', '妹妹': 'mèimei',
    '侄子': 'zhízi', '侄女': 'zhínǚ', '外甥': 'wàisheng', '外甥女': 'wàishengnǚ',
    '伯父': 'bófù', '叔叔': 'shūshu', '姑姑': 'gūgu', '舅舅': 'jiùjiu', '姨妈': 'yímā',
    '伯母': 'bómǔ', '婶婶': 'shěnshen', '姑丈': 'gūzhàng', '舅妈': 'jiùmā', '姨丈': 'yízhàng',
    '堂哥': 'tánggē', '堂姐': 'tángjiě', '堂弟': 'tángdì', '堂妹': 'tángmèi',
    '表哥': 'biǎogē', '表姐': 'biǎojiě', '表弟': 'biǎodì', '表妹': 'biǎomèi',
    '伯公': 'bógōng', '叔公': 'shūgōng', '姑婆': 'gūpó', '舅公': 'jiùgōng', '姨婆': 'yípó',
    '嫂嫂': 'sǎosao', '弟妇': 'dìfù', '姐夫': 'jiěfu', '妹夫': 'mèifu', '媳妇': 'xífu', '女婿': 'nǚxu',
    '妻子': 'qīzi', '丈夫': 'zhàngfu', '女朋友': 'nǚpéngyou', '男朋友': 'nánpéngyou',
    '岳父': 'yuèfù', '岳母': 'yuèmǔ', '公公': 'gōnggong', '婆婆': 'pópo', '我': 'wǒ'
};

/** What you call the spouse of a relative, keyed by what you call the relative. */
const SPOUSE_OF_TERM = {
    '伯父': '伯母', '叔叔': '婶婶', '姑姑': '姑丈', '舅舅': '舅妈', '姨妈': '姨丈',
    '哥哥': '嫂嫂', '弟弟': '弟妇', '姐姐': '姐夫', '妹妹': '妹夫', '儿子': '媳妇', '女儿': '女婿'
};

function pick(person, male, female) {
    return person && person.gender === 'female' ? female : male;
}

/** Map of ancestorId -> chain of ids from `id` up to that ancestor. Includes `id` itself. */
function ancestorChains(id) {
    const chains = new Map([[id, [id]]]);
    let frontier = [id];
    while (frontier.length) {
        const next = [];
        frontier.forEach(current => {
            const parents = getParentCouple(current);
            if (!parents) return;
            parents.people.forEach(parent => {
                if (!chains.has(parent.id)) {
                    chains.set(parent.id, [...chains.get(current), parent.id]);
                    next.push(parent.id);
                }
            });
        });
        frontier = next;
    }
    return chains;
}

/** True when `a` is listed before `b` among the same parents' children (so is older). null if unknown. */
function listedBefore(aId, bId) {
    const couple = getParentCouple(aId);
    if (!couple || couple !== getParentCouple(bId)) return null;
    return couple.children.indexOf(aId) < couple.children.indexOf(bId);
}

/** Is `target` older than `me`? Uses birthdays, then the order the connecting relatives are listed. */
function targetIsOlder(me, target, meLinkId, targetLinkId) {
    const byAge = compareAge(target, me);
    if (byAge !== 0) return byAge < 0;
    return listedBefore(targetLinkId, meLinkId);
}

function makeRelation(kind, title, detail, term) {
    return { kind, title, detail: detail || '', term: term || '', pinyin: term ? (PINYIN[term] || '') : '' };
}

function cousinOrdinal(k) {
    return ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth'][k] || `${k}th`;
}

function capitalise(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

function bloodRelation(meId, targetId) {
    const me = findPersonById(meId), t = findPersonById(targetId);
    const mine = ancestorChains(meId), theirs = ancestorChains(targetId);
    let best = null;
    mine.forEach((chainMe, ancestorId) => {
        const chainT = theirs.get(ancestorId);
        if (!chainT) return;
        const total = (chainMe.length - 1) + (chainT.length - 1);
        if (!best || total < best.total) best = { ancestorId, chainMe, chainT, total };
    });
    if (!best) return null;

    const { chainMe, chainT } = best;
    const m = chainMe.length - 1, n = chainT.length - 1;
    const P = i => findPersonById(chainMe[i]);   // my line, upward
    const Q = i => findPersonById(chainT[i]);    // their line, upward
    const sideOf = person => pick(person, "Father's", "Mother's");
    const sb = person => pick(person, 'brother', 'sister');
    const sd = person => pick(person, 'son', 'daughter');
    const R = (title, detail, term) => Object.assign(makeRelation('blood', title, detail, term), { m, n });

    if (m === 0 && n === 0) return R('You', '', '我');

    // Their ancestors
    if (n === 0) {
        if (m === 1) return R(pick(t, 'Father', 'Mother'), '', pick(t, '爸爸', '妈妈'));
        const paternal = P(1).gender !== 'female';
        if (m === 2) {
            return R(pick(t, 'Grandfather', 'Grandmother'), `${sideOf(P(1))} ${pick(t, 'father', 'mother')}`,
                paternal ? pick(t, '爷爷', '奶奶') : pick(t, '外公', '外婆'));
        }
        if (m === 3) {
            return R(pick(t, 'Great-grandfather', 'Great-grandmother'), `${paternal ? "Father's" : "Mother's"} side`,
                paternal ? pick(t, '曾祖父', '曾祖母') : '');
        }
        return R('Ancestor', `${'Great-'.repeat(m - 2)}${pick(t, 'grandfather', 'grandmother')}`, '');
    }

    // Their descendants
    if (m === 0) {
        if (n === 1) return R(pick(t, 'Son', 'Daughter'), '', pick(t, '儿子', '女儿'));
        if (n === 2) {
            const viaSon = Q(1).gender !== 'female';
            return R(pick(t, 'Grandson', 'Granddaughter'), `${viaSon ? "Son's" : "Daughter's"} ${sd(t)}`,
                viaSon ? pick(t, '孙子', '孙女') : pick(t, '外孙', '外孙女'));
        }
        return R(pick(t, 'Great-grandson', 'Great-granddaughter'), 'Descendant', '');
    }

    // Brothers and sisters
    if (m === 1 && n === 1) {
        const older = targetIsOlder(me, t, meId, targetId);
        if (older === null) return R(capitalise(sb(t)), '', '');
        return R(`${older ? 'Older' : 'Younger'} ${sb(t)}`, '',
            older ? pick(t, '哥哥', '姐姐') : pick(t, '弟弟', '妹妹'));
    }

    // Nieces and nephews
    if (m === 1 && n >= 2) {
        if (n === 2) {
            const viaBrother = Q(1).gender !== 'female';
            return R(pick(t, 'Nephew', 'Niece'), `${viaBrother ? "Brother's" : "Sister's"} ${sd(t)}`,
                viaBrother ? pick(t, '侄子', '侄女') : pick(t, '外甥', '外甥女'));
        }
        return R(pick(t, 'Grand-nephew', 'Grand-niece'), 'Child of a nephew or niece', '');
    }

    // Aunts and uncles
    if (n === 1 && m >= 2) {
        if (m === 2) {
            const parent = P(1);
            const older = listedBefore(chainT[0], parent.id);
            const ageWord = older === null ? '' : older ? 'older ' : 'younger ';
            let term = '';
            if (parent.gender !== 'female') {
                term = t.gender === 'female' ? '姑姑' : (older === null ? '' : older ? '伯父' : '叔叔');
            } else {
                term = t.gender === 'female' ? '姨妈' : '舅舅';
            }
            return R(pick(t, 'Uncle', 'Aunt'), `${sideOf(parent)} ${ageWord}${sb(t)}`, term);
        }
        if (m === 3) {
            const grand = P(2);
            const older = listedBefore(chainT[0], grand.id);
            let term = '';
            if (grand.gender !== 'female' && P(1).gender !== 'female') {
                term = t.gender === 'female' ? '姑婆' : (older === null ? '' : older ? '伯公' : '叔公');
            } else if (grand.gender === 'female') {
                term = t.gender === 'female' ? '姨婆' : '舅公';
            }
            return R(pick(t, 'Great-uncle', 'Great-aunt'), `${pick(grand, "Grandfather's", "Grandmother's")} ${sb(t)}`, term);
        }
        return R(pick(t, 'Great-uncle', 'Great-aunt'), 'Distant', '');
    }

    // Cousins
    if (m === n && m >= 2) {
        if (m === 2) {
            const mine1 = P(1), theirs1 = Q(1);
            const paternalLine = mine1.gender !== 'female' && theirs1.gender !== 'female';
            const older = targetIsOlder(me, t, mine1.id, theirs1.id);
            let term = '';
            if (older !== null) term = (paternalLine ? '堂' : '表') + (older ? pick(t, '哥', '姐') : pick(t, '弟', '妹'));
            const ageWord = older === null ? '' : older ? 'Older ' : 'Younger ';
            return R(`${ageWord}${ageWord ? 'cousin' : 'Cousin'}`,
                `${sideOf(mine1)} ${sb(theirs1)}'s ${sd(t)}`, term);
        }
        return R(`${cousinOrdinal(m - 1)} cousin`, 'Shared great-grandparents or further back', '');
    }

    const k = Math.min(m, n) - 1, removed = Math.abs(m - n);
    const removedWord = removed === 1 ? 'once' : removed === 2 ? 'twice' : `${removed} times`;
    return R(`${cousinOrdinal(k)} cousin, ${removedWord} removed`, '', '');
}

function spouseWord(t) {
    const status = getEffectiveRelationshipStatus(t);
    if (status === 'dating' || status === 'bf_gf') return { title: pick(t, 'Boyfriend', 'Girlfriend'), term: pick(t, '男朋友', '女朋友') };
    return { title: pick(t, 'Husband', 'Wife'), term: pick(t, '丈夫', '妻子') };
}

/**
 * Describe how `targetId` is related to `meId`.
 * @returns {{kind: string, title: string, detail: string, term: string, pinyin: string, custom?: boolean} | null}
 */
function describeRelation(meId, targetId) {
    const me = findPersonById(meId), t = findPersonById(targetId);
    if (!me || !t) return null;

    let result = bloodRelation(meId, targetId);

    if (!result) {
        const partner = getSpouse(meId);
        if (partner && partner.id === targetId) {
            const w = spouseWord(t);
            result = makeRelation('spouse', w.title, '', w.term);
        }
    }

    if (!result) {
        // Spouse of a blood relative
        const theirPartner = getSpouse(targetId);
        const viaBlood = theirPartner && theirPartner.id !== meId ? bloodRelation(meId, theirPartner.id) : null;
        if (viaBlood && viaBlood.title !== 'You') {
            const word = pick(t, 'Husband', 'Wife');
            result = makeRelation('inlaw', `${word} of your ${viaBlood.title.toLowerCase()}`, '', SPOUSE_OF_TERM[viaBlood.term] || '');
        }
    }

    if (!result) {
        // Blood relative of my spouse
        const partner = getSpouse(meId);
        const viaPartner = partner ? bloodRelation(partner.id, targetId) : null;
        if (viaPartner) {
            let term = '';
            if (viaPartner.n === 0 && viaPartner.m === 1) {
                term = me.gender === 'female' ? pick(t, '公公', '婆婆') : pick(t, '岳父', '岳母');
            }
            result = makeRelation('inlaw', `Your spouse's ${viaPartner.title.toLowerCase()}`, '', term);
        }
    }

    if (!result) result = makeRelation('none', 'Not linked in the tree', '', '');

    if (t.callName) { result.term = t.callName; result.pinyin = ''; result.custom = true; }
    return result;
}

/** Everything the page and tests need when running without a browser. */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { describeRelation, getAllPeople, findPersonById, setFamilyData, DEFAULT_FAMILY_DATA, deepClone };
}
