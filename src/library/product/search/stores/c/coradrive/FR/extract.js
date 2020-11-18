const { transform } = require('./transform');

async function implementation (
  { results },
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('div[class*="popin_text_container"] a[class*="popin_link"]');
    await context.click('div[class*="popin_text_container"] a[class*="popin_link"]');
  } catch (error) {
    console.log('Close pop up button not present!!');
  }
  await context.evaluate(async function (results) {
    await new Promise(resolve => setTimeout(resolve, 2814));
    const element = document.querySelector('div[id*="footer"]');
    let countOfTry = 0;
    if (element) {
      while (!document.querySelector('div[class="ias-noneleft"] em')) {
        element.scrollIntoView({ behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 3000));
        countOfTry++;
        if (countOfTry > 40) {
          break;
        }
        const productsCount = document.querySelectorAll('div[class*="grille"] > div[class*="col1"]  ');
        if (productsCount && productsCount.length > results) {
          break;
        }
      }
    }
  }, results);
  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-searchurl', url);
  }
  await context.evaluate(addUrl);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'coradrive',
    transform,
    domain: 'coradrive.fr',
    zipcode: '',
  },
  implementation,
};
