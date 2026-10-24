
import { useEffect, useState } from 'react';

const backupQuestions = [
  { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Mercury'], correctAnswer: 1, explanation: 'Mars looks reddish because its surface contains iron oxide.', topic: 'Planets' },
  { question: 'Which is the largest planet in our Solar System?', options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'], correctAnswer: 2, explanation: 'Jupiter is the largest planet in our Solar System.', topic: 'Planets' },
  { question: 'Which star is closest to Earth?', options: ['Sirius', 'Polaris', 'The Sun', 'Vega'], correctAnswer: 2, explanation: 'The Sun is the star at the center of our Solar System.', topic: 'Stars' },
  { question: 'What is Earth’s natural satellite?', options: ['Titan', 'The Moon', 'Europa', 'Phobos'], correctAnswer: 1, explanation: 'The Moon orbits Earth naturally.', topic: 'Moons' },
  { question: 'Which planet has the most prominent rings?', options: ['Mars', 'Saturn', 'Mercury', 'Earth'], correctAnswer: 1, explanation: 'Saturn is famous for its spectacular ring system.', topic: 'Planets' },
  { question: 'How many planets are in our Solar System?', options: ['7', '8', '9', '10'], correctAnswer: 1, explanation: 'There are eight officially recognized planets.', topic: 'Solar System' },
  { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswer: 2, explanation: 'Mercury follows the closest orbit to the Sun.', topic: 'Planets' },
  { question: 'Which planet is farthest from the Sun?', options: ['Saturn', 'Uranus', 'Neptune', 'Jupiter'], correctAnswer: 2, explanation: 'Neptune is the farthest recognized planet from the Sun.', topic: 'Planets' },
  { question: 'What force keeps planets in orbit around the Sun?', options: ['Magnetism', 'Gravity', 'Friction', 'Sound'], correctAnswer: 1, explanation: 'Gravity keeps planets moving in their orbits.', topic: 'Physics' },
  { question: 'What is the name of our galaxy?', options: ['Andromeda', 'Whirlpool', 'Milky Way', 'Sombrero'], correctAnswer: 2, explanation: 'Our Solar System is inside the Milky Way galaxy.', topic: 'Galaxies' },
  { question: 'Which planet is famous for its Great Red Spot?', options: ['Jupiter', 'Venus', 'Mars', 'Neptune'], correctAnswer: 0, explanation: 'The Great Red Spot is a huge storm on Jupiter.', topic: 'Planets' },
  { question: 'Which planet rotates on its side to an extreme degree?', options: ['Mars', 'Uranus', 'Mercury', 'Earth'], correctAnswer: 1, explanation: 'Uranus has an extreme axial tilt.', topic: 'Planets' },
  { question: 'What do astronauts wear to survive outside a spacecraft?', options: ['Raincoat', 'Spacesuit', 'Wetsuit', 'Winter coat'], correctAnswer: 1, explanation: 'A spacesuit provides protection and life support.', topic: 'Astronauts' },
  { question: 'What is a group of stars forming a recognizable pattern called?', options: ['Constellation', 'Asteroid', 'Comet', 'Crater'], correctAnswer: 0, explanation: 'Constellations are recognizable patterns of stars in the sky.', topic: 'Stars' },
  { question: 'What is the Sun mostly made of?', options: ['Rock', 'Liquid water', 'Hot gas and plasma', 'Solid iron'], correctAnswer: 2, explanation: 'The Sun is made mostly of hydrogen and helium in a plasma state.', topic: 'Stars' },
  { question: 'Which object is often described as a dirty snowball?', options: ['Comet', 'Moon', 'Star', 'Galaxy'], correctAnswer: 0, explanation: 'Comets contain ice, dust and rocky material.', topic: 'Small bodies' },
  { question: 'What is the path of an object around another object called?', options: ['Crater', 'Orbit', 'Axis', 'Shadow'], correctAnswer: 1, explanation: 'An orbit is the path an object follows around another object.', topic: 'Orbits' },
  { question: 'Which planet is hottest on average?', options: ['Mercury', 'Venus', 'Mars', 'Jupiter'], correctAnswer: 1, explanation: 'Venus has an intense greenhouse effect that traps heat.', topic: 'Planets' },
  { question: 'What is the name of the first artificial satellite?', options: ['Apollo 11', 'Sputnik 1', 'Voyager 1', 'Hubble'], correctAnswer: 1, explanation: 'Sputnik 1 was launched by the Soviet Union in 1957.', topic: 'History' },
  { question: 'What do we call a rock from space that reaches the ground?', options: ['Meteorite', 'Nebula', 'Comet tail', 'Solar flare'], correctAnswer: 0, explanation: 'A space rock that survives to reach the ground is a meteorite.', topic: 'Small bodies' },
  { question: 'Which planet is known for its powerful winds and blue appearance?', options: ['Neptune', 'Mercury', 'Mars', 'Venus'], correctAnswer: 0, explanation: 'Neptune appears blue and has extremely fast winds.', topic: 'Planets' },
  { question: 'What does a telescope help us do?', options: ['Hear distant planets', 'Observe distant objects', 'Change gravity', 'Travel instantly'], correctAnswer: 1, explanation: 'Telescopes collect light or other signals to study distant objects.', topic: 'Tools' },
  { question: 'What is a huge cloud of gas and dust in space called?', options: ['Nebula', 'Asteroid', 'Orbit', 'Crater'], correctAnswer: 0, explanation: 'Nebulae are large clouds of gas and dust in space.', topic: 'Deep space' },
  { question: 'Which planet is often called Earth’s sister planet?', options: ['Mars', 'Venus', 'Jupiter', 'Neptune'], correctAnswer: 1, explanation: 'Venus is similar to Earth in size, though its environment is very different.', topic: 'Planets' },
  { question: 'Which planet is famous for a large system of moons and rings?', options: ['Saturn', 'Mercury', 'Earth', 'Mars'], correctAnswer: 0, explanation: 'Saturn has an extensive ring system and many known moons.', topic: 'Planets' },
  { question: 'What is the center of our Solar System?', options: ['Earth', 'Jupiter', 'The Sun', 'The Moon'], correctAnswer: 2, explanation: 'The Sun is at the center of our Solar System.', topic: 'Solar System' },
  { question: 'What is a light-year a measure of?', options: ['Time', 'Distance', 'Brightness', 'Temperature'], correctAnswer: 1, explanation: 'A light-year is the distance light travels in one year.', topic: 'Space science' },
  { question: 'Which space telescope launched in 2021 studies infrared light?', options: ['James Webb Space Telescope', 'Sputnik 1', 'Apollo 11', 'Voyager 2'], correctAnswer: 0, explanation: 'The James Webb Space Telescope observes mainly infrared light.', topic: 'Telescopes' },
  { question: 'Which planet do humans live on?', options: ['Mars', 'Earth', 'Venus', 'Saturn'], correctAnswer: 1, explanation: 'Earth is our home planet and the only world currently known to host life.', topic: 'Earth' },
  { question: 'What is a small rocky object orbiting the Sun called?', options: ['Asteroid', 'Nebula', 'Star', 'Galaxy'], correctAnswer: 0, explanation: 'Asteroids are rocky or metallic bodies that orbit the Sun.', topic: 'Small bodies' },
  { question: 'Which mission first landed humans on the Moon?', options: ['Apollo 8', 'Apollo 11', 'Artemis I', 'Voyager 1'], correctAnswer: 1, explanation: 'Apollo 11 landed astronauts on the Moon in July 1969.', topic: 'History' },
  { question: 'What is the name for a planet outside our Solar System?', options: ['Exoplanet', 'Dwarf star', 'Meteor', 'Pulsar'], correctAnswer: 0, explanation: 'An exoplanet orbits a star beyond our Solar System.', topic: 'Planets' },
  { question: 'What causes day and night on Earth?', options: ['Earth rotating', 'The Moon disappearing', 'The Sun orbiting Earth daily', 'Clouds moving'], correctAnswer: 0, explanation: 'Earth’s rotation turns different parts of the planet toward and away from the Sun.', topic: 'Earth' },
  { question: 'Which planet has the tallest known volcano in the Solar System, Olympus Mons?', options: ['Mars', 'Venus', 'Earth', 'Mercury'], correctAnswer: 0, explanation: 'Olympus Mons is a giant shield volcano on Mars.', topic: 'Mars' },
  { question: 'What is the visible surface of the Sun called?', options: ['Photosphere', 'Core', 'Mantle', 'Crust'], correctAnswer: 0, explanation: 'The photosphere is the layer from which most visible sunlight escapes.', topic: 'Stars' },
  { question: 'Which moon of Saturn has lakes of liquid methane and ethane?', options: ['Titan', 'Earth’s Moon', 'Phobos', 'Io'], correctAnswer: 0, explanation: 'Titan has lakes and seas of liquid hydrocarbons on its surface.', topic: 'Moons' },
  { question: 'Which moon of Jupiter has active volcanoes?', options: ['Europa', 'Io', 'Titan', 'Triton'], correctAnswer: 1, explanation: 'Jupiter’s moon Io is the most volcanically active known world.', topic: 'Moons' },
  { question: 'What is the name of the force that pulls objects toward Earth?', options: ['Gravity', 'Electricity', 'Sound', 'Friction'], correctAnswer: 0, explanation: 'Earth’s gravity attracts objects toward its center.', topic: 'Physics' },
  { question: 'Which planet has a day longer than its year?', options: ['Venus', 'Earth', 'Neptune', 'Jupiter'], correctAnswer: 0, explanation: 'Venus rotates so slowly that its sidereal rotation takes longer than its orbit around the Sun.', topic: 'Planets' },
  { question: 'What is the name of the first human to travel into space?', options: ['Neil Armstrong', 'Yuri Gagarin', 'Buzz Aldrin', 'John Glenn'], correctAnswer: 1, explanation: 'Yuri Gagarin became the first human in space in 1961.', topic: 'History' },
  { question: 'What is the boundary around a black hole beyond which light cannot escape called?', options: ['Event horizon', 'Photosphere', 'Asteroid belt', 'Magnetosphere'], correctAnswer: 0, explanation: 'The event horizon marks the boundary beyond which escape is impossible.', topic: 'Black holes' },
  { question: 'What is the name of the galaxy closest in size to the Milky Way and expected to merge with it?', options: ['Andromeda Galaxy', 'Whirlpool Galaxy', 'Sombrero Galaxy', 'Pinwheel Galaxy'], correctAnswer: 0, explanation: 'The Andromeda Galaxy is a large neighboring galaxy expected to merge with the Milky Way in the distant future.', topic: 'Galaxies' },
  { question: 'Which planet is known for a thick carbon dioxide atmosphere and sulfuric acid clouds?', options: ['Venus', 'Mars', 'Earth', 'Mercury'], correctAnswer: 0, explanation: 'Venus has a dense carbon dioxide atmosphere and clouds containing sulfuric acid.', topic: 'Planets' },
  { question: 'What is the name of the region between Mars and Jupiter containing many asteroids?', options: ['Kuiper Belt', 'Asteroid Belt', 'Oort Cloud', 'Solar wind'], correctAnswer: 1, explanation: 'The main asteroid belt lies between Mars and Jupiter.', topic: 'Small bodies' },
  { question: 'What do we call a star that suddenly becomes extremely bright after an explosion?', options: ['Supernova', 'Planet', 'Comet', 'Moon'], correctAnswer: 0, explanation: 'A supernova is an enormous stellar explosion.', topic: 'Stars' },
  { question: 'What is the name of the boundary where the Sun’s influence meets interstellar space?', options: ['Heliopause', 'Equator', 'Terminator', 'Event horizon'], correctAnswer: 0, explanation: 'The heliopause marks the outer boundary of the Sun’s heliosphere.', topic: 'Solar System' },
  { question: 'Which planet has the shortest year?', options: ['Mercury', 'Earth', 'Mars', 'Saturn'], correctAnswer: 0, explanation: 'Mercury takes about 88 Earth days to orbit the Sun.', topic: 'Planets' },
  { question: 'What is the name of the robotic vehicle that explores a planet’s surface?', options: ['Rover', 'Telescope', 'Lander leg', 'Satellite dish'], correctAnswer: 0, explanation: 'A rover is a mobile robot designed to explore a surface.', topic: 'Exploration' },
  { question: 'What is the name of the icy region beyond Neptune that contains Pluto?', options: ['Asteroid Belt', 'Kuiper Belt', 'Core', 'Photosphere'], correctAnswer: 1, explanation: 'Pluto is a dwarf planet in the Kuiper Belt.', topic: 'Small bodies' },
  { question: 'What protects Earth from much of the charged particle flow from the Sun?', options: ['Magnetosphere', 'Asteroid belt', 'Moonlight', 'Cloud cover'], correctAnswer: 0, explanation: 'Earth’s magnetic field creates a magnetosphere that deflects many charged particles.', topic: 'Earth' }
];

function seededDailyIndex(date, count) {
  let seed = Number(date.replaceAll('-', '')) || 1;
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296 * count;
  };
}

function dailyBackup(date) {
  const random = seededDailyIndex(date, backupQuestions.length);
  const pool = [...backupQuestions];
  const selected = [];
  while (selected.length < 5 && pool.length) {
    const index = Math.floor(random());
    selected.push(pool.splice(index, 1)[0]);
  }
  return selected.map((q, i) => ({ ...q, id: `${date}-backup-${i}` }));
}

function validQuestion(q) {
  return q && typeof q.question === 'string' &&
    Array.isArray(q.options) && q.options.length === 4 &&
    Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 &&
    q.correctAnswer < 4 && typeof q.explanation === 'string';
}

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('backup');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  useEffect(() => {
    let active = true;

    async function loadQuestions() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/daily-questions.json?date=${today}`,
          { cache: 'no-store' }
        );
        if (!response.ok) throw new Error('Daily questions unavailable');
        const data = await response.json();
        if (data.date !== today || !Array.isArray(data.questions) ||
            data.questions.length !== 5 || !data.questions.every(validQuestion)) {
          throw new Error('Daily question file is not valid for today');
        }
        if (active) {
          setQuestions(data.questions);
          setSource('AI');
        }
      } catch {
        if (active) {
          setQuestions(dailyBackup(today));
          setSource('backup');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadQuestions();
    return () => { active = false; };
  }, [today]);

  function chooseAnswer(optionIndex) {
    if (selected !== null) return;
    setSelected(optionIndex);
    setAnswers((previous) => [...previous, {
  questionId: questions[index].id || `${index}`,
  question: questions[index],
  correct: optionIndex === questions[index].correctAnswer,
}]);
  }

  function nextQuestion() {
    if (index === questions.length - 1) {
      setFinished(true);
    } else {
      setIndex((current) => current + 1);
      setSelected(null);
    }
  }

  function restart() {
    setQuestions(dailyBackup(today));
    setSource('backup practice');
    setIndex(0);
    setAnswers([]);
    setSelected(null);
    setFinished(false);
  }

  if (loading) {
    return <section className="card text-center"><p className="text-xl font-bold">🚀 Preparing your space challenge…</p></section>;
  }

  if (!questions.length) return <section className="card">Questions are unavailable. Please refresh the page.</section>;

  const question = questions[index];
  const score = answers.filter((answer) => answer.correct).length;

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden">
        <p className="font-bold uppercase tracking-widest text-cyan-300">🚀 Daily mission</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Quiz Arena</h1>
        <p className="mt-2 text-slate-300">Five questions. One space cadet. How much do you know about the universe?</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-violet-500/20 px-3 py-1">📅 {today}</span>
          <span className="rounded-full bg-cyan-500/20 px-3 py-1">🪐 {questions.length} questions</span>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1">✨ {source === 'AI' ? 'AI daily challenge' : 'Backup challenge'}</span>
        </div>
      </section>

      {!finished ? (
        <section className="card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-bold text-cyan-300">Question {index + 1} of {questions.length}</p>
            <p className="text-sm text-slate-300">Score: {score}/{answers.length}</p>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
          </div>
          <h2 className="text-xl font-bold leading-relaxed">{question.question}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {question.options.map((option, optionIndex) => {
              const isChosen = selected === optionIndex;
              const isCorrect = question.correctAnswer === optionIndex;
              let style = 'border-white/15 hover:border-cyan-400 hover:bg-white/5';
              if (selected !== null && isCorrect) style = 'border-emerald-400 bg-emerald-500/15';
              else if (isChosen) style = 'border-rose-400 bg-rose-500/15';

              return (
                <button
                  key={`${question.id || index}-${optionIndex}`}
                  type="button"
                  disabled={selected !== null}
                  onClick={() => chooseAnswer(optionIndex)}
                  className={`min-h-14 rounded-2xl border p-4 text-left transition ${style}`}
                >
                  <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 font-bold">{String.fromCharCode(65 + optionIndex)}</span>
                  {option}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div className={`mt-5 rounded-2xl p-4 ${selected === question.correctAnswer ? 'bg-emerald-500/15' : 'bg-amber-500/15'}`}>
              <p className="font-bold">{selected === question.correctAnswer ? '🌟 Great job!' : '🛰️ Keep exploring!'}</p>
              <p className="mt-1 text-sm text-slate-200">{question.explanation}</p>
              <button className="btn-primary mt-4" onClick={nextQuestion}>
                {index === questions.length - 1 ? 'See my results' : 'Next question →'}
              </button>
            </div>
          )}
        </section>
      ) : (
        <section className="card text-center">
          <p className="text-5xl">{score >= 4 ? '🏆' : score >= 2 ? '🌟' : '🚀'}</p>
          <h2 className="mt-3 text-3xl font-extrabold">{score >= 4 ? 'Space superstar!' : score >= 2 ? 'Great mission!' : 'Keep exploring!'}</h2>
          <p className="mt-2 text-lg">You scored <strong>{score} out of {questions.length}</strong>.</p>
          <p className="mt-2 text-slate-300">{score === 5 ? 'Perfect score! You are ready for another galaxy.' : 'Every question teaches you something new. Keep learning!'}</p>
          <button className="btn-primary mt-5" onClick={restart}>Play practice round again</button>
        </section>
      )}

      <p className="text-center text-xs text-slate-400">Free to play • No account needed • Your answers stay in this browser session.</p>
    </div>
  );
}
