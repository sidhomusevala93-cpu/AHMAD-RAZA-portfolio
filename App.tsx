
import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { ICONS } from './components/Icons';
import * as DATA from './data';
import type { Project, Service, BlogPost, FAQItem, Certification, Experience, Award, Testimonial } from './types';

// Declare jsPDF on the window object for TypeScript
declare global {
    interface Window {
        jspdf: any;
    }
}

// --- THEME MANAGEMENT ---
type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('portfolio-theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio-theme', 'light');
    }
  }, [theme]);
  
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- LANGUAGE MANAGEMENT ---
type Language = 'EN' | 'FR' | 'AR';
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');

  useEffect(() => {
    const storedLang = localStorage.getItem('portfolio-language') as Language;
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('portfolio-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// --- INTERSECTION OBSERVER HOOK ---
const useOnScreen = (ref: React.RefObject<HTMLElement>, threshold = 0.1) => {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIntersecting(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current);
            }
        };
    }, [ref, threshold]);

    return isIntersecting;
};

// --- HELPER & REUSABLE UI COMPONENTS ---

const Section: React.FC<{id: string, title: string, children: React.ReactNode, className?: string}> = ({ id, title, children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  return (
    <section id={id} ref={ref} className={`py-16 md:py-24 container mx-auto px-4 md:px-8 transition-opacity duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 relative">
        <span className="text-blue-500 dark:text-orange-400">{title}</span>
        <span className="block w-20 h-1 bg-blue-500 dark:bg-orange-400 mx-auto mt-2"></span>
      </h2>
      {children}
    </section>
  );
};


type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

const Toast: React.FC<{ message: ToastMessage; onDismiss: (id: number) => void }> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`text-white px-6 py-4 border-0 rounded relative mb-4 shadow-lg ${colors[message.type]} animate-fade-in-down`}>
      <span className="inline-block align-middle mr-8">{message.message}</span>
      <button onClick={() => onDismiss(message.id)} className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
        <span>×</span>
      </button>
    </div>
  );
};


const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-3xl" aria-label="Close modal">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- SECTION COMPONENTS ---

const Header: React.FC<{ activeSection: string }> = ({ activeSection }) => {
    const { toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { id: 'hero', title: 'Home' },
        { id: 'about', title: 'About' },
        { id: 'skills', title: 'Skills' },
        { id: 'projects', title: 'Projects' },
        { id: 'experience', title: 'Resume' },
        { id: 'contact', title: 'Contact' },
    ];
    
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md z-40 transition-all duration-300">
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center h-16">
                <a href="#hero" className="text-2xl font-bold text-blue-500 dark:text-orange-400">J.Doe</a>
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map(link => (
                         <a key={link.id} href={`#${link.id}`} className={`text-sm font-medium transition-colors hover:text-blue-500 dark:hover:text-orange-400 ${activeSection === link.id ? 'text-blue-500 dark:text-orange-400' : 'text-gray-600 dark:text-gray-300'}`}>{link.title}</a>
                    ))}
                </nav>
                <div className="flex items-center space-x-4">
                     <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle theme">
                        <ICONS.Sun className="h-5 w-5 dark:hidden" />
                        <ICONS.Moon className="h-5 w-5 hidden dark:block" />
                    </button>
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="bg-transparent border-none text-sm focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="EN">EN</option>
                            <option value="FR">FR</option>
                            <option value="AR">AR</option>
                        </select>
                    </div>
                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
                        {isMenuOpen ? <ICONS.X className="h-6 w-6"/> : <ICONS.Menu className="h-6 w-6"/>}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 py-4">
                     {navLinks.map(link => (
                         <a key={link.id} href={`#${link.id}`} onClick={() => setIsMenuOpen(false)} className="block text-center py-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-orange-400">{link.title}</a>
                    ))}
                </div>
            )}
        </header>
    );
};


