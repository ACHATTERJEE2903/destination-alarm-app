import test from 'node:test';
import assert from 'node:assert/strict';
import { distanceInMeters } from './geo.js';

test('distance is zero for identical coordinates', () => {
  const point = { lat: 40.7128, lng: -74.006 };
  assert.equal(distanceInMeters(point, point), 0);
});

test('distance is roughly correct for known points', () => {
  const sf = { lat: 37.7749, lng: -122.4194 };
  const oakland = { lat: 37.8044, lng: -122.2712 };
  const distance = distanceInMeters(sf, oakland);

  assert.ok(distance > 12000 && distance < 14000, `distance was ${distance}`);
});
