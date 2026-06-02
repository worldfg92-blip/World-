// ============ WORLD FG - SHARED APP FUNCTIONS ============

// Redirect if not logged in
if (!isLoggedIn()) {
    window.location.href = 'index.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    initEmojiPicker();
    initDarkMode();
    initLanguageSelector();
});

// ============ DARK/LIGHT MODE ============
function initDarkMode() {
    const mode = localStorage.getItem('worldfg_theme') || 'dark';
    applyTheme(mode);
    
    // Add theme toggle to any page
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.onclick = function() {
            const current = localStorage.getItem('worldfg_theme') || 'dark';
            const newMode = current === 'dark' ? 'light' : 'dark';
            applyTheme(newMode);
            localStorage.setItem('worldfg_theme', newMode);
        };
    }
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

// ============ LANGUAGE SELECTOR ============
const translations = {
    en: {
        home: 'Home',
        friends: 'Friends',
        marketplace: 'Marketplace',
        live: 'Live',
        messages: 'Messages',
        settings: 'Settings',
        profile: 'Profile',
        stories: 'Stories',
        whatsOnMind: "What's on your mind?",
        post: 'Post',
        like: 'Like',
        love: 'Love',
        laugh: 'Laugh',
        comment: 'Comment',
        share: 'Share',
        search: 'Search people, posts, locations...',
        notifications: 'Notifications',
        noNotifications: 'No notifications yet',
        trending: 'Trending Worldwide',
        liveNow: 'Live Now',
        peopleYouMayKnow: 'People You May Know',
        worldNews: 'World News & Updates',
        createStory: 'Create Story',
        photoVideo: 'Photo/Video',
        goLive: 'Go Live',
        verified: 'Get Verified',
        logout: 'Log Out',
        editProfile: 'Edit Profile',
        myProfile: 'My Profile',
        chats: 'Chats',
        typeMessage: 'Type a message...',
        send: 'Send',
        boost: 'Boost',
        createListing: 'Create Listing',
        addFriend: 'Add Friend',
        follow: 'Follow',
        unfollow: 'Unfollow',
    },
    es: {
        home: 'Inicio',
        friends: 'Amigos',
        marketplace: 'Mercado',
        live: 'En Vivo',
        messages: 'Mensajes',
        settings: 'Configuración',
        profile: 'Perfil',
        stories: 'Historias',
        whatsOnMind: '¿Qué estás pensando?',
        post: 'Publicar',
        like: 'Me gusta',
        love: 'Me encanta',
        laugh: 'Me divierte',
        comment: 'Comentar',
        share: 'Compartir',
        search: 'Buscar personas, publicaciones...',
        notifications: 'Notificaciones',
        noNotifications: 'Sin notificaciones',
        trending: 'Tendencias Mundiales',
        liveNow: 'En Vivo Ahora',
        peopleYouMayKnow: 'Personas que quizás conozcas',
        worldNews: 'Noticias Mundiales',
        createStory: 'Crear Historia',
        photoVideo: 'Foto/Video',
        goLive: 'Transmitir',
        verified: 'Verificado',
        logout: 'Cerrar Sesión',
        editProfile: 'Editar Perfil',
        myProfile: 'Mi Perfil',
        chats: 'Chats',
        typeMessage: 'Escribe un mensaje...',
        send: 'Enviar',
        boost: 'Impulsar',
        createListing: 'Crear Anuncio',
        addFriend: 'Agregar Amigo',
        follow: 'Seguir',
        unfollow: 'Dejar de Seguir',
    },
    fr: {
        home: 'Accueil',
        friends: 'Amis',
        marketplace: 'Marché',
        live: 'En Direct',
        messages: 'Messages',
        settings: 'Paramètres',
        profile: 'Profil',
        stories: 'Histoires',
        whatsOnMind: 'Quoi de neuf?',
        post: 'Publier',
        like: "J'aime",
        love: "J'adore",
        laugh: 'Haha',
        comment: 'Commenter',
        share: 'Partager',
        search: 'Rechercher...',
        notifications: 'Notifications',
        noNotifications: 'Aucune notification',
        trending: 'Tendances Mondiales',
        liveNow: 'En Direct',
        peopleYouMayKnow: 'Personnes que vous pourriez connaître',
        worldNews: 'Actualités Mondiales',
        createStory: 'Créer une Histoire',
        photoVideo: 'Photo/Vidéo',
        goLive: 'Direct',
        verified: 'Vérifié',
        logout: 'Déconnexion',
        editProfile: 'Modifier Profil',
        myProfile: 'Mon Profil',
        chats: 'Discussions',
        typeMessage: 'Écrivez un message...',
        send: 'Envoyer',
        boost: 'Booster',
        createListing: 'Créer Annonce',
        addFriend: 'Ajouter Ami',
        follow: 'Suivre',
        unfollow: 'Ne Plus Suivre',
    },
    de: {
        home: 'Startseite',
        friends: 'Freunde',
        marketplace: 'Marktplatz',
        live: 'Live',
        messages: 'Nachrichten',
        settings: 'Einstellungen',
        profile: 'Profil',
        stories: 'Geschichten',
        whatsOnMind: 'Was beschäftigt dich?',
        post: 'Posten',
        like: 'Gefällt mir',
        love: 'Liebe',
        laugh: 'Lachen',
        comment: 'Kommentieren',
        share: 'Teilen',
        search: 'Suchen...',
        notifications: 'Benachrichtigungen',
        noNotifications: 'Keine Benachrichtigungen',
        trending: 'Weltweite Trends',
        liveNow: 'Jetzt Live',
        peopleYouMayKnow: 'Personen die du kennen könntest',
        worldNews: 'Weltnachrichten',
        createStory: 'Geschichte erstellen',
        photoVideo: 'Foto/Video',
        goLive: 'Live Gehen',
        verified: 'Verifiziert',
        logout: 'Abmelden',
        editProfile: 'Profil Bearbeiten',
        myProfile: 'Mein Profil',
        chats: 'Chats',
        typeMessage: 'Nachricht eingeben...',
        send: 'Senden',
        boost: 'Boost',
        createListing: 'Anzeige Erstellen',
        addFriend: 'Freund Hinzufügen',
        follow: 'Folgen',
        unfollow: 'Entfolgen',
    },
    zh: {
        home: '首页',
        friends: '好友',
        marketplace: '市场',
        live: '直播',
        messages: '消息',
        settings: '设置',
        profile: '个人资料',
        stories: '故事',
        whatsOnMind: '你在想什么？',
        post: '发布',
        like: '赞',
        love: '爱',
        laugh: '笑',
        comment: '评论',
        share: '分享',
        search: '搜索...',
        notifications: '通知',
        noNotifications: '暂无通知',
        trending: '全球趋势',
        liveNow: '正在直播',
        peopleYouMayKnow: '可能认识的人',
        worldNews: '世界新闻',
        createStory: '创建故事',
        photoVideo: '照片/视频',
        goLive: '开始直播',
        verified: '已认证',
        logout: '退出',
        editProfile: '编辑资料',
        myProfile: '我的资料',
        chats: '聊天',
        typeMessage: '输入消息...',
        send: '发送',
        boost: '推广',
        createListing: '创建列表',
        addFriend: '添加好友',
        follow: '关注',
        unfollow: '取消关注',
    },
    ar: {
        home: 'الرئيسية',
        friends: 'الأصدقاء',
        marketplace: 'السوق',
        live: 'مباشر',
        messages: 'الرسائل',
        settings: 'الإعدادات',
        profile: 'الملف الشخصي',
        stories: 'القصص',
        whatsOnMind: 'بماذا تفكر؟',
        post: 'نشر',
        like: 'أعجبني',
        love: 'أحب',
        laugh: 'ضحك',
        comment: 'تعليق',
        share: 'مشاركة',
        search: 'بحث...',
        notifications: 'الإشعارات',
        noNotifications: 'لا توجد إشعارات',
        trending: 'المواضيع الشائعة',
        liveNow: 'مباشر الآن',
        peopleYouMayKnow: 'أشخاص قد تعرفهم',
        worldNews: 'أخبار العالم',
        createStory: 'إنشاء قصة',
        photoVideo: 'صورة/فيديو',
        goLive: 'بث مباشر',
        verified: 'موثق',
        logout: 'تسجيل خروج',
        editProfile: 'تعديل الملف',
        myProfile: 'ملفي',
        chats: 'الدردشات',
        typeMessage: 'اكتب رسالة...',
        send: 'إرسال',
        boost: 'تعزيز',
        createListing: 'إنشاء إعلان',
        addFriend: 'إضافة صديق',
        follow: 'متابعة',
        unfollow: 'إلغاء متابعة',
    },
    pt: {
        home: 'Início',
        friends: 'Amigos',
        marketplace: 'Mercado',
        live: 'Ao Vivo',
        messages: 'Mensagens',
        settings: 'Configurações',
        profile: 'Perfil',
        stories: 'Histórias',
        whatsOnMind: 'No que você está pensando?',
        post: 'Publicar',
        like: 'Curtir',
        love: 'Amar',
        laugh: 'Haha',
        comment: 'Comentar',
        share: 'Compartilhar',
        search: 'Pesquisar...',
        notifications: 'Notificações',
        noNotifications: 'Sem notificações',
        trending: 'Tendências Mundiais',
        liveNow: 'Ao Vivo Agora',
        peopleYouMayKnow: 'Pessoas que você talvez conheça',
        worldNews: 'Notícias Mundiais',
        createStory: 'Criar História',
        photoVideo: 'Foto/Vídeo',
        goLive: 'Transmitir',
        verified: 'Verificado',
        logout: 'Sair',
        editProfile: 'Editar Perfil',
        myProfile: 'Meu Perfil',
        chats: 'Conversas',
        typeMessage: 'Digite uma mensagem...',
        send: 'Enviar',
        boost: 'Impulsionar',
        createListing: 'Criar Anúncio',
        addFriend: 'Adicionar Amigo',
        follow: 'Seguir',
        unfollow: 'Deixar de Seguir',
    }
};

