import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { 
  Search, Sparkles, MapPin, TrendingUp, Target, Zap, 
  Settings, ChevronRight, AlertTriangle, CheckCircle2, 
  Compass, Lightbulb, Home as HomeIcon, RefreshCw, Layers, Globe2,
  Brain, Database, ArrowRight, X
} from 'lucide-react';

// Dynamic import for map (SSR disabled)
const MapView = dynamic(() => import('../components/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <div className="map-loading-spinner"></div>
      <span>Loading map...</span>
    </div>
  )
});

// Settings Modal Component
const SettingsModal = dynamic(() => import('../components/SettingsModal'), { ssr: false });

interface POIData {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  confidence: number;
  verified: boolean;
  attributes?: {
    hours?: string;
    rating?: number;
    tags?: string[];
  };
}

interface AnalysisResult {
  query: string;
  aiReasoning: {
    interpretation: string;
    suggestedLocations: POIData[];
    assumptions: string[];
    confidence: number;
  };
  groundTruth: {
    verifiedPOIs: POIData[];
    corrections: string[];
    gaps: string[];
    accuracy: number;
  };
  recommendation: string;
  visualization: {
    center: [number, number];
    zoom: number;
  };
}

type QueryType = 'location' | 'market' | 'competitor' | 'optimize';

const QUERY_TYPES: { id: QueryType; label: string; icon: any; description: string }[] = [
  { id: 'location', label: 'Location Search', icon: MapPin, description: 'Find optimal locations' },
  { id: 'market', label: 'Market Analysis', icon: TrendingUp, description: 'Analyze market gaps' },
  { id: 'competitor', label: 'Competitor Intel', icon: Target, description: 'Map competition' },
  { id: 'optimize', label: 'Optimize', icon: Zap, description: 'Optimize coverage' },
];