const Hero: React.FC = () => {
    const [typedText, setTypedText] = useState('');
    const taglines = DATA.HERO_TAGLINES;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delay = 2000;

    useEffect(() => {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const type = () => {
            const currentText = taglines[textIndex];
            if (isDeleting) {
                setTypedText(currentText.substring(0, charIndex - 1));
                charIndex--;
            } else {
                setTypedText(currentText.substring(0, charIndex + 1));
                charIndex++;
            }

            if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => isDeleting = true, delay);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % taglines.length;
            }
        };

        const timer = setInterval(type, isDeleting ? deletingSpeed : typingSpeed);
        return () => clearInterval(timer);
    }, [taglines]);

    return (
        <section id="hero" className="min-h-screen flex items-center bg-gray-100 dark:bg-gray-800">
            <div className="container mx-auto px-4 md:px-8 text-center">
                <img src={DATA.PROFILE.pic} alt={DATA.PROFILE.name} className="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-blue-500 dark:border-orange-400 shadow-lg" />
                <h1 className="text-4xl md:text-6xl font-extrabold mb-2">{DATA.PROFILE.name}</h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">{DATA.PROFILE.profession}</p>
                <p className="text-lg md:text-xl text-blue-500 dark:text-orange-400 h-8 mb-8 font-mono">
                  {typedText}
                  <span className="animate-blink">|</span>
                </p>
                <div className="flex justify-center space-x-4">
                    <a href="#contact" className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105">Hire Me</a>
                    <a href="#projects" className="px-8 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform transform hover:scale-105">View Portfolio</a>
                </div>
            </div>
        </section>
    );
};


const About: React.FC = () => {
    const { jsPDF } = window.jspdf;
    
    const downloadCV = () => {
        const doc = new jsPDF();
        doc.text("Curriculum Vitae - " + DATA.PROFILE.name, 20, 20);
        doc.text("Bio:", 20, 40);
        doc.text(DATA.ABOUT.bio, 20, 50, { maxWidth: 170 });
        // Add more details to the PDF
        doc.save(`${DATA.PROFILE.name}-CV.pdf`);
    };

    const CircularSkill: React.FC<{ percentage: number; skill: string }> = ({ percentage, skill }) => {
        const sqSize = 120;
        const strokeWidth = 10;
        const radius = (sqSize - strokeWidth) / 2;
        const viewBox = `0 0 ${sqSize} ${sqSize}`;
        const dashArray = radius * Math.PI * 2;
        const dashOffset = dashArray - (dashArray * percentage) / 100;
        
        return (
            <div className="flex flex-col items-center">
                <svg width={sqSize} height={sqSize} viewBox={viewBox}>
                    <circle className="fill-none stroke-gray-200 dark:stroke-gray-600" cx={sqSize / 2} cy={sqSize / 2} r={radius} strokeWidth={`${strokeWidth}px`} />
                    <circle
                        className="fill-none stroke-blue-500 dark:stroke-orange-400 transition-all duration-1000 ease-in-out"
                        cx={sqSize / 2}
                        cy={sqSize / 2}
                        r={radius}
                        strokeWidth={`${strokeWidth}px`}
                        transform={`rotate(-90 ${sqSize/2} ${sqSize/2})`}
                        style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset, strokeLinecap: 'round' }}
                    />
                    <text className="fill-current text-xl font-bold" x="50%" y="50%" dy=".3em" textAnchor="middle">
                        {`${percentage}%`}
                    </text>
                </svg>
                <p className="mt-2 font-semibold">{skill}</p>
            </div>
        );
    };

    return (
        <Section id="about" title="About Me">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/3">
                    <img src={DATA.ABOUT.pic} alt="Profile" className="rounded-lg shadow-2xl w-full" />
                </div>
                <div className="md:w-2/3">
                    <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">{DATA.ABOUT.bio}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">
                        {DATA.ABOUT.skills.map(skill => (
                            <CircularSkill key={skill.name} percentage={skill.level} skill={skill.name} />
                        ))}
                    </div>
                    <button onClick={downloadCV} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105 flex items-center gap-2">
                        <ICONS.Download className="h-5 w-5" /> Download CV
                    </button>
                </div>
            </div>
        </Section>
    );
};

