import express from "express";
import { Balloons } from "./balloons.js";

const balloons = new Balloons();

const app = express();
app.use(express.json());

app.put("/balloons/:tag", (req, res) => {
  const { mass, volume } = req.body;

  // ensure request follows constraints
  if (
    typeof mass !== "number" ||
    mass < 0 ||
    typeof volume !== "number" ||
    volume < 0
  ) {
    return res
      .status(400)
      .json({ Error: "Mass and volume must both be numbers greater than 0." });
  }

  const tag = req.params.tag;
  // not 100% sure this check is needed
  if (!tag) {
    return res
      .status(400)
      .json({ Error: "The tag parameter must be included." });
  }

  balloons.set(tag, volume, mass);

  return res.status(200).send();
});

app.get("/balloons", (req, res) => {
  const length = req.query["length"];
  const width = req.query["width"];
  const height = req.query["height"];
  const mass = req.query["mass"];

  // ensure request follows constraints
  if (length < 0 || width < 0 || height < 0) {
    return res.status(400).json({ Error: "Container volume must be nonzero." });
  }

  res.json({ balloons: balloons.getMaxBalloons(length, width, height, mass) });
});

export { app };
