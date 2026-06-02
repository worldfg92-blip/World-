// ============ WORLD FG - SHARED APP FUNCTIONS ============

// Redirect if not logged in
if (!isLoggedIn()) {
    window.location.href = 'index.html';
}

// Global pending media storage
window.pendingMedia = null;
window.pendingStoryMedia = null;
window.pendingProfilePic = null;
window.pendingCoverPic = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    initDarkMode();
    initLanguageSelector();
    autoSpreadNewUsers();
    loadRealNotifications();
    initGlobalEventListeners();
});

// ============ GLOBAL EVENT LISTENERS ============
function initGlobalEventListeners() {
    // Close search on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            const results = document.getElementById('searchResults');
            if (results) results.style.display = 'none';
        }
        if (!e.target.closest('.user-menu-trigger') && !e.target.closest('#userMenuPanel')) {
            const panel = document.getElementById('userMenuPanel');
            if (panel) panel.style.display = 'none';
        }
        if (!e.target.closest('.icon-badge') && !e.target.closest('#notifPanel') && !e.target.closest('#notifOverlay')) {
            const panel = document.getElementById('notifPanel');
            if (panel) panel.style.display = 'none';
            const overlay = document.getElementById('notifOverlay');
            if (overlay) overlay.style.display = 'none';
        }
    });
}

// ============ DARK/LIGHT MODE ============
function initDarkMode() {
    const mode = localStorage.getItem('worldfg_theme') || 'dark';
    applyTheme(mode);
}

function applyTheme(mode) {
    const root = document.documentElement;
    if (mode === 'light') {
        root.style.setProperty('--darker', '#f0f2f5');
        root.style.setProperty('--dark', '#ffffff');
        root.style.setProperty('--card', '#ffffff');
        root.style.setProperty('--border', '#ddd');
        root.style.setProperty('--hover', '#f0f2f5');
        document.body.style.color = '#1c1e21';
    } else {
        root.style.setProperty('--darker', '#020617');
        root.style.setProperty('--dark', '#0f172a');
        root.style.setProperty('--card', '#1e293b');
        root.style.setProperty('--border', '#334155');
        root.style.setProperty('--hover', '#2d3a4f');
        document.body.style.color = '#e2e8f0';
    }
}

// ============ LANGUAGE ============
let currentLanguage = localStorage.getItem('worldfg_language') || 'en';

function initLanguageSelector() {
    const selector = document.getElementById('languageSelector');
    if (selector) {
        selector.value = currentLanguage;
        selector.onchange = function() {
            currentLanguage = this.value;
            localStorage.setItem('worldfg_language', currentLanguage);
        };
    }
}

// ============ AUTO-SPREAD NEW USERS ============
function autoSpreadNewUsers() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    if (!DB.discoveryPool) DB.discoveryPool = [];
    if (!DB.discoveryPool.includes(currentUser.id)) {
        DB.discoveryPool.push(currentUser.id);
        saveDB();
    }
}

