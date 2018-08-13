function random_string() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

export function generateUniqueId() {
    return new Date().getTime().toString(36) + '-' + random_string();
}

window.generateUniqueId = generateUniqueId;

export function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}

// b64EncodeUnicode('✓ à la mode'); // "4pyTIMOgIGxhIG1vZGU="
// b64EncodeUnicode('\n'); // "Cg=="

export function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// b64DecodeUnicode('4pyTIMOgIGxhIG1vZGU='); // "✓ à la mode"
// b64DecodeUnicode('Cg=='); // "\n"

export function shuffle(array) {
    let i, j = 0, temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
