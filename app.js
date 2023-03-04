const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { Poppler } = require("node-poppler");
const { resolve } = require("path");
const pdf2html = require("pdf2html");

const getCategories = ($) => {
  const drugs = $(
    "body > div.container-fluid.container-main > div.content > div.table-responsive > table > tbody > tr"
  );
  const drugData = [];
  drugs.each((index, el) => {
    const detailsModal = $(el).find("button").attr("data-target");

    if (detailsModal && detailsModal === "#detailsModal") {
      const drug = {};

      drug.dencom = $(el).find("button").attr("data-dencom");
      drug.dci = $(el).find("button").attr("data-dci");
      drug.formafarm = $(el).find("button").attr("data-formafarm");
      drug.conc = $(el).find("button").attr("data-conc");
      drug.codatc = $(el).find("button").attr("data-codatc");
      drug.actter = $(el).find("button").attr("data-actter");
      drug.prescript = $(el).find("button").attr("data-prescript");
      drug.ambalaj = $(el).find("button").attr("data-ambalaj");
      drug.volumamb = $(el).find("button").attr("data-volumamb");
      drug.valabamb = $(el).find("button").attr("data-valabamb");
      drug.cim = $(el).find("button").attr("data-cim");
      drug.firmtarp = $(el).find("button").attr("data-firmtarp");
      drug.firmtard = $(el).find("button").attr("data-firmtard");
      drug.nrdtamb = $(el).find("button").attr("data-nrdtamb");
      drug.linkrcp = $(el).find("button").attr("data-linkrcp");
      drug.linkpro = $(el).find("button").attr("data-linkpro");
      drug.linkamb = $(el).find("button").attr("data-linkamb");

      drugData.push(drug);
    }
  });
  return drugData;
};

const getDrug = (url) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.get(url).then((response) => {
        const body = response.data;
        const $ = cheerio.load(body); // Load HTML data and initialize cheerio
        const t = getCategories($);
        resolve(t);
      });
    }, 1000);
  });
};

const getDrugs = async () => {
  const targetURL = "https://nomenclator.anm.ro/medicamente?page=";
  const global = [];
  for (let i = 1; i < 1616; i++) {
    await getDrug(`${targetURL}${i}`).then((r) => {
      global.push(r);
      console.log(r.length, "Page", i);
    });
  }
  fs.writeFile("drugs.json", JSON.stringify(global.flat(), null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Data written to file successfully!");
  });
};

getDrugs();
