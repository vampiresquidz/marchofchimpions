console.clear();
console.log('lsakdfalskjdflnksd');

const config = {
  src: 'https://chimpions.s3.us-east-1.amazonaws.com/PLease%20work.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLWVhc3QtMSJGMEQCICU85IIVvlfvohmC14%2BnT4SoVVqLjLmfRFtLMpgXwCaJAiAKAL5TjxOOKLZErKgvsDzL8MgVKfOlpEKPPgkfe7Xa1ir2Agh7EAAaDDA5ODM5NTU3NjY3NCIMPiUWGndjh6AS2WHYKtMCcFk3qZ4CKIaJEftkQe3yvpQ6IdnBpNSbKZaVQdikO41%2FEve3V7LIebjp4vuGGi%2Fs%2BJHdiqPyqePbdi3bdA6yuS678I%2FcymDcjgJYu9RuaDrP90eyD66g1PFKKhdUsq3FRBWj92vjdPHhzC2eMwT1XXkvKArAxpB3jQF%2FDMaL3hKDT2FWA1l8IHJxxLsYKZAYtKVd74gDh7yRbm9RWZBd422TiSOk6Ye9TeKyg9%2FiARjerpW99hLDcHtmWpPcpSa%2BCv3e2EeviXk1gJO8QSq9VvwCAjcfRzqnPFYbXR%2FA0zZHOVlpsbH6MkyA1D%2BTa6bekAJ7uj8164hbOpUma7UuFAdwaGc8wwiVmADMCNBkDRgbshOpvyxcbtLrdY%2BQbLodLy0KXB8pwOiYQxgjtl5o03Vj5wIpFO7nddjpbhaDBIbdtKeWEG4CwTY63fxB6OJVzZQQMJeQ0o4GOrQCnTUxw%2BKU8ev%2BkTcOWON2gvo6LEbskhrqx3qvd0rE1%2BxMvRW4pQgPOxcwshQTrN9UAm0AQRA%2FMuq6t84GfxoINRcOg06cHd%2FauROZAQP%2BeT%2FItZJVHsNC%2FwXQvTK84g46Z6yRR7Oe0%2FE1iqCVNIQRIL5vaJ%2Bz4DTKx00DJbaeJ%2FQ0gP0qbGH9L5R9C700r5vxXHdERAFqmUcH9hBNblVsUIe59CL5ueZIRugJRqi468GpS2nNjE7wWgSimb9q5B8QbpO5FrNtzn%2BDVyG8BL%2BY76O4e6Hc5%2FvzA1J%2FG3Ew5M7PiNbdqnHeUO3BtD%2FOV2%2BlaV4f5AVFYhxfBfS%2BcvK1Rq7IqQdgeqQhkSqr3JPpyVGkWFwSqah2Q5BlYC%2BszT92TmR2vNCb3NK5hNoMCGo%2FPjHL9rI%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220104T175356Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIARN2GVLFRN5M6ONED%2F20220104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a9a214b69160e450d949b12c28f801333bd3fefc14c23310f22c24c3364515c1',
  rows: 15,
  cols: 7 };


// UTILS

const randomRange = (min, max) => min + Math.random() * (max - min);

const randomIndex = array => randomRange(0, array.length) | 0;

const removeFromArray = (array, i) => array.splice(i, 1)[0];

const removeItemFromArray = (array, item) => removeFromArray(array, array.indexOf(item));

const removeRandomFromArray = array => removeFromArray(array, randomIndex(array));

const getRandomFromArray = (array) =>
array[randomIndex(array) | 0];


// TWEEN FACTORIES

const resetPeep = ({ stage, peep }) => {
  const direction = Math.random() > 0.5 ? 1 : -1;
  // using an ease function to skew random to lower values to help hide that peeps have no legs
  const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random());
  const startY = stage.height - peep.height + offsetY;
  let startX;
  let endX;

  if (direction === 1) {
    startX = -peep.width;
    endX = stage.width;
    peep.scaleX = 1;
  } else {
    startX = stage.width + peep.width;
    endX = 0;
    peep.scaleX = -1;
  }

  peep.x = startX;
  peep.y = startY;
  peep.anchorY = startY;

  return {
    startX,
    startY,
    endX };

};

const normalWalk = ({ peep, props }) => {
  const {
    startX,
    startY,
    endX } =
  props;

  const xDuration = 10;
  const yDuration = 0.25;

  const tl = gsap.timeline();
  tl.timeScale(randomRange(0.5, 1.5));
  tl.to(peep, {
    duration: xDuration,
    x: endX,
    ease: 'none' },
  0);
  tl.to(peep, {
    duration: yDuration,
    repeat: xDuration / yDuration,
    yoyo: true,
    y: startY - 10 },
  0);

  return tl;
};

const walks = [
normalWalk];


// CLASSES

class Peep {
  constructor({
    image,
    rect })
  {
    this.image = image;
    this.setRect(rect);

    this.x = 0;
    this.y = 0;
    this.anchorY = 0;
    this.scaleX = 1;
    this.walk = null;
  }

  setRect(rect) {
    this.rect = rect;
    this.width = rect[2];
    this.height = rect[3];

    this.drawArgs = [
    this.image,
    ...rect,
    0, 0, this.width, this.height];

  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, 1);
    ctx.drawImage(...this.drawArgs);
    ctx.restore();
  }}


// MAIN

const img = document.createElement('img');
img.onload = init;
img.src = config.src;

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const stage = {
  width: 0,
  height: 0 };


const allPeeps = [];
const availablePeeps = [];
const crowd = [];

function init() {
  createPeeps();

  // resize also (re)populates the stage
  resize();

  gsap.ticker.add(render);
  window.addEventListener('resize', resize);
}

function createPeeps() {
  const {
    rows,
    cols } =
  config;
  const {
    naturalWidth: width,
    naturalHeight: height } =
  img;
  const total = rows * cols;
  const rectWidth = width / rows;
  const rectHeight = height / cols;

  for (let i = 0; i < total; i++) {
    allPeeps.push(new Peep({
      image: img,
      rect: [
      i % rows * rectWidth,
      (i / rows | 0) * rectHeight,
      rectWidth,
      rectHeight] }));


  }
}

function resize() {
  stage.width = canvas.clientWidth;
  stage.height = canvas.clientHeight;
  canvas.width = stage.width * devicePixelRatio;
  canvas.height = stage.height * devicePixelRatio;

  crowd.forEach(peep => {
    peep.walk.kill();
  });

  crowd.length = 0;
  availablePeeps.length = 0;
  availablePeeps.push(...allPeeps);

  initCrowd();
}

function initCrowd() {
  while (availablePeeps.length) {
    // setting random tween progress spreads the peeps out
    addPeepToCrowd().walk.progress(Math.random());
  }
}

function addPeepToCrowd() {
  const peep = removeRandomFromArray(availablePeeps);
  const walk = getRandomFromArray(walks)({
    peep,
    props: resetPeep({
      peep,
      stage }) }).

  eventCallback('onComplete', () => {
    removePeepFromCrowd(peep);
    addPeepToCrowd();
  });

  peep.walk = walk;

  crowd.push(peep);
  crowd.sort((a, b) => a.anchorY - b.anchorY);

  return peep;
}

function removePeepFromCrowd(peep) {
  removeItemFromArray(crowd, peep);
  availablePeeps.push(peep);
}

function render() {
  canvas.width = canvas.width;
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);

  crowd.forEach(peep => {
    peep.render(ctx);
  });

  ctx.restore();
}
