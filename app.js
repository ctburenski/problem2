import express from "express";
import { Balloons } from "./balloons.js";

const balloons = new Balloons();

const app = express();
app.use(express.json());

app.put("/balloons/:tag", (req, res) => {
  const { mass, volume } = req.body;

  // ensure request follows constraints
  if (mass > 0 && volume > 0) {
    const tag = req.params.tag;
    // not 100% sure this check is needed
    if (!tag) {
      return res
        .status(400)
        .json({ Error: "The tag parameter must be included." });
    }

    balloons.set(tag, volume, mass);

    return res.status(200).send();
  } else {
    return res
      .status(400)
      .json({ Error: "Mass and volume must both be numbers greater than 0." });
  }
});

app.get("/balloons", (req, res) => {
  const length = parseFloat(req.query["length"]);
  const width = parseFloat(req.query["width"]);
  const height = parseFloat(req.query["height"]);
  const mass = parseFloat(req.query["mass"]);

  // ensure request follows constraints
  if (
    length > 0 &&
    width > 0 &&
    height > 0 &&
    (!req.query["mass"] || mass > 0)
  ) {
    return res.json({
      balloons: balloons.getMaxBalloons(
        length,
        width,
        height,
        isNaN(mass) ? undefined : mass
      ),
    });
  } else {
    return res
      .status(400)
      .json({ Error: "Container volume must be a number greater than zero." });
  }
});

export { app };
