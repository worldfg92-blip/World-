// ============ WORLD FG - COMPLETE APP FUNCTIONS ============

if (!isLoggedIn()) {
    window.location.href = 'index.html';
}

window.pendingMedia = null;
window.pendingMediaType = null;

document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

// ============ COVER PHOTO UPLOAD ============
function changeCover() {
    document.getElementById('coverUpload').click();
}

function updateCover(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const coverUrl = e.target.result;
        const currentUser = getCurrentUser();
        
        // Get profile user (could be viewing someone else's profile)
        const urlParams = new URLSearchParams(window.location.search);
        const profileUserId = urlParams.get('id') || currentUser.id;
        const profileUser = DB.users.find(u => u.id === profileUserId);
        
        if (profileUser) {
            profileUser.coverPic = coverUrl;
            if (profileUser.id === currentUser.id) {
                currentUser.coverPic = coverUrl;
            }
        }
        
        saveDB();
        
        // Update the cover image display
        const coverImage = document.getElementById('coverImage');
        const coverPlaceholder = document.getElementById('coverPlaceholder');
        if (coverImage) {
            coverImage.src = coverUrl;
            coverImage.style.display = 'block';
        }
        if (coverPlaceholder) coverPlaceholder.style.display = 'none';
        
        alert('✅ Cover photo updated successfully!');
        addNotification('📸 Cover Photo', 'Your cover photo has been updated!');
    };
    reader.readAsDataURL(file);
}

// ============ PROFILE PICTURE UPLOAD ============
function changeProfilePic() {
    document.getElementById('profilePicUpload').click();
}

