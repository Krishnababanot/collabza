// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

console.log("Website.js: Module loaded");

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuRx3N2ZUVgl4b9zeakA5yMPZ24V-0ne0",
    authDomain: "collabza-web.firebaseapp.com",
    projectId: "collabza-web",
    storageBucket: "collabza-web.firebasestorage.app",
    messagingSenderId: "484851749389",
    appId: "1:484851749389:web:924f5c5073b85cb4d33b44",
    measurementId: "G-EYWMSXVTQF"
};

// Initialize Firebase
let app, auth, provider;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}

// Initialize Lucide Icons
if (window.lucide) {
    lucide.createIcons();
} else {
    console.warn("Lucide Icons not loaded via CDN");
}

// Elements
const navbar = document.querySelector('.navbar');
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const fadeElements = document.querySelectorAll('.fade-in-up');

// Navbar Scroll Effect
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile Menu Toggle
if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenu.classList.contains('active') ? 'x' : 'menu';
        mobileToggle.innerHTML = `<i data-lucide="${icon}"></i>`;
        if (window.lucide) lucide.createIcons();
    });
}

// Close Mobile Menu on Link Click
if (mobileLinks) {
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.innerHTML = `<i data-lucide="menu"></i>`;
                if (window.lucide) lucide.createIcons();
            }
        });
    });
}

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

if (fadeElements) {
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handling
const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const form = document.querySelector('.contact-form');
        const inputs = form.querySelectorAll('input');
        const textarea = form.querySelector('textarea');

        const firstName = inputs[0] ? inputs[0].value : '';
        const lastName = inputs[1] ? inputs[1].value : '';
        const email = inputs[2] ? inputs[2].value : '';
        const budgetInput = document.getElementById('budget-input');
        const budget = budgetInput ? budgetInput.value : '';
        const message = textarea ? textarea.value : '';

        if (!firstName || !email || !budget) {
            alert('Please fill in all required fields.');
            return;
        }

        const formattedMessage = `Hi Collabza, I'm ${firstName} ${lastName}.\n\nI'm interested in working with you. My budget is ${budget}.\n\n${message}\n\nEmail: ${email}`;

        navigator.clipboard.writeText(formattedMessage).then(() => {
            alert('Message copied to clipboard! Paste it in our DMs.');
            window.open('https://www.instagram.com/collabza/', '_blank');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            window.open('https://www.instagram.com/collabza/', '_blank');
        });
    });
}

// --- AUTH LOGIC ---

// Login Function
async function login() {
    console.log("Login button clicked");
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("User logged in:", result.user.displayName);
    } catch (error) {
        console.error("Login Error:", error.message);
        alert("Login failed: " + error.message);
    }
}

// Logout Function
function logout() {
    console.log("Logout button clicked");
    signOut(auth).then(() => {
        console.log("User signed out");
    }).catch((error) => {
        console.error("Logout Error:", error.message);
    });
}

// Attach Event Listeners
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const portalLoginBtn = document.getElementById('portal-login-btn');
const portalLogoutBtn = document.getElementById('portal-logout-btn');

if (loginBtn) {
    console.log("Attached listener to login-btn");
    loginBtn.addEventListener('click', login);
} else {
    console.warn("login-btn not found");
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if (portalLoginBtn) {
    console.log("Attached listener to portal-login-btn");
    portalLoginBtn.addEventListener('click', login);
}

if (portalLogoutBtn) {
    portalLogoutBtn.addEventListener('click', logout);
}

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    console.log("Auth State Changed:", user ? "Logged In" : "Logged Out");

    // Elements need to be re-fetched or we use valid references
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const userPic = document.getElementById('user-pic');

    const portalLoginView = document.getElementById('portal-login-view');
    const portalDashboardView = document.getElementById('portal-dashboard-view');
    const portalUserName = document.getElementById('portal-user-name');

    if (user) {
        // Logged In
        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        if (userName) userName.innerText = user.displayName;
        if (userPic) userPic.src = user.photoURL;

        if (portalLoginView) portalLoginView.style.display = 'none';
        if (portalDashboardView) {
            portalDashboardView.style.display = 'block';
            if (portalUserName) portalUserName.innerText = user.displayName.split(' ')[0];
        }
    } else {
        // Logged Out
        if (loginBtn) loginBtn.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';

        if (portalLoginView) portalLoginView.style.display = 'block';
        if (portalDashboardView) portalDashboardView.style.display = 'none';
    }
});