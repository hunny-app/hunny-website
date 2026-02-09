// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .step, .solution-feature, .process-step, .who-card, .partner-card, .step-content, .solution-health-sharing, .conversation-suggestions');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
});

// Button click handlers (placeholder for future functionality)
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.target.textContent.trim();
        
        if (buttonText.includes('Get Started') || buttonText.includes('Start Your Journey')) {
            // Add your sign-up logic here
            console.log('Sign up clicked');
        } else if (buttonText.includes('Watch Demo')) {
            // Add your demo video logic here
            console.log('Watch demo clicked');
        } else if (buttonText.includes('Learn More')) {
            // Scroll to features section
            document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add active state to navigation links on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Initialize EmailJS (you'll need to replace with your actual EmailJS public key)
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Create an email service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Get your Public Key, Service ID, and Template ID
// 5. Replace the values below

// Initialize EmailJS when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Uncomment and add your EmailJS public key when ready
    // emailjs.init("YOUR_PUBLIC_KEY");
});

// Signup form handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('emailInput');
        const email = emailInput.value.trim();
        const submitButton = signupForm.querySelector('button[type="submit"]');
        
        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Disable button during submission
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Joining...';
        }
        
        // Option 1: Send email using mailto (works immediately, opens email client)
        const subject = encodeURIComponent('New Early Access Signup - Grannie AI');
        const body = encodeURIComponent(`A new user has signed up for early access:\n\nEmail: ${email}\n\nPlease add this email to your early access list.`);
        const mailtoLink = `mailto:grannieaiapp@gmail.com?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        setTimeout(() => {
            alert('Thank you for joining the early access list! We\'ll be in touch soon with updates and pilot opportunities.');
            
            // Reset form
            signupForm.reset();
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Join early access';
            }
        }, 500);
        
        // Option 2: To use Formspree instead, uncomment below and add your form ID:
        /*
        try {
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    _to: 'grannieaiapp@gmail.com',
                    _subject: 'New Early Access Signup - Grannie AI'
                })
            });
            
            if (response.ok) {
                alert('Thank you for joining the early access list! We\'ll be in touch soon with updates and pilot opportunities.');
                signupForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error. Please contact us directly at grannieaiapp@gmail.com');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Join early access';
            }
        }
        */
    });
}


