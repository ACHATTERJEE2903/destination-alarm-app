import { distanceInMeters } from './geo.js';

const elements = {
  destLat: document.querySelector('#dest-lat'),
  destLng: document.querySelector('#dest-lng'),
  radius: document.querySelector('#radius'),
  start: document.querySelector('#start'),
  stop: document.querySelector('#stop'),
  setFromCurrent: document.querySelector('#set-from-current'),
  status: document.querySelector('#status'),
  current: document.querySelector('#current'),
  distance: document.querySelector('#distance'),
  reached: document.querySelector('#reached'),
  testAlarm: document.querySelector('#test-alarm')
};

let watchId = null;
let hasTriggeredAlarm = false;


function updateStatus(text, alert = false) {
  elements.status.textContent = text;
  elements.status.classList.toggle('alert', alert);
}

function parseDestination() {
  const lat = Number(elements.destLat.value);
  const lng = Number(elements.destLng.value);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

function ringAlarm(message) {
  updateStatus(message, true);
  elements.reached.textContent = 'Yes';

  if (navigator.vibrate) {
    navigator.vibrate([250, 150, 250, 150, 250]);
  }

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  gain.gain.setValueAtTime(0.001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.5, audioContext.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.7);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.75);
}

function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  updateStatus('Stopped');
  elements.start.disabled = false;
  elements.stop.disabled = true;
}

function startTracking() {
  const destination = parseDestination();
  if (!destination) {
    updateStatus('Please enter a valid destination latitude and longitude.', true);
    return;
  }

  if (!navigator.geolocation) {
    updateStatus('Geolocation is not supported in this browser.', true);
    return;
  }

  const radius = Number(elements.radius.value) || 400;
  hasTriggeredAlarm = false;
  elements.reached.textContent = 'No';

  updateStatus('Tracking...');
  elements.start.disabled = true;
  elements.stop.disabled = false;

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const current = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      elements.current.textContent = `${current.lat.toFixed(5)}, ${current.lng.toFixed(5)}`;

      const meters = distanceInMeters(current, destination);
      elements.distance.textContent = `${meters.toFixed(0)} m`;

      if (!hasTriggeredAlarm && meters <= radius) {
        hasTriggeredAlarm = true;
        ringAlarm('Destination reached — alarm active!');
      }
    },
    (error) => {
      updateStatus(`Tracking error: ${error.message}`, true);
      stopTracking();
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    }
  );
}

function fillDestinationFromCurrent() {
  if (!navigator.geolocation) {
    updateStatus('Geolocation is not supported in this browser.', true);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      elements.destLat.value = position.coords.latitude.toFixed(6);
      elements.destLng.value = position.coords.longitude.toFixed(6);
      updateStatus('Destination set from current location.');
    },
    (error) => {
      updateStatus(`Could not set destination: ${error.message}`, true);
    }
  );
}

elements.start.addEventListener('click', startTracking);
elements.stop.addEventListener('click', stopTracking);
elements.setFromCurrent.addEventListener('click', fillDestinationFromCurrent);
elements.testAlarm.addEventListener('click', () => ringAlarm('Test alarm fired.'));

