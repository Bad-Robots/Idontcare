import { useState, useEffect } from 'react';

// Channel Types
type Channel = 6 | 17 | 42;

export default function App() {
  const [channel, setChannel] = useState<Channel>(6);
  const [tracking, setTracking] = useState(50);
  const [glitchActive, setGlitchActive] = useState(false);
  const [roverActive, setRoverActive] = useState(false);
  const [showMax, setShowMax] = useState(false);
  const [technicolor, setTechnicolor] = useState(false);
  const [inputBuffer, setInputBuffer] = useState('');

  // The Prisoner Protocol (Rover) & Max Headroom trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const nextBuffer = (inputBuffer + e.key.toUpperCase()).slice(-15);
      setInputBuffer(nextBuffer);
      if (nextBuffer.includes('BE SEEING YOU')) {
        setRoverActive(true);
      }
      if (nextBuffer.includes('MAX')) {
        setShowMax(true);
        setTimeout(() => setShowMax(false), 3000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputBuffer]);

  // Random glitch trigger
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200 + Math.random() * 800);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`crt-container ${glitchActive ? 'glitch-mode' : ''} ${technicolor ? 'technicolor-tilt' : ''}`}>
      <div className="crt-flicker" />
      <div className="static-void" />
      
      {/* TV UI Header */}
      <header className="tv-header">
        <div className="channel-display">CH {channel}</div>
        <div className="tracking-status">TRACKING: {tracking}%</div>
        <div className="knob-container">
           <button onClick={() => setTechnicolor(!technicolor)} style={{fontSize: '0.6rem', padding: '2px 5px', minWidth: '40px'}}>TILT</button>
        </div>
      </header>

      <main className="crt-screen">
        <ChannelRenderer 
          channel={channel} 
          tracking={tracking} 
          setTracking={setTracking}
        />
      </main>

      {/* Control Panel (Footer) */}
      <footer className="tv-controls">
        <button onClick={() => setChannel(6)}>Void (6)</button>
        <button onClick={() => setChannel(17)}>Repair (17)</button>
        <button onClick={() => setChannel(42)}>Lounge (42)</button>
      </footer>

      {roverActive && <RoverCursor />}
      {showMax && <MaxHeadroomModal />}
    </div>
  );
}

function MaxHeadroomModal() {
  return (
    <div className="max-modal">
      <div className="max-head">M-M-M-MAX!</div>
      <p>"20 minutes into the future, and you're still watching this?"</p>
    </div>
  );
}

function ChannelRenderer({ channel, tracking, setTracking }: { 
  channel: Channel, 
  tracking: number,
  setTracking: (v: number) => void 
}) {
  const blurAmount = Math.abs(50 - tracking) / 5;

  return (
    <div style={{ filter: `blur(${blurAmount}px)` }} className="channel-content">
      {channel === 6 && <StaticVoidChannel />}
      {channel === 17 && <VCRRepairChannel tracking={tracking} setTracking={setTracking} />}
      {channel === 42 && <DeepCutLounge />}
    </div>
  );
}

function StaticVoidChannel() {
  return (
    <div className="void-content">
      <h2>CHANNEL 6: THE STATIC VOID</h2>
      <p>Stare long enough, and the void stares back...</p>
      <div className="secret-hover" style={{ opacity: 0.1, cursor: 'help' }}>.</div>
    </div>
  );
}

function VCRRepairChannel({ tracking, setTracking }: { tracking: number, setTracking: (v: number) => void }) {
  return (
    <div className="repair-content">
      <h2>CHANNEL 17: VCR REPAIR SHOP</h2>
      <p>Please adjust tracking for optimal viewing.</p>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={tracking} 
        onChange={(e) => setTracking(parseInt(e.target.value))}
        style={{ width: '200px', margin: '20px 0' }}
      />
      <div className="repair-grid">
        <div className="repair-visual" style={{ 
          fontSize: '1.2rem', 
          color: tracking === 50 ? '#33ff33' : '#ff3333',
          border: '1px solid currentColor',
          padding: '10px'
        }}>
           {tracking === 50 ? "✓ TRACKING ALIGNED" : "DATA CORRUPT"}
        </div>
      </div>
    </div>
  );
}

function DeepCutLounge() {
  const trivia = [
    "Manimal (1983): Jonathan Chase could transform into any animal.",
    "The Prisoner (1967): I am not a number, I am a free man!",
    "Garth Marenghi's Darkplace: I know writers who use subtext and they're all cowards.",
    "AutoMan (1983): A hologram that fights crime with a cursor.",
    "Max Headroom (1987): 20 minutes into the future."
  ];

  return (
    <div className="lounge-content">
      <h2>CHANNEL 42: DEEP CUT LOUNGE</h2>
      <div className="ticker">
        <div className="ticker-inner">
          {trivia.map((t, i) => <span key={i} style={{marginRight: '50px'}}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

function RoverCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="rover" style={{ left: pos.x, top: pos.y }}>
      <div className="rover-ball" />
    </div>
  );
}
