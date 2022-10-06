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

    // if mass is unrelated, then we need
    // to find the highest number that
    // are within the remaining voume and
    // mass limits
    this.massUnrelated = massUnrelated;
  }

  set(tag, volume, mass) {
    this.sortedSet.set(tag, volume);
    this.balloonValues.set(tag, { volume, mass });
  }

  getMaxBalloons(length, width, height, mass) {
    const maxVolume = length * width * height;
    let currentVolume = 0;

    let balloonsList = [];

    let balloonIterator = this.balloonIterator();

    if (mass) {
      const maxMass = mass;
      let currentMass = 0;
      for (const tag of balloonIterator) {
        const { mass, volume } = this.balloonValues.get(tag);
        if (
          (currentVolume += volume) < maxVolume &&
          (currentMass += mass) < maxMass
        ) {
          balloonsList.push({ tag, mass, volume });
        } else {
          return balloonsList;
        }
      }
    } else {
      for (const tag of balloonIterator) {
        const { mass, volume } = this.balloonValues.get(tag);
        if ((currentVolume += volume) < maxVolume) {
          balloonsList.push({ tag, mass, volume });
        } else {
          return balloonsList;
        }
      }
    }
    return balloonsList;
  }

  balloonIterator() {
    let balloons = this.sortedSet.rangeByScore(0);
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (balloons.length < 1) {
          return { done: true };
        }
        // using shift isn't ideal here
        return { value: balloons.shift(), done: false };
      },
    };
  }
}
