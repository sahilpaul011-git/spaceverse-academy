
import { Link } from 'react-router-dom';
import OrbitView from '../components/OrbitView';

const destinations = [
  {
    number: '01',
    icon: '🪐',
    title: 'Solar System',
    description: 'Meet eight planets and explore their fascinating orbits.',
    route: '/explore',
    label: 'EXPLORE WORLDS',
  },
  {
    number: '02',
    icon: '🧪',
    title: 'Cosmic Lab',
    description: 'Discover the physics, forces, and mysteries of space.',
    route: '/cosmic-lab',
    label: 'RUN EXPERIMENTS',
  },
  {
    number: '03',
    icon: '✦',
    title: 'What If?',
    description: 'Imagine impossible cosmic events and explore the outcomes.',
    route: '/what-if',
    label: 'QUESTION REALITY',
  },
  {
    number: '04',
    icon: '🚀',
    title: 'Mission Control',
    description: 'Take on space missions and follow your explorer journey.',
    route: '/missions',
    label: 'START A MISSION',
  },
];

const discoveries = [
  {
    icon: '🌌',
    title: 'Deep Space',
    subtitle: 'Galaxies beyond our own',
    query: 'NASA Hubble distant galaxies',
  },
  {
    icon: '🔴',
    title: 'Mars',
    subtitle: 'The red planet',
    query: 'NASA Mars rover landscape',
  },
  {
    icon: '🪐',
    title: 'Saturn',
    subtitle: 'A world of rings',
    query: 'NASA Cassini Saturn rings',
  },
  {
    icon: '✨',
    title: 'Star Nurseries',
    subtitle: 'Where stars are born',
    query: 'Webb telescope Pillars of Creation',
  },
];

function Eyebrow({ children }) {
  return <p className="sv-eyebrow">{children}</p>;
}

