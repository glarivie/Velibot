import axios from 'axios'
import _ from 'lodash'

import { getDistance, getCoordinates } from './location'

const getStationsData = async () => {
  const url = 'http://opendata.paris.fr/explore/dataset/stations-velib-disponibilites-en-temps-reel/download?format=json'

  const { data } = await axios.get(url)

  const stations = data
    .filter(({ fields }) => _.isEqual(fields.status, 'OPEN'))
    .map(station => ({
      id: station.recordid,
      bikes: station.fields.available_bikes,
      stands: station.fields.available_bike_stands,
      address: station.fields.address,
      position: {
        lat: station.fields.position[0],
        lng: station.fields.position[1],
      },
    }))

  return stations
}

const getClosestStation = async address => {
  const coordinates = await getCoordinates(address)
  const stations = await getStationsData()

  if (!coordinates || !stations)
    throw new Error('Cannot get the closest station')

  const stationsWithDistance = stations
    .map(station => ({
      ...station,
      distance: getDistance(
        station.position.lat,
        station.position.lng,
        coordinates.lat,
        coordinates.lng,
      ),
    }))
    .filter(({ bikes }) => bikes > 0)
    .sort((a, b) => a.distance - b.distance)

  return stationsWithDistance[0]
}

export {
  getStationsData,
  getClosestStation,
}