// ============ SEARCH ============
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    const resultsDiv = document.getElementById('searchResults');
    if (!resultsDiv) return;
    
    if (query.length < 1) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    const currentUser = getCurrentUser();
    
    // Search ALL users
    let results = DB.users.filter(u => 
        u.id !== currentUser?.id && (
            u.fullName?.toLowerCase().includes(query) ||
            u.firstName?.toLowerCase().includes(query) ||
            u.lastName?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query) ||
            u.location?.toLowerCase().includes(query) ||
            u.country?.toLowerCase().includes(query) ||
            u.bio?.toLowerCase().includes(query) ||
            u.work?.toLowerCase().includes(query)
        )
    );
    
    // Also search posts for video names
    const postResults = DB.posts.filter(p => 
        p.text?.toLowerCase().includes(query) ||
        p.userName?.toLowerCase().includes(query)
    );
    
    postResults.forEach(p => {
        const author = DB.users.find(u => u.id === p.userId);
        if (author && !results.find(r => r.id === author.id) && author.id !== currentUser?.id) {
            results.push(author);
        }
    });
    
    results = [...new Map(results.map(u => [u.id, u])).values()];
    
    if (results.length === 0) {
        resultsDiv.innerHTML = `<div style="padding:16px; text-align:center; color:#64748b;"><p>No users found for "${query}"</p></div>`;
    } else {
        resultsDiv.innerHTML = results.map(u => `
            <div style="padding:10px 12px; cursor:pointer; display:flex; align-items:center; gap:10px; border-bottom:1px solid var(--border);" 
                 onclick="viewProfile('${u.id}')"
                 onmouseover="this.style.background='var(--hover)'" 
                 onmouseout="this.style.background='none'">
                <div style="width:40px; height:40px; border-radius:50%; background:var(--gradient); overflow:hidden; flex-shrink:0;">
                    ${u.profilePic ? `<img src="${u.profilePic}" style="width:100%;height:100%;object-fit:cover;">` : 
                    `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;font-size:18px;">${u.avatar || u.firstName?.charAt(0)}</div>`}
                </div>
                <div style="flex:1; min-width:0;">
                    <div style="font-weight:600; font-size:14px;">${u.fullName} ${u.verified ? '<i class="fas fa-check-circle" style="color:#1877f2;"></i>' : ''}</div>
                    <div style="font-size:11px; color:#64748b;">📍 ${u.location || u.country || 'Worldwide'}</div>
                </div>
                <button onclick="event.stopPropagation(); sendFriendRequest('${u.id}')" 
                    style="background:var(--primary); color:white; border:none; padding:6px 14px; border-radius:16px; cursor:pointer; font-size:12px; white-space:nowrap;">
                    ${DB.friends[getCurrentUser()?.id]?.includes(u.id) ? '✅ Friends' : '+ Add'}
                </button>
            </div>
        `).join('');
    }
    
    resultsDiv.style.display = 'block';
}

function viewProfile(userId) {
    window.location.href = 'profile.html?id=' + userId;
}

// ============ REAL STORY UPLOAD ============
function createStory() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*';
    fileInput.capture = 'environment';
    
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const story = {
                id: 'story_' + Date.now(),
                userId: getCurrentUser().id,
                userName: getCurrentUser().fullName,
                mediaUrl: e.target.result,
                mediaType: file.type.startsWith('video') ? 'video' : 'image',
                time: new Date().toISOString(),
                views: []
            };
            
            if (!DB.stories) DB.stories = [];
            DB.stories.unshift(story);
            
            // Auto-delete after 24 hours
            setTimeout(() => {
                DB.stories = DB.stories.filter(s => s.id !== story.id);
                saveDB();
                if (document.getElementById('storiesContainer')) renderStories();
            }, 86400000);
            
            saveDB();
            addNotification('📸 Story', 'You created a new story!');
            alert('✅ Story created successfully! It will be visible for 24 hours.');
            
            if (document.getElementById('storiesContainer')) renderStories();
            if (document.getElementById('storiesRow')) renderStoriesRow();
        };
        reader.readAsDataURL(file);
    };
    
    fileInput.click();
}

function viewStory(storyId) {
    const story = DB.stories?.find(s => s.id === storyId);
    if (!story) {
        alert('Story not found or has expired.');
        return;
    }
    
    // Create full-screen story viewer
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.95); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center;';
    
    overlay.innerHTML = `
        <div style="position:absolute; top:20px; left:20px; color:white; font-weight:600;">${story.userName}</div>
        <div style="position:absolute; top:20px; right:20px; color:white; cursor:pointer; font-size:24px;" onclick="this.parentElement.remove()">✕</div>
        ${story.mediaType === 'video' ? 
            `<video src="${story.mediaUrl}" controls autoplay style="max-width:90%; max-height:80vh; border-radius:12px;"></video>` : 
            `<img src="${story.mediaUrl}" style="max-width:90%; max-height:80vh; border-radius:12px;">`
        }
        <div style="color:white; margin-top:16px;">${timeAgo(story.time)}</div>
    `;
    
    document.body.appendChild(overlay);
    overlay.onclick = function(e) {
        if (e.target === overlay) overlay.remove();
    };
}

// ============ REAL POST WITH PHOTOS/VIDEOS ============
function createPost() {
    const statusInput = document.getElementById('statusInput');
    const text = statusInput ? statusInput.value.trim() : '';
    
    if (!text && !window.pendingMedia) {
        alert('Please write something or add a photo/video!');
        return;
    }
    
    const user = getCurrentUser();
    const post = {
        id: 'post_' + Date.now(),
        userId: user.id,
        userName: user.fullName,
        userAvatar: user.avatar,
        userProfilePic: user.profilePic,
        userVerified: user.verified,
        userLocation: user.location || user.country,
        text: text || '📸 Shared media',
        mediaUrl: window.pendingMedia || null,
        mediaType: window.pendingMediaType || null,
        likes: [], loves: [], laughs: [], wows: [], sads: [], angries: [],
        comments: [], shares: [],
        time: new Date().toISOString()
    };
    
    DB.posts.unshift(post);
    window.pendingMedia = null;
    window.pendingMediaType = null;
    if (statusInput) statusInput.value = '';
    saveDB();
    renderPosts();
    addNotification('📝 Post', 'Your post has been shared!');
    alert('✅ Post created successfully!');
}

function handleMediaUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        window.pendingMedia = e.target.result;
        window.pendingMediaType = file.type.startsWith('video') ? 'video' : 'image';
        // Auto-create post after media is loaded
        createPost();
    };
    reader.readAsDataURL(file);
}

// Also handle profile media upload
function handleProfileMedia(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        window.pendingMedia = e.target.result;
        window.pendingMediaType = file.type.startsWith('video') ? 'video' : 'image';
        createProfilePost();
    };
    reader.readAsDataURL(file);
}

function createProfilePost() {
    const input = document.getElementById('profileStatusInput');
    const text = input?.value?.trim() || '';
    
    if (!text && !window.pendingMedia) return;
    
    const user = getCurrentUser();
    const post = {
        id: 'post_' + Date.now(),
        userId: user.id,
        userName: user.fullName,
        userAvatar: user.avatar,
        userProfilePic: user.profilePic,
        userVerified: user.verified,
        userLocation: user.location || user.country,
        text: text || '📸 Shared media',
        mediaUrl: window.pendingMedia || null,
        mediaType: window.pendingMediaType || null,
        likes: [], loves: [], laughs: [], wows: [], sads: [], angries: [],
        comments: [], shares: [],
        time: new Date().toISOString()
    };
    
    DB.posts.unshift(post);
    window.pendingMedia = null;
    window.pendingMediaType = null;
    if (input) input.value = '';
    saveDB();
    renderProfilePosts();
    addNotification('📝 Post', 'New post created!');
}

function renderPosts() {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const friendIds = DB.friends[currentUser.id] || [];
    let relevantPosts = DB.posts.filter(post => 
        post.userId === currentUser.id || friendIds.includes(post.userId)
    );
    
    relevantPosts.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    if (!relevantPosts.length) {
        container.innerHTML = '<div class="card-widget"><p style="text-align:center; padding:20px;">No posts yet. Be the first to share! 🌍</p></div>';
        return;
    }
    
    container.innerHTML = relevantPosts.map(post => {
        const isLiked = (post.likes||[]).includes(currentUser.id);
        const isLoved = (post.loves||[]).includes(currentUser.id);
        const isLaughed = (post.laughs||[]).includes(currentUser.id);
        
        return `
            <div class="post-card">
                <div class="post-header-info">
                    <div class="post-avatar" onclick="viewProfile('${post.userId}')" style="cursor:pointer;">
                        ${post.userProfilePic ? `<img src="${post.userProfilePic}" alt="${post.userName}">` : post.userAvatar}
                    </div>
                    <div class="post-user-details">
                        <div class="post-username" onclick="viewProfile('${post.userId}')" style="cursor:pointer;">
                            ${post.userName} 
                            ${post.userVerified ? '<i class="fas fa-check-circle verified-check"></i>' : ''}
                        </div>
                        <div class="post-meta">${timeAgo(post.time)} • 📍 ${post.userLocation}</div>
                    </div>
                </div>
                <div class="post-text">${post.text}</div>
                ${post.mediaUrl ? 
                    (post.mediaType === 'video' ? 
                        `<video src="${post.mediaUrl}" controls class="post-media-content" style="width:100%; border-radius:8px; max-height:400px;"></video>` : 
                        `<img src="${post.mediaUrl}" class="post-media-content" alt="Post" onclick="viewFullImage('${post.mediaUrl}')" style="cursor:pointer;">`
                    ) : ''}
                <div class="post-reaction-bar">
                    <button class="reaction-btn ${isLiked ? 'active-reaction' : ''}" onclick="reactToPost('${post.id}', 'like')">👍 ${(post.likes||[]).length}</button>
                    <button class="reaction-btn ${isLoved ? 'active-reaction' : ''}" onclick="reactToPost('${post.id}', 'love')">❤️ ${(post.loves||[]).length}</button>
                    <button class="reaction-btn ${isLaughed ? 'active-reaction' : ''}" onclick="reactToPost('${post.id}', 'laugh')">😂 ${(post.laughs||[]).length}</button>
                    <button class="reaction-btn" onclick="reactToPost('${post.id}', 'wow')">😮 ${(post.wows||[]).length}</button>
                </div>
                <div style="display:flex; gap:8px; padding:4px 0;">
                    <button class="reaction-btn" onclick="toggleComments('${post.id}')">💬 ${(post.comments||[]).length} Comments</button>
                    <button class="reaction-btn" onclick="sharePost('${post.id}')">🔄 ${(post.shares||[]).length} Shares</button>
                </div>
                <div id="comments-${post.id}" style="display:none;">
                    ${(post.comments||[]).map(c => `
                        <div style="background:var(--dark); padding:6px 10px; border-radius:12px; margin:4px 0; font-size:13px;">
                            <strong>${c.user}</strong>: ${c.text}
                        </div>
                    `).join('')}
                    <div class="comment-box" style="display:flex; gap:8px; margin-top:8px;">
                        <button onclick="showEmojiForComment('commentInput-${post.id}')" style="background:none; border:none; cursor:pointer; font-size:18px;">😊</button>
                        <input type="text" id="commentInput-${post.id}" placeholder="Write a comment..." style="flex:1; padding:8px; border-radius:20px; background:var(--dark); border:1px solid var(--border); color:#e2e8f0;" onkeypress="if(event.key==='Enter')addComment('${post.id}')">
                        <button onclick="addComment('${post.id}')" style="background:var(--primary); color:white; border:none; padding:8px 16px; border-radius:20px; cursor:pointer;">Send</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function reactToPost(postId, type) {
    const post = DB.posts.find(p => p.id === postId);
    if (!post) return;
    
    if (!post[type + 's']) post[type + 's'] = [];
    const arr = post[type + 's'];
    const userId = getCurrentUser().id;
    
    if (arr.includes(userId)) {
        arr.splice(arr.indexOf(userId), 1);
    } else {
        arr.push(userId);
    }
    
    saveDB();
    renderPosts();
}

function toggleComments(postId) {
    const div = document.getElementById('comments-' + postId);
    if (div) {
        div.style.display = div.style.display === 'none' ? 'block' : 'none';
    }
}

function addComment(postId) {
    const input = document.getElementById('commentInput-' + postId);
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    
    const post = DB.posts.find(p => p.id === postId);
    if (!post) return;
    
    if (!post.comments) post.comments = [];
    post.comments.push({
        user: getCurrentUser().fullName,
        text: text,
        time: new Date().toISOString()
    });
    
    input.value = '';
    saveDB();
    renderPosts();
    document.getElementById('comments-' + postId).style.display = 'block';
    addNotification('💬 Comment', 'You commented on a post');
}

function sharePost(postId) {
    const post = DB.posts.find(p => p.id === postId);
    if (!post) return;
    
    const userId = getCurrentUser().id;
    if (!post.shares) post.shares = [];
    if (!post.shares.includes(userId)) {
        post.shares.push(userId);
    }
    
    const newShare = {
        id: 'post_' + Date.now(),
        userId: userId,
        userName: getCurrentUser().fullName,
        userAvatar: getCurrentUser().avatar,
        userProfilePic: getCurrentUser().profilePic,
        userVerified: getCurrentUser().verified,
        userLocation: getCurrentUser().location || getCurrentUser().country,
        text: `🔄 Shared: ${post.text}`,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        likes: [], loves: [], laughs: [], wows: [], sads: [], angries: [],
        comments: [], shares: [],
        time: new Date().toISOString()
    };
    
    DB.posts.unshift(newShare);
    saveDB();
    renderPosts();
    addNotification('🔄 Share', 'You shared a post!');
    alert('✅ Post shared!');
}

function viewFullImage(mediaUrl) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.95); z-index:9999; display:flex; align-items:center; justify-content:center; cursor:pointer;';
    overlay.innerHTML = `<img src="${mediaUrl}" style="max-width:90%; max-height:90%; border-radius:8px;">`;
    overlay.onclick = () => overlay.remove();
    document.body.appendChild(overlay);
}

