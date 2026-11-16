/** Face position per photo: [x%, y%, zoom, width/height]. Used to centre faces in round avatars. */
const PHOTO_FOCUS = {
    "Adelia.jpg": [50, 60, 1.3, 0.727],
    "Ah Huat.jpg": [50, 32, 1.2, 0.538],
    "Alston.jpg": [40, 32, 1.1, 0.81],
    "Alvin33.jpg": [45, 32, 1.4, 0.739],
    "Ashley soon.jpg": [35, 45, 1.2, 0.933],
    "Austin Soon.jpg": [48, 37, 1.2, 0.729],
    "Baby.jpg": [40, 40, 1.1, 0.707],
    "Ben.jpg": [48, 37, 1.2, 0.917],
    "Bryan.jpg": [50, 33, 1.3, 0.667],
    "Bryle.jpg": [40, 37, 1.2, 0.736],
    "Calvin.jpg": [47, 45, 1.1, 1.017],
    "Charles 2nd son.jpg": [30, 28, 1.2, 0.795],
    "Charles son.jpg": [45, 25, 1.2, 0.74],
    "Charles.jpg": [50, 35, 1.3, 0.761],
    "Cheuy Mei.jpg": [48, 45, 1.2, 0.732],
    "Chris.jpg": [47, 50, 1.3, 0.633],
    "Clement.jpg": [60, 40, 1.2, 0.845],
    "Da E E.jpg": [50, 22, 1.2, 0.577],
    "Daphene.jpg": [45, 38, 1.3, 0.682],
    "Darren soon.jpg": [50, 32, 1.2, 0.568],
    "David 3.jpg": [45, 30, 1.3, 0.669],
    "David Soon.jpg": [50, 33, 1.2, 0.747],
    "Denise Soon.jpg": [45, 45, 1.3, 0.618],
    "Dennis.jpg": [50, 45, 1.1, 0.69],
    "Edwin.jpg": [45, 25, 1.4, 0.782],
    "Emeliah.jpg": [40, 45, 1.3, 0.664],
    "Emmanuel.jpg": [55, 40, 1.6, 0.796],
    "Gabriel.jpg": [40, 20, 1.4, 0.825],
    "Grace.jpg": [45, 45, 1.6, 0.881],
    "Hailey.jpg": [50, 40, 1.2, 0.707],
    "Helen.jpg": [50, 45, 1.2, 0.735],
    "Irene.jpg": [50, 45, 1.4, 0.811],
    "Jezzrie.jpg": [45, 45, 1.1, 0.822],
    "Jing Jie.jpg": [50, 58, 1.3, 0.769],
    "Joey.jpg": [50, 30, 1.4, 0.78],
    "Jonathan.jpg": [55, 36, 1.4, 0.459],
    "Jovan.jpg": [48, 38, 1.3, 0.702],
    "Joyce.jpg": [35, 42, 1.4, 0.824],
    "Julia.jpg": [45, 50, 1.0, 0.813],
    "Keegan.jpg": [48, 45, 1.2, 0.863],
    "Kenzie.jpg": [40, 30, 1.2, 0.727],
    "LY.jpg": [40, 30, 1.2, 0.737],
    "Leslie.jpg": [42, 30, 1.5, 0.668],
    "Lian Tee.jpg": [50, 37, 1.2, 0.764],
    "Lisa.jpg": [40, 37, 1.2, 0.777],
    "Lynette Tan.jpg": [50, 60, 1.2, 0.59],
    "Mah Chye.jpg": [50, 58, 1.2, 0.726],
    "Mah Kok.jpg": [50, 28, 1.5, 0.664],
    "Maia.jpg": [53, 22, 1.4, 0.903],
    "Marcus.jpg": [40, 40, 1.2, 0.664],
    "Marissa Neo.jpg": [43, 42, 1.0, 0.795],
    "Mark Soon.jpg": [72, 25, 1.5, 0.795],
    "Martin Neo.jpg": [40, 33, 1.2, 0.684],
    "May Soon.jpg": [48, 50, 1.3, 0.645],
    "Michelle Tan.jpg": [38, 30, 1.4, 0.75],
    "Natania.jpg": [50, 55, 1.2, 1.107],
    "Nick.jpg": [50, 30, 1.5, 0.547],
    "Noah.jpg": [38, 45, 1.2, 0.494],
    "Paul Soon.jpg": [55, 33, 1.3, 0.729],
    "Peter Soon.jpg": [50, 40, 1.3, 0.806],
    "Priscilla Soon.jpg": [47, 38, 1.3, 0.77],
    "Qi QI.jpg": [33, 38, 1.4, 0.719],
    "Rachel.jpg": [33, 45, 1.6, 0.75],
    "Rinnah.jpg": [42, 43, 1.2, 1.051],
    "Roger Neo.jpg": [50, 55, 1.0, 0.853],
    "Sally.jpg": [40, 22, 1.4, 0.782],
    "Samuel.jpg": [38, 43, 1.1, 0.675],
    "Sarah Tan.jpg": [35, 45, 1.4, 0.569],
    "Shaniah.jpg": [50, 55, 1.1, 0.699],
    "Shanna Yan.jpg": [43, 22, 1.4, 0.646],
    "Sharon Gan.jpg": [48, 45, 1.2, 0.657],
    "Sharon.jpg": [52, 55, 1.0, 0.92],
    "Shermaine.jpg": [48, 30, 1.3, 0.65],
    "Sherry.jpg": [48, 38, 1.3, 0.698],
    "Soon Thian Poot.jpg": [50, 42, 1.2, 0.671],
    "Steffi.jpg": [48, 38, 1.2, 0.663],
    "Susan.jpg": [38, 25, 1.5, 0.642],
    "Thiam Pong.jpg": [47, 50, 1.2, 0.622],
    "Ting Ting.jpg": [37, 40, 1.3, 0.884],
    "Trixie.jpg": [45, 48, 1.0, 0.861],
    "Twa kim.jpg": [45, 40, 1.2, 0.629],
    "Uncle John.jpg": [45, 25, 1.3, 0.593],
    "Vanessa Soon.jpg": [50, 37, 1.4, 0.741],
    "Vivian.jpg": [40, 45, 1.2, 0.674],
    "Wai Sin.jpg": [45, 30, 1.4, 0.787],
    "Yuan Zhang.jpg": [68, 30, 1.3, 0.761],
    "sakim.jpg": [45, 40, 1.2, 0.793],
    "yvvette Tan.jpg": [48, 25, 1.3, 0.681]
};

