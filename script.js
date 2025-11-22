// Navigation function
function goToScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        window.scrollTo(0, 0);
    }

    document.querySelectorAll('.nav-item');
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const phoneInput = document.getElementById('phone-input');
    const phoneNumber = phoneInput.value;
    
    // Store phone number
    sessionStorage.setItem('phoneNumber', phoneNumber);
    
    // Display phone number on verification screen
    const phoneDisplay = document.getElementById('phone-display');
    if (phoneDisplay) {
        phoneDisplay.textContent = phoneNumber;
    }
    
    // Navigate to SMS verification screen
    goToScreen('sms-verify');
}

// Handle code input - auto-focus next field
document.addEventListener('DOMContentLoaded', function() {
    const codeInputs = document.querySelectorAll('.code-input');
    
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Auto-focus next input
            if (value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });
});

// Handle nickname submission
function handleNicknameSubmit() {
    const nicknameInput = document.getElementById('nickname-input');
    const nickname = nicknameInput.value.trim();
    
    if (nickname) {
        // Store nickname
        sessionStorage.setItem('nickname', nickname);
        
        // Update profile name
        const profileName = document.getElementById('profile-name');
        if (profileName) {
            profileName.textContent = nickname;
        }
        
        // Navigate to home screen
        goToScreen('home');
    } else {
        alert('Please enter your nickname');
    }
}

// Load stored nickname on page load
window.addEventListener('load', function() {
    const storedNickname = sessionStorage.getItem('nickname');
    if (storedNickname) {
        const profileName = document.getElementById('profile-name');
        if (profileName) {
            profileName.textContent = storedNickname;
        }
    }
});

// Handle mood selection
document.addEventListener('click', function(e) {
    if (e.target.closest('.mood-emoji')) {
        const moods = document.querySelectorAll('.mood-emoji');
        moods.forEach(mood => mood.style.transform = 'scale(1)');
        e.target.closest('.mood-emoji').style.transform = 'scale(1.2)';
        
        // Optional: Store mood selection
        const moodText = e.target.closest('.mood-emoji').textContent.trim();
        console.log('Mood selected:', moodText);
    }
});

// Handle task completion
document.addEventListener('click', function(e) {
    if (e.target.closest('.task-action')) {
        const taskCard = e.target.closest('.task-card');
        const actionBtn = e.target.closest('.task-action');
        
        if (actionBtn.textContent === 'Next Up' && !taskCard.classList.contains('completed')) {
            // Check if previous task is completed
            const allTasks = document.querySelectorAll('.task-card');
            const currentIndex = Array.from(allTasks).indexOf(taskCard);
            
            if (currentIndex > 0) {
                const previousTask = allTasks[currentIndex - 1];
                if (!previousTask.classList.contains('completed')) {
                    alert('Please complete the previous task first!');
                    return;
                }
            }
            
            // Mark as completed
            taskCard.classList.add('completed');
            actionBtn.textContent = 'Done';
            
            // Unlock next task
            if (currentIndex < allTasks.length - 1) {
                const nextTask = allTasks[currentIndex + 1];
                const nextLockIcon = nextTask.querySelector('.task-icon.lock');
                if (nextLockIcon) {
                    nextLockIcon.classList.remove('lock');
                    nextLockIcon.textContent = '✓';
                    nextLockIcon.style.backgroundColor = 'var(--success-color)';
                }
            }
            
            // Show congratulations
            showCongratulations();
        }
    }
});