function updateProfilePic(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const picUrl = e.target.result;
        const currentUser = getCurrentUser();
        
        const urlParams = new URLSearchParams(window.location.search);
        const profileUserId = urlParams.get('id') || currentUser.id;
        const profileUser = DB.users.find(u => u.id === profileUserId);
        
        if (profileUser) {
            profileUser.profilePic = picUrl;
            if (profileUser.id === currentUser.id) {
                currentUser.profilePic = picUrl;
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
        
        // Update header avatar
        const headerAvatar = document.getElementById('headerAvatar');
        if (headerAvatar) {
            headerAvatar.innerHTML = `<img src="${picUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        }
        
        alert('✅ Profile picture updated successfully!');
        addNotification('📸 Profile Picture', 'Your profile picture has been updated!');
    };
    reader.readAsDataURL(file);
}

// ============ POST WITH MEDIA ============
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
        likes: [],
        loves: [],
        laughs: [],
        wows: [],
        comments: [],
        shares: [],
        time: new Date().toISOString()
    };
    
    DB.posts.unshift(post);
    window.pendingMedia = null;
    window.pendingMediaType = null;
    if (statusInput) statusInput.value = '';
    saveDB();
    renderPosts();
    alert('✅ Post created!');
    addNotification('📝 Post', 'Your post has been shared!');
}

function handleMediaUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        window.pendingMedia = e.target.result;
        window.pendingMediaType = file.type.startsWith('video') ? 'video' : 'image';
        createPost();
    };
    reader.readAsDataURL(file);
}

// ============ RENDER POSTS WITH EMOJI REACTIONS ============
function renderPosts() {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const friendIds = DB.friends[currentUser.id] || [];
    let posts = DB.posts.filter(post => 
        post.userId === currentUser.id || friendIds.includes(post.userId)
    );
    
    if (!posts.length) {
        container.innerHTML = '<div class="card-widget"><p style="text-align:center; padding:20px;">No posts yet. Be the first to share! 🌍</p></div>';
        return;
    }
    
    container.innerHTML = posts.map(post => {
        const isLiked = (post.likes || []).includes(currentUser.id);
        const isLoved = (post.loves || []).includes(currentUser.id);
        const isLaughed = (post.laughs || []).includes(currentUser.id);
        const isWowed = (post.wows || []).includes(currentUser.id);
        
        return `
            <div class="post-card">
                <div class="post-header-info">
                    <div class="post-avatar" onclick="goToProfile('${post.userId}')" style="cursor:pointer;">
                        ${post.userProfilePic ? `<img src="${post.userProfilePic}" alt="${post.userName}">` : (post.userAvatar || '?')}
                    </div>
                    <div class="post-user-details">
                        <div class="post-username" onclick="goToProfile('${post.userId}')" style="cursor:pointer;">
                            ${post.userName} 
                            ${post.userVerified ? '<i class="fas fa-check-circle verified-check"></i>' : ''}
                        </div>
                        <div class="post-meta">${timeAgo(post.time)} • 📍 ${post.userLocation}</div>
                    </div>
                </div>
                <div class="post-text">${post.text}</div>
                ${post.mediaUrl ? 
                    (post.mediaType === 'video' ? 
                        `<video src="${post.mediaUrl}" controls style="width:100%; border-radius:8px; max-height:400px;"></video>` : 
                        `<img src="${post.mediaUrl}" style="width:100%; border-radius:8px; max-height:400px; object-fit:cover; cursor:pointer;" onclick="viewImage('${post.mediaUrl}')">`
                    ) : ''}
                <div class="post-reaction-bar" style="display:flex; justify-content:space-around; padding:8px 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border); margin:8px 0;">
                    <span onclick="reactToPost('${post.id}', 'like')" style="cursor:pointer; ${isLiked ? 'color:var(--primary); font-weight:bold;' : ''}">👍 Like (${(post.likes||[]).length})</span>
                    <span onclick="reactToPost('${post.id}', 'love')" style="cursor:pointer; ${isLoved ? 'color:#ef4444; font-weight:bold;' : ''}">❤️ Love (${(post.loves||[]).length})</span>
                    <span onclick="reactToPost('${post.id}', 'laugh')" style="cursor:pointer; ${isLaughed ? 'color:#f59e0b; font-weight:bold;' : ''}">😂 Laugh (${(post.laughs||[]).length})</span>
                    <span onclick="reactToPost('${post.id}', 'wow')" style="cursor:pointer; ${isWowed ? 'color:#8b5cf6; font-weight:bold;' : ''}">😮 Wow (${(post.wows||[]).length})</span>
                </div>
                <div style="display:flex; gap:8px; padding:4px 0;">
                    <span onclick="toggleComments('${post.id}')" style="cursor:pointer;">💬 Comment (${(post.comments||[]).length})</span>
                    <span onclick="sharePost('${post.id}')" style="cursor:pointer;">🔄 Share (${(post.shares||[]).length})</span>
                </div>
                <div id="comments-${post.id}" style="display:none; margin-top:8px;">
                    ${(post.comments||[]).map(c => `
                        <div style="background:var(--dark); padding:6px 10px; border-radius:12px; margin:4px 0; font-size:13px;">
                            <strong>${c.user}</strong>: ${c.text}
                        </div>
                    `).join('')}
                    <div style="display:flex; gap:8px; margin-top:8px;">
                        <input type="text" id="commentInput-${post.id}" placeholder="Write a comment..." style="flex:1; padding:8px; border-radius:20px; background:var(--dark); border:1px solid var(--border); color:#e2e8f0;" onkeypress="if(event.key==='Enter')addComment('${post.id}')">
                        <button onclick="addComment('${post.id}')" style="background:var(--primary); color:white; border:none; padding:8px 16px; border-radius:20px; cursor:pointer;">Send 😊</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function reactToPost(postId, type) {
    const post = DB.posts.find(p => p.id === postId);
    if (!post) {
        alert('Post not found!');
        return;
    }
    
    const key = type + 's';
    if (!post[key]) post[key] = [];
    
    const userId = getCurrentUser().id;
    const index = post[key].indexOf(userId);
    
    if (index > -1) {
        post[key].splice(index, 1);
    } else {
        post[key].push(userId);
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
    if (!post) {
        alert('Post not found!');
        return;
    }
    
    if (!post.comments) post.comments = [];
    post.comments.push({
        user: getCurrentUser().fullName,
        text: text,
        time: new Date().toISOString()
    });
    
    input.value = '';
    saveDB();
    renderPosts();
    
    // Keep comments visible
    setTimeout(() => {
        const div = document.getElementById('comments-' + postId);
        if (div) div.style.display = 'block';
    }, 100);
    
    addNotification('💬 Comment', 'You commented on a post');
}

function sharePost(postId) {
    const post = DB.posts.find(p => p.id === postId);
    if (!post) {
        alert('Post not found!');
        return;
    }
    
    if (!post.shares) post.shares = [];
    post.shares.push(getCurrentUser().id);
    
    // Create share post
    const newPost = {
        id: 'post_' + Date.now(),
        userId: getCurrentUser().id,
        userName: getCurrentUser().fullName,
        userAvatar: getCurrentUser().avatar,
        userProfilePic: getCurrentUser().profilePic,
        userVerified: getCurrentUser().verified,
        userLocation: getCurrentUser().location || getCurrentUser().country,
        text: '🔄 Shared: ' + post.text,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        likes: [],
        loves: [],
        laughs: [],
        wows: [],
        comments: [],
        shares: [],
        time: new Date().toISOString()
    };
    
    DB.posts.unshift(newPost);
    saveDB();
    renderPosts();
    alert('✅ Post shared!');
    addNotification('🔄 Share', 'You shared a post');
}

function viewImage(url) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.95); z-index:9999; display:flex; align-items:center; justify-content:center; cursor:pointer;';
    overlay.innerHTML = `<img src="${url}" style="max-width:90%; max-height:90%; border-radius:8px;">`;
    overlay.onclick = () => overlay.remove();
    document.body.appendChild(overlay);
}

function goToProfile(userId) {
    window.location.href = 'profile.html?id=' + userId;
}

// ============ STORIES ============
function createStory() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(ev) {
            const story = {
                id: 'story_' + Date.now(),
                userId: getCurrentUser().id,
                userName: getCurrentUser().fullName,
                mediaUrl: ev.target.result,
                time: new Date().toISOString(),
                views: []
            };
            
            if (!DB.stories) DB.stories = [];
            DB.stories.unshift(story);
            
            setTimeout(() => {
                DB.stories = DB.stories.filter(s => s.id !== story.id);
                saveDB();
            }, 86400000);
            
            saveDB();
            renderStories();
            alert('✅ Story created! Visible for 24 hours.');
            addNotification('📸 Story', 'You created a story!');
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function renderStories() {
    const container = document.getElementById('storiesContainer');
    if (!container) return;
    
    const user = getCurrentUser();
    let html = `
        <div class="story-circle" onclick="createStory()" style="background:var(--card); display:flex; align-items:center; justify-content:center; flex-direction:column; cursor:pointer;">
            <div style="width:60px; height:60px; border-radius:50%; font-size:24px; margin-bottom:20px; background:var(--gradient); display:flex; align-items:center; justify-content:center; color:white;">+</div>
            <div style="position:static; color:white; text-align:center; font-size:11px;">Create Story</div>
        </div>
    `;
    
    if (DB.stories) {
        DB.stories.filter(s => (new Date() - new Date(s.time)) < 86400000).slice(0, 8).forEach(story => {
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

function viewStory(storyId) {
    const story = DB.stories?.find(s => s.id === storyId);
    if (!story) { alert('Story expired or not found.'); return; }
    
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.95); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center;';
    overlay.innerHTML = `
        <div style="position:absolute; top:20px; left:20px; color:white; font-weight:600;">${story.userName}</div>
        <div style="position:absolute; top:20px; right:20px; color:white; cursor:pointer; font-size:24px;" onclick="this.parentElement.remove()">✕</div>
        <img src="${story.mediaUrl}" style="max-width:90%; max-height:80vh; border-radius:12px;">
        <div style="color:white; margin-top:16px;">${timeAgo(story.time)}</div>
    `;
    document.body.appendChild(overlay);
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
}

// ============ SEARCH ============
function handleSearch() {
    const input = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('searchResults');
    if (!input || !resultsDiv) return;
    
    const query = input.value.toLowerCase().trim();
    if (query.length < 1) { resultsDiv.style.display = 'none'; return; }
    
    const currentUser = getCurrentUser();
    let results = DB.users.filter(u => 
        u.id !== currentUser?.id && (
            (u.fullName || '').toLowerCase().includes(query) ||
            (u.firstName || '').toLowerCase().includes(query) ||
            (u.lastName || '').toLowerCase().includes(query) ||
            (u.location || '').toLowerCase().includes(query) ||
            (u.country || '').toLowerCase().includes(query)
        )
    );
    
    results = [...new Map(results.map(u => [u.id, u])).values()];
    
    if (!results.length) {
        resultsDiv.innerHTML = '<p style="padding:16px; text-align:center; color:#64748b;">No users found</p>';
    } else {
        resultsDiv.innerHTML = results.map(u => `
            <div style="padding:10px; cursor:pointer; display:flex; align-items:center; gap:10px; border-bottom:1px solid var(--border);" 
                 onclick="goToProfile('${u.id}')" onmouseover="this.style.background='var(--hover)'" onmouseout="this.style.background='none'">
                <div style="width:40px; height:40px; border-radius:50%; background:var(--gradient); overflow:hidden;">
                    ${u.profilePic ? `<img src="${u.profilePic}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;">${u.avatar || '?'}</div>`}
                </div>
                <div style="flex:1;">
                    <strong>${u.fullName}</strong> ${u.verified ? '<i class="fas fa-check-circle" style="color:#1877f2;"></i>' : ''}
                    <div style="font-size:11px; color:#64748b;">📍 ${u.location || u.country}</div>
                </div>
            </div>
        `).join('');
    }
    resultsDiv.style.display = 'block';
}

// ============ FRIENDS ============
function renderFriendSuggestions() {
    const container = document.getElementById('friendSuggestions');
    if (!container) return;
    
    const user = getCurrentUser();
    const friendIds = DB.friends[user.id] || [];
    const suggestions = DB.users.filter(u => u.id !== user.id && !friendIds.includes(u.id)).slice(0, 5);
    
    container.innerHTML = suggestions.length ? suggestions.map(u => `
        <div style="display:flex; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid var(--border);">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--gradient); overflow:hidden; cursor:pointer;" onclick="goToProfile('${u.id}')">
                ${u.profilePic ? `<img src="${u.profilePic}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;">${u.avatar}</div>`}
            </div>
            <div style="flex:1; font-size:13px; cursor:pointer;" onclick="goToProfile('${u.id}')">
                <strong>${u.fullName}</strong>
                <div style="color:#64748b; font-size:11px;">📍 ${u.location || u.country}</div>
            </div>
            <button onclick="sendFriendRequest('${u.id}')" style="background:var(--primary); color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px;">Add</button>
        </div>
    `).join('') : '<p style="color:#64748b; font-size:13px;">No suggestions</p>';
}

function sendFriendRequest(userId) {
    const user = DB.users.find(u => u.id === userId);
    if (!user) return;
    
    if (!DB.friendRequests) DB.friendRequests = {};
    if (!DB.friendRequests[userId]) DB.friendRequests[userId] = [];
    
    if (DB.friendRequests[userId].includes(getCurrentUser().id)) {
        alert('Friend request already sent!');
        return;
    }
    
    DB.friendRequests[userId].push(getCurrentUser().id);
    saveDB();
    alert('✅ Friend request sent to ' + user.fullName + '!');
    addNotification('👥 Friend', 'Sent request to ' + user.fullName);
}

// ============ NOTIFICATIONS ============
function addNotification(type, text) {
    if (!DB.notifications) DB.notifications = [];
    DB.notifications.unshift({ id: Date.now(), type, text, time: new Date().toISOString(), read: false });
    if (DB.notifications.length > 100) DB.notifications.pop();
    saveDB();
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const badge = document.getElementById('notifBadge');
    if (!badge) return;
    const count = (DB.notifications || []).filter(n => !n.read).length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
}

function toggleNotifications() {
    const panel = document.getElementById('notifPanel');
    if (!panel) return;
    
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
        return;
    }
    
    panel.style.display = 'block';
    const list = document.getElementById('notifList');
    if (!list) return;
    
    const notifs = DB.notifications || [];
    list.innerHTML = notifs.length ? notifs.slice(0, 20).map(n => `
        <div style="padding:10px; border-bottom:1px solid var(--border); ${n.read ? '' : 'background:var(--hover); border-left:3px solid var(--primary);'}">
            <strong>${n.type}</strong>: ${n.text}
            <small style="display:block; color:#64748b;">${timeAgo(n.time)}</small>
        </div>
    `).join('') : '<p style="padding:20px; text-align:center; color:#64748b;">No notifications</p>';
    
    notifs.forEach(n => n.read = true);
    saveDB();
    updateNotificationBadge();
}

// ============ CHAT ============
let currentChatPartner = null;

function renderChatContacts() {
    const div = document.getElementById('chatContactsList');
    if (!div) return;
    
    const user = getCurrentUser();
    const friendIds = DB.friends[user.id] || [];
    const friends = DB.users.filter(u => friendIds.includes(u.id));
    
    div.innerHTML = friends.length ? friends.map(u => `
        <div style="display:flex; align-items:center; gap:10px; padding:10px; cursor:pointer; border-bottom:1px solid var(--border);" onclick="openChat('${u.id}', '${u.fullName}')">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--gradient); overflow:hidden;">
                ${u.profilePic ? `<img src="${u.profilePic}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;">${u.avatar}</div>`}
            </div>
            <span>${u.fullName}</span>
        </div>
    `).join('') : '<p style="padding:12px; color:#64748b;">Add friends to chat!</p>';
}

function openChat(userId, name) {
    currentChatPartner = userId;
    document.getElementById('chatContactsList').style.display = 'none';
    document.getElementById('chatWindowInner').style.display = 'block';
    document.getElementById('chatPartnerLabel').textContent = name;
    
    const area = document.getElementById('chatMessagesArea');
    area.innerHTML = '';
    const key = [getCurrentUser().id, userId].sort().join('_');
    if (DB.messages[key]) {
        DB.messages[key].forEach(m => {
            area.innerHTML += `<div class="chat-msg ${m.from === getCurrentUser().id ? 'sent-msg' : 'received-msg'}" style="margin-bottom:6px;">${m.text}</div>`;
        });
    }
    area.scrollTop = area.scrollHeight;
}

function sendChatMsg() {
    const input = document.getElementById('chatMsgInput');
    const text = input?.value?.trim();
    if (!text || !currentChatPartner) return;
    
    const key = [getCurrentUser().id, currentChatPartner].sort().join('_');
    if (!DB.messages[key]) DB.messages[key] = [];
    DB.messages[key].push({ from: getCurrentUser().id, text, time: new Date().toISOString() });
    
    document.getElementById('chatMessagesArea').innerHTML += `<div class="chat-msg sent-msg" style="margin-bottom:6px;">${text}</div>`;
    input.value = '';
    saveDB();
}

// ============ UTILS ============
function goLive() { window.location.href = 'live.html'; }

function verifyProfile() {
    const user = getCurrentUser();
    if (user.verified) { alert('✅ Already verified!'); return; }
    if (confirm('Get blue verification badge?')) {
        user.verified = true;
        const dbUser = DB.users.find(u => u.id === user.id);
        if (dbUser) dbUser.verified = true;
        saveDB();
        alert('✅ Verified!');
        addNotification('🔵 Verified', 'Profile verified!');
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
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}

function initPage() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update header
    const hA = document.getElementById('headerAvatar');
    const hN = document.getElementById('headerUserName');
    const fA = document.getElementById('feedAvatar');
    const sA = document.getElementById('sidebarAvatar');
    const sN = document.getElementById('sidebarUserName');
    
    if (hA) hA.innerHTML = user.profilePic ? `<img src="${user.profilePic}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : user.avatar;
    if (hN) hN.textContent = user.firstName;
    if (fA) fA.innerHTML = user.profilePic ? `<img src="${user.profilePic}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : user.avatar;
    if (sA) sA.innerHTML = user.profilePic ? `<img src="${user.profilePic}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : user.avatar;
    if (sN) sN.textContent = user.fullName;
    
    const fc = document.getElementById('friendCountSidebar');
    if (fc) fc.textContent = '(' + (DB.friends[user.id] || []).length + ')';
    
    if (document.getElementById('postsContainer')) { renderPosts(); renderStories(); renderFriendSuggestions(); }
    updateNotificationBadge();
    renderChatContacts();
}
