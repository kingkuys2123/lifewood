import { useRef } from 'react';
import { useReveal } from '../../../hooks/useReveal';
import './AIServices.css';

export default function AISEcosystem() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, 0.08);

  return (
    <section className="ais-eco" ref={sectionRef}>
      <div className="wrap">
        <div className="ais-eco__grid">

          {/* 1 — Data Validation (dark, tall, spans 2 rows) */}
          <article className="ais-eco__card ais-eco__card--dark reveal">
            <div>
              <h3 className="ais-eco__title">Data Validation</h3>
              <p className="ais-eco__body">
                The goal is to create data that is consistent, accurate and
                complete, preventing data loss or errors in transfer, code or
                configuration.
              </p>
              <p className="ais-eco__copy">
                We verify that data conforms to predefined standards, rules or
                constraints, ensuring the information is trustworthy and fit for
                its intended purpose.
              </p>
            </div>
            <div>
              <div className="ais-eco__image--dark">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80"
                  alt="Data validation chain"
                />
              </div>
              <p className="ais-eco__copyright">© 2025 Lifewood Data Technology</p>
            </div>
          </article>

          {/* 2 — Data Collection */}
          <article className="ais-eco__card reveal reveal-delay-1">
            <h3 className="ais-eco__title">Data Collection</h3>
            <p className="ais-eco__body">
              Lifewood delivers multi-modal data collection across text, audio,
              image, and video, supported by advanced workflows for
              categorization, labeling, tagging, transcription, sentiment
              analysis, and subtitle generation.
            </p>
            <p className="ais-eco__copy">
              Our scalable processes ensure accuracy and cultural nuance across
              30+ languages and regions.
            </p>
          </article>

          {/* 3 — Data Acquisition */}
          <article className="ais-eco__card reveal reveal-delay-2">
            <h3 className="ais-eco__title">Data Acquisition</h3>
            <p className="ais-eco__body">
              We provide <strong>end-to-end data acquisition solutions</strong>—
              capturing, processing, and managing large-scale, diverse datasets.
            </p>
            <div className="ais-eco__cluster">
              <div className="ais-eco__avatar">🧑</div>
              <div className="ais-eco__avatar">👩</div>
              <div className="ais-eco__cluster-logo">
                <span>●</span>life<em style={{fontStyle:'normal',color:'#1D1D1F'}}>wood</em>
              </div>
              <div className="ais-eco__avatar">👨</div>
              <div className="ais-eco__avatar">🧑‍💻</div>
            </div>
          </article>

          {/* 4 — Data Curation */}
          <article className="ais-eco__card reveal reveal-delay-1">
            <h3 className="ais-eco__title">Data Curation</h3>
            <p className="ais-eco__body">
              We sift, select and index data to ensure reliability, accessibility
              and ease of classification.
            </p>
            <p className="ais-eco__copy">
              Data can be curated to support business decisions, academic
              research, genealogies, scientific research and more.
            </p>
            <div className="ais-eco__dots">
              {['saffron','saffron','forest','saffron','forest','saffron','forest','forest'].map((c,i)=>(
                <span key={i} className={`ais-eco__dot ais-eco__dot--${c}`} />
              ))}
            </div>
          </article>

          {/* 5 — Data Annotation */}
          <article className="ais-eco__card reveal reveal-delay-2">
            <h3 className="ais-eco__title">Data Annotation</h3>
            <p className="ais-eco__body">
              In the age of AI, data is the fuel for all analytic and machine
              learning. With our in-depth library of services, we're here to be
              an integral part of your digital strategy, accelerating your
              organization's cognitive systems development.
            </p>
            <div className="ais-eco__badge">
              <div className="ais-eco__badge-icon" aria-hidden="true">🔖</div>
              <span>
                Lifewood provides high quality annotation services for a wide
                range of mediums including text, audio and video for both
                computer vision and natural language processing.
              </span>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