// Show congratulations message
function showCongratulations() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #48BB78, #38A169);
        color: white;
        padding: 24px 32px;
        border-radius: 16px;
        font-size: 18px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(72, 187, 120, 0.4);
        z-index: 10000;
        animation: fadeInOut 2s ease-in-out;
    `;
    message.textContent = '🎉 Great job! Task completed!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Add fadeInOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Handle form inputs - prevent default form submission
document.addEventListener('submit', function(e) {
    if (e.target.id !== 'login-form') {
        e.preventDefault();
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'Escape' to go back
    if (e.key === 'Escape') {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen && activeScreen.id !== 'about-1') {
            const backBtn = activeScreen.querySelector('.btn-back');
            if (backBtn) {
                backBtn.click();
            }
        }
    }
});

// Simulate typing effect for placeholder
function typeEffect(element, text, speed = 100) {
    let i = 0;
    element.placeholder = '';
    
    const typing = setInterval(() => {
        if (i < text.length) {
            element.placeholder += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, speed);
}

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.task-card, .psychologist-card, .test-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// Handle option selection
document.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
        const optionItems = e.target.closest('.option-list').querySelectorAll('.option-item');
        optionItems.forEach(item => {
            item.style.borderColor = 'var(--border-color)';
            item.style.backgroundColor = 'white';
        });
        
        const selectedItem = e.target.closest('.option-item');
        selectedItem.style.borderColor = 'var(--primary-color)';
        selectedItem.style.backgroundColor = '#F7FAFC';
    }
});

// Smooth scroll to top when changing screens
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Update active nav item
function updateActiveNav(screenId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Map screen IDs to nav items
    const navMap = {
        'home': 0,
        'helpline': 1,
        'tests': 2,
        'profile': 3
    };
    
    const navIndex = navMap[screenId];
    if (navIndex !== undefined && navItems[navIndex]) {
        navItems[navIndex].classList.add('active');
    }
}

// Enhanced goToScreen with nav update
const originalGoToScreen = goToScreen;
goToScreen = function(screenId) {
    originalGoToScreen(screenId);
};

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    const button = e.target.closest('button');
    if (!button) return;
    
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize tooltips (optional enhancement)
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                delete this._tooltip;
            }
        });
    });
}

// Call initialization functions
document.addEventListener('DOMContentLoaded', function() {
    initTooltips();
    console.log('Wheat App initialized successfully! 🌾');
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js').then(function(registration) {
        //     console.log('ServiceWorker registered: ', registration);
        // }).catch(function(error) {
        //     console.log('ServiceWorker registration failed: ', error);
        // });
    });
}

// Handle offline status
window.addEventListener('offline', function() {
    const offlineMessage = document.createElement('div');
    offlineMessage.id = 'offline-message';
    offlineMessage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: #F56565;
        color: white;
        padding: 12px;
        text-align: center;
        font-size: 14px;
        z-index: 10000;
    `;
    offlineMessage.textContent = '⚠️ You are offline. Some features may not work.';
    document.body.appendChild(offlineMessage);
});

window.addEventListener('online', function() {
    const offlineMessage = document.getElementById('offline-message');
    if (offlineMessage) {
        offlineMessage.remove();
    }
});

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    console.log('Event tracked:', { category, action, label });
    // Implement your analytics here (e.g., Google Analytics, Mixpanel, etc.)
}

// Track screen views
const originalGoToScreen2 = goToScreen;
goToScreen = function(screenId) {
    originalGoToScreen2(screenId);
    trackEvent('Navigation', 'Screen View', screenId);
};

// Debug mode (toggle with Ctrl+D)
let debugMode = false;
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        debugMode = !debugMode;
        console.log('Debug mode:', debugMode ? 'ON' : 'OFF');
        
        if (debugMode) {
            document.body.style.outline = '2px solid red';
        } else {
            document.body.style.outline = 'none';
        }
    }
});
// ===== NEW FEATURES =====

// Handle mood emoji click - open mood entry screen
document.addEventListener('click', function(e) {
    if (e.target.closest('.mood-emoji')) {
        goToScreen('mood-entry');
    }
});

// Handle mood option selection in mood entry screen
document.addEventListener('click', function(e) {
    if (e.target.closest('.mood-option')) {
        const moodOptions = document.querySelectorAll('.mood-option');
        moodOptions.forEach(opt => opt.classList.remove('selected'));
        e.target.closest('.mood-option').classList.add('selected');
        
        // Store selected mood
        const mood = e.target.closest('.mood-option').getAttribute('data-mood');
        sessionStorage.setItem('currentMood', mood);
    }
});

// Update current time display
function updateCurrentTime() {
    const timeText = document.getElementById('time-text');
    if (timeText) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeText.textContent = `${hours}:${minutes}`;
    }
}

// Initialize time update
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000); // Update every minute
});

// Save mood entry
function saveMoodEntry() {
    const mood = sessionStorage.getItem('currentMood');
    const description = document.getElementById('mood-description').value.trim();
    const timeText = document.getElementById('time-text').textContent;
    
    if (!mood) {
        alert('Пожалуйста, выберите настроение');
        return;
    }
    
    // Get existing mood entries or create new array
    let moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    
    // Create new entry
    const entry = {
        id: Date.now(),
        mood: mood,
        time: timeText,
        date: new Date().toLocaleDateString('ru-RU'),
        description: description,
        timestamp: new Date().toISOString()
    };
    
    // Add to beginning of array
    moodEntries.unshift(entry);
    
    // Keep only last 100 entries
    if (moodEntries.length > 100) {
        moodEntries = moodEntries.slice(0, 100);
    }
    
    // Save to localStorage
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    
    // Clear form
    sessionStorage.removeItem('currentMood');
    document.getElementById('mood-description').value = '';
    document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
    
    // Show success message
    showMoodSaveSuccess();
    
    // Return to home screen
    setTimeout(() => {
        goToScreen('home');
    }, 1500);
}

