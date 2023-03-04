import { Drugs } from "./drugsObject.js";
import * as fs from "fs";
console.log(Drugs.length);

const parse = () => {
  let drugs = new Set();
  Drugs.forEach((drug) => {
    drugs.add(drug.dencom);
  });

  const parsed = [...drugs].map((drug) => {
    const filtered = Drugs.filter((dr) => drug === dr.dencom);
    const result = transformArray(filtered);
    return result;
  });

  fs.writeFile("final.json", JSON.stringify(parsed, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Data written to file successfully!");
  });
};

const transformArray = (arr) => {
  let result = {};
  const map = new Map();
  for (const { dencom, ...rest } of arr) {
    if (map.has(dencom)) {
      const existing = map.get(dencom);
      for (const [prop, value] of Object.entries(rest)) {
        if (existing[prop] instanceof Array) {
          if (!existing[prop].includes(value)) {
            existing[prop].push(value);
          }
        } else if (existing[prop] !== value) {
          existing[prop] = [existing[prop], value];
        }
      }
    } else {
      map.set(dencom, { dencom, ...rest });
      result = map.get(dencom);
    }
  }
  return result;
};

parse();
