import { useState } from "react";
import { Link } from "react-router-dom";

const planets = [
  {
    name: "Mars",
    type: "THE RED PLANET",
    detail: "Explore dusty deserts, giant volcanoes and the search for ancient life.",
    className: "mars",
    number: "04",
    path: "/explore",
  },
  {
    name: "Saturn",
    type: "THE RINGED GIANT",
    detail: "Discover a world surrounded by spectacular rings of ice and rock.",
    className: "saturn",
    number: "06",
    path: "/explore",
  },
  {
    name: "Earth",
    type: "OUR HOME",
    detail: "Learn what makes our blue planet a special place for life.",
    className: "earth",
    number: "03",
    path: "/explore",
  },
];

const features = [
  {
    icon: "🪐",
    title: "Explore the Universe",
    text: "Travel between planets and discover moons, stars and galaxies.",
    path: "/explore",
    label: "Start exploring",
  },
  {
    icon: "🚀",
    title: "Space Missions",
    text: "Follow exciting missions and learn how humans explore space.",
    path: "/missions",
    label: "View missions",
  },
  {
    icon: "🧪",
    title: "Cosmic Lab",
    text: "Experiment with space concepts and discover how the universe works.",
    path: "/cosmic-lab",
    label: "Enter the lab",
  },
  {
    icon: "🌌",
    title: "What If? Simulator",
    text: "Imagine strange cosmic scenarios and explore their consequences.",
    path: "/what-if",
    label: "Try an experiment",
  },
];

