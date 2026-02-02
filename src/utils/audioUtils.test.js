import { playLyreSound, canPlayAudio } from './audioUtils';

describe('audioUtils', () => {
  describe('canPlayAudio', () => {
    it('should return true when AudioContext is available', () => {
      // Create a mock AudioContext
      global.AudioContext = jest.fn();
      
      expect(canPlayAudio()).toBe(true);
      
      // Cleanup
      delete global.AudioContext;
    });

    it('should return true when webkitAudioContext is available', () => {
      // Create a mock webkitAudioContext
      global.webkitAudioContext = jest.fn();
      
      expect(canPlayAudio()).toBe(true);
      
      // Cleanup
      delete global.webkitAudioContext;
    });

    it('should return false when no AudioContext is available', () => {
      // Ensure no audio context is available
      delete global.AudioContext;
      delete global.webkitAudioContext;
      
      expect(canPlayAudio()).toBe(false);
    });
  });

  describe('playLyreSound', () => {
    it('should not throw an error when audio context is unavailable', () => {
      // Ensure no audio context is available
      delete global.AudioContext;
      delete global.webkitAudioContext;
      
      // Should not throw an error
      expect(() => playLyreSound()).not.toThrow();
    });

    it('should create audio context and play sound when available', () => {
      // Create mock audio context
      const mockGainNode = {
        gain: {
          setValueAtTime: jest.fn(),
          linearRampToValueAtTime: jest.fn(),
          exponentialRampToValueAtTime: jest.fn()
        },
        connect: jest.fn()
      };

      const mockOscillator = {
        type: 'sine',
        frequency: { value: 0 },
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn()
      };

      const mockAudioContext = {
        createOscillator: jest.fn(() => Object.create(mockOscillator)),
        createGain: jest.fn(() => Object.create(mockGainNode)),
        destination: {},
        currentTime: 0
      };

      global.AudioContext = jest.fn(() => mockAudioContext);

      playLyreSound();

      expect(global.AudioContext).toHaveBeenCalled();
      expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(2);
      expect(mockAudioContext.createGain).toHaveBeenCalledTimes(2);
      
      // Cleanup
      delete global.AudioContext;
    });
  });
});