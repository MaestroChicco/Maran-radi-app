import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, Share2, MoreVertical, Search, Clock, Radio, Menu, X, Home, Bookmark, Settings } from 'lucide-react';

const MaranRadioApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [showMenu, setShowMenu] = useState(false);
  const [recentStations, setRecentStations] = useState([]);
  const audioRef = useRef(null);

  const stations = [
    { id: 1, name: 'Jazz FM', genre: 'Jazz', frequency: '101.5', listeners: '12.5K', country: 'USA', url: 'https://example.com/jazz' },
    { id: 2, name: 'Rock Central', genre: 'Rock', frequency: '98.7', listeners: '25.1K', country: 'UK', url: 'https://example.com/rock' },
    { id: 3, name: 'Classical Wave', genre: 'Classical', frequency: '104.2', listeners: '8.9K', country: 'Germany', url: 'https://example.com/classical' },
    { id: 4, name: 'Pop Hits 24/7', genre: 'Pop', frequency: '95.3', listeners: '45.2K', country: 'USA', url: 'https://example.com/pop' },
    { id: 5, name: 'Electronic Pulse', genre: 'Electronic', frequency: '107.1', listeners: '18.7K', country: 'Netherlands', url: 'https://example.com/electronic' },
    { id: 6, name: 'Country Roads', genre: 'Country', frequency: '92.5', listeners: '15.3K', country: 'USA', url: 'https://example.com/country' },
    { id: 7, name: 'Hip Hop Nation', genre: 'Hip Hop', frequency: '99.9', listeners: '32.1K', country: 'USA', url: 'https://example.com/hiphop' },
    { id: 8, name: 'Reggae Vibes', genre: 'Reggae', frequency: '96.8', listeners: '9.4K', country: 'Jamaica', url: 'https://example.com/reggae' }
  ];

  const genres = ['All', 'Jazz', 'Rock', 'Classical', 'Pop', 'Electronic', 'Country', 'Hip Hop', 'Reggae'];
  const [selectedGenre, setSelectedGenre] = useState('All');

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         station.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || station.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const togglePlay = (station = null) => {
    if (station && station.id !== currentStation?.id) {
      setCurrentStation(station);
      if (!recentStations.find(s => s.id === station.id)) {
        setRecentStations(prev => [station, ...prev.slice(0, 4)]);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = (stationId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(stationId)) {
        newFavorites.delete(stationId);
      } else {
        newFavorites.add(stationId);
      }
      return newFavorites;
    });
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const StationCard = ({ station, isCompact = false }) => (
    <div className={`bg-amber-50 rounded-xl p-4 border border-amber-200 hover:shadow-lg transition-all ${isCompact ? 'flex items-center space-x-3' : ''}`}>
      <div className={`${isCompact ? 'flex-1' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-amber-900 text-lg">{station.name}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleFavorite(station.id)}
              className={`p-1 rounded ${favorites.has(station.id) ? 'text-red-500' : 'text-amber-600 hover:text-red-500'} transition-colors`}
            >
              <Heart size={18} fill={favorites.has(station.id) ? 'currentColor' : 'none'} />
            </button>
            <button className="p-1 text-amber-600 hover:text-amber-800 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-amber-700 mb-3">
          <span className="bg-amber-200 px-2 py-1 rounded-full">{station.genre}</span>
          <span>{station.frequency} FM</span>
          <span>{station.listeners} listeners</span>
          <span>{station.country}</span>
        </div>
        <button
          onClick={() => togglePlay(station)}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
            currentStation?.id === station.id && isPlaying
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-amber-200 text-amber-800 hover:bg-amber-300'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            {currentStation?.id === station.id && isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{currentStation?.id === station.id && isPlaying ? 'Playing' : 'Play'}</span>
          </div>
        </button>
      </div>
    </div>
  );

  const NowPlayingBar = () => {
    if (!currentStation) return null;

    return (
      <div className="fixed bottom-20 left-0 right-0 bg-amber-800 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
              <Radio size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{currentStation.name}</p>
              <p className="text-sm text-amber-200 truncate">{currentStation.genre} • {currentStation.frequency} FM</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-amber-700 rounded-lg transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="w-20 accent-amber-400"
              />
            </div>
            <button
              onClick={() => togglePlay()}
              className="p-3 bg-amber-600 hover:bg-amber-500 rounded-full transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Navigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-200 px-4 py-2">
      <div className="flex justify-around">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'favorites', icon: Bookmark, label: 'Favorites' },
          { id: 'recent', icon: Clock, label: 'Recent' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === id ? 'text-amber-700 bg-amber-100' : 'text-amber-600 hover:text-amber-700'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'favorites':
        const favoriteStations = stations.filter(s => favorites.has(s.id));
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-900">Your Favorites</h2>
            {favoriteStations.length === 0 ? (
              <div className="text-center py-12 text-amber-600">
                <Heart size={48} className="mx-auto mb-4 opacity-50" />
                <p>No favorite stations yet</p>
                <p className="text-sm">Tap the heart icon on any station to add it here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {favoriteStations.map(station => (
                  <StationCard key={station.id} station={station} />
                ))}
              </div>
            )}
          </div>
        );
      
      case 'recent':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-900">Recently Played</h2>
            {recentStations.length === 0 ? (
              <div className="text-center py-12 text-amber-600">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <p>No recent stations</p>
                <p className="text-sm">Start listening to see your history here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {recentStations.map(station => (
                  <StationCard key={station.id} station={station} isCompact />
                ))}
              </div>
            )}
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-amber-900">Settings</h2>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-4">Audio Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-amber-800">Volume</span>
                  <div className="flex items-center space-x-2">
                    <Volume2 size={16} className="text-amber-600" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                      className="w-24 accent-amber-600"
                    />
                    <span className="text-sm text-amber-600 w-8">{volume}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-4">App Info</h3>
              <div className="space-y-2 text-amber-700">
                <p>Version: 1.0.0</p>
                <p>Total Stations: {stations.length}</p>
                <p>Favorites: {favorites.size}</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" size={20} />
              <input
                type="text"
                placeholder="Search stations or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedGenre === genre
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Stations Grid */}
            <div className="grid gap-4">
              {filteredStations.map(station => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>

            {filteredStations.length === 0 && (
              <div className="text-center py-12 text-amber-600">
                <Radio size={48} className="mx-auto mb-4 opacity-50" />
                <p>No stations found</p>
                <p className="text-sm">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-100">
      {/* Header */}
      <header className="bg-amber-800 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <Radio size={24} />
            </div>
            <h1 className="text-2xl font-bold">Maran</h1>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-amber-700 rounded-lg transition-colors"
          >
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMenu(false)}>
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-6">Menu</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-3 hover:bg-amber-100 rounded-lg transition-colors text-amber-800">
                About Maran
              </button>
              <button className="w-full text-left p-3 hover:bg-amber-100 rounded-lg transition-colors text-amber-800">
                Help & Support
              </button>
              <button className="w-full text-left p-3 hover:bg-amber-100 rounded-lg transition-colors text-amber-800">
                Rate App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4 pb-32">
        {renderContent()}
      </main>

      {/* Now Playing Bar */}
      <NowPlayingBar />

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
};

export default MaranRadioApp;