// ============ EMOJI FOR COMMENTS ============
const emojiList = ['😀','😂','😍','🥰','😘','😊','🤗','🤔','😎','🔥','❤️','💯','👍','👏','🙌','🎉','💪','✌️','🌟','💡','📸','🎵','💬','✅','❌','🔔','📍','🏠','🚗','✈️','🌈','🍕','☕','🎂','⚽','📱','💻','🎮'];

function showEmojiForComment(inputId) {
    const existing = document.querySelector('.emoji-picker-popup');
    if (existing) {
        existing.remove();
        return;
    }
    
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const picker = document.createElement('div');
    picker.className = 'emoji-picker-popup';
    picker.style.cssText = 'position:absolute; bottom:100%; left:0; background:var(--card); border:1px solid var(--border); border-radius:12px; padding:8px; display:grid; grid-template-columns:repeat(8,1fr); gap:4px; z-index:1000; max-height:200px; overflow-y:auto; width:280px;';
    
    emojiList.forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.style.cssText = 'cursor:pointer; padding:6px; font-size:20px; text-align:center; border-radius:6px;';
        span.onmouseover = () => span.style.background = 'var(--hover)';
        span.onmouseout = () => span.style.background = 'none';
        span.onclick = () => {
            input.value += emoji;
            input.focus();
            picker.remove();
        };
        picker.appendChild(span);
    });
    
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(picker);
    
    setTimeout(() => {
        document.addEventListener('click', function closePicker(e) {
            if (!picker.contains(e.target) && e.target !== input) {
                picker.remove();
                document.removeEventListener('click', closePicker);
            }
        });
    }, 100);
}

