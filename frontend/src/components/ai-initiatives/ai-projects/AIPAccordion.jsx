import { useMemo, useRef, useState } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './AIProjects.css';

const PROJECTS = [
  {
    id: '2.1',
    title: 'AI Data Extraction',
    icon: 'db',
    summary: 'AI-optimized image & text acquisition from global sources.',
    description:
        "Using Al, we optimize the acquisition of image and text from multiple sources. Techniques include onsite scanning, drone photography, negotiation with archives and the formation of alliances with corporations, religious organizations and governments.",
    color: '#F5A623',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=75',
  },
  {
    id: '2.2',
    title: 'Machine Learning Enablement',
    icon: 'ml',
    summary: 'Building and scaling ML pipelines for real-world impact.',
    description:
        "From simple data to deep learning, our data solutions are highly flexible and can enable a wide variety of ML systems, no matter how complex the model.",
    color: '#133020',
    img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=75',
  },
  {
    id: '2.3',
    title: 'Autonomous Driving Technology',
    icon: 'car',
    summary: 'Training datasets for safe, reliable autonomous vehicles.',
    description:
        "Our expertise in precision data labelling lays the groundwork for AI, so that it can process\n" +
        "and adapt to the complexities of real-world conditions. We have implemented a diverse\n" +
        "mapping methodology, that employs a wide range of data types, including 2D and 3D\n" +
        "models, and combinations of both, to create a fully visualized cognitive driving system.\n" +
        "\n" +
        "Millions of images, videos and mapping data were annotated, efectively transitioning this\n" +
        "technology from theoretical models to real-world applications - a significant leap forward\n" +
        "for autonomous transport.\n" +
        "\n" +
        "Lifewood remains at the forefront of this technology, pioneering the evolution of safe,\n" +
        "eficient autonomous driving solutions.",
    color: '#F5A623',
    img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=75',
  },
  {
    id: '2.4',
    title: 'AI-Enabled Customer Service',
    icon: 'chat',
    summary: 'Intelligent conversational AI for next-gen support.',
    description:
        "Al-enabled customer service is now the quickest and most effective route for institutions to deliver personalized, proactive experiences that drive customer engagement. Al powered services can increase customer engagement, multiplying cross-sell and upsell opportunities. Guided by our experts Al customer service can transform customer relationships creating an improved cycle of service, satisfaction and increased customer engagement",
    color: '#133020',
    img: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&q=75',
  },
  {
    id: '2.5',
    title: 'Natural Language Processing and Speech Acquisition',
    icon: 'mic',
    summary: '50+ language datasets for NLP and voice AI systems.',
    description:
        "We have partnered with some of the world's most advanced companies in NLP development. With a managed workforce that spans the globe, we offer solutions in over 50 language capabilities and can assess various dialects and accents for both text and audio data. We specialize in collecting and transcribing recordings from native speakers. This has involved tens of thousands of conversations, a scale made possible by our expertise in adapting industrial processes and our integration with Al.",
    color: '#F5A623',
    img: 'https://images.unsplash.com/photo-1589254065909-b7086229d08c?w=600&q=75',
  },
  {
    id: '2.6',
    title: 'Computer Vision (CV)',
    icon: 'eye',
    summary: 'High-quality annotated visual data for CV models.',
    description:
        "Training Al to see and understand the world requires a high volume of quality training data. Lifewood provides total data solutions for your CV development from collection to annotation to classification and more, for video and image datasets enabling machines to interpret visual information. We have experience in a wide variety of applications including autonomous vehicles, farm monitoring, face recognition and more.",
    color: '#133020',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=75',
  },
  {
    id: '2.7',
    title: 'Daily Head Count Monitoring',
    icon: 'db',
    summary: 'Real-time workforce data visualization powered by Google Drive Excel uploads.',
    description:
        "DataViz is an intelligent data visualization system that connects directly to Google Drive, automatically reads uploaded Excel files, and transforms raw workforce data into dynamic charts, tables, and graphs in real time. Designed to eliminate manual reporting, the system's AI agent instantly processes each uploaded file and renders the data through clear, interactive visuals — giving managers instant insight into daily head counts across all teams and locations.",
    color: '#133020',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=75',
  },
  {
    id: '2.8',
    title: 'Genealogy',
    icon: 'tree',
    summary: 'Structured genealogical AI datasets across generations.',
    description:
        "Powered by Al, Lifewood processes genealogical material at speed and scale, to conserve and illuminate family histories, national archives, corporate lists and records of all types. Lifewood has more than 18 years of experience capturing, scanning and processing genealogical data. In fact, Lifewood started with genealogy data as its core business, so that over the years we have accumulated vast knowledge in diverse types of genealogy indexing.\n" +
        "\n" +
        "We have worked with all the major genealogy companies and have extensive experience in transcribing and indexing genealogical content in a wide variety of formats, including tabular, pre-printed forms and paragraph-style records.\n" +
        "\n" +
        "Working across borders, with offices on every continent, our ability with multi-language projects has built an extensive capability spanning more than 50 languages and associated dialects. Now, powered by Al and the latest inter-office communication systems, we are transforming ever more efficient ways to service our clients, while keeping humanity at the centre of our activity.\n" +
        "\n" +
        "Genealogical material that we have experience with includes:\n" +
        "\n" +
        "Census\n" +
        "Vital - BMD\n" +
        "Church and Parish Registers\n" +
        "Passenger Lists\n" +
        "Naturalisation\n" +
        "Military Records\n" +
        "Legal Records\n" +
        "Yearbooks",
    color: '#F5A623',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=75',
  },
];