let currentLanguage = localStorage.getItem('worldfg_language') || 'en';

function initLanguageSelector() {
    const selector = document.getElementById('languageSelector');
    if (selector) {
        selector.value = currentLanguage;
        selector.onchange = function() {
            currentLanguage = this.value;
            localStorage.setItem('worldfg_language', currentLanguage);
            translatePage();
        };
    }
}

function translatePage() {
    const lang = translations[currentLanguage];
    if (!lang) return;
    
    // Translate common elements
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (lang[key]) {
            el.textContent = lang[key];
        }
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (lang[key]) {
            el.placeholder = lang[key];
        }
    });
}

function __(key) {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
}

// ============ EMOJI PICKER ============
const emojiList = ['😀','😃','😄','😁','😅','😂','🤣','😊','😇','🙂','😍','🥰','😘','😗','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','😮','😯','😲','😳','🥺','😢','😭','😤','😡','🤬','💀','☠️','💩','🤡','👻','🎉','🎊','🎈','🎂','🎀','🎁','🏆','⚽','🏀','🎵','🎶','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💖','💗','💓','💞','💝','👍','👎','👏','🙌','🤝','💪','✌️','🤞','🤟','👋','✋','🖐️','☝️','👇','👆','👉','👈','🙏','💅','🎯','🔔','🔕','💬','🗨️','📢','📣','🔊','🌍','🌎','🌏','🏠','🏡','🏢','🏪','🚗','🚕','✈️','🚀','🌙','☀️','⭐','🌈','🔥','💧','🍕','🍔','🍟','🌭','🍿','🎬','📱','💻','🖥️','⌚','📷','🎥'];

