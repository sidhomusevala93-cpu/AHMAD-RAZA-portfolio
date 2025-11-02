// FIX: Import React to resolve 'Cannot find namespace React' error.
import React from 'react';

export interface Project {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    tags: string[];
    links: {
        github?: string;
        live?: string;
    };
}

export interface Skill {
    name: string;
    level: number;
}

export interface Experience {
    role: string;
    company: string;
    period: string;
    description: string;
}

export interface Education {
    institution: string;
    degree: string;
    period: string;
    description: string;
}

export interface Service {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    shortDescription: string;
    fullDescription: string;
}

export interface Testimonial {
    name: string;
    title: string;
    image: string;
    feedback: string;
}

export interface Award {
    title: string;
    issuer: string;
    year: string;
}

export interface Certification {
    title: string;
    organization: string;
    date: string;
    verifyLink: string;
}

export interface BlogPost {
    id: number;
    title: string;
    date: string;
    imageUrl: string;
    intro: string;
    content: string; // HTML content
}

export interface GalleryImage {
    url: string;
    alt: string;
}

export interface Stat {
    value: number;
    label: string;
    suffix?: string;
}

export interface PricingPlan {
    title: string;
    price: number;
    period: 'mo' | 'yr';
    description: string;
    features: string[];
    recommended?: boolean;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface PartnerLogo {
    src: string;
    alt: string;
}