/* ── SVG icon helper ── */
const ICONS = {
  db: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/>
    </svg>
  ),
  ml: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  ),
  car: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2"/>
      <path d="M16 8h4l3 4v4h-7V8Z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  tree: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

function ProjectCard({ project, active, onHover, onClick }) {
  return (
    <button
      type="button"
      className={`aip-acc__card${active ? ' is-active' : ''}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onClick}
      aria-label={`Open ${project.title}`}
    >
      <div className="aip-acc__card-media">
        <img src={project.img} alt={project.title} loading="lazy" />
        <span className="aip-acc__card-shade" aria-hidden="true" />
      </div>
      <div className="aip-acc__card-content">
        <span className="aip-acc__icon-wrap" style={{ '--ic': project.color }}>
          {ICONS[project.icon]}
        </span>
        <span className="aip-acc__num">{project.id}</span>
        <span className="aip-acc__title">{project.title}</span>
        <span className="aip-acc__summary">{project.summary}</span>
      </div>
    </button>
  );
}

export default function AIPAccordion() {
  const [activeId, setActiveId] = useState('2.1');
  const ref = useRef(null);
  useReveal(ref, 0.05);

  const active = useMemo(() => PROJECTS.find((project) => project.id === activeId) || PROJECTS[0], [activeId]);

  return (
    <section className="aip-acc-section" ref={ref}>
      <div className="wrap">
        {/* section head */}
        <div className="aip-acc__head reveal">
          <span className="aip-acc__kicker">
            <span className="aip-acc__kicker-dot" />
            Projects
          </span>
          <h2 className="aip-acc__h2">What we currently handle</h2>
        </div>

        <div className="aip-acc__layout aip-acc__layout--cards">
          <div className="aip-acc__cards reveal reveal-delay-1" role="list" aria-label="AI projects">
            {PROJECTS.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                active={active.id === project.id}
                onHover={() => setActiveId(project.id)}
                onClick={() => setActiveId(project.id)}
              />
            ))}
          </div>

          <div className="aip-acc__detail reveal reveal-delay-2" style={{ '--ic': active.color }}>
            <div className="aip-acc__detail-header">
              <span className="aip-acc__preview-icon">{ICONS[active.icon]}</span>
              <div>
                <p className="aip-acc__num">{active.id}</p>
                <h3 className="aip-acc__detail-title">{active.title}</h3>
              </div>
            </div>

            <div className="aip-acc__desc">
              {active.description.split(/\n\n+/).map((para, pi) => (
                <p key={pi} className="aip-acc__para">
                  {para.split('\n').map((line, li, arr) => (
                    <span key={li}>
                      {line}
                      {li < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            <a href="/contact" className="aip-acc__cta">
              Learn more
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
