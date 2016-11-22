import qs from 'query-string';
import axios from 'axios';
import _ from 'lodash';

const { GMAP_API_KEY } = process.env;

const getDistance = (lat1, lng1, lat2, lng2) => {
  const deg2rad = deg => deg * (Math.PI / 180);
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  return parseFloat(d.toFixed(2)); // Distance in km between the two points
};

const getCoordinates = async address => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${qs.stringify({
    address: `${address} France`,
    key: GMAP_API_KEY,
  })}`;

  const { data: { results, status } } = await axios.get(url);
  const coordinates = {
    lat: _.get(results[0], 'geometry.location.lat'),
    lng: _.get(results[0], 'geometry.location.lng'),
  };

  if (!_.isEqual(status, 'OK') || _.isNil(coordinates.lat) || _.isNil(coordinates.lng))
    throw new Error('Cannot get address coordinates');

  return coordinates;
};

const getDirection = async (origin, destination) => {
  const url = `https://maps.googleapis.com/maps/api/directions/json?${qs.stringify({
    origin: `${origin} France`,
    destination: `${destination} France`,
    avoid: 'highways',
    mode: 'bicycling',
    key: GMAP_API_KEY,
  })}`;

  const { data: { routes, status } } = await axios.get(url);
  const direction = {
    distance: _.get(routes[0], 'legs[0].distance.text'),
    duration: _.get(routes[0], 'legs[0].duration.text'),
  };

  if (!_.isEqual(status, 'OK') || _.isNil(direction.distance) || _.isNil(direction.duration))
    throw new Error('Cannot get direction');

  return direction;
};

export {
  getDistance,
  getCoordinates,
  getDirection,
};
