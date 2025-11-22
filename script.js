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