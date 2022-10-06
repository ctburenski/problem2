let okCount = 0;
let failedCount = 0;
for (let i = 0; i < 7_000; i++) {
  const volume = Math.ceil(Math.random() * 150);
  const mass = volume;
  const result = await fetch(`http://localhost:7777/balloons/${i}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mass,
      volume,
    }),
  });
  if (result.ok) {
    okCount++;
    console.log(`request ${i} made - result was ok`);
  } else {
    failedCount++;
    const content = await result.json();
    console.error(`\n\nresult: ${result.status} - ${JSON.stringify(content)}`);
  }
}

for (let i = 0; i < 7_000; i++) {
  const width = Math.ceil(Math.random() * 7);
  const length = Math.ceil(Math.random() * 7);
  const height = Math.ceil(Math.random() * 7);
  const massBool = Math.ceil(Math.random() * 10) % 2;
  const mass = Math.ceil(Math.random() * 1_000);
  const result = await fetch(
    `http://localhost:7777/balloons?width=${width}&height=${height}&length=${length}${
      massBool ? "&mass=" + mass : ""
    }`
  );

  const balloonsJSON = await result.json();
  const balloonsList = balloonsJSON.balloons;
  const volume = mass * width * height;
  let volumeOfBalloons = 0;
  let massOfBalloons = 0;

  for (let i = 0; i < balloonsList.length; i++) {
    volumeOfBalloons += balloonsList[i].volume;
    massOfBalloons += balloonsList[i].mass;
  }

  if (
    result.ok &&
    volume >= volumeOfBalloons &&
    (!massBool || mass >= massOfBalloons)
  ) {
    okCount++;
    console.log(`request ${i} made - result was ok`);
  } else {
    failedCount++;
    if (massOfBalloons > mass) {
      console.error(`Mass was over the limit by ${massOfBalloons - mass}`);
    } else if (volumeOfBalloons > volume) {
      console.error(
        `Balloons could not fit in that volume.\nOver by ${
          volumeOfBalloons - volume
        }`
      );
    } else {
      console.error(`API request was not ok. Status: ${result.status}`);
    }
  }
}

console.log(`\n\nFailed: ${failedCount} - Ok: ${okCount}`);
