// WorldFG Database Management
let DB = JSON.parse(localStorage.getItem('worldfg_db'));

if (!DB || !DB.users) {
    DB = {
        users: [],
        posts: [],
        stories: [],
        messages: {},
        friends: {},
        friendRequests: {},
        followers: {},
        notifications: [],
        marketplaceItems: [],
        marketplaceListings: [],
        events: [],
        pages: [],
        currentUser: null
    };
    localStorage.setItem('worldfg_db', JSON.stringify(DB));
}

function saveDB() {
    localStorage.setItem('worldfg_db', JSON.stringify(DB));
}

function getCurrentUser() {
    return DB.currentUser;
}

function isLoggedIn() {
    return DB.currentUser !== null;
}

function redirectToLogin() {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
    }
}