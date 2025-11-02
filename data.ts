
import type { Project, Skill, Experience, Education, Service, Testimonial, Award, Certification, BlogPost, GalleryImage, Stat, PricingPlan, FAQItem, PartnerLogo } from './types';
import { ICONS } from './components/Icons';

// --- REPLACE WITH YOUR DATA ---

export const PROFILE = {
    name: "Jane Doe",
    profession: "Senior Frontend Engineer",
    pic: "https://picsum.photos/seed/profile1/200/200", // Replace with your profile picture URL
};

export const HERO_TAGLINES = [
    "Building intuitive user interfaces.",
    "Crafting pixel-perfect web experiences.",
    "Turning ideas into interactive reality.",
    "Specializing in React & TypeScript.",
];

export const ABOUT = {
    pic: "https://picsum.photos/seed/profile2/400/500", // Replace with another picture of you
    bio: "I'm a passionate Senior Frontend Engineer with over 8 years of experience in creating beautiful, responsive, and high-performance web applications. My expertise lies in the React ecosystem, TypeScript, and modern CSS frameworks. I thrive on solving complex problems and collaborating with teams to deliver outstanding digital products.",
    skills: [
        { name: "React", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "UI/UX Design", level: 85 },
    ]
};

export const SKILLS: { [key: string]: Skill[] } = {
    "Programming Languages": [
        { name: "JavaScript (ES6+)", level: 98 },
        { name: "TypeScript", level: 95 },
        { name: "HTML5", level: 99 },
        { name: "CSS3 / SCSS", level: 97 },
    ],
    "Frameworks & Tools": [
        { name: "React & Next.js", level: 96 },
        { name: "Tailwind CSS", level: 99 },
        { name: "Node.js", level: 80 },
        { name: "Figma", level: 88 },
    ],
    "Soft Skills": [
        { name: "Problem Solving", level: 95 },
        { name: "Team Collaboration", level: 98 },
        { name: "Communication", level: 97 },
        { name: "Agile Methodologies", level: 92 },
    ]
};

export const PROJECTS: Project[] = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Project Title ${i + 1}`,
    description: `A detailed description of Project ${i + 1}, showcasing the technologies used, the problems solved, and the outcomes achieved. This project was a great learning experience.`,
    imageUrl: `https://picsum.photos/seed/project${i}/400/300`,
    category: i % 2 === 0 ? 'Web App' : 'E-commerce',
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
    links: {
        github: "https://github.com",
        live: "https://example.com"
    }
}));

export const EXPERIENCE: { work: Experience[], education: Education[] } = {
    work: [
        {
            role: "Senior Frontend Engineer",
            company: "Tech Solutions Inc.",
            period: "2020 - Present",
            description: "Led the development of a new client-facing dashboard using React and TypeScript, improving user engagement by 40%. Mentored junior developers and established code quality standards."
        },
        {
            role: "Frontend Developer",
            company: "Innovate Co.",
            period: "2017 - 2020",
            description: "Developed and maintained several e-commerce websites, focusing on performance and responsive design. Collaborated with designers to implement pixel-perfect UIs."
        }
    ],
    education: [
        {
            institution: "University of Technology",
            degree: "B.S. in Computer Science",
            period: "2013 - 2017",
            description: "Graduated with honors. Focused on web development, data structures, and algorithms. President of the coding club."
        }
    ]
};

export const SERVICES: Service[] = [
    { icon: ICONS.Code, title: "Web Development", shortDescription: "Creating responsive and fast web applications.", fullDescription: "Full-stack web development services, from a simple landing page to a complex web application using modern technologies like React, Next.js, and Node.js. I focus on performance, scalability, and maintainability." },
    { icon: ICONS.PenTool, title: "UI/UX Design", shortDescription: "Designing intuitive and beautiful user interfaces.", fullDescription: "User-centric design process to create wireframes, mockups, and prototypes that are not only visually appealing but also easy to use. I use tools like Figma to bring ideas to life." },
    { icon: ICONS.Smartphone, title: "Mobile-First Design", shortDescription: "Ensuring your website looks great on all devices.", fullDescription: "With a mobile-first approach, I design and develop websites that provide an optimal viewing experience across a wide range of devices from mobile phones to desktop computers." }
];

