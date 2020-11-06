const { transform } = require('./transform');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const selectors = {
    isVariants: 'div[class*="product-attributes"]',
    isColors: '.product-attributes__color-item',
    isSizes: '.product-attributes__item-select',
    targetDiv: 'body > #product-wrapper',
    esSpecs: '#especificaciones',
  };
  try {
    await context.evaluate((selectors) => {
    // @ts-ignore
      const specs = [...document.querySelectorAll('#features .specification')];
      let headers = [];
      let values = [];
      const getElementsText = (el) => {
        let t = '';
        t += t ? ` ${el.innerText}` : el.innerText;
        const subEls = el.querySelectorAll('a > span.tooltip_content *');
        Array.from(subEls).forEach(e => {
          t += ` ${e.innerText}`;
        });
        return t.trim();
      };
      for (const spec of specs) {
        headers = headers.concat(Array.from(spec.querySelectorAll('dt')).map(getElementsText));
        values = values.concat(Array.from(spec.querySelectorAll('dd')).map(getElementsText));
      }
      const totalLen = headers.length;
      let text = '';
      for (let i = 0; i < totalLen; i++) {
        text += text ? ` | ${headers[i]} ${values[i]}` : `${headers[i]} ${values[i]}`;
      }
      document.querySelector(selectors.targetDiv).setAttribute('specs', text);
    }, selectors);
  } catch (e) {
    console.log(e.message);
  }
  try {
    await context.waitForSelector(selectors.isVariants);
    await context.evaluate((selectors) => {
      let firstVariant = '';
      const div = document.querySelector(selectors.targetDiv);
      const isColors = document.querySelector(selectors.isColors);
      const isSizes = document.querySelector(selectors.isSizes);
      if (isColors) {
        firstVariant = isColors.getAttribute('data-action-id').replace(/(.+-)(\d+)(.html)/, '$2');
        div.setAttribute('first-variant', firstVariant);
      }
      if (!isColors && isSizes) {
        firstVariant = isSizes.querySelector('option').getAttribute('data-action-id').replace(/(.+-)(\d+)(.html)/, '$2');
        div.setAttribute('first-variant', firstVariant);
      }
    }, selectors);
  } catch (e) {
    console.log('No variants present for this product');
  }
  // For mediamarkt ES
  try {
    const specsES = await context.evaluate((selectors) => {
      return Boolean(document.querySelector(selectors.esSpecs));
    }, selectors);
    if (specsES) {
      await context.evaluate((selectors) => {
        document.querySelector(selectors.esSpecs).scrollIntoView({ behavior: 'smooth' });
      }, selectors);
      await context.waitForSelector('#inpage_container', { timeout: 60000 });
      await context.click('#more_flixmedia');
      await context.waitForSelector('#wrp_flixmedia img', { timeout: 60000 });
    }
  } catch (e) {
    console.log(e.message);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.com.tr',
    zipcode: '',
  },
  implementation,
};