export default function Home() {
  return (
    <div className="sv-home">
      <div className="sv-ambient sv-ambient-one" aria-hidden="true" />
      <div className="sv-ambient sv-ambient-two" aria-hidden="true" />

      {/* CINEMATIC HERO */}
      <section className="sv-hero">
        <div className="sv-hero-copy">
          <div className="sv-status">
            <span className="sv-status-dot" />
            THE UNIVERSE IS YOURS TO DISCOVER
          </div>

          <Eyebrow>SPACEVERSE ACADEMY / 001</Eyebrow>

          <h1 className="sv-title">
            Beyond the
            <br />
            <span>ordinary.</span>
            <br />
            Into the infinite.
          </h1>

          <p className="sv-hero-description">
            A universe of discovery awaits. Explore distant worlds, run
            cosmic experiments, and ask the questions that take you
            beyond the stars.
          </p>

          <div className="sv-actions">
            <Link className="sv-button sv-button-primary" to="/explore">
              Begin your journey <span>↗</span>
            </Link>
            <Link className="sv-button sv-button-secondary" to="/what-if">
              <span>✦</span> What if...?
            </Link>
          </div>

          <div className="sv-hero-note">
            <span>✳</span> Free space discovery for curious minds
          </div>
        </div>

        {/* CSS 3D PLANET SCENE */}
        <div className="sv-universe" aria-label="Decorative 3D-style planet scene">
          <div className="sv-universe-grid" aria-hidden="true" />
          <div className="sv-starfield sv-starfield-back" aria-hidden="true" />

          <div className="sv-orbit sv-orbit-a" aria-hidden="true" />
          <div className="sv-orbit sv-orbit-b" aria-hidden="true" />
          <div className="sv-orbit sv-orbit-c" aria-hidden="true" />

          <div className="sv-planet sv-planet-main" aria-hidden="true">
            <div className="sv-planet-clouds" />
          </div>

          <div className="sv-planet sv-planet-small" aria-hidden="true" />
          <div className="sv-planet sv-planet-ringed" aria-hidden="true">
            <div className="sv-ring" />
          </div>

          <div className="sv-floating-label sv-label-top">
            <span className="sv-label-dot" />
            SECTOR 07 / UNKNOWN
          </div>

          <div className="sv-floating-label sv-label-bottom">
            <span className="sv-label-symbol">✦</span>
            SOMEWHERE, WAITING TO BE DISCOVERED
          </div>

          <div className="sv-universe-caption">
            <span>FIG. 01</span>
            <span>AN INFINITE FRONTIER</span>
          </div>
        </div>
      </section>

      {/* QUICK INFORMATION STRIP */}
      <section className="sv-facts" aria-label="Space facts">
        <div>
          <span className="sv-fact-number">08</span>
          <span className="sv-fact-label">Major planets</span>
        </div>
        <div>
          <span className="sv-fact-number">∞</span>
          <span className="sv-fact-label">Things to discover</span>
        </div>
        <div>
          <span className="sv-fact-number">01</span>
          <span className="sv-fact-label">Curious mind needed</span>
        </div>
        <div className="sv-free-fact">
          <span className="sv-fact-number">FREE</span>
          <span className="sv-fact-label">Start exploring today</span>
        </div>
      </section>

      {/* LEARNING DESTINATIONS */}
      <section className="sv-section">
        <div className="sv-section-heading">
          <div>
            <Eyebrow>YOUR NEXT DESTINATION</Eyebrow>
            <h2>Choose your universe.</h2>
          </div>
          <p>
            Every great discovery begins with one small question.
            Where will yours take you?
          </p>
        </div>

        <div className="sv-destination-grid">
          {destinations.map((item) => (
            <Link
              className="sv-destination"
              to={item.route}
              key={item.number}
            >
              <div className="sv-card-top">
                <span className="sv-card-icon">{item.icon}</span>
                <span className="sv-card-number">{item.number}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="sv-card-footer">
                <span>{item.label}</span>
                <span className="sv-card-arrow">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INTERACTIVE SOLAR SYSTEM */}
      <section className="sv-section sv-orbit-section">
        <div className="sv-section-heading">
          <div>
            <Eyebrow>OUR COSMIC NEIGHBOURHOOD</Eyebrow>
            <h2>Worlds in motion.</h2>
          </div>
          <Link className="sv-text-link" to="/explore">
            Open full explorer ↗
          </Link>
        </div>

        <div className="sv-orbit-panel">
          <div className="sv-panel-heading">
            <div>
              <span className="sv-panel-overline">LIVE LEARNING MODEL</span>
              <h3>The Solar System</h3>
            </div>
            <span className="sv-panel-tag">INTERACTIVE</span>
          </div>

          <p className="sv-panel-description">
            Explore the Sun and eight planets with our simplified
            orbital model. Select a planet to begin your journey.
          </p>

          <OrbitView compact selectedId={null} />

          <div className="sv-panel-footer">
            <span>SIMPLIFIED ORBITS · NOT TO SCALE</span>
            <Link to="/explore">Explore the planets →</Link>
          </div>
        </div>
      </section>

      {/* DISCOVERIES */}
      <section className="sv-section">
        <div className="sv-section-heading">
          <div>
            <Eyebrow>CAPTURED FROM THE COSMOS</Eyebrow>
            <h2>The universe, unveiled.</h2>
          </div>
          <Link className="sv-text-link" to="/gallery">
            Visit gallery ↗
          </Link>
        </div>

        <div className="sv-discovery-grid">
          {discoveries.map((item, index) => (
            <Link
              key={item.title}
              to={`/gallery?q=${encodeURIComponent(item.query)}`}
              className={`sv-discovery sv-discovery-${index + 1}`}
            >
              <span className="sv-discovery-icon">{item.icon}</span>
              <span className="sv-discovery-text">
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
              </span>
              <span className="sv-discovery-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      {/* QUIZ FEATURE */}
      <section className="sv-quiz-banner">
        <div className="sv-quiz-art" aria-hidden="true">?</div>
        <div className="sv-quiz-copy">
          <Eyebrow>YOUR MIND IS THE MISSION</Eyebrow>
          <h2>How much of the cosmos do you know?</h2>
          <p>
            Challenge yourself with space quizzes. Discover surprising
            facts and become a little more cosmic with every answer.
          </p>
        </div>
        <Link className="sv-button sv-button-primary" to="/quiz">
          Enter Quiz Arena ↗
        </Link>
      </section>

      {/* FREE-FIRST LEARNING */}
      <section className="sv-section sv-access-section">
        <div className="sv-access-card">
          <span className="sv-access-icon">✦</span>
          <Eyebrow>OPEN THE DOOR TO SPACE</Eyebrow>
          <h2>Curiosity should have no launch fee.</h2>
          <p>
            Start with free space exploration, learning activities,
            and discovery. Optional premium courses can be added later
            without putting the basic learning journey behind a paywall.
          </p>
          <Link className="sv-text-link" to="/explore">
            Start learning for free ↗
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sv-footer">
        <Link className="sv-brand" to="/">
          <span className="sv-brand-mark">✳</span>
          SPACEVERSE <span>ACADEMY</span>
        </Link>

        <p>Made for curious minds and future explorers.</p>

        <div className="sv-footer-links">
          <Link to="/explore">Explore</Link>
          <Link to="/quiz">Quiz Arena</Link>
          <Link to="/missions">Missions</Link>
          <Link to="/cosmic-lab">Cosmic Lab</Link>
          <Link to="/what-if">What If?</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/credits">About</Link>
        </div>

        <span className="sv-footer-bottom">
          KEEP LOOKING UP. THERE IS MORE OUT THERE.
        </span>
      </footer>
    </div>
  );
}

/* =========================================
   SPACEVERSE ACADEMY — CINEMATIC HOMEPAGE
   ========================================= */

.sv-home {
  --sv-bg: #050711;
  --sv-panel: #0b1020;
  --sv-cyan: #8be9f8;
  --sv-muted: #a1a9bd;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  color: #f5f7ff;
  background:
    radial-gradient(ellipse at 50% 0%, #152044 0%, transparent 45%),
    #050711;
  font-family: "Segoe UI", system-ui, sans-serif;
}

.sv-home a {
  text-decoration: none;
}

.sv-ambient {
  position: absolute;
  z-index: -1;
  width: 28rem;
  height: 28rem;
  border-radius: 50%;
  filter: blur(100px);
  opacity: .12;
  pointer-events: none;
}

.sv-ambient-one {
  top: 10rem;
  left: -18rem;
  background: #06b6d4;
}

.sv-ambient-two {
  top: 45rem;
  right: -18rem;
  background: #7c3aed;
}

.sv-hero {
  width: min(100% - 2.5rem, 1240px);
  min-height: 650px;
  margin: auto;
  padding: 6rem 0 5rem;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  align-items: center;
  gap: 2rem;
}

.sv-hero-copy {
  position: relative;
  z-index: 2;
}

.sv-status {
  display: inline-flex;
  align-items: center;
  gap: .65rem;
  padding: .7rem .9rem;
  border: 1px solid #ffffff1c;
  border-radius: 999px;
  background: #ffffff08;
  color: #c6d2e9;
  font-size: .64rem;
  font-weight: 800;
  letter-spacing: .13em;
}

.sv-status-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #67e8f9;
  box-shadow: 0 0 14px #67e8f9;
  animation: sv-pulse 2s ease-in-out infinite;
}

.sv-eyebrow {
  margin: 1.5rem 0 .75rem;
  color: var(--sv-cyan);
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .24em;
  line-height: 1.8;
}

.sv-title {
  margin: 0;
  color: #f8fafc;
  font-size: clamp(2.9rem, 5.5vw, 5.3rem);
  font-weight: 650;
  letter-spacing: -.075em;
  line-height: .99;
}

.sv-title span {
  background: linear-gradient(105deg, #f7fbff 5%, #a5e9ff 40%, #a5a4ff 85%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.sv-hero-description {
  max-width: 490px;
  margin: 1.5rem 0 0;
  color: #a9b3c9;
  font-size: 1rem;
  line-height: 1.95;
}

.sv-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  margin-top: 2rem;
}

.sv-button {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  padding: .8rem 1.2rem;
  border-radius: 999px;
  font-size: .85rem;
  font-weight: 800;
  transition: transform .2s ease, background .2s ease, border-color .2s ease;
}

.sv-button:hover {
  transform: translateY(-3px);
}

.sv-button-primary {
  border: 1px solid #a5f3fc;
  background: #a5f3fc;
  color: #07111d !important;
  box-shadow: 0 8px 30px #22d3ee20;
}

.sv-button-primary:hover {
  background: #cffafe;
}

.sv-button-secondary {
  border: 1px solid #ffffff24;
  background: #ffffff06;
  color: #f1f5f9 !important;
}

.sv-button-secondary:hover {
  border-color: #a5f3fc80;
  background: #67e8f912;
}

.sv-hero-note {
  display: flex;
  align-items: center;
  gap: .6rem;
  margin-top: 2rem;
  color: #8d9ab3;
  font-size: .76rem;
}

.sv-hero-note span {
  color: var(--sv-cyan);
}

/* Cinematic planet composition */

.sv-universe {
  position: relative;
  min-width: 0;
  min-height: 520px;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.sv-universe-grid {
  position: absolute;
  inset: 12% -10% 0;
  opacity: .22;
  transform: perspective(450px) rotateX(64deg) scale(1.25);
  transform-origin: center bottom;
  background-image:
    linear-gradient(#6478ae30 1px, transparent 1px),
    linear-gradient(90deg, #6478ae30 1px, transparent 1px);
  background-size: 38px 38px;
  mask-image: linear-gradient(transparent, black 45%, transparent);
}

.sv-starfield {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(1px 1px at 12% 18%, #fff 99%, transparent),
    radial-gradient(2px 2px at 77% 17%, #a5f3fc 99%, transparent),
    radial-gradient(1px 1px at 88% 58%, #fff 99%, transparent),
    radial-gradient(1px 1px at 26% 78%, #fff 99%, transparent),
    radial-gradient(2px 2px at 59% 87%, #c4b5fd 99%, transparent),
    radial-gradient(1px 1px at 48% 25%, #fff 99%, transparent),
    radial-gradient(1px 1px at 92% 32%, #fff 99%, transparent),
    radial-gradient(1px 1px at 10% 55%, #bae6fd 99%, transparent);
  background-size: 100% 100%;
}

.sv-orbit {
  position: absolute;
  left: 50%;
  top: 48%;
  border: 1px solid #9bb7ff25;
  border-radius: 50%;
  transform-style: preserve-3d;
  pointer-events: none;
}

.sv-orbit-a {
  width: 390px;
  height: 160px;
  transform: translate(-50%, -50%) rotate(-28deg) rotateX(59deg);
}

.sv-orbit-b {
  width: 460px;
  height: 235px;
  transform: translate(-50%, -50%) rotate(32deg) rotateX(61deg);
}

.sv-orbit-c {
  width: 330px;
  height: 360px;
  border-color: #67e8f916;
  transform: translate(-50%, -50%) rotate(47deg) rotateY(58deg);
}

.sv-planet {
  position: absolute;
  left: 50%;
  top: 48%;
  border-radius: 50%;
  transform-style: preserve-3d;
}

.sv-planet-main {
  width: clamp(180px, 24vw, 280px);
  aspect-ratio: 1;
  background:
    radial-gradient(ellipse at 28% 22%, #d3f7ff 0%, transparent 10%),
    radial-gradient(ellipse at 35% 30%, #65c9db 0%, #247fae 26%, #17406f 55%, #09132d 78%, #030611 100%);
  box-shadow:
    inset -35px -20px 55px #02040e,
    inset 10px 8px 22px #c8f6ff55,
    0 0 38px #2684ca36,
    0 0 110px #4f46e51e;
  transform: translate(-50%, -50%) translateZ(35px);
  animation: sv-float 7s ease-in-out infinite;
}

.sv-planet-clouds {
  position: absolute;
  inset: 4%;
  border-radius: 50%;
  opacity: .65;
  background:
    repeating-linear-gradient(
      163deg,
      transparent 0 15px,
      #d5f8ff1a 16px 19px,
      transparent 20px 35px
    );
  mask-image: radial-gradient(circle at 35% 35%, black, transparent 72%);
}

.sv-planet-small {
  top: 25%;
  left: 77%;
  width: 47px;
  aspect-ratio: 1;
  background: radial-gradient(circle at 30% 25%, #ffe3b5, #d98c58 48%, #46284a 83%, #100b20);
  box-shadow: inset -8px -4px 10px #130b23, 0 0 35px #f59e0b26;
  transform: translateZ(70px);
  animation: sv-float-small 5s ease-in-out infinite;
}

.sv-planet-ringed {
  top: 72%;
  left: 21%;
  width: 64px;
  aspect-ratio: 1;
  background: radial-gradient(circle at 30% 25%, #f5d6a0, #9f784e 54%, #28203a 88%);
  box-shadow: inset -10px -4px 12px #090814;
  transform: translateZ(60px);
  animation: sv-float-small 6s ease-in-out infinite reverse;
}

.sv-ring {
  position: absolute;
  width: 155%;
  height: 38%;
  top: 32%;
  left: -27%;
  border: 7px solid #e8cda6b0;
  border-left-color: #d8b88a50;
  border-right-color: #f4dfb76b;
  border-radius: 50%;
  transform: rotate(-24deg);
  box-shadow: 0 0 12px #e9cfa422;
}

.sv-floating-label {
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: .6rem;
  padding: .7rem .8rem;
  border: 1px solid #ffffff19;
  border-radius: 8px;
  background: #070b19c9;
  color: #bac6df;
  font-size: .57rem;
  letter-spacing: .1em;
  backdrop-filter: blur(12px);
}

.sv-label-top {
  top: 14%;
  left: 3%;
}

.sv-label-bottom {
  right: 1%;
  bottom: 15%;
  max-width: 240px;
}

.sv-label-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #67e8f9;
  box-shadow: 0 0 10px #67e8f9;
}

.sv-label-symbol {
  color: #c4b5fd;
  font-size: .9rem;
}

.sv-universe-caption {
  position: absolute;
  bottom: 3%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  gap: .5rem;
  border-top: 1px solid #ffffff18;
  padding-top: .9rem;
  color: #71809e;
  font-size: .6rem;
  letter-spacing: .14em;
}

/* Facts strip */

.sv-facts {
  width: min(100% - 2.5rem, 1240px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid #ffffff17;
  border-bottom: 1px solid #ffffff17;
  padding: 1.7rem 0;
}

.sv-facts > div {
  display: flex;
  flex-direction: column;
  gap: .45rem;
  padding: .4rem 1.4rem;
  border-right: 1px solid #ffffff13;
}

.sv-facts > div:first-child {
  padding-left: 0;
}

.sv-facts > div:last-child {
  border-right: 0;
}

.sv-fact-number {
  color: #f2f6ff;
  font-size: 1.7rem;
  font-weight: 650;
  letter-spacing: -.06em;
}

.sv-free-fact .sv-fact-number {
  color: var(--sv-cyan);
  font-size: 1.4rem;
}

.sv-fact-label {
  color: #8d9ab3;
  font-size: .75rem;
}

/* Shared section styles */

.sv-section {
  width: min(100% - 2.5rem, 1240px);
  margin: 0 auto;
  padding: 6rem 0 1rem;
}

.sv-section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.sv-section-heading .sv-eyebrow {
  margin-top: 0;
}

.sv-section-heading h2,
.sv-access-card h2,
.sv-quiz-copy h2 {
  margin: 0;
  color: #f5f7ff;
  font-size: clamp(1.8rem, 3.4vw, 3rem);
  font-weight: 650;
  letter-spacing: -.055em;
  line-height: 1.15;
}

.sv-section-heading > p {
  max-width: 370px;
  margin: 0;
  color: #929db4;
  font-size: .9rem;
  line-height: 1.8;
}

.sv-text-link {
  color: var(--sv-cyan) !important;
  font-size: .8rem;
  font-weight: 750;
  white-space: nowrap;
}

.sv-text-link:hover {
  color: white !important;
}

/* Destination cards */

.sv-destination-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.sv-destination {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 1.35rem;
  border: 1px solid #ffffff14;
  border-radius: 14px;
  background:
    radial-gradient(ellipse at 90% 0%, #5b75a01c, transparent 55%),
    #ffffff04;
  transition: transform .25s ease, border-color .25s ease, background .25s ease;
}

.sv-destination:hover {
  transform: translateY(-5px);
  border-color: #8be9f84d;
  background-color: #a5f3fc08;
}

.sv-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.2rem;
}

.sv-card-icon {
  font-size: 2rem;
}

.sv-card-number {
  color: #62718d;
  font-size: .7rem;
  letter-spacing: .15em;
}

.sv-destination h3 {
  margin: 0;
  color: #f5f7ff;
  font-size: 1.08rem;
  font-weight: 750;
}

.sv-destination > p {
  min-height: 84px;
  margin: .7rem 0 1.2rem;
  color: #98a4ba;
  font-size: .82rem;
  line-height: 1.8;
}

.sv-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  margin-top: auto;
  border-top: 1px solid #ffffff15;
  padding-top: 1rem;
  color: #9feaf8;
  font-size: .61rem;
  font-weight: 800;
  letter-spacing: .1em;
}

.sv-card-arrow {
  font-size: 1rem;
  transition: transform .2s ease;
}

.sv-destination:hover .sv-card-arrow {
  transform: translate(3px, -3px);
}

/* Orbit panel */

.sv-orbit-section {
  padding-top: 7rem;
}

.sv-orbit-panel {
  overflow: hidden;
  padding: clamp(1rem, 3vw, 2rem);
  border: 1px solid #ffffff17;
  border-radius: 18px;
  background:
    radial-gradient(ellipse at 50% 25%, #1b2b5530, transparent 60%),
    #090d1a;
}

.sv-panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.sv-panel-overline {
  color: #93a3c0;
  font-size: .62rem;
  font-weight: 800;
  letter-spacing: .18em;
}

.sv-panel-heading h3 {
  margin: .4rem 0 0;
  color: white;
  font-size: 1.5rem;
  font-weight: 750;
}

.sv-panel-tag {
  border: 1px solid #67e8f93b;
  border-radius: 999px;
  padding: .5rem .7rem;
  color: #a5f3fc;
  font-size: .6rem;
  font-weight: 800;
  letter-spacing: .1em;
}

.sv-panel-description {
  max-width: 650px;
  margin: 1rem 0 1.5rem;
  color: #98a4ba;
  font-size: .88rem;
  line-height: 1.8;
}

.sv-orbit-panel > section {
  max-width: 700px;
  margin: 0 auto;
}

.sv-orbit-panel > section > div {
  border-color: #ffffff12;
  background-color: #050916;
}

.sv-panel-footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid #ffffff12;
  padding-top: 1rem;
  color: #7e8ba5;
  font-size: .62rem;
  letter-spacing: .1em;
}

.sv-panel-footer a {
  color: #a5f3fc;
  font-size: .75rem;
  font-weight: 750;
  letter-spacing: 0;
}

/* Discovery cards */

.sv-discovery-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .8rem;
}

.sv-discovery {
  position: relative;
  display: flex;
  min-height: 160px;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 1.2rem;
  border: 1px solid #ffffff14;
  border-radius: 14px;
  background: linear-gradient(145deg, #101b35, #090c19);
  transition: transform .2s ease, border-color .2s ease;
}

.sv-discovery::after {
  position: absolute;
  right: -25px;
  top: -35px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #6366f125;
  content: "";
  filter: blur(20px);
}

.sv-discovery-2::after {
  background: #f9731625;
}

.sv-discovery-3::after {
  background: #fbbf2425;
}

.sv-discovery-4::after {
  background: #22d3ee25;
}

.sv-discovery:hover {
  transform: translateY(-4px);
  border-color: #a5f3fc55;
}

.sv-discovery-icon {
  position: relative;
  z-index: 1;
  font-size: 1.7rem;
}

.sv-discovery-text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: .4rem;
}

.sv-discovery-text strong {
  color: #f5f7ff;
  font-size: .95rem;
}

.sv-discovery-text small {
  color: #98a4ba;
  font-size: .75rem;
}

.sv-discovery-arrow {
  position: absolute;
  right: 1rem;
  bottom: 1.1rem;
  color: #a5f3fc;
}

/* Quiz banner */

.sv-quiz-banner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2rem;
  width: min(100% - 2.5rem, 1240px);
  margin: 7rem auto 0;
  overflow: hidden;
  padding: clamp(1.5rem, 5vw, 3.5rem);
  border: 1px solid #a5b4fc30;
  border-radius: 18px;
  background:
    radial-gradient(ellipse at 100% 0%, #8b5cf62a, transparent 45%),
    linear-gradient(110deg, #0d1830, #13132a);
}

.sv-quiz-copy {
  position: relative;
  z-index: 1;
  flex: 1;
}

.sv-quiz-copy .sv-eyebrow {
  margin-top: 0;
}

.sv-quiz-copy h2 {
  max-width: 600px;
}

.sv-quiz-copy > p {
  max-width: 600px;
  margin: 1rem 0 0;
  color: #a8b2c8;
  font-size: .9rem;
  line-height: 1.85;
}

.sv-quiz-art {
  position: absolute;
  right: 30%;
  top: -50%;
  color: #a5b4fc0b;
  font-size: 23rem;
  font-weight: 900;
  line-height: 1;
  pointer-events: none;
}

.sv-quiz-banner > .sv-button {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

/* Free learning */

.sv-access-section {
  padding-top: 5rem;
  padding-bottom: 6rem;
}

.sv-access-card {
  max-width: 780px;
  margin: auto;
  text-align: center;
}

.sv-access-icon {
  display: inline-grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 1px solid #67e8f94d;
  border-radius: 16px;
  background: #67e8f90d;
  color: #a5f3fc;
  font-size: 1.5rem;
}

.sv-access-card .sv-eyebrow {
  margin-top: 1.5rem;
}

.sv-access-card h2 {
  max-width: 650px;
  margin: auto;
}

.sv-access-card > p {
  max-width: 620px;
  margin: 1.2rem auto;
  color: #a0abc1;
  font-size: .9rem;
  line-height: 1.9;
}

/* Footer */

.sv-footer {
  border-top: 1px solid #ffffff16;
  padding: 2.5rem 1.25rem;
  text-align: center;
  background: #03050c8c;
}

.sv-brand {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  color: #f5f7ff !important;
  font-size: .95rem;
  font-weight: 900;
  letter-spacing: .08em;
}

.sv-brand > span:last-child {
  color: #9caac3;
  font-weight: 500;
}

.sv-brand-mark {
  color: #a5f3fc;
  font-size: 1.5rem;
}

.sv-footer > p {
  margin: .8rem 0 1.2rem;
  color: #8e9ab2;
  font-size: .8rem;
}

.sv-footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.2rem;
}

.sv-footer-links a {
  color: #b4bfd2;
  font-size: .75rem;
}

.sv-footer-links a:hover {
  color: #a5f3fc;
}

.sv-footer-bottom {
  display: block;
  margin-top: 2rem;
  color: #68758f;
  font-size: .58rem;
  letter-spacing: .2em;
}

/* Animations */

@keyframes sv-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .45; }
}

@keyframes sv-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -10px; }
}

@keyframes sv-float-small {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -9px; }
}

/* Tablet */

@media (max-width: 900px) {
  .sv-hero {
    min-height: auto;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding-top: 4.5rem;
  }

  .sv-hero-copy {
    max-width: 700px;
  }

  .sv-universe {
    width: 100%;
    max-width: 650px;
    min-height: 480px;
    margin: 0 auto;
  }

  .sv-title {
    font-size: clamp(3rem, 9vw, 5.2rem);
  }

  .sv-destination-grid,
  .sv-discovery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sv-destination > p {
    min-height: 0;
  }

  .sv-quiz-banner {
    align-items: flex-start;
    flex-direction: column;
  }

  .sv-quiz-art {
    right: 5%;
    top: -25%;
  }
}

/* Mobile */

@media (max-width: 560px) {
  .sv-hero,
  .sv-section,
  .sv-facts,
  .sv-quiz-banner {
    width: calc(100% - 2rem);
  }

  .sv-hero {
    padding-top: 3rem;
    padding-bottom: 2rem;
  }

  .sv-status {
    font-size: .54rem;
    letter-spacing: .08em;
  }

  .sv-title {
    font-size: clamp(2.8rem, 13vw, 4.2rem);
  }

  .sv-hero-description {
    font-size: .9rem;
    line-height: 1.8;
  }

  .sv-actions {
    align-items: stretch;
  }

  .sv-button {
    font-size: .78rem;
    padding: .75rem .9rem;
  }

  .sv-universe {
    min-height: 365px;
  }

  .sv-planet-main {
    width: 180px;
  }

  .sv-planet-small {
    width: 34px;
  }

  .sv-planet-ringed {
    width: 45px;
  }

  .sv-ring {
    border-width: 5px;
  }

  .sv-orbit-a {
    width: 280px;
    height: 125px;
  }

  .sv-orbit-b {
    width: 320px;
    height: 185px;
  }

  .sv-orbit-c {
    width: 250px;
    height: 290px;
  }

  .sv-floating-label {
    padding: .55rem;
    font-size: .47rem;
  }

  .sv-label-bottom {
    max-width: 190px;
  }

  .sv-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: .7rem 0;
  }

  .sv-facts > div {
    padding: 1rem .7rem;
    border-bottom: 1px solid #ffffff13;
  }

  .sv-facts > div:first-child {
    padding-left: .7rem;
  }

  .sv-facts > div:nth-child(2) {
    border-right: 0;
  }

  .sv-facts > div:nth-child(3),
  .sv-facts > div:nth-child(4) {
    border-bottom: 0;
  }

  .sv-fact-number {
    font-size: 1.5rem;
  }

  .sv-section {
    padding-top: 4rem;
  }

  .sv-section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: .9rem;
  }

  .sv-section-heading h2,
  .sv-access-card h2,
  .sv-quiz-copy h2 {
    font-size: 2rem;
  }

  .sv-destination-grid {
    gap: .7rem;
  }

  .sv-destination {
    padding: 1rem;
  }

  .sv-card-top {
    margin-bottom: 1.4rem;
  }

  .sv-card-icon {
    font-size: 1.6rem;
  }

  .sv-destination h3 {
    font-size: .95rem;
  }

  .sv-destination > p {
    font-size: .77rem;
  }

  .sv-card-footer {
    font-size: .52rem;
  }

  .sv-discovery-grid {
    gap: .7rem;
  }

  .sv-discovery {
    min-height: 145px;
    padding: .9rem;
  }

  .sv-discovery-text strong {
    font-size: .85rem;
  }

  .sv-discovery-text small {
    font-size: .68rem;
  }

  .sv-quiz-banner {
    margin-top: 4rem;
    padding: 1.4rem;
  }

  .sv-quiz-banner > .sv-button {
    width: 100%;
  }

  .sv-quiz-art {
    right: -5%;
    top: -10%;
    font-size: 15rem;
  }

  .sv-access-section {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  .sv-footer-links {
    gap: .8rem 1rem;
  }
}

/* Respect accessibility preferences */

@media (prefers-reduced-motion: reduce) {
  .sv-home *,
  .sv-home *::before,
  .sv-home *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}