// ============ REAL COVER & PROFILE PHOTOS ============
function updateCover(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const coverUrl = e.target.result;
        
        // Update profile user
        const urlParams = new URLSearchParams(window.location.search);
        const profileUserId = urlParams.get('id') || getCurrentUser()?.id;
        const profileUser = DB.users.find(u => u.id === profileUserId);
        
        if (profileUser) {
            profileUser.coverPic = coverUrl;
            if (profileUser.id === getCurrentUser()?.id) {
                DB.currentUser.coverPic = coverUrl;
            }
        }
        
        saveDB();
        
        // Update display
        const coverImage = document.getElementById('coverImage');
        const coverPlaceholder = document.getElementById('coverPlaceholder');
        if (coverImage) {
            coverImage.src = coverUrl;
            coverImage.style.display = 'block';
        }
        if (coverPlaceholder) coverPlaceholder.style.display = 'none';
        
        addNotification('📸 Cover', 'Cover photo updated!');
        alert('✅ Cover photo updated successfully!');
        
        // Auto-create a post about it
        const post = {
            id: 'post_' + Date.now(),
            userId: getCurrentUser().id,
            userName: getCurrentUser().fullName,
            userAvatar: getCurrentUser().avatar,
            userProfilePic: getCurrentUser().profilePic,
            userVerified: getCurrentUser().verified,
            userLocation: getCurrentUser().location || getCurrentUser().country,
            text: '🖼️ Updated cover photo',
            mediaUrl: coverUrl,
            mediaType: 'image',
            likes: [], loves: [], laughs: [], wows: [], sads: [], angries: [],
            comments: [], shares: [],
            time: new Date().toISOString()
        };
        DB.posts.unshift(post);
        saveDB();
    };
    reader.readAsDataURL(file);
}