export default function Home() {
  const [activePlanet, setActivePlanet] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const planet = planets[activePlanet];

  return (
    <main className="sv-home">
      <section className="sv-hero">
        <div className="sv-stars" aria-hidden="true" />
        <div className="sv-nebula" aria-hidden="true" />

        <div className="sv-hero-content">
          <div className="sv-eyebrow">
            <span className="sv-live-dot" />
            YOUR UNIVERSE OF DISCOVERY
          </div>

          <h1>
            BIG UNIVERSE.
            <br />
            <span>ENDLESS</span> WONDER.
          </h1>

          <p className="sv-hero-copy">
            A universe of space adventures, interactive experiments and
            incredible discoveries — made for curious minds.
          </p>

          <div className="sv-hero-actions">
            <Link className="sv-button sv-button-primary" to="/explore">
              Explore the universe <span>↗</span>
            </Link>
            <Link className="sv-button sv-button-glass" to="/quiz">
              Take a space quiz <span>✦</span>
            </Link>
          </div>

          <div className="sv-hero-stats">
            <div>
              <strong>8</strong>
              <span>PLANETS TO DISCOVER</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>QUESTIONS TO EXPLORE</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>CURIOSITY POWERED</span>
            </div>
          </div>
        </div>

        <div className="sv-solar-scene" aria-label="Illustration of planets in space">
          <div className="sv-orbit sv-orbit-one" />
          <div className="sv-orbit sv-orbit-two" />
          <div className="sv-orbit sv-orbit-three" />
          <div className="sv-sun" />
          <div className="sv-planet sv-planet-mercury" />
          <div className="sv-planet sv-planet-venus" />
          <div className="sv-planet sv-planet-earth">
            <span />
          </div>
          <div className="sv-planet sv-planet-mars" />
          <div className="sv-planet sv-planet-jupiter">
            <span />
          </div>
          <div className="sv-planet sv-planet-saturn">
            <span />
          </div>
          <div className="sv-planet sv-planet-neptune" />
          <div className="sv-floating-label sv-label-top">
            <span>✦</span> THE SOLAR SYSTEM
          </div>
          <div className="sv-floating-label sv-label-bottom">
            4.6 BILLION YEARS OF HISTORY
          </div>
        </div>

        <div className="sv-scroll-cue">
          <span /> SCROLL TO DISCOVER
        </div>
      </section>

      <section className="sv-section sv-discover">
        <div className="sv-section-heading">
          <div>
            <span className="sv-kicker">YOUR COSMIC JOURNEY</span>
            <h2>
              Pick your next <span>destination.</span>
            </h2>
          </div>
          <Link className="sv-text-link" to="/explore">
            View all worlds ↗
          </Link>
        </div>

        <div className="sv-planet-grid">
          {planets.map((item, index) => (
            <button
              className={`sv-planet-card ${activePlanet === index ? "selected" : ""}`}
              key={item.name}
              onClick={() => setActivePlanet(index)}
              type="button"
            >
              <div className={`sv-card-planet ${item.className}`}>
                {item.className === "saturn" && <span />}
              </div>
              <div className="sv-card-topline">
                <span>{item.type}</span>
                <span>/{item.number}</span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.detail}</p>
              <span className="sv-card-action">
                Discover world <span>↗</span>
              </span>
            </button>
          ))}
        </div>

        <div className="sv-selected-world">
          <div>
            <span className="sv-kicker">YOUR SELECTED DESTINATION</span>
            <h3>{planet.name} is waiting.</h3>
            <p>{planet.detail}</p>
          </div>
          <Link className="sv-button sv-button-primary" to={planet.path}>
            Visit {planet.name} ↗
          </Link>
        </div>
      </section>

      <section className="sv-section sv-learning">
        <div className="sv-section-heading">
          <div>
            <span className="sv-kicker">LEARN BY DOING</span>
            <h2>
              More than learning.
              <br />
              <span>It's an adventure.</span>
            </h2>
          </div>
          <p className="sv-heading-note">
            Read less. Discover more. Turn your biggest questions into
            unforgettable space adventures.
          </p>
        </div>

        <div className="sv-feature-grid">
          {features.map((feature, index) => (
            <article className="sv-feature-card" key={feature.title}>
              <div className="sv-feature-top">
                <span className="sv-feature-icon">{feature.icon}</span>
                <span className="sv-feature-number">
                  0{index + 1}
                </span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <Link to={feature.path} className="sv-text-link">
                {feature.label} ↗
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="sv-quiz-banner">
        <div className="sv-quiz-stars" />
        <div className="sv-quiz-art" aria-hidden="true">
          <div className="sv-quiz-moon">☾</div>
          <div className="sv-quiz-spark">✦</div>
          <div className="sv-quiz-star">✧</div>
        </div>
        <div className="sv-quiz-copy">
          <span className="sv-kicker">MISSION: BRAIN POWER</span>
          <h2>Think you know space?</h2>
          <p>
            Test your cosmic knowledge with fun questions, surprising facts
            and new challenges.
          </p>
          <Link className="sv-button sv-button-primary" to="/quiz">
            Challenge yourself ↗
          </Link>
        </div>
        <div className="sv-quiz-badge">
          <span>✦</span>
          <strong>READY</strong>
          <small>FOR LAUNCH</small>
        </div>
      </section>

      <section className="sv-section sv-free">
        <div className="sv-free-orb" aria-hidden="true" />
        <span className="sv-kicker">SPACE FOR EVERYONE</span>
        <h2>
          Your journey starts <span>for free.</span>
        </h2>
        <p>
          Begin with free space-learning experiences. When you're ready for
          more, discover deeper courses and premium adventures.
        </p>
        <div className="sv-free-actions">
          <Link className="sv-button sv-button-primary" to="/explore">
            Start learning free ↗
          </Link>
          <Link className="sv-button sv-button-glass" to="/credits">
            About SpaceVerse
          </Link>
        </div>
      </section>

      <footer className="sv-footer">
        <Link to="/" className="sv-brand">
          <span className="sv-brand-icon">✦</span>
          <span>
            SPACEVERSE
            <small>ACADEMY</small>
          </span>
        </Link>
        <p>Made for curious minds and future explorers.</p>
        <div className="sv-footer-links">
          <Link to="/explore">Explore</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/missions">Missions</Link>
          <Link to="/credits">About</Link>
        </div>
        <span className="sv-copyright">© {new Date().getFullYear()} SpaceVerse Academy</span>
      </footer>
    </main>
  );
}