const Skills: React.FC = () => {
    const SkillBar: React.FC<{ name: string; level: number }> = ({ name, level }) => {
        const ref = useRef<HTMLDivElement>(null);
        const isVisible = useOnScreen(ref);

        return (
            <div ref={ref} className="mb-4">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-gray-700 dark:text-white">{name}</span>
                    <span className="text-sm font-medium text-blue-700 dark:text-orange-400">{level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 dark:bg-orange-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: isVisible ? `${level}%` : '0%' }}></div>
                </div>
            </div>
        );
    };

    return (
        <Section id="skills" title="My Skills">
            <div className="grid md:grid-cols-3 gap-8">
                {Object.entries(DATA.SKILLS).map(([category, skills]) => (
                     <div key={category} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                         <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                           {category === 'Programming Languages' ? <ICONS.Code className="h-6 w-6 text-blue-500 dark:text-orange-400"/> :
                            category === 'Frameworks & Tools' ? <ICONS.Tool className="h-6 w-6 text-blue-500 dark:text-orange-400"/> :
                            <ICONS.Users className="h-6 w-6 text-blue-500 dark:text-orange-400"/>}
                            {category}
                         </h3>
                        {skills.map(skill => (
                             <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                        ))}
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Projects: React.FC<{ onProjectClick: (project: Project) => void }> = ({ onProjectClick }) => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', ...new Set(DATA.PROJECTS.map(p => p.category))];
    
    const filteredProjects = DATA.PROJECTS.filter(project => {
        const matchesCategory = filter === 'All' || project.category === filter;
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const exportToCSV = () => {
        const headers = "Title,Category,Description,GitHub,Live Demo\n";
        const csvContent = "data:text/csv;charset=utf-8," + headers + DATA.PROJECTS.map(p => 
            `"${p.title}","${p.category}","${p.description.replace(/"/g, '""')}","${p.links.github}","${p.links.live}"`
        ).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "projects.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <Section id="projects" title="Portfolio">
            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                <div className="relative w-full md:w-auto">
                    <input
                        type="search"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-full bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-400"
                    />
                    <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                </div>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === cat ? 'bg-blue-500 text-white dark:bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        {cat}
                    </button>
                ))}
                <button onClick={exportToCSV} className="px-4 py-2 text-sm font-semibold rounded-full bg-green-500 text-white flex items-center gap-2">
                    <ICONS.Download className="h-4 w-4" /> Export CSV
                </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer" onClick={() => onProjectClick(project)}>
                        <img src={project.imageUrl} alt={project.title} className="w-full h-60 object-cover transform group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <h3 className="text-white text-xl font-bold">{project.title}</h3>
                            <p className="text-gray-300 text-sm">{project.tags.join(', ')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Experience: React.FC = () => {
    const { jsPDF } = window.jspdf;
    
    const downloadResume = () => {
        const doc = new jsPDF();
        let y = 20;
        doc.setFontSize(18);
        doc.text("Resume - " + DATA.PROFILE.name, 20, y);
        y += 10;
        
        doc.setFontSize(14);
        doc.text("Work Experience", 20, y); y += 10;
        DATA.EXPERIENCE.work.forEach(item => {
            doc.setFontSize(12);
            doc.text(`${item.role} at ${item.company}`, 25, y); y+=6;
            doc.setFontSize(10);
            doc.text(`${item.period}`, 25, y); y+=6;
            doc.text(item.description, 25, y, { maxWidth: 160 }); y += (doc.splitTextToSize(item.description, 160).length * 5) + 5;
        });

        // Add Education and Certifications sections similarly
        
        doc.save(`${DATA.PROFILE.name}-Resume.pdf`);
    };

    const TimelineItem: React.FC<{item: Experience | Certification, icon: React.ReactNode}> = ({item, icon}) => (
        <div className="relative pl-8 sm:pl-32 py-6 group">
            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 dark:before:bg-gray-600 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-blue-600 dark:after:bg-orange-500 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                <div className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-20 mb-3 sm:mb-0 text-white bg-blue-500 dark:bg-orange-500 rounded-full">{icon}</div>
                <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-blue-600 dark:text-orange-400 bg-blue-100 dark:bg-gray-700 rounded-full">{item.period || (item as Certification).date}</time>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{(item as Experience).role || (item as Certification).title}</div>
            </div>
            <div className="text-slate-500 dark:text-gray-400">{(item as Experience).company || (item as Certification).organization}</div>
            <div className="text-slate-500 dark:text-gray-400 mt-2">{(item as Experience).description}</div>
        </div>
    );
    
    return (
        <Section id="experience" title="Resume">
            <div className="text-center mb-12">
                <button onClick={downloadResume} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105 flex items-center gap-2 mx-auto">
                    <ICONS.Download className="h-5 w-5" /> Download Resume
                </button>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-center">Work Experience</h3>
                    <div className="space-y-4">
                        {DATA.EXPERIENCE.work.map(item => <TimelineItem key={item.company} item={item} icon={<ICONS.Briefcase className="h-8 w-8"/>} />)}
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-center">Education</h3>
                     <div className="space-y-4">
                        {DATA.EXPERIENCE.education.map(item => <TimelineItem key={item.institution} item={item} icon={<ICONS.GraduationCap className="h-8 w-8"/>} />)}
                    </div>
                </div>
            </div>
        </Section>
    );
};

const Services: React.FC<{ onServiceClick: (service: Service) => void }> = ({ onServiceClick }) => {
    return (
        <Section id="services" title="Services I Offer">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DATA.SERVICES.map(service => (
                    <div key={service.title} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="inline-block p-4 bg-blue-100 dark:bg-gray-700 rounded-full mb-4">
                            <service.icon className="h-8 w-8 text-blue-500 dark:text-orange-400"/>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{service.shortDescription}</p>
                        <button onClick={() => onServiceClick(service)} className="font-semibold text-blue-500 dark:text-orange-400 hover:underline">Learn More</button>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % DATA.TESTIMONIALS.length);
    }, []);

    const prevSlide = () => {
        setCurrentIndex(prev => (prev - 1 + DATA.TESTIMONIALS.length) % DATA.TESTIMONIALS.length);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);
    
    return (
        <Section id="testimonials" title="What Clients Say">
            <div className="relative max-w-3xl mx-auto">
                <div className="overflow-hidden">
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {DATA.TESTIMONIALS.map((testimonial, index) => (
                            <div key={index} className="w-full flex-shrink-0 text-center p-8">
                                <img src={testimonial.image} alt={testimonial.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200 dark:border-gray-700"/>
                                <p className="text-lg italic text-gray-600 dark:text-gray-300 mb-4">"{testimonial.feedback}"</p>
                                <h4 className="font-bold">{testimonial.name}</h4>
                                <p className="text-sm text-gray-500">{testimonial.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 <button onClick={prevSlide} className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Previous testimonial">
                    <ICONS.ChevronLeft className="h-6 w-6"/>
                </button>
                <button onClick={nextSlide} className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Next testimonial">
                    <ICONS.ChevronRight className="h-6 w-6"/>
                </button>
                <div className="flex justify-center mt-4">
                    {DATA.TESTIMONIALS.map((_, index) => (
                        <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full mx-1 ${currentIndex === index ? 'bg-blue-500 dark:bg-orange-400' : 'bg-gray-300 dark:bg-gray-600'}`}></button>
                    ))}
                </div>
            </div>
        </Section>
    );
};


const Achievements: React.FC = () => {
    return (
        <Section id="achievements" title="Awards & Achievements">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DATA.AWARDS.map(award => (
                    <div key={award.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                           <ICONS.Trophy className="h-8 w-8 text-yellow-500"/>
                        </div>
                        <div>
                           <h3 className="font-bold">{award.title}</h3>
                           <p className="text-sm text-gray-500">{award.issuer} - {award.year}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Certifications: React.FC = () => {
    return (
        <Section id="certifications" title="Certifications">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DATA.CERTIFICATIONS.map(cert => (
                    <div key={cert.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
                        <div>
                           <h3 className="font-bold text-lg mb-2">{cert.title}</h3>
                           <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{cert.organization}</p>
                           <p className="text-xs text-gray-400 mb-4">Issued: {cert.date}</p>
                        </div>
                        <a href={cert.verifyLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-500 dark:text-orange-400 hover:underline mt-auto">Verify Certificate &rarr;</a>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Blog: React.FC<{ onPostClick: (post: BlogPost) => void }> = ({ onPostClick }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPosts = DATA.BLOG_POSTS.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.intro.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Section id="blog" title="Latest Articles">
            <div className="text-center mb-8">
                <input
                    type="search"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full max-w-md mx-auto pl-10 pr-4 py-2 border rounded-full bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-400"
                />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(0, 3).map(post => (
                    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                            <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{post.intro}</p>
                            <button onClick={() => onPostClick(post)} className="font-semibold text-blue-500 dark:text-orange-400 hover:underline">Read More &rarr;</button>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Gallery: React.FC<{ onImageClick: (url: string) => void }> = ({ onImageClick }) => {
    return (
        <Section id="gallery" title="Gallery">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {DATA.GALLERY_IMAGES.map((img, index) => (
                    <img
                        key={index}
                        src={img.url}
                        alt={img.alt}
                        className="mb-4 w-full rounded-lg shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onClick={() => onImageClick(img.url)}
                    />
                ))}
            </div>
        </Section>
    );
};


const Stats: React.FC = () => {
    const AnimatedCounter: React.FC<{ target: number, duration?: number }> = ({ target, duration = 2000 }) => {
        const [count, setCount] = useState(0);
        const ref = useRef<HTMLSpanElement>(null);
        const isVisible = useOnScreen(ref);

        useEffect(() => {
            if (!isVisible) return;
            let start = 0;
            const end = target;
            if (start === end) return;

            let startTime: number | null = null;
            const step = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(Math.floor(progress * (end - start) + start));
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }, [isVisible, target, duration]);

        return <span ref={ref}>{count.toLocaleString()}</span>;
    };

    return (
        <div id="stats" className="bg-blue-500 dark:bg-orange-500 text-white py-16">
            <div className="container mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {DATA.STATS.map(stat => (
                    <div key={stat.label}>
                         <div className="text-4xl md:text-5xl font-bold mb-2">
                           <AnimatedCounter target={stat.value} />
                           {stat.suffix}
                         </div>
                         <p className="text-lg">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Pricing: React.FC = () => {
    return (
        <Section id="pricing" title="Pricing Plans">
            <div className="grid lg:grid-cols-3 gap-8">
                {DATA.PRICING_PLANS.map(plan => (
                    <div key={plan.title} className={`bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center border-2 ${plan.recommended ? 'border-blue-500 dark:border-orange-400 transform scale-105' : 'border-transparent'}`}>
                        {plan.recommended && <span className="bg-blue-500 dark:bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-4 left-1/2 -translate-x-1/2">Recommended</span>}
                        <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                        <p className="text-4xl font-extrabold mb-2">${plan.price}<span className="text-lg font-normal text-gray-500">/{plan.period}</span></p>
                        <p className="text-gray-500 mb-6">{plan.description}</p>
                        <ul className="text-left space-y-3 mb-8">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <ICONS.CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-3 font-semibold rounded-full shadow-md transition-transform transform hover:scale-105 ${plan.recommended ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300'}`}>
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <Section id="faq" title="Frequently Asked Questions">
            <div className="max-w-3xl mx-auto space-y-4">
                {DATA.FAQS.map((faq, index) => (
                    <div key={index} className="border dark:border-gray-700 rounded-lg">
                        <button onClick={() => toggleFAQ(index)} className="w-full flex justify-between items-center p-4 text-left font-semibold">
                            <span>{faq.question}</span>
                            <ICONS.ChevronDown className={`h-5 w-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-screen' : 'max-h-0'}`}>
                            <p className="p-4 pt-0 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Partners: React.FC = () => {
    return (
        <div id="partners" className="py-12 bg-gray-100 dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <h3 className="text-center text-xl font-semibold text-gray-500 mb-6">Trusted by companies like</h3>
                <div className="relative overflow-hidden">
                   <div className="flex animate-marquee whitespace-nowrap">
                       {DATA.PARTNER_LOGOS.map((logo, index) => <img key={index} src={logo.src} alt={logo.alt} className="h-10 mx-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />)}
                       {DATA.PARTNER_LOGOS.map((logo, index) => <img key={index + DATA.PARTNER_LOGOS.length} src={logo.src} alt={logo.alt} className="h-10 mx-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />)}
                   </div>
                </div>
            </div>
        </div>
    );
};


const Contact: React.FC<{ showToast: (message: string, type?: ToastMessage['type']) => void }> = ({ showToast }) => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', file: null as File | null });
    const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    useEffect(() => {
      // Load draft from localStorage
      const draft = localStorage.getItem('contactFormDraft');
      if (draft) {
        setFormData(JSON.parse(draft));
      }
      generateCaptcha();
    }, []);

    const generateCaptcha = () => {
      const num1 = Math.ceil(Math.random() * 10);
      const num2 = Math.ceil(Math.random() * 10);
      setCaptcha({ num1, num2, answer: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const newFormData = { ...formData, [name]: value };
      setFormData(newFormData);
      // Save draft to localStorage
      localStorage.setItem('contactFormDraft', JSON.stringify(newFormData));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFormData({ ...formData, file: e.target.files[0] });
      }
    };
    
    const validateForm = () => {
      const newErrors: Record<string, string> = {};
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      if (!formData.subject) newErrors.subject = "Subject is required";
      if (!formData.message) newErrors.message = "Message is required";
      if (parseInt(captcha.answer) !== captcha.num1 + captcha.num2) newErrors.captcha = "Incorrect CAPTCHA answer";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) {
        showToast("Please fix the errors in the form.", "error");
        return;
      }
      showToast("Sending message...", "info");
      try {
          // Fake API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          // throw new Error("Fake API error"); // Uncomment to test error case
          showToast("Message sent successfully!", "success");
          setFormData({ name: '', email: '', subject: '', message: '', file: null });
          localStorage.removeItem('contactFormDraft');
          generateCaptcha();
      } catch (error) {
          showToast("Failed to send message. Please try the mail link.", "error");
          window.location.href = `mailto:${DATA.CONTACT.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}`;
      }
    };

    return (
        <Section id="contact" title="Get In Touch">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <form onSubmit={handleSubmit} noValidate>
                       <div className="mb-4">
                            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className={`w-full p-3 bg-white dark:bg-gray-800 border ${errors.name ? 'border-red-500' : 'dark:border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                           <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className={`w-full p-3 bg-white dark:bg-gray-800 border ${errors.email ? 'border-red-500' : 'dark:border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                           {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className={`w-full p-3 bg-white dark:bg-gray-800 border ${errors.subject ? 'border-red-500' : 'dark:border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                        </div>
                        <div className="mb-4">
                           <textarea name="message" placeholder="Your Message" rows={5} value={formData.message} onChange={handleChange} className={`w-full p-3 bg-white dark:bg-gray-800 border ${errors.message ? 'border-red-500' : 'dark:border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}></textarea>
                           {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attach file (optional)</label>
                            <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        </div>
                         <div className="mb-4 flex items-center gap-2">
                           <label htmlFor="captcha" className="font-medium">{`What is ${captcha.num1} + ${captcha.num2}?`}</label>
                           <input type="number" id="captcha" value={captcha.answer} onChange={e => setCaptcha({...captcha, answer: e.target.value})} className={`w-20 p-2 bg-white dark:bg-gray-800 border ${errors.captcha ? 'border-red-500' : 'dark:border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                           {errors.captcha && <p className="text-red-500 text-sm">{errors.captcha}</p>}
                        </div>
                        <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition-colors">Send Message</button>
                    </form>
                </div>
                <div>
                     <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4">
                           <ICONS.Mail className="h-6 w-6 text-blue-500 dark:text-orange-400"/>
                           <a href={`mailto:${DATA.CONTACT.email}`} className="hover:underline">{DATA.CONTACT.email}</a>
                        </div>
                        <div className="flex items-center gap-4">
                           <ICONS.Phone className="h-6 w-6 text-blue-500 dark:text-orange-400"/>
                           <a href={`tel:${DATA.CONTACT.phone}`} className="hover:underline">{DATA.CONTACT.phone}</a>
                        </div>
                        <div className="flex items-center gap-4">
                           <ICONS.MapPin className="h-6 w-6 text-blue-500 dark:text-orange-400"/>
                           <span>{DATA.CONTACT.address}</span>
                        </div>
                    </div>
                    <div className="h-80 rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            src={DATA.CONTACT.mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </Section>
    );
};

const Newsletter: React.FC<{ showToast: (message: string, type?: ToastMessage['type']) => void }> = ({ showToast }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(email)) {
            showToast("Please enter a valid email address.", "error");
            return;
        }
        const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
        if (subscribers.includes(email)) {
            showToast("You are already subscribed!", "info");
        } else {
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            showToast("Thank you for subscribing!", "success");
            setEmail('');
        }
    };
    
    return (
        <div className="bg-gray-100 dark:bg-gray-800 py-16">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-2xl font-bold mb-2">Subscribe to My Newsletter</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Get updates on my latest articles, projects, and thoughts.</p>
                <form onSubmit={handleSubmit} className="flex justify-center max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-3 rounded-l-md border-r-0 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <button type="submit" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-r-md hover:bg-blue-600 transition-colors">Subscribe</button>
                </form>
            </div>
        </div>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center space-x-6 mb-4">
                    {Object.entries(DATA.SOCIAL_LINKS).map(([name, url]) => {
                         const Icon = ICONS[name as keyof typeof ICONS];
                         return (
                            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 dark:hover:text-orange-400 transition-colors">
                                <Icon className="h-6 w-6" />
                            </a>
                         );
                    })}
                </div>
                <p>&copy; {new Date().getFullYear()} {DATA.PROFILE.name}. All rights reserved.</p>
            </div>
        </footer>
    );
};

const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
    
    return (
        <button onClick={scrollToTop} className={`fixed bottom-5 right-5 p-3 rounded-full bg-blue-500 dark:bg-orange-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} aria-label="Back to top">
            <ICONS.ArrowUp className="h-6 w-6"/>
        </button>
    );
};

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="fixed bottom-5 left-5 z-30">
            {isOpen && (
                <div className="bg-white dark:bg-gray-800 w-72 h-96 rounded-lg shadow-2xl mb-2 flex flex-col animate-fade-in-up">
                    <div className="p-4 bg-blue-500 dark:bg-orange-500 text-white rounded-t-lg">
                        <h4 className="font-bold">Chat with me</h4>
                    </div>
                    <div className="p-4 flex-grow text-sm">
                        <p className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg mb-2">Hello! How can I help you today?</p>
                        <p className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">Feel free to ask about my work or availability.</p>
                    </div>
                    <div className="p-2 border-t dark:border-gray-700">
                        <a href={`mailto:${DATA.CONTACT.email}`} className="w-full text-center block bg-blue-500 text-white py-2 rounded-md">Send me an email</a>
                    </div>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-4 rounded-full bg-blue-500 dark:bg-orange-500 text-white shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-110" aria-label="Toggle chat">
                 {isOpen ? <ICONS.X className="h-6 w-6"/> : <ICONS.MessageSquare className="h-6 w-6"/>}
            </button>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [activeSection, setActiveSection] = useState('hero');

    const sectionRefs = {
        hero: useRef<HTMLElement>(null),
        about: useRef<HTMLElement>(null),
        skills: useRef<HTMLElement>(null),
        projects: useRef<HTMLElement>(null),
        experience: useRef<HTMLElement>(null),
        contact: useRef<HTMLElement>(null),
    };
    
    const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    }, []);

    const dismissToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const openModal = (title: string, content: React.ReactNode) => {
      setModalTitle(title);
      setModalContent(content);
    };

    const closeModal = () => {
      setModalContent(null);
      setModalTitle('');
    };
    
    const handleProjectClick = (project: Project) => {
        openModal(project.title, (
            <div>
                <img src={project.imageUrl} alt={project.title} className="w-full h-64 object-cover rounded-lg mb-4" />
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300">{tag}</span>)}
                </div>
                <p className="mb-4">{project.description}</p>
                <div className="flex space-x-4">
                    {project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-gray-900"> <ICONS.GitHub className="h-5 w-5"/> GitHub</a>}
                    {project.links.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-600"> <ICONS.ExternalLink className="h-5 w-5"/> Live Demo</a>}
                </div>
            </div>
        ));
    };

    const handleServiceClick = (service: Service) => {
        openModal(service.title, <p>{service.fullDescription}</p>);
    };

    const handlePostClick = (post: BlogPost) => {
         openModal(post.title, (
            <div>
                <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-4" />
                <p className="text-sm text-gray-500 mb-4">{post.date}</p>
                <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
        ));
    };

    const handleImageClick = (url: string) => {
        openModal("Image Preview", <img src={url} alt="Gallery" className="w-full h-auto rounded-lg" />);
    };
    
    // Keyboard shortcuts & Scroll Spy
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 't' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              document.querySelector<HTMLButtonElement>('button[aria-label="Toggle theme"]')?.click();
            }
            if (e.key === '/') {
                e.preventDefault();
                document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-30% 0px -70% 0px' }
        );
        
        Object.values(sectionRefs).forEach(ref => {
           if(ref.current) observer.observe(ref.current)
        });

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            Object.values(sectionRefs).forEach(ref => {
              if(ref.current) observer.unobserve(ref.current);
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <LanguageProvider>
          <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans leading-relaxed selection:bg-blue-200 dark:selection:bg-orange-800">
              <Header activeSection={activeSection} />
              
              <main>
                  <div ref={sectionRefs.hero}><Hero /></div>
                  <div ref={sectionRefs.about}><About /></div>
                  <div ref={sectionRefs.skills}><Skills /></div>
                  <div ref={sectionRefs.projects}><Projects onProjectClick={handleProjectClick} /></div>
                  <div ref={sectionRefs.experience}><Experience /></div>
                  <Services onServiceClick={handleServiceClick} />
                  <Testimonials />
                  <Achievements />
                  <Certifications />
                  <Blog onPostClick={handlePostClick} />
                  <Gallery onImageClick={handleImageClick} />
                  <Stats />
                  <Pricing />
                  <FAQ />
                  <Partners />
                  <div ref={sectionRefs.contact}><Contact showToast={showToast} /></div>
                  <Newsletter showToast={showToast} />
              </main>
    
              <Footer />
    
              {/* Floating UI Elements */}
              <BackToTopButton />
              <ChatWidget />
    
              {/* Global Modal */}
              <Modal isOpen={!!modalContent} onClose={closeModal} title={modalTitle}>
                  {modalContent}
              </Modal>
    
              {/* Toast Notifications Container */}
              <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
                  {toasts.map(toast => (
                      <Toast key={toast.id} message={toast} onDismiss={dismissToast} />
                  ))}
              </div>
          </div>
        </LanguageProvider>
    );
};


const MainAppWrapper: React.FC = () => (
    <ThemeProvider>
        <App />
    </ThemeProvider>
);

export default MainAppWrapper;