export const TESTIMONIALS: Testimonial[] = [
    { name: "John Smith", title: "CEO, Innovate Co.", image: "https://picsum.photos/seed/client1/100/100", feedback: "Jane is an exceptional developer. Her attention to detail and ability to tackle complex problems is second to none. She was a key player in our project's success." },
    { name: "Sarah Johnson", title: "Product Manager, Tech Solutions Inc.", image: "https://picsum.photos/seed/client2/100/100", feedback: "Working with Jane was a pleasure. She is not only a skilled engineer but also a great communicator who understands product needs and delivers high-quality work on time." }
];

export const AWARDS: Award[] = [
    { title: "Developer of the Year", issuer: "Tech Solutions Inc.", year: "2022" },
    { title: "Innovation Award", issuer: "Innovate Co.", year: "2019" },
    { title: "Top Performer", issuer: "Tech Solutions Inc.", year: "2021" },
];

export const CERTIFICATIONS: Certification[] = [
    { title: "React - The Complete Guide", organization: "Udemy", date: "Jun 2021", verifyLink: "#" },
    { title: "Advanced TypeScript", organization: "Coursera", date: "Mar 2022", verifyLink: "#" },
    { title: "Certified Web Professional", organization: "W3C", date: "Jan 2020", verifyLink: "#" },
];

export const BLOG_POSTS: BlogPost[] = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    title: `Blog Post Title ${i + 1}`,
    date: `October ${20 - i}, 2023`,
    imageUrl: `https://picsum.photos/seed/blog${i}/400/200`,
    intro: "This is a short introduction to the blog post, giving readers a glimpse of what's to come...",
    content: `
        <h2>This is the full content of the blog post.</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.</p>
        <p>Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
    `
}));

export const GALLERY_IMAGES: GalleryImage[] = Array.from({ length: 12 }, (_, i) => ({
    url: `https://picsum.photos/seed/gallery${i}/500/${Math.floor(Math.random() * (600 - 300 + 1) + 300)}`,
    alt: `Gallery image ${i + 1}`
}));

export const STATS: Stat[] = [
    { value: 8, label: "Years of Experience", suffix: "+" },
    { value: 120, label: "Projects Completed" },
    { value: 95, label: "Happy Clients" },
    { value: 15320, label: "Cups of Coffee ☕" },
];

export const PRICING_PLANS: PricingPlan[] = [
    { title: "Basic", price: 499, period: 'mo', description: "For small projects and startups.", features: ["Web Design", "10 Pages", "Basic SEO", "Mobile Responsive"], recommended: false },
    { title: "Pro", price: 999, period: 'mo', description: "For growing businesses.", features: ["Everything in Basic", "E-commerce Integration", "CMS", "Advanced SEO"], recommended: true },
    { title: "Enterprise", price: 1999, period: 'mo', description: "For large-scale applications.", features: ["Everything in Pro", "Custom API Integrations", "Dedicated Support", "Cloud Hosting"], recommended: false }
];

export const FAQS: FAQItem[] = [
    { question: "What is your hourly rate?", answer: "My rate varies depending on the project complexity. Please contact me for a detailed quote." },
    { question: "Are you available for freelance work?", answer: "Yes, I am currently accepting new freelance projects. Let's discuss your needs!" },
    { question: "What is your typical project timeline?", answer: "A typical project takes between 4-8 weeks to complete, but this can vary based on the scope of work." },
    { question: "Do you provide support after the project is complete?", answer: "Yes, I offer various support packages to ensure your website remains up-to-date and secure." }
];

export const PARTNER_LOGOS: PartnerLogo[] = Array.from({ length: 6 }, (_, i) => ({
    src: `https://via.placeholder.com/150x50/cccccc/888888?text=Client${i+1}`,
    alt: `Client Logo ${i + 1}`
}));

export const CONTACT = {
    email: "your.email@example.com",
    phone: "+1 (123) 456-7890",
    address: "123 Creative Lane, Tech City, 10101",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617329986022!2d-73.98785308459395!3d40.74844097932788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1633456789123!5m2!1sen!2sus" // Replace with your location
};

export const SOCIAL_LINKS = {
    GitHub: "https://github.com",
    LinkedIn: "https://linkedin.com",
    Twitter: "https://twitter.com",
};
