import _ from 'lodash';

import { getDirection } from '../helpers/location';
import { getClosestStation } from '../helpers/velib';

const testCoord = async (req, res) => {
  try {
    const origin = _.get(req.params, 'origin');
    const destination = _.get(req.params, 'destination');

    if (!origin || !destination)
      throw new Error('invalid address');

    const direction = await getDirection(origin, destination);

    return res.json(direction);
  } catch (error) {
    return res.status(403).send(error);
  }
};

const testVelib = async (req, res) => {
  try {
    const address = _.get(req.params, 'address');
    const data = await getClosestStation(address);

    return res.json(data);
  } catch (error) {
    return res.status(403).send(error);
  }
};

export {
  testCoord,
  testVelib,
};
