const { transform } = require('../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('div.paragraph a.ng-star-inserted');
    await context.click('a.ng-star-inserted');
  } catch (error) {
    console.log('cookie pop up not loded', error);
  }
  await context.evaluate(async () => {
    function addHiddenDiv (vidurl, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('data-vidurl', vidurl);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

  //   if (document.querySelector('div.paragraph a')) {
  //     // @ts-ignore
  //     document.querySelector('a.ng-star-inserted').click();
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //   } else if (document.querySelector('div.tab-specs-row')) {
  //     // @ts-ignore
  //     document.querySelector('li#tab-more-info').click();
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //   }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CO',
    store: 'rappi_farmatodo',
    transform: transform,
    domain: 'rappi.com.co',
    zipcode: '',
  },
  //implementation,
};
