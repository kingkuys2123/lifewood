import './MarqueeSection.css';

const ROW_A = [
    { word: 'Audio Annotation',     accent: false },
    { word: 'Image Labelling',      accent: true  },
    { word: 'Video Intelligence',   accent: false },
    { word: 'Text & NLP',           accent: false },
    { word: 'LLM Training Data',    accent: true  },
    { word: 'Speech Recognition',   accent: false },
    { word: 'Data Quality',         accent: false },
    { word: 'Model Evaluation',     accent: true  },
];

const ROW_B = [
    { word: 'Multilingual Corpus',  accent: true  },
    { word: 'Computer Vision',      accent: false },
    { word: 'Semantic Segmentation',accent: false },
    { word: 'Sentiment Analysis',   accent: true  },
    { word: 'Entity Recognition',   accent: false },
    { word: 'Data Pipeline',        accent: false },
    { word: 'Human-in-the-Loop',    accent: true  },
    { word: 'Ground Truth',         accent: false },
];

function Row({ items, reverse = false }) {
    /* Duplicate once so the seamless loop works */
    const doubled = [...items, ...items];
    return (
        <div className={`mq__row ${reverse ? 'mq__row--rev' : 'mq__row--fwd'}`} aria-hidden="true">
            {doubled.map((item, i) => (
                <span key={i} className="mq__item">
                    <span className={`mq__word${item.accent ? ' mq__word--accent' : ''}`}>
                        {item.word}
                    </span>
                    <span className="mq__sep" />
                </span>
            ))}
        </div>
    );
}

export default function MarqueeSection() {
    return (
        <section className="mq" aria-label="Capability keywords" aria-hidden="true">
            <Row items={ROW_A} reverse={false} />
            <Row items={ROW_B} reverse={true}  />
        </section>
    );
}