function initEmojiPicker() {
    // Add emoji button to all comment and chat inputs
    document.addEventListener('click', function(e) {
        if (e.target.closest('.emoji-trigger')) {
            const btn = e.target.closest('.emoji-trigger');
            const inputId = btn.getAttribute('data-target');
            showEmojiPicker(btn, inputId);
        }
    });
}

function showEmojiPicker(triggerElement, inputId) {
    // Remove existing picker
    const existing = document.querySelector('.emoji-picker-popup');
    if (existing) existing.remove();
    
    const picker = document.createElement('div');
    picker.className = 'emoji-picker-popup';
    picker.style.cssText = `
        position: absolute;
        bottom: 40px;
        left: 0;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 8px;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 4px;
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
        width: 280px;
    `;
    
    emojiList.forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.style.cssText = 'cursor:pointer; padding:4px; font-size:20px; text-align:center; border-radius:4px;';
        span.onmouseover = () => span.style.background = 'var(--hover)';
        span.onmouseout = () => span.style.background = 'none';
        span.onclick = () => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value += emoji;
                input.focus();
            }
            picker.remove();
        };
        picker.appendChild(span);
    });
    
    triggerElement.parentElement.style.position = 'relative';
    triggerElement.parentElement.appendChild(picker);
    
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closePicker(e) {
            if (!picker.contains(e.target) && e.target !== triggerElement) {
                picker.remove();
                document.removeEventListener('click', closePicker);
            }
        });
    }, 100);
}

