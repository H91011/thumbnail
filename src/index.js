const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const puppeteer = require('puppeteer');
const resizeOptimizeImages = require('resize-optimize-images');
const imageToBase64 = require('image-to-base64');

app.use(bodyParser.urlencoded({
  extended: false
}));

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(bodyParser.json());

app.post('/thumbnail', async (req, res) => {

  setTimeout(async () => {
    const url = req.body.url;
    console.log(url);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 800,
      height: 600,
      deviceScaleFactor: 1,
    });
    await page.goto(url);
    await page.screenshot({
      path: 'thumbnail.png'
    });
    await browser.close();
  }, 1500);

  res.send({
    "status": 200
  });
});

app.get('/base64', cors(corsOptions), async (req, res) => {

  // Set the options.
  const options = {
    images: ['thumbnail.png'],
    width: 400,
    height: 300,
    quality: 90
  };
  await resizeOptimizeImages(options);

  imageToBase64('thumbnail.png') // Image URL
    .then(
      (response) => {
        res.send({"base64": response});
      }
    )
})


app.listen(3000, () => {
  console.log("Started on PORT 3000");
})