function updateProfilePic(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const picUrl = e.target.result;
        
        // Update profile user
        const urlParams = new URLSearchParams(window.location.search);
        const profileUserId = urlParams.get('id') || getCurrentUser()?.id;
        const profileUser = DB.users.find(u => u.id === profileUserId);
        
        if (profileUser) {
            profileUser.profilePic = picUrl;
            if (profileUser.id === getCurrentUser()?.id) {
                DB.currentUser.profilePic = picUrl;
            }
        }
        
        saveDB();
        
        // Update display
        const profileImage = document.getElementById('profileImage');
        const profileInitial = document.getElementById('profileInitial');
        if (profileImage) {
            profileImage.src = picUrl;
            profileImage.style.display = 'block';
        }
        if (profileInitial) profileInitial.style.display = 'none';
        
        // Update all avatars on page
        updateAllAvatars(picUrl);
        
        addNotification('📸 Profile', 'Profile picture updated!');
        alert('✅ Profile picture updated successfully!');
        
        // Auto-create a post about it
        const post = {
            id: 'post_' + Date.now(),
            userId: getCurrentUser().id,
            userName: getCurrentUser().fullName,
            userAvatar: getCurrentUser().avatar,
            userProfilePic: picUrl,
            userVerified: getCurrentUser().verified,
            userLocation: getCurrentUser().location || getCurrentUser().country,
            text: '📸 Updated profile picture',
            mediaUrl: picUrl,
            mediaType: 'image',
            likes: [], loves: [], laughs: [], wows: [], sads: [], angries: [],
            comments: [], shares: [],
            time: new Date().toISOString()
        };
        DB.posts.unshift(post);
        saveDB();
        
        // Reload full profile to update everything
        if (typeof loadFullProfile === 'function') {
            loadFullProfile();
        }
    };
    reader.readAsDataURL(file);
}