function insertEmoji(inputId, emoji) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value += emoji;
        input.focus();
    }
}

// ============ ENHANCED POSTS WITH EMOJI REACTIONS ============
function createPost() {
    const statusInput = document.getElementById('statusInput');
    const text = statusInput ? statusInput.value.trim() : '';
    
    if (!text && !window.pendingMedia) {
        alert('Please write something or add a photo!');
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
        likes: [],
        loves: [],
        laughs: [],
        wows: [],
        sads: [],
        angries: [],
        comments: [],
        shares: [],
        time: new Date().toISOString()
    };
    
    DB.posts.unshift(post);
    window.pendingMedia = null;
    if (statusInput) statusInput.value = '';
    saveDB();
    renderPosts();
    addNotification('📝 Post', 'Your post has been shared with the world!');
}

function renderPosts() {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    
    const currentUser = getCurrentUser();
    const friendIds = DB.friends[currentUser.id] || [];
    const relevantPosts = DB.posts.filter(post => 
        post.userId === currentUser.id || 
        friendIds.includes(post.userId)
    );
    
    if (!relevantPosts.length) {
        container.innerHTML = '<div class="card-widget"><p style="text-align:center; padding:20px;">No posts yet. Add friends to see their posts! 🌍</p></div>';
        return;
    }
    
    container.innerHTML = relevantPosts.map(post => {
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
                        <div class="post-meta">
                            ${timeAgo(post.time)} • 📍 ${post.userLocation}
                        </div>
                    </div>
                </div>
                <div class="post-text">${post.text}</div>
                ${post.mediaUrl ? `<img src="${post.mediaUrl}" class="post-media-content" alt="Post media">` : ''}
                <div class="post-reaction-bar">
                    <button class="reaction-btn" onclick="reactWithEmoji('${post.id}', 'like')">👍 ${post.likes.length}</button>
                    <button class="reaction-btn" onclick="reactWithEmoji('${post.id}', 'love')">❤️ ${post.loves.length}</button>
                    <button class="reaction-btn" onclick="reactWithEmoji('${post.id}', 'laugh')">😂 ${post.laughs.length}</button>
                    <button class="reaction-btn" onclick="reactWithEmoji('${post.id}', 'wow')">😮 ${(post.wows||[]).length}</button>
                    <button class="reaction-btn" onclick="reactWithEmoji('${post.id}', 'sad')">😢 ${(post.sads||[]).length}</button>
                    <button class="reaction-btn" onclick="reactWithEmoji('${post.id}', 'angry')">😡 ${(post.angries||[]).length}</button>
                </div>
                <div style="display:flex; gap:4px; padding:4px 0;">
                    <button class="reaction-btn" onclick="toggleComments('${post.id}')">💬 ${post.comments.length} Comments</button>
                    <button class="reaction-btn" onclick="sharePost('${post.id}')">🔄 ${(post.shares||[]).length} Shares</button>
                </div>
                <div id="comments-${post.id}" style="display:none;">
                    ${post.comments.map(c => `
                        <div style="background:var(--dark); padding:6px 10px; border-radius:12px; margin:4px 0; font-size:13px;">
                            <strong>${c.user}</strong>: ${c.text}
                        </div>
                    `).join('')}
                    <div class="comment-box">
                        <button class="emoji-trigger" data-target="commentInput-${post.id}" style="background:none; border:none; cursor:pointer; font-size:18px;">😊</button>
                        <input type="text" id="commentInput-${post.id}" placeholder="Write a comment...">
                        <button onclick="addComment('${post.id}')">Send</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function reactWithEmoji(postId, type) {
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

// ============ ENHANCED CHAT WITH EMOJI & VOICE ============
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
            <div style="width:32px; height:32px; border-radius:50%; background:var(--gradient); overflow:hidden;">
                ${u.profilePic ? `<img src="${u.profilePic}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;">${u.avatar}</div>`}
            </div>
            <span>${u.fullName}</span>
            <div style="display:flex; gap:4px; margin-left:auto;">
                <button onclick="event.stopPropagation(); startAudioCall('${u.id}', '${u.fullName}')" style="background:none; border:none; color:var(--success); cursor:pointer;" title="Audio Call">📞</button>
                <button onclick="event.stopPropagation(); startVideoCall('${u.id}', '${u.fullName}')" style="background:none; border:none; color:var(--primary); cursor:pointer;" title="Video Call">📹</button>
            </div>
        </div>
    `).join('');
}

function openChat(userId, name) {
    currentChatPartner = userId;
    document.getElementById('chatContactsList').style.display = 'none';
    document.getElementById('chatWindowInner').style.display = 'block';
    document.getElementById('chatPartnerLabel').textContent = name;
    
    const area = document.getElementById('chatMessagesArea');
    area.innerHTML = '';
    
    const chatKey = [getCurrentUser().id, userId].sort().join('_');
    if (DB.messages[chatKey]) {
        DB.messages[chatKey].forEach(m => {
            const cls = m.from === getCurrentUser().id ? 'sent-msg' : 'received-msg';
            const type = m.type === 'voice' ? '🎤 Voice Message' : m.text;
            area.innerHTML += `<div class="chat-msg ${cls}">${type}</div>`;
        });
    }
    
    area.scrollTop = area.scrollHeight;
}

function sendChatMsg() {
    const input = document.getElementById('chatMsgInput');
    const text = input.value.trim();
    if (!text || !currentChatPartner) return;
    
    const chatKey = [getCurrentUser().id, currentChatPartner].sort().join('_');
    if (!DB.messages[chatKey]) DB.messages[chatKey] = [];
    
    const msg = { from: getCurrentUser().id, text, type: 'text', time: new Date().toISOString() };
    DB.messages[chatKey].push(msg);
    
    const area = document.getElementById('chatMessagesArea');
    area.innerHTML += `<div class="chat-msg sent-msg">${text}</div>`;
    area.scrollTop = area.scrollHeight;
    
    input.value = '';
    saveDB();
}

function sendVoiceMessage() {
    if (!currentChatPartner) return;
    
    // Simulate voice recording
    const voiceText = prompt('🎤 Voice Message: Type your message to send as voice (simulated):');
    if (!voiceText) return;
    
    const chatKey = [getCurrentUser().id, currentChatPartner].sort().join('_');
    if (!DB.messages[chatKey]) DB.messages[chatKey] = [];
    
    const msg = { from: getCurrentUser().id, text: voiceText, type: 'voice', time: new Date().toISOString() };
    DB.messages[chatKey].push(msg);
    
    const area = document.getElementById('chatMessagesArea');
    area.innerHTML += `<div class="chat-msg sent-msg">🎤 Voice: ${voiceText}</div>`;
    area.scrollTop = area.scrollHeight;
    
    saveDB();
}

// ============ VIDEO & AUDIO CALLS ============
function startVideoCall(userId, name) {
    if (confirm(`📹 Start video call with ${name}?`)) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    alert(`📹 Video call with ${name} is now active!\n\nCamera and microphone connected.\n\n(In production, this would use WebRTC for real peer-to-peer video calls)`);
                    addNotification('📹 Video Call', `Video call started with ${name}`);
                })
                .catch(() => {
                    alert(`📹 Video call with ${name} started (simulated)`);
                    addNotification('📹 Video Call', `Video call with ${name}`);
                });
        } else {
            alert(`📹 Video call with ${name} started!`);
            addNotification('📹 Video Call', `Video call with ${name}`);
        }
    }
}

function startAudioCall(userId, name) {
    if (confirm(`📞 Start audio call with ${name}?`)) {
        alert(`📞 Audio call with ${name} is now active!\n\nMicrophone connected.\n\n(In production, this would use WebRTC for real audio calls)`);
        addNotification('📞 Audio Call', `Audio call started with ${name}`);
    }
}

// ============ EVENTS ============
function createEvent() {
    const title = prompt('📅 Event Title:');
    if (!title) return;
    const date = prompt('📅 Event Date (YYYY-MM-DD):');
    const location = prompt('📍 Event Location:');
    const description = prompt('📝 Event Description:');
    
    if (!DB.events) DB.events = [];
    DB.events.push({
        id: 'event_' + Date.now(),
        title,
        date,
        location,
        description,
        creator: getCurrentUser().fullName,
        creatorId: getCurrentUser().id,
        attendees: [],
        time: new Date().toISOString()
    });
    
    saveDB();
    addNotification('📅 Event', `New event created: ${title}`);
    alert('✅ Event created successfully!');
}

// ============ PAGES FOR BUSINESS ============
function createPage() {
    const name = prompt('🏢 Page Name (Business/Brand):');
    if (!name) return;
    const category = prompt('📂 Category (e.g., Business, Entertainment, News):');
    const description = prompt('📝 Page Description:');
    
    if (!DB.pages) DB.pages = [];
    DB.pages.push({
        id: 'page_' + Date.now(),
        name,
        category,
        description,
        creator: getCurrentUser().fullName,
        creatorId: getCurrentUser().id,
        followers: [],
        posts: [],
        verified: false,
        time: new Date().toISOString()
    });
    
    saveDB();
    addNotification('🏢 Page', `New page created: ${name}`);
    alert('✅ Business page created successfully!');
}

// ============ PROFILE EDITING (Name, Email, Phone) ============
function editProfileDetails() {
    const user = getCurrentUser();
    if (!user) return;
    
    const newName = prompt('Full Name:', user.fullName || '');
    if (newName !== null && newName.trim()) {
        user.fullName = newName.trim();
        const nameParts = newName.trim().split(' ');
        user.firstName = nameParts[0];
        user.lastName = nameParts.slice(1).join(' ') || '';
    }
    
    const newEmail = prompt('Email Address:', user.email || '');
    if (newEmail !== null && newEmail.trim()) {
        user.email = newEmail.trim().toLowerCase();
    }
    
    const newPhone = prompt('Phone Number:', user.phone || '');
    if (newPhone !== null) {
        user.phone = newPhone.trim();
    }
    
    const userInDb = DB.users.find(u => u.id === user.id);
    if (userInDb) {
        Object.assign(userInDb, {
            fullName: user.fullName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
        });
    }
    
    saveDB();
    initPage();
    addNotification('✏️ Profile', 'Profile details updated!');
    alert('✅ Profile updated successfully!');
}

// ============ ENHANCED NOTIFICATIONS ============
function addNotification(type, text) {
    DB.notifications.unshift({
        id: Date.now(),
        type,
        text,
        time: new Date().toISOString(),
        read: false
    });
    
    if (DB.notifications.length > 100) DB.notifications.pop();
    saveDB();
    updateNotificationBadge();
}

// ============ TIME AGO ============
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

// Close dropdowns on outside click
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container')) {
        const results = document.getElementById('searchResults');
        if (results) results.style.display = 'none';
    }
    if (!e.target.closest('.user-menu-trigger') && !e.target.closest('#userMenuPanel')) {
        const panel = document.getElementById('userMenuPanel');
        if (panel) panel.style.display = 'none';
    }
    if (!e.target.closest('.icon-badge') && !e.target.closest('#notifPanel')) {
        const panel = document.getElementById('notifPanel');
        if (panel) panel.style.display = 'none';
    }
});

function initPage() {
    const user = getCurrentUser();
    if (!user) return;
    
    const headerAvatar = document.getElementById('headerAvatar');
    const headerUserName = document.getElementById('headerUserName');
    const feedAvatar = document.getElementById('feedAvatar');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarUserName = document.getElementById('sidebarUserName');
    
    if (headerAvatar) {
        if (user.profilePic) {
            headerAvatar.innerHTML = `<img src="${user.profilePic}" alt="${user.firstName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            headerAvatar.textContent = user.avatar;
        }
    }
    if (headerUserName) headerUserName.textContent = user.firstName;
    if (feedAvatar) {
        if (user.profilePic) {
            feedAvatar.innerHTML = `<img src="${user.profilePic}" alt="${user.firstName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            feedAvatar.textContent = user.avatar;
        }
    }
    if (sidebarAvatar) {
        if (user.profilePic) {
            sidebarAvatar.innerHTML = `<img src="${user.profilePic}" alt="${user.firstName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
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
        renderFriends();
    }
    
    updateNotificationBadge();
    renderChatContacts();
}