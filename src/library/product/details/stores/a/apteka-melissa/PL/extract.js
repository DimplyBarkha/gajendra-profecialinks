const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const timeout = 60000;
  const props = {
    selectors: {
      target: '.content-app > div > .kontener',
      script: 'script[type="application/ld+json"]',
    },
    fields: {
      image: '',
      ratingCount: '',
      brandText: '',
      shippingInfo: '',
    },
  };
  try {
    const currentUrl = await context.evaluate(() => {
      return window.location.href;
    });
    const iframeUrl = await context.evaluate(() => {
      return document.querySelector('div[itemprop="description"] > iframe').getAttribute('src');
    });
    await context.goto(iframeUrl, { timeout, waitUntil: 'networkidle0', checkBlocked: true });
    await context.waitForSelector('.bb-nutridrink img');
    const images = await context.evaluate((iframeUrl) => {
      const iframeSrc = iframeUrl.split('index.html')[0];
      // @ts-ignore
      const images = [...document.querySelectorAll('.bb-nutridrink img')];
      let text = '';
      images.forEach(image => {
        const imageSrc = iframeSrc + image.attributes.src.value;
        text = text + (text ? ' | ' : '') + imageSrc;
      });
      return text;
    }, iframeUrl);
    const description = await context.evaluate(() => {
      // @ts-ignore
      return document.querySelector('.bb-nutridrink').innerText;
    });
    await context.goto(currentUrl, { timeout, waitUntil: 'networkidle0', checkBlocked: true });
    const variables = { props: props, images: images, description: description };
    await context.evaluate((variables) => {
      document.querySelector(variables.props.selectors.target).setAttribute('aplus-images', variables.images);
      document.querySelector(variables.props.selectors.target).setAttribute('enhanced-content', variables.description);
    }, variables);
  } catch (e) {
    console.log(e.message);
  }
  try {
    await context.evaluate((props) => {
      const setAtrbt = (name, value) => {
        targetDiv.setAttribute(name, value);
      };
      const targetDiv = document.querySelector(props.selectors.target);
      // @ts-ignore
      const dataFromScript = document.querySelector(props.selectors.script).innerText;
      const jsonData = JSON.parse(dataFromScript);
      setAtrbt('main-image', jsonData.image.replace(/(.+jpg)(.+)/, '$1'));
      setAtrbt('rating-count', jsonData.aggregateRating.reviewCount);
      setAtrbt('brand-text', jsonData.brand.name);
      setAtrbt('shipping-info', 'Sold by ' + jsonData.offers.seller.name);
    }, props);
  } catch (e) {
    console.log(e.message);
  }
  try {
    await context.evaluate((props) => {
      // @ts-ignore
      const descAll = document.querySelector('div[itemprop="description"]').innerText;
      if (descAll.search('Skład:') !== -1) {
        if (descAll.search('Wskazania') !== -1 || descAll.search('Wskzania') !== -1) {
          let desc = descAll.match(/(Wskzania:|Wskazania:)(.+?)Skład:/gs);
          if (desc) {
            desc = desc[0].replace(/(Skład:|Wskazania:|Właściwości:)/gs, '');
            document.querySelector(props.selectors.target).setAttribute('additional-description', desc);
          }
        } else if (descAll.search('Właściwości:') !== -1) {
          let desc = descAll.match(/Właściwości:(.+?)Skład:/gs);
          if (desc) {
            desc = desc[0].replace(/(Skład:|Wskazania:|Wskzania:|Właściwości:)/gs, '');
            document.querySelector(props.selectors.target).setAttribute('additional-description', desc);
          }
        }
      } else if (descAll.search('Składniki:') !== -1) {
        let desc = descAll.match(/(Wskzania:|Wskazania:)(.+?)Składniki:/gs);
        if (desc) {
          desc = desc[0].replace(/(Składniki:|Wskazania:|Wskzania:|Właściwości:)/gs, '');
          document.querySelector(props.selectors.target).setAttribute('additional-description', desc);
        }
      } else if (descAll.search('Stosowanie:') !== -1 && descAll.search('Ważne informacje:') === -1) {
        let desc = descAll.match(/(Wskazania:|Wskzania:)(.+?)Stosowanie:/gs);
        if (desc) {
          desc = desc[0].replace(/(Wskazania:|Wskzania:|Właściwości:|Stosowanie:)/gs, '');
          document.querySelector(props.selectors.target).setAttribute('additional-description', desc);
        }
      } else if (descAll.search('Ważne informacje:') !== -1 && descAll.search('Stosowanie:') === -1) {
        let desc = descAll.match(/Wskazania:(.+?)Ważne informacje:/gs);
        if (desc) {
          desc = desc[0].replace(/(Wskazania:|Właściwości:|Ważne informacje:)/gs, '');
          document.querySelector(props.selectors.target).setAttribute('additional-description', desc);
        }
      } else if (descAll.search('Stosowanie:') !== -1 && descAll.search('Ważne informacje:') !== -1) {
        let desc = descAll.match(/Wskazania:(.+?)Stosowanie:/gs);
        if (desc) {
          desc = desc[0].replace(/(Wskazania:|Właściwości:|Stosowanie:)/gs, '');
          document.querySelector(props.selectors.target).setAttribute('additional-description', desc);
        }
      } else {
        let desc = descAll.match(/Wskazania:(.+?)Opakowanie:/gs);
        if (desc) {
          desc = desc[0].replace(/(Wskazania:|Właściwości:|Opakowanie:)/gs, '');
        } else {
          desc = descAll.match(/Właściwości:(.+?)Opakowanie:/gs);
          desc = desc[0].replace(/(Wskazania:|Właściwości:|Opakowanie:)/gs, '');
        }
        document.querySelector(props.selectors.target).setAttribute('additional-description', desc);
      }
      let ingrediants = descAll.match(/Skład:(.+?)Stosowanie:/gs);
      if (ingrediants) {
        ingrediants = ingrediants[0].replace(/Skład:|Stosowanie:/gs, '');
        document.querySelector(props.selectors.target).setAttribute('ingrediants', ingrediants);
      }
      let directions = descAll.match(/Stosowanie:(.+?)Ważne informacje:/gs);
      if (directions) {
        directions = directions[0].replace(/(Stosowanie:|Ważne informacje:)/gs, '');
        document.querySelector(props.selectors.target).setAttribute('directions', directions);
      }
      let warnings = descAll.match(/Ważne informacje:(.+?)Opakowanie:/gs);
      if (warnings) {
        warnings = warnings[0].replace(/(Opakowanie:|Ważne informacje:)/gs, '');
        document.querySelector(props.selectors.target).setAttribute('warnings', warnings);
      }
      const sizeSplit = descAll.split('Opakowanie:');
      if (sizeSplit[1]) {
        let size = sizeSplit[1].split('\n');
        size = size.filter(function (el) {
          return (el != null && el !== '');
        });
        if (size[0].length > 15 && sizeSplit.length > 2) {
          size = sizeSplit[2].split('\n');
          size = size.filter(function (el) {
            return (el != null && el !== '');
          });
        }
        document.querySelector(props.selectors.target).setAttribute('quantity', size[0]);
      }
    }, props);
  } catch (e) {
    console.log(e.message);
  }
  try {
    await context.waitForSelector('#owl-atrybuty a');
    await context.evaluate((props) => {
      // @ts-ignore
      const variants = [...document.querySelectorAll('#owl-atrybuty a')];
      let text = '';
      variants.forEach(variant => {
        text = text + (text ? ' | ' : ' ') + variant.getAttribute('href').replace(/(.+,)(\d+)(.+)/, '$2');
      });
      let variantsCount = 0;
      if (text) {
        variantsCount = text.split('|').length;
      }
      document.querySelector(props.selectors.target).setAttribute('variants-count', variantsCount);
      document.querySelector(props.selectors.target).setAttribute('variants', text);
      text = text.split('|')[0];
      document.querySelector(props.selectors.target).setAttribute('first-variant', text);
    }, props);
  } catch (e) {
    console.log(e.message);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'apteka-melissa',
    transform,
    domain: 'apteka-melissa.pl',
    zipcode: '',
  },
  implementation,
};
