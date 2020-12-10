const { transform } = require('./format');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  // if we're on search site we should click and select first item
  var detailsPage = await context.evaluate(async () => {

    if (document.querySelector('a.c-prod-card__images') != null) {
      var productLink = document.querySelector('a.c-prod-card__images').getAttribute('href');
    }

    return productLink;
  });

  // check if detailsPage exists
  if (detailsPage) {
    await context.goto('https://www.selfridges.com/' + detailsPage);
  }

  await new Promise((resolve) => setTimeout(resolve, 8000));

  await context.evaluate(async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    function addElementToDocument(id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.setAttribute('content', key);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };

    //getting variantId
    const script = document.querySelector('script[data-component="pdp-semantic-data"]') ? document.querySelector('script[data-component="pdp-semantic-data"]').innerText : null;
    if (document.querySelector('section[data-js-component="productHero"]') !== null) {
      const scriptToString = JSON.parse(script);

      // @ts-ignore

      if (script !== null) {
        const sku = scriptToString.model[0].sku;
        // @ts-ignore
        addElementToDocument('variantid', sku)
      }


      //getting availability
      if (script !== null) {
        const isAvailable = scriptToString.model[0].offers[0].availability;
        // @ts-ignore
        addElementToDocument('availability', isAvailable)
      }



      const isImgZoom = document.querySelector('span.hero-zoom')
        ? document.querySelector('span.hero-zoom') : null;
      // @ts-ignore
      if (isImgZoom !== null) {
        addElementToDocument('isImgZoom', 'Yes', 'Yes');
      } else {
        addElementToDocument('isImgZoom', 'No', 'No');
      }

      const description1 = document.querySelector('#content1 div.c-tabs__copy span')
        ? document.querySelector('#content1 div.c-tabs__copy span').innerText : '';
      const description2 = document.querySelectorAll('#content1 div.c-tabs__copy ul li')
        ? document.querySelectorAll('#content1 div.c-tabs__copy ul li') : '';
      if (description2) {
        const bulletsArr = [description2];
        const bulletsArrSliced = bulletsArr.slice(1);
        // @ts-ignore
        description2.forEach(e => bulletsArrSliced.push(e.textContent));
        const concatDesc = bulletsArrSliced.join(' || ');
        addElementToDocument('descriptionBull', concatDesc);
      } else if (description1) {
        addElementToDocument('description', description1);
      }
    }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    transform: transform,
    domain: 'selfridges.com',
    zipcode: '',
  }, implementation,
};