function updateAllAvatars(picUrl) {
    // Update header avatar
    const headerAvatar = document.getElementById('headerAvatar');
    if (headerAvatar) {
        headerAvatar.innerHTML = `<img src="${picUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }
    
    // Update feed avatar
    const feedAvatar = document.getElementById('feedAvatar');
    if (feedAvatar) {
        feedAvatar.innerHTML = `<img src="${picUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }
    
    // Update sidebar avatar
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if (sidebarAvatar) {
        sidebarAvatar.innerHTML = `<img src="${picUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }
    
    // Update story avatar
    const storyAvatar = document.getElementById('storyAvatar');
    if (storyAvatar && storyAvatar.parentElement?.querySelector('img')) {
        storyAvatar.parentElement.querySelector('img').src = picUrl;
    }
}

// ============ FRIENDS ============
function renderFriendSuggestions() {
    const container = document.getElementById('friendSuggestions');
    if (!container) return;
    
    const currentUser = getCurrentUser();
    const friendIds = DB.friends[currentUser.id] || [];
    
    const suggestions = DB.users.filter(u => 
        u.id !== currentUser.id && !friendIds.includes(u.id)
    ).slice(0, 5);
    
    if (!suggestions.length) {
        container.innerHTML = '<p style="color:#64748b; font-size:13px;">No suggestions</p>';
        return;
    }
    
    container.innerHTML = suggestions.map(u => `
        <div style="display:flex; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid var(--border);">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--gradient); overflow:hidden; flex-shrink:0; cursor:pointer;" onclick="viewProfile('${u.id}')">
                ${u.profilePic ? `<img src="${u.profilePic}" style="width:100%;height:100%;object-fit:cover;">` : 
                `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;">${u.avatar}</div>`}
            </div>
            <div style="flex:1; font-size:13px; cursor:pointer;" onclick="viewProfile('${u.id}')">
                <strong>${u.fullName}</strong>
                <div style="color:#64748b; font-size:11px;">📍 ${u.location || u.country}</div>
            </div>
            <button onclick="sendFriendRequest('${u.id}')" style="background:var(--primary); color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px;">Add</button>
        </div>
    `).join('');
}

function sendFriendRequest(userId) {
    const currentUser = getCurrentUser();
    const user = DB.users.find(u => u.id === userId);
    if (!user) return;
    
    if (!DB.friendRequests) DB.friendRequests = {};
    if (!DB.friendRequests[userId]) DB.friendRequests[userId] = [];
    
    if (DB.friendRequests[userId].includes(currentUser.id)) {
        alert('Friend request already sent!');
        return;
    }
    
    if (DB.friends[currentUser.id]?.includes(userId)) {
        alert('You are already friends!');
        return;
    }
    
    DB.friendRequests[userId].push(currentUser.id);
    saveDB();
    addNotification('👥 Friend Request', 'Sent to ' + user.fullName);
    alert('✅ Friend request sent!');
    renderFriendSuggestions();
}

// ============ STORIES RENDERING ============
function renderStories() {
    const container = document.getElementById('storiesContainer');
    if (!container) return;
    
    const currentUser = getCurrentUser();
    
    let html = `
        <div class="story-circle" onclick="createStory()" style="background:var(--card); display:flex; align-items:center; justify-content:center; flex-direction:column; cursor:pointer;">
            <div style="width:60px; height:60px; border-radius:50%; font-size:24px; margin-bottom:20px; background:var(--gradient); display:flex; align-items:center; justify-content:center; color:white; overflow:hidden;" id="storyAvatarCircle">
                ${currentUser.profilePic ? `<img src="${currentUser.profilePic}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : '+'}
            </div>
            <div class="story-user" style="position:static; color:white; text-align:center; font-size:11px;">Create Story</div>
        </div>
    `;
    
    if (DB.stories) {
        const recentStories = DB.stories.filter(s => 
            (new Date() - new Date(s.time)) < 86400000
        ).slice(0, 8);
        
        recentStories.forEach(story => {
            html += `
                <div class="story-circle" onclick="viewStory('${story.id}')" style="cursor:pointer;">
                    ${story.mediaUrl ? `<img src="${story.mediaUrl}" style="width:100%;height:100%;object-fit:cover;">` : ''}
                    <div class="story-user">${story.userName.split(' ')[0]}</div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

// ============ NOTIFICATIONS ============
function addNotification(type, text) {
    if (!DB.notifications) DB.notifications = [];
    DB.notifications.unshift({
        id: 'notif_' + Date.now(),
        type, text,
        time: new Date().toISOString(),
        read: false
    });
    if (DB.notifications.length > 100) DB.notifications = DB.notifications.slice(0, 100);
    saveDB();
    updateNotificationBadge();
}

function loadRealNotifications() {
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const badge = document.getElementById('notifBadge');
    if (!badge) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const unreadNotifs = (DB.notifications || []).filter(n => !n.read).length;
    const friendReqs = (DB.friendRequests?.[currentUser.id] || []).length;
    let unreadMsgs = 0;
    
    const friendIds = DB.friends[currentUser.id] || [];
    friendIds.forEach(fid => {
        const chatKey = [currentUser.id, fid].sort().join('_');
        const msgs = DB.messages[chatKey] || [];
        unreadMsgs += msgs.filter(m => m.from === fid && !m.read).length;
    });
    
    const total = unreadNotifs + friendReqs + unreadMsgs;
    badge.textContent = total;
    badge.style.display = total > 0 ? 'block' : 'none';
}

function toggleNotifications() {
    const panel = document.getElementById('notifPanel');
    if (!panel) return;
    
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
        return;
    }
    
    panel.style.display = 'block';
    
    const notifList = document.getElementById('notifList');
    if (!notifList) return;
    
    const allNotifs = DB.notifications || [];
    
    if (!allNotifs.length) {
        notifList.innerHTML = '<p style="text-align:center; padding:20px; color:#64748b;">No notifications yet</p>';
    } else {
        notifList.innerHTML = allNotifs.slice(0, 20).map(n => `
            <div style="padding:10px 12px; border-bottom:1px solid var(--border); ${n.read ? '' : 'background:var(--hover); border-left:3px solid var(--primary);'}">
                <strong>${n.type}</strong>: ${n.text}
                <small style="display:block; color:#64748b;">${timeAgo(n.time)}</small>
            </div>
        `).join('');
    }
    
    // Mark all read
    if (DB.notifications) {
        DB.notifications.forEach(n => n.read = true);
        saveDB();
        updateNotificationBadge();
    }
}

// ============ CHAT ============
let currentChatPartner = null;

function renderChatContacts() {
    const contactsDiv = document.getElementById('chatContactsList');
    if (!contactsDiv) return;
    
    const currentUser = getCurrentUser();
    const friendIds = DB.friends[currentUser.id] || [];
    const friends = DB.users.filter(u => friendIds.includes(u.id));
    
    if (!friends.length) {
        contactsDiv.innerHTML = '<p style="padding:12px; color:#64748b;">Add friends to start chatting!</p>';
        return;
    }
    
    contactsDiv.innerHTML = friends.map(u => `
        <div style="display:flex; align-items:center; gap:10px; padding:10px; cursor:pointer; border-bottom:1px solid var(--border);" onclick="openChat('${u.id}', '${u.fullName}')">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--gradient); overflow:hidden;">
                ${u.profilePic ? `<img src="${u.profilePic}" style="width:100%;height:100%;object-fit:cover;">` : 
                `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;">${u.avatar}</div>`}
            </div>
            <span>${u.fullName}</span>
        </div>
    `).join('');
}

function openChat(userId, name) {
    currentChatPartner = userId;
    const contactsList = document.getElementById('chatContactsList');
    const chatInner = document.getElementById('chatWindowInner');
    
    if (contactsList) contactsList.style.display = 'none';
    if (chatInner) chatInner.style.display = 'block';
    
    const label = document.getElementById('chatPartnerLabel');
    if (label) label.textContent = name;
    
    const area = document.getElementById('chatMessagesArea');
    if (area) {
        area.innerHTML = '';
        const chatKey = [getCurrentUser().id, userId].sort().join('_');
        if (DB.messages[chatKey]) {
            DB.messages[chatKey].forEach(m => {
                const cls = m.from === getCurrentUser().id ? 'sent-msg' : 'received-msg';
                area.innerHTML += `<div class="chat-msg ${cls}" style="margin-bottom:6px;">${m.text}</div>`;
            });
        }
        area.scrollTop = area.scrollHeight;
    }
}

function sendChatMsg() {
    const input = document.getElementById('chatMsgInput');
    const text = input?.value?.trim();
    if (!text || !currentChatPartner) return;
    
    const chatKey = [getCurrentUser().id, currentChatPartner].sort().join('_');
    if (!DB.messages[chatKey]) DB.messages[chatKey] = [];
    
    DB.messages[chatKey].push({ 
        from: getCurrentUser().id, 
        text, 
        time: new Date().toISOString(), 
        read: false 
    });
    
    const area = document.getElementById('chatMessagesArea');
    if (area) {
        area.innerHTML += `<div class="chat-msg sent-msg" style="margin-bottom:6px;">${text}</div>`;
        area.scrollTop = area.scrollHeight;
    }
    
    if (input) input.value = '';
    saveDB();
}

function backToContacts() {
    const contactsList = document.getElementById('chatContactsList');
    const chatInner = document.getElementById('chatWindowInner');
    if (contactsList) contactsList.style.display = 'block';
    if (chatInner) chatInner.style.display = 'none';
    currentChatPartner = null;
}

function toggleChatWindow() {
    // Handle chat widget toggle
}

// ============ OTHER FUNCTIONS ============
function goLive() {
    window.location.href = 'live.html';
}

function verifyProfile() {
    const user = getCurrentUser();
    if (user.verified) {
        alert('✅ Already verified!');
        return;
    }
    if (confirm('🔵 Request blue verification badge?')) {
        user.verified = true;
        const userInDb = DB.users.find(u => u.id === user.id);
        if (userInDb) userInDb.verified = true;
        saveDB();
        addNotification('🔵 Verified', 'Profile verified!');
        alert('🎉 Verified! Blue badge added.');
        initPage();
    }
}

function toggleUserMenu() {
    const panel = document.getElementById('userMenuPanel');
    if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function logout() {
    if (confirm('Log out?')) {
        DB.currentUser = null;
        saveDB();
        window.location.href = 'index.html';
    }
}

function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
    return date.toLocaleDateString();
}

// ============ INIT PAGE ============
function initPage() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update all avatars
    const headerAvatar = document.getElementById('headerAvatar');
    const headerUserName = document.getElementById('headerUserName');
    const feedAvatar = document.getElementById('feedAvatar');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarUserName = document.getElementById('sidebarUserName');
    
    if (headerAvatar) {
        if (user.profilePic) {
            headerAvatar.innerHTML = `<img src="${user.profilePic}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            headerAvatar.textContent = user.avatar;
        }
    }
    if (headerUserName) headerUserName.textContent = user.firstName;
    if (feedAvatar) {
        if (user.profilePic) {
            feedAvatar.innerHTML = `<img src="${user.profilePic}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            feedAvatar.textContent = user.avatar;
        }
    }
    if (sidebarAvatar) {
        if (user.profilePic) {
            sidebarAvatar.innerHTML = `<img src="${user.profilePic}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            sidebarAvatar.textContent = user.avatar;
        }
    }
    if (sidebarUserName) sidebarUserName.textContent = user.fullName;
    
    const friendCountSidebar = document.getElementById('friendCountSidebar');
    if (friendCountSidebar && DB.friends[user.id]) {
        friendCountSidebar.textContent = '(' + DB.friends[user.id].length + ')';
    }
    
    if (document.getElementById('postsContainer')) {
        renderPosts();
        renderStories();
        renderFriendSuggestions();
    }
    if (document.getElementById('friendsContainer')) {
        if (typeof renderFriends === 'function') renderFriends();
    }
    
    updateNotificationBadge();
    renderChatContacts();
}
