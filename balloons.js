import redisSortedSet from "redis-sorted-set";

export class Balloons {
  constructor(massUnrelated = false) {
    // this is for sorting by volume/mass,
    // but only stores the volume and tag
    // of the balloon
    this.sortedSet = new redisSortedSet();

    // this is for retreiving the voume and
    // mass of a given balloon
    this.balloonValues = new Map();
  }

  set(tag, volume, mass) {
    // the sorted set will return the smallest item first
    // so the negative sign will let us get the biggest item
    // first so we can use pop instead of shift on the
    // results.
    this.sortedSet.set(tag, -volume);
    this.balloonValues.set(tag, { volume, mass });
  }

  getMaxBalloons(length, width, height, mass) {
    const maxVolume = length * width * height;
    const maxMass = mass;

    let balloonsList = [];
    let balloonIterator = this.balloonIterator();

    let updatedVolume = 0;
    let updatedMass = 0;

    for (const tag of balloonIterator) {
      const { mass, volume } = this.balloonValues.get(tag);

      updatedMass += mass;
      updatedVolume += volume;
      if (updatedVolume <= maxVolume && (!mass || updatedMass <= maxMass)) {
        balloonsList.push({ tag, mass, volume });
      } else {
        return balloonsList;
      }
    }

    // if there are not enough balloons to fill
    // the space we return what we can
    return balloonsList;
  }

  balloonIterator() {
    // these will be sorted with largest first
    // since the score used was negative
    let balloons = this.sortedSet.rangeByScore(null);

    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (balloons.length < 1) {
          return { done: true };
        } else {
          return { value: balloons.pop(), done: false };
        }
      },
    };
  }
}
