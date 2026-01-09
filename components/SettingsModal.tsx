'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Globe, Box, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onStatusChange: () => void;
}

interface LLMConfig {
  provider: string;
  endpoint: string;
  model: string;
}

export default function SettingsModal({ onClose, onStatusChange }: SettingsModalProps) {
  const [config, setConfig] = useState<LLMConfig>({
    provider: 'ollama',
    endpoint: 'http://localhost:11434/v1',
    model: 'llama3.2'
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/test-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      setTestResult(data.connected ? 'success' : 'error');
    } catch {
      setTestResult('error');
    }
    
    setTesting(false);
  };

  const handleSave = async () => {
    // In a real app, this would save to localStorage or backend
    localStorage.setItem('poi-oracle-llm-config', JSON.stringify(config));
    onStatusChange();
    onClose();
  };

  useEffect(() => {
    // Load saved config
    const saved = localStorage.getItem('poi-oracle-llm-config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {}
    }
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Settings size={22} />
            LLM Configuration
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          {/* Provider Selection */}
          <div className="form-group">
            <label className="form-label">
              <Zap size={14} />
              Provider
            </label>
            <div className="query-type-grid">
              <button
                className={`query-type-btn ${config.provider === 'ollama' ? 'active' : ''}`}
                onClick={() => setConfig(prev => ({ 
                  ...prev, 
                  provider: 'ollama',
                  endpoint: 'http://localhost:11434/v1'
                }))}
              >
                <Box size={16} />
                <span>Ollama (Local)</span>
              </button>
              <button
                className={`query-type-btn ${config.provider === 'openai' ? 'active' : ''}`}
                onClick={() => setConfig(prev => ({ 
                  ...prev, 
                  provider: 'openai',
                  endpoint: 'https://api.openai.com/v1'
                }))}
              >
                <Globe size={16} />
                <span>OpenAI (Cloud)</span>
              </button>
            </div>
          </div>

          {/* Endpoint */}
          <div className="form-group">
            <label className="form-label">
              <Globe size={14} />
              API Endpoint
            </label>
            <input
              type="text"
              className="query-input"
              style={{ minHeight: 'auto', padding: '12px 16px' }}
              value={config.endpoint}
              onChange={e => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
              placeholder="http://localhost:11434/v1"
            />
          </div>

          {/* Model */}
          <div className="form-group">
            <label className="form-label">
              <Box size={14} />
              Model Name
            </label>
            <input
              type="text"
              className="query-input"
              style={{ minHeight: 'auto', padding: '12px 16px' }}
              value={config.model}
              onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
              placeholder="llama3.2"
            />
            <div style={{ 
              marginTop: '8px', 
              fontSize: '12px', 
              color: 'var(--text-muted)' 
            }}>
              {config.provider === 'ollama' && (
                <>Recommended: llama3.2, mistral, phi3</>
              )}
              {config.provider === 'openai' && (
                <>Recommended: gpt-3.5-turbo, gpt-4</>
              )}
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: testResult === 'success' 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${testResult === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '10px',
              fontSize: '13px',
              color: testResult === 'success' ? '#10b981' : '#ef4444'
            }}>
              {testResult === 'success' ? (
                <>
                  <CheckCircle size={16} />
                  Connection successful! LLM is ready.
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  Connection failed. Check your settings.
                </>
              )}
            </div>
          )}

          {/* Help Text */}
          <div style={{
            padding: '16px',
            background: 'var(--bg-card)',
            borderRadius: '10px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            lineHeight: '1.6'
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Quick Setup:</strong>
            <ol style={{ margin: '8px 0 0 16px', paddingLeft: '4px' }}>
              <li>Install Ollama: <code style={{ color: 'var(--color-primary)' }}>curl -fsSL https://ollama.ai/install.sh | sh</code></li>
              <li>Pull a model: <code style={{ color: 'var(--color-primary)' }}>ollama pull llama3.2</code></li>
              <li>Start server: <code style={{ color: 'var(--color-primary)' }}>ollama serve</code></li>
            </ol>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="modal-btn secondary"
            onClick={handleTest}
            disabled={testing}
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          <button 
            className="modal-btn primary"
            onClick={handleSave}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
