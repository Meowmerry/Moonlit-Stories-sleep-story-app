import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, Pause, Play } from 'lucide-react';
import './styles.css'

function SleepStoryGenerator() {
  const [options, setOptions] = useState(null)
  const [formData, setFormData] = useState({
    mood: 'peaceful',
    theme: 'nature',
    style: 'very_simple',
    perspective: 'second_person',
    length: 'medium'
  })
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [provider, setProvider] = useState('')
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [stars, setStars] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [readingSpeed, setReadingSpeed] = useState(0.75)
  const [voiceGender, setVoiceGender] = useState('female')

  // Generate starfield on mount
  useEffect(() => {
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3
    }))
    setStars(newStars)
  }, [])

  useEffect(() => {
    fetchOptions()
    loadFavorites()
  }, [])

  const fetchOptions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/options`)
      const data = await response.json()
      setOptions(data)
    } catch (err) {
      console.error('Failed to fetch options:', err)
    }
  }

  const loadFavorites = () => {
    const saved = localStorage.getItem('sleepStoryFavorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const saveFavorite = () => {
    const newFavorite = {
      id: Date.now().toString(),
      story,
      mood: formData.mood,
      theme: formData.theme,
      timestamp: new Date().toISOString()
    }
    const updated = [...favorites, newFavorite]
    setFavorites(updated)
    localStorage.setItem('sleepStoryFavorites', JSON.stringify(updated))
  }

  const removeFavorite = (id) => {
    const updated = favorites.filter(f => f.id !== id)
    setFavorites(updated)
    localStorage.setItem('sleepStoryFavorites', JSON.stringify(updated))
  }

  const generateStory = async () => {
    setLoading(true)
    setError('')
    setStory('')
    setProvider('')
    stopSpeaking()

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to generate story')
      }

      const data = await response.json()
      setStory(data.story)
      setProvider(data.provider)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const speakStory = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.')
      return
    }

    // Split text into words for highlighting
    const words = text.split(/\s+/)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = readingSpeed
    utterance.pitch = 0.9
    utterance.volume = 0.8

    // Select voice based on gender preference
    const voices = speechSynthesis.getVoices()
    let selectedVoice = null

    if (voiceGender === 'female') {
      selectedVoice = voices.find(v =>
        v.name.includes('Female') ||
        v.name.includes('Samantha') ||
        v.name.includes('Karen') ||
        v.name.includes('Victoria') ||
        v.name.includes('Zira')
      )
    } else {
      selectedVoice = voices.find(v =>
        v.name.includes('Male') ||
        v.name.includes('David') ||
        v.name.includes('Daniel') ||
        v.name.includes('Mark')
      )
    }

    if (selectedVoice) utterance.voice = selectedVoice

    utterance.onstart = () => {
      setIsPlaying(true)
      setCurrentWordIndex(0)
    }

    // Use boundary event for precise word-by-word highlighting
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Calculate which word we're at based on character position
        const textUpToNow = text.substring(0, event.charIndex)
        const wordCount = textUpToNow.trim().split(/\s+/).length - 1
        setCurrentWordIndex(Math.min(wordCount, words.length - 1))
      }
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentWordIndex(-1)
    }

    speechSynthesis.speak(utterance)
  }

  const toggleSpeech = () => {
    if (!story) return

    if (isPlaying && !isPaused) {
      speechSynthesis.pause()
      setIsPaused(true)
    } else if (isPaused) {
      speechSynthesis.resume()
      setIsPaused(false)
    } else {
      speakStory(story)
    }
  }

  const stopSpeaking = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentWordIndex(-1)
  }

  const getMoodEmoji = (mood) => {
    const emojis = {
      'peaceful': '🕊️',
      'anxious': '🌊',
      'overthinking': '🌀',
      'lonely': '🌙',
      'grateful': '✨',
      'exhausted': '😴'
    }
    return emojis[mood] || '✨'
  }

  if (!options) {
    return (
      <div className="dreamweaver-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dreamweaver-container">
      {/* Animated starfield */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}

      <div className="dreamweaver-content">
        {/* Header */}
        <header className="dreamweaver-header">
          <div className="header-icons">
            <Moon className="moon-icon"/>
            <h1 className="dreamweaver-title">Dreamweaver</h1>
            <Sparkles className="sparkle-icon"/>
          </div>
          <p className="dreamweaver-subtitle">Where AI meets the healing power of sleep</p>
        </header>

        {/* Tab Navigation */}
        <div className="dreamweaver-tabs">
          <button
            className={`tab ${!showFavorites ? 'active' : ''}`}
            onClick={() => setShowFavorites(false)}
          >
            Generate Story
          </button>
          <button
            className={`tab ${showFavorites ? 'active' : ''}`}
            onClick={() => setShowFavorites(true)}
          >
            Favorites ({favorites.length})
          </button>
        </div>

        {!showFavorites ? (
          <>
            {/* Story Generation Form */}
            <div className="dreamweaver-card">
              <div className="form-section">
                {/* Mood Selection */}
                <div className="input-group">
                  <label className="input-label">How are you feeling tonight?</label>
                  <div className="mood-grid">
                    {options.moods.map(m => (
                      <button
                        key={m.value}
                        onClick={() => setFormData({...formData, mood: m.value})}
                        className={`mood-button ${formData.mood === m.value ? 'selected' : ''}`}
                      >
                        <span className="mood-emoji">{getMoodEmoji(m.value)}</span>
                        <span className="mood-label">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Selection */}
                <div className="input-group">
                  <label className="input-label">Where shall we journey?</label>
                  <div className="theme-grid">
                    {options.themes.map(t => (
                      <button
                        key={t.value}
                        onClick={() => setFormData({...formData, theme: t.value})}
                        className={`theme-button ${formData.theme === t.value ? 'selected' : ''}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div className="input-group">
                  <label className="input-label">Story Style</label>
                  <div className="style-grid">
                    {options.styles.map(s => (
                      <button
                        key={s.value}
                        onClick={() => setFormData({...formData, style: s.value})}
                        className={`style-button ${formData.style === s.value ? 'selected' : ''}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length Selection */}
                <div className="input-group">
                  <label className="input-label">Story Duration</label>
                  <div className="length-grid">
                    {options.lengths.map(l => (
                      <button
                        key={l.value}
                        onClick={() => setFormData({...formData, length: l.value})}
                        className={`length-button ${formData.length === l.value ? 'selected' : ''}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Voice Settings */}
                <div className="voice-settings-section">
                  <label className="input-label">Voice Settings</label>

                  {/* Voice Gender Selection */}
                  <div className="voice-gender-container">
                    <button
                      onClick={() => setVoiceGender('female')}
                      className={`voice-gender-button ${voiceGender === 'female' ? 'selected' : ''}`}
                    >
                      👩 Female Voice
                    </button>
                    <button
                      onClick={() => setVoiceGender('male')}
                      className={`voice-gender-button ${voiceGender === 'male' ? 'selected' : ''}`}
                    >
                      👨 Male Voice
                    </button>
                  </div>

                  {/* Reading Speed Slider */}
                  <div className="speed-control-container">
                    <label className="speed-label">
                      Reading Speed: {readingSpeed === 0.5 ? 'Very Slow' : readingSpeed === 0.75 ? 'Slow' : readingSpeed === 1 ? 'Normal' : readingSpeed === 1.25 ? 'Fast' : 'Very Fast'}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.25"
                      value={readingSpeed}
                      onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
                      className="speed-slider"
                    />
                    <div className="speed-markers">
                      <span>0.5x</span>
                      <span>0.75x</span>
                      <span>1x</span>
                      <span>1.25x</span>
                      <span>1.5x</span>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateStory}
                  disabled={loading}
                  className="generate-dreamweaver-button"
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Weaving your dream...
                    </>
                  ) : (
                    'Generate Sleep Story'
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="dreamweaver-error">
                <p>{error}</p>
              </div>
            )}

            {/* Story Display */}
            {story && (
              <div className="dreamweaver-card story-card">
                <div className="story-header-dreamweaver">
                  <h2 className="journey-title">Your Journey Awaits</h2>
                  <div className="story-meta">
                    <span className="provider-info">✨ {provider === 'claude' ? 'Claude AI' : 'OpenAI GPT-4'}</span>
                  </div>
                </div>

                <div className="story-controls">
                  <button onClick={toggleSpeech} className="voice-control-button">
                    {isPlaying && !isPaused ?   <Pause className="w-5 h-5" /> :    <Play className="w-5 h-5" />}
                    {/* {isPlaying && !isPaused ? '⏸ Pause' : '▶️ Play Voice'} */}
                  </button>
                  <button onClick={saveFavorite} className="save-button">
                    ⭐ Save Favorite
                  </button>
                </div>

                {isPlaying && (
                  <div className="speaking-indicator">
                    <div className="pulse-dot"></div>
                    {isPaused ? 'Paused' : 'Speaking...'}
                  </div>
                )}

                <div className="story-content">
                  {story.split(/\s+/).map((word, index) => (
                    <span
                      key={index}
                      className={`story-word ${index === currentWordIndex ? 'highlighted' : ''}`}
                    >
                      {word}{' '}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Favorites View */
          <div className="dreamweaver-card">
            <h2 className="favorites-title">Your Favorite Dreams</h2>
            {favorites.length === 0 ? (
              <p className="empty-favorites">No favorites yet. Generate a story and save it to your collection.</p>
            ) : (
              <div className="favorites-list">
                {favorites.map(fav => (
                  <div key={fav.id} className="favorite-card">
                    <div className="favorite-header">
                      <span className="favorite-tags">
                        {getMoodEmoji(fav.mood)} {fav.mood} · {fav.theme}
                      </span>
                      <button
                        onClick={() => removeFavorite(fav.id)}
                        className="delete-fav-button"
                      >
                        🗑
                      </button>
                    </div>
                    <div className="favorite-preview">
                      {fav.story.substring(0, 200)}...
                    </div>
                    <button
                      onClick={() => {
                        setStory(fav.story)
                        setShowFavorites(false)
                      }}
                      className="load-fav-button"
                    >
                      Load Story
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="dreamweaver-footer">
          <p>✨ Close your eyes, breathe deeply, and let the story guide you to rest ✨</p>
        </footer>
      </div>
    </div>
  )
}

export default SleepStoryGenerator
