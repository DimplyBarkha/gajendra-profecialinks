const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const checkExistance = async (selector) => {
    return await context.evaluate(async (currentSelector) => {
      return await Boolean(document.querySelector(currentSelector));
    }, selector);
  };
  const delay = t => new Promise(resolve => setTimeout(resolve, t));
  const footerSelector = '#footer';
  console.log('footer - ', checkExistance(footerSelector));
  if (await checkExistance(footerSelector)) {
    await context.evaluate((footerSelector) => {
      const ele = document.querySelector(footerSelector);
      ele.scrollIntoView({ behavior: 'smooth' });
    }, footerSelector);
  }
  const currentUrl = await context.evaluate(() => {
    return document.querySelector('#currentPageUrl').getAttribute('value');
  });
  const iframeSelector = '#eky-dyson-iframe';
  if (await checkExistance(iframeSelector)) {
    const iframeUrl = await context.evaluate((iframeSelector) => {
      return document.querySelector(iframeSelector).getAttribute('src');
    }, iframeSelector);
    await context.goto(iframeUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
    await context.waitForXPath('//video');
    const video = await context.evaluate(() => {
      const src = ele('video');
      function ele (tag) {
        return document.querySelectorAll(tag);
      }
      const value = [];
      retrieve(src);
      function retrieve (src) {
        for (let i = 0; i < src.length; i++) {
          value.push(src[i].currentSrc);
        }
      }
      return value;
    });

    await context.evaluate(() => {
      const scrollTo = document.querySelector('#specifications');
      scrollTo.scrollIntoView({ behavior: 'smooth' });
    });
    await delay(15000);
    await context.waitForSelector('div[class="eky-row left-padding divider-line"] img');
    await delay(15000);
    const images = await context.evaluate(() => {
      const src = document.querySelectorAll('div[class="eky-row left-padding divider-line"] img');
      const value = [];
      retrieve(src);
      function retrieve (src) {
        for (let i = 0; i < src.length; i++) {
          value.push(src[i].currentSrc);
        }
      }
      return value;
    });

    const desc = await context.evaluate(() => {
      const src = document.querySelectorAll('h1,h2,h3,h4,p,div.eky-accessory>div');
      const value = [];
      retrieve(src);
      function retrieve (src) {
        for (let i = 0; i < src.length; i++) {
          value.push(src[i].innerText);
        }
      }
      return value;
    });
    await context.goto(currentUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate((video) => {
      video = video.join(' | ');
      document.querySelector('body').setAttribute('video-src', video);
    }, video);
    await context.evaluate((images) => {
      images = images.join(' | ');
      console.log(images);
      const len = images.length;
      if (images[len - 2] === '|') {
        console.log('removing | ');
        images = images.slice(0, len - 3);
      }
      document.querySelector('body').setAttribute('img-src', images);
    }, images);
    await context.evaluate((desc) => {
      desc = desc.join(' | ');
      document.querySelector('body').setAttribute('desc', desc);
    }, desc);
  }
  await delay(10000);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'ehservices',
    transform,
    domain: 'ehservices.co.uk',
    zipcode: '',
  },
  implementation,
};
