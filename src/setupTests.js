// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import 'jest-fetch-mock';
import { act } from 'react';

// Enable fetch mocks
global.fetch = require('jest-fetch-mock');

// Create storage mock implementation with improved error handling and type safety
const createStorageMock = () => {
  let store = {};
  return {
    getItem: jest.fn((key) => {
      if (typeof key !== 'string') {
        throw new TypeError('key must be a string');
      }
      return store[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      if (typeof key !== 'string') {
        throw new TypeError('key must be a string');
      }
      // Simulate storage quota error for testing error scenarios
      if (Object.keys(store).length >= 1000) {
        throw new Error('Storage quota exceeded');
      }
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      if (typeof key !== 'string') {
        throw new TypeError('key must be a string');
      }
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: jest.fn(() => Object.keys(store).length),
    key: jest.fn((index) => {
      if (typeof index !== 'number') {
        throw new TypeError('index must be a number');
      }
      return Object.keys(store)[index] || null;
    }),
  };
};

// Create mock instances
const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
});

// Mock window.location
delete window.location;
window.location = {
  href: '',
  pathname: '',
  reload: jest.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
  // Reset fetch mocks
  fetch.resetMocks();
  
  // Reset storage mocks
  localStorageMock.clear();
  sessionStorageMock.clear();
  
  // Clear all mock function calls
  Object.values(localStorageMock).forEach(mockFn => {
    if (typeof mockFn.mockClear === 'function') {
      mockFn.mockClear();
    }
  });
  
  Object.values(sessionStorageMock).forEach(mockFn => {
    if (typeof mockFn.mockClear === 'function') {
      mockFn.mockClear();
    }
  });
  
  // Reset window.location
  window.location.href = '';
  window.location.pathname = '';
  window.location.reload.mockClear();
});