const EXAMPLE_QUERIES = [
  { text: "Where should I open a chai stall near IT parks in Bangalore?", icon: "☕" },
  { text: "Show me underserved neighborhoods for pharmacies in Delhi", icon: "💊" },
  { text: "Best locations for a gym in residential areas of Mumbai", icon: "🏋️" },
  { text: "Where to open a restaurant near tech parks in Hyderabad?", icon: "🍽️" },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState<QueryType>('location');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [llmStatus, setLlmStatus] = useState<'connected' | 'disconnected' | 'demo'>('demo');
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 77.5946]);
  const [mapZoom, setMapZoom] = useState(12);

  // Check LLM status on mount
  useEffect(() => {
    checkLLMStatus();
  }, []);

  const checkLLMStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setLlmStatus(data.connected ? 'connected' : 'demo');
    } catch {
      setLlmStatus('demo');
    }
  };

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, queryType }),
      });
      
      const data: AnalysisResult = await res.json();
      setResult(data);
      
      if (data.visualization) {
        setMapCenter(data.visualization.center);
        setMapZoom(data.visualization.zoom);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setResult(null);
    setMapCenter([12.9716, 77.5946]);
    setMapZoom(12);
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  // Combine all POIs for map
  const allPOIs = result ? [
    ...result.aiReasoning.suggestedLocations,
    ...result.groundTruth.verifiedPOIs
  ] : [];

  return (
    <>
      <Head>
        <title>POI Oracle | Spatial Intelligence Platform</title>
        <meta name="description" content="AI Reasoning meets Ground Truth - Spatial Intelligence for location decisions" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <button className="home-button" onClick={handleReset} title="Reset to home">
              <HomeIcon size={18} />
            </button>
            <div className="brand">
              <div className="brand-icon">
                <Globe2 size={24} />
              </div>
              <div className="brand-text">
                <h1>POI Oracle</h1>
                <span className="brand-tagline">Spatial Intelligence Platform</span>
              </div>
            </div>
          </div>
          
          <div className="header-center">
            <div className={`status-badge ${llmStatus}`}>
              <span className="status-dot"></span>
              <span className="status-text">
                {llmStatus === 'connected' ? 'LLM Connected' : 
                 llmStatus === 'demo' ? 'Demo Mode' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="header-right">
            <button className="settings-button" onClick={() => setShowSettings(true)}>
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {/* Left Sidebar - Input Panel */}
          <aside className="input-panel">
            <div className="panel-scroll">
              {/* Query Type Selection */}
              <section className="input-section">
                <label className="section-label">
                  <Layers size={14} />
                  Analysis Type
                </label>
                <div className="query-type-grid">
                  {QUERY_TYPES.map((type) => (
                    <button
                      key={type.id}
                      className={`query-type-btn ${queryType === type.id ? 'active' : ''}`}
                      onClick={() => setQueryType(type.id)}
                    >
                      <type.icon size={16} />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Query Input */}
              <section className="input-section">
                <label className="section-label">
                  <Search size={14} />
                  Your Query
                </label>
                <div className="query-input-wrapper">
                  <textarea
                    className="query-input"
                    placeholder="Describe the location analysis you need..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={4}
                  />
                  <div className="query-input-footer">
                    <span className="char-count">{query.length}/500</span>
                    <span className="hint">Press Enter to analyze</span>
                  </div>
                </div>
                
                <button 
                  className={`analyze-button ${isLoading ? 'loading' : ''}`}
                  onClick={handleAnalyze}
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={18} className="spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Analyze Location</span>
                    </>
                  )}
                </button>
              </section>

              {/* Example Queries */}
              <section className="input-section examples-section">
                <label className="section-label">
                  <Lightbulb size={14} />
                  Try an Example
                </label>
                <div className="examples-list">
                  {EXAMPLE_QUERIES.map((example, idx) => (
                    <button
                      key={idx}
                      className="example-btn"
                      onClick={() => handleExampleClick(example.text)}
                    >
                      <span className="example-icon">{example.icon}</span>
                      <span className="example-text">{example.text}</span>
                      <ChevronRight size={14} className="example-arrow" />
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="panel-footer">
              <span>Powered by</span>
              <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer">Ollama</a>
              <span>•</span>
              <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
            </div>
          </aside>

          {/* Center Panel - Analysis Results */}
          <section className="analysis-panel">
            <div className="panel-header">
              <h2>
                <Brain size={18} />
                Analysis Results
              </h2>
              {result && (
                <div className="result-stats">
                  <span className="stat">
                    <span className="stat-icon ai">🤖</span>
                    {result.aiReasoning.suggestedLocations.length} AI suggestions
                  </span>
                  <span className="stat">
                    <span className="stat-icon verified">✓</span>
                    {result.groundTruth.verifiedPOIs.length} verified
                  </span>
                </div>
              )}
            </div>

            <div className="panel-scroll">
              {!result && !isLoading && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Compass size={48} />
                  </div>
                  <h3>Ready to Analyze</h3>
                  <p>Enter a location query to see AI reasoning grounded in real-world POI data</p>
                  <div className="empty-features">
                    <div className="feature">
                      <Brain size={20} />
                      <span>AI-powered spatial reasoning</span>
                    </div>
                    <div className="feature">
                      <Database size={20} />
                      <span>61% accuracy POI classifier</span>
                    </div>
                    <div className="feature">
                      <CheckCircle2 size={20} />
                      <span>Ground truth validation</span>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="loading-state">
                  <div className="loading-animation">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring delay-1"></div>
                    <div className="pulse-ring delay-2"></div>
                    <Globe2 size={32} className="loading-icon" />
                  </div>
                  <h3>Analyzing spatial data...</h3>
                  <p>AI is reasoning about your query</p>
                </div>
              )}

              {result && (
                <div className="results-container">
                  {/* AI Reasoning Card */}
                  <div className="result-card ai-reasoning">
                    <div className="card-header">
                      <div className="card-title">
                        <Brain size={18} />
                        <span>AI Reasoning</span>
                      </div>
                      <span className="card-badge unverified">
                        <AlertTriangle size={12} />
                        Unverified
                      </span>
                    </div>
                    <div className="card-content">
                      <p className="interpretation">{result.aiReasoning.interpretation}</p>
                      
                      <div className="assumptions">
                        <h4>Key Assumptions</h4>
                        <ul>
                          {result.aiReasoning.assumptions.map((assumption, idx) => (
                            <li key={idx}>
                              <span className="assumption-num">{idx + 1}</span>
                              {assumption}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="confidence-meter">
                        <div className="confidence-label">
                          <span>AI Confidence</span>
                          <span className="confidence-value">
                            {Math.round(result.aiReasoning.confidence * 100)}%
                          </span>
                        </div>
                        <div className="confidence-bar">
                          <div 
                            className="confidence-fill ai"
                            style={{ width: `${result.aiReasoning.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ground Truth Card */}
                  <div className="result-card ground-truth">
                    <div className="card-header">
                      <div className="card-title">
                        <Database size={18} />
                        <span>Ground Truth</span>
                      </div>
                      <span className="card-badge verified">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    </div>
                    <div className="card-content">
                      <div className="accuracy-display">
                        <div className="accuracy-value">
                          {result.groundTruth.accuracy}%
                        </div>
                        <div className="accuracy-label">Validation Accuracy</div>
                      </div>

                      {result.groundTruth.corrections.length > 0 && (
                        <div className="corrections">
                          <h4>
                            <AlertTriangle size={14} />
                            Corrections Made
                          </h4>
                          <ul>
                            {result.groundTruth.corrections.map((correction, idx) => (
                              <li key={idx}>{correction}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.groundTruth.gaps.length > 0 && (
                        <div className="gaps">
                          <h4>
                            <Target size={14} />
                            Market Gaps Found
                          </h4>
                          <ul>
                            {result.groundTruth.gaps.map((gap, idx) => (
                              <li key={idx}>{gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="result-card recommendation">
                    <div className="card-header">
                      <div className="card-title">
                        <Sparkles size={18} />
                        <span>Recommendation</span>
                      </div>
                    </div>
                    <div className="card-content">
                      <pre className="recommendation-text">{result.recommendation}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Panel - Map */}
          <section className="map-panel">
            <div className="panel-header">
              <h2>
                <MapPin size={18} />
                Spatial Visualization
              </h2>
              <div className="map-legend">
                <span className="legend-item ai">
                  <span className="legend-dot"></span>
                  AI Suggestions
                </span>
                <span className="legend-item verified">
                  <span className="legend-dot"></span>
                  Verified POIs
                </span>
              </div>
            </div>
            <div className="map-container">
              <MapView 
                center={mapCenter}
                zoom={mapZoom}
                pois={allPOIs}
              />
            </div>
          </section>
        </main>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} onStatusChange={checkLLMStatus} />
      )}
    </>
  );
}