/** Branch colours, one per child of the founders. Founders use gold. Matches --b0…--b11 in styles.css. */
const BRANCH_COUNT = 12;

/** Where the face is in a person's photo: {x, y, z, a} (percent, percent, zoom, width/height) or null when unknown. */
function photoFocusFor(person) {
    if (!person || !person.photo) return null;
    const file = photoFileName(person.photo);
    const known = file ? PHOTO_FOCUS[file] : null;
    const aspect = known ? known[3] : (/^data:/.test(person.photo) ? 1 : null);
    const custom = person.photoFocus;
    if (custom && Number.isFinite(custom.x)) return { x: custom.x, y: custom.y, z: custom.z || 1, a: aspect };
    if (known) return { x: known[0], y: known[1], z: known[2], a: aspect };
    return { x: 50, y: 35, z: 1, a: aspect };
}

function photoFileName(path) {
    if (!path || /^data:/.test(path)) return null;
    try { return decodeURIComponent(String(path).split('/').pop()); } catch (err) { return null; }
}

/** Inline style that places the face in the middle of a square frame. */
function photoFrameStyle(focus) {
    if (!focus) return '';
    if (!focus.a) return `object-position:${focus.x}% ${focus.y}%;transform:scale(${focus.z});transform-origin:${focus.x}% ${focus.y}%`;
    const z = Math.max(1, focus.z), a = focus.a;
    const W = a < 1 ? z : z * a, H = a < 1 ? z / a : z;
    const L = Math.min(0, Math.max(1 - W, 0.5 - focus.x / 100 * W));
    const T = Math.min(0, Math.max(1 - H, 0.5 - focus.y / 100 * H));
    const pct = v => `${(v * 100).toFixed(2)}%`;
    return `position:absolute;max-width:none;width:${pct(W)};height:${pct(H)};left:${pct(L)};top:${pct(T)}`;
}