// Show mood save success message
function showMoodSaveSuccess() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #48BB78, #38A169);
        color: white;
        padding: 24px 32px;
        border-radius: 16px;
        font-size: 18px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(72, 187, 120, 0.4);
        z-index: 10000;
        animation: fadeInOut 1.5s ease-in-out;
    `;
    message.textContent = '✅ Запись сохранена!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 1500);
}

// Load recent mood entries for analytics
function loadRecentEntries() {
    const entriesContainer = document.getElementById('recent-entries');
    if (!entriesContainer) return;
    
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    
    if (moodEntries.length === 0) {
        entriesContainer.innerHTML = '<p style="text-align: center; color: #718096; padding: 20px;">Пока нет записей</p>';
        return;
    }
    
    const moodEmojis = {
        'happy': '😊',
        'calm': '😌',
        'sad': '😔',
        'anxious': '😰',
        'angry': '😠',
        'tired': '😴'
    };
    
    const moodLabels = {
        'happy': 'Счастливый',
        'calm': 'Спокойный',
        'sad': 'Грустный',
        'anxious': 'Тревожный',
        'angry': 'Злой',
        'tired': 'Уставший'
    };
    
    // Show only last 5 entries
    const recentEntries = moodEntries.slice(0, 5);
    
    entriesContainer.innerHTML = recentEntries.map(entry => `
        <div class="recent-entry">
            <div class="entry-header">
                <span class="entry-mood-emoji">${moodEmojis[entry.mood] || '😊'}</span>
                <div class="entry-info">
                    <div class="entry-mood-label">${moodLabels[entry.mood] || entry.mood}</div>
                    <div class="entry-datetime">${entry.date} в ${entry.time}</div>
                </div>
            </div>
            ${entry.description ? `<div class="entry-description">${entry.description}</div>` : ''}
        </div>
    `).join('');
}

// Load analytics when analytics screen is opened
const originalGoToScreenForAnalytics = goToScreen;
goToScreen = function(screenId) {
    originalGoToScreenForAnalytics(screenId);
    
    if (screenId === 'analytics') {
        loadRecentEntries();
        updateMoodStats();
    }
};

// Update mood statistics
function updateMoodStats() {
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    
    if (moodEntries.length === 0) return;
    
    // Count moods
    const moodCounts = {};
    moodEntries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    const total = moodEntries.length;
    
    // Update mood stats bars
    const moodStats = document.querySelectorAll('.mood-stat');
    moodStats.forEach((stat, index) => {
        const moods = ['happy', 'calm', 'sad', 'anxious'];
        const mood = moods[index];
        const count = moodCounts[mood] || 0;
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        
        const fill = stat.querySelector('.mood-stat-fill');
        const value = stat.querySelector('.mood-stat-value');
        
        if (fill && value) {
            fill.style.width = percentage + '%';
            value.textContent = percentage + '%';
        }
    });
}

// Period selector for analytics
document.addEventListener('click', function(e) {
    if (e.target.closest('.period-btn')) {
        document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
        e.target.closest('.period-btn').classList.add('active');
        
        const period = e.target.closest('.period-btn').getAttribute('data-period');
        console.log('Period selected:', period);
        // Here you can filter data based on period
    }
});

// Initialize tooltips and features
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mood tracking features initialized! 🌾');
});


// Simple mood chart visualization (without Chart.js)
function drawSimpleMoodChart() {
    const canvas = document.getElementById('moodChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    if (moodEntries.length === 0) {
        ctx.fillStyle = '#718096';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Нет данных для отображения', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Get last 7 entries
    const lastEntries = moodEntries.slice(0, 7).reverse();
    
    // Mood value mapping
    const moodValues = {
        'happy': 5,
        'calm': 4,
        'tired': 3,
        'sad': 2,
        'anxious': 1,
        'angry': 0
    };
    
    // Calculate points
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const pointSpacing = chartWidth / (lastEntries.length - 1 || 1);
    
    const points = lastEntries.map((entry, index) => {
        const value = moodValues[entry.mood] || 3;
        const x = padding + index * pointSpacing;
        const y = padding + chartHeight - (value / 5) * chartHeight;
        return { x, y, mood: entry.mood };
    });
    
    // Draw grid
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // Draw line
    ctx.strokeStyle = '#d6a85a';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.stroke();
    
    // Draw points
    points.forEach(point => {
        ctx.fillStyle = '#d6a85a';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Draw labels
    ctx.fillStyle = '#718096';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    lastEntries.forEach((entry, index) => {
        const x = padding + index * pointSpacing;
        const label = new Date(entry.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        ctx.fillText(label, x, canvas.height - 10);
    });
}

// Update analytics screen to draw chart
const originalGoToScreenWithChart = goToScreen;
goToScreen = function(screenId) {
    originalGoToScreenWithChart(screenId);
    
    if (screenId === 'analytics') {
        setTimeout(() => {
            loadRecentEntries();
            updateMoodStats();
            drawSimpleMoodChart();
        }, 100);
    }
};