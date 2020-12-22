const { transform } = require('./format');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // if there is no result for search term
  await context.evaluate(async () => {
    const noResultsSearchTerm = document.querySelector('body.page-no-results');
    if (noResultsSearchTerm) {
      throw new Error('No Results for this RPC');
    }
  });

  if (inputs.id) {
    try {
      // if we're on search site we should click and select first item
      var detailsPage = await context.evaluate(async () => {
        await new Promise((resolve) => setTimeout(resolve, 8000));
        const selector = document.querySelector('a.c-prod-card__images');
        if (selector) {
          var productLink = selector.getAttribute('href');
        }
        return productLink;
      });

      // check if detailsPage exists
      if (detailsPage) {
        await context.goto('https://www.selfridges.com/' + detailsPage, { waitUntil: 'networkidle0', checkBlocked: true });
        await new Promise((resolve) => setTimeout(resolve, 8000));
      }
    } catch (err) {
      console.log('Stopped at search page');
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 8000));

  await context.evaluate(async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const isVariants = document.querySelector('section.multi-size div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item');
    if (isVariants) {
      const variants = document.querySelectorAll('section.multi-size div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item');
      const rpc = [];
      const sizeVariants = JSON.parse(document.querySelector('script[data-component="pdp-semantic-data"]').textContent);
      for (let i = 0; i < sizeVariants.model.length; i++) {
        rpc.push(sizeVariants.model[i].sku);
      }
      for (let i = 0; i < sizeVariants.model.length; i++) {
        variants[i].setAttribute('variantId', rpc[i]);
        variants[i].setAttribute('availability', sizeVariants.model[i].offers[0].availability);
      }
      document.querySelector('section[data-js-component="productHero"]').setAttribute('firstVariant', rpc[0]);
    } else {
      var newSection = document.createElement('section');
      newSection.className = 'multi-size';
      document.querySelector('section[data-js-component="productHero"]').append(newSection);

      var newDiv1 = document.createElement('div');
      newDiv1.setAttribute('data-ts-select-label', 'Size');
      document.querySelector('section[data-js-component="productHero"] section.multi-size').append(newDiv1);

      var newDiv = document.createElement('div');
      newDiv.className = 'c-select__dropdown-item-container';
      document.querySelector('section[data-js-component="productHero"] section.multi-size div[data-ts-select-label="Size"]').append(newDiv);

      var newSpan = document.createElement('span');
      newSpan.className = 'c-select__dropdown-item';
      document.querySelector('section[data-js-component="productHero"] section.multi-size div[data-ts-select-label="Size"] div.c-select__dropdown-item-container').appendChild(newSpan);

      const availability = document.querySelector('button[data-action="add-to-bag"].--disabled');
      if (availability) {
        document.querySelector('section[data-js-component="productHero"]').setAttribute('availability', 'Out of Stock');
      } else {
        document.querySelector('section[data-js-component="productHero"]').setAttribute('availability', 'In Stock');
      }
      const isSku = JSON.parse(document.querySelector('script[data-component="pdp-semantic-data"]').textContent).model;
      if (isSku) {
        document.querySelector('section.multi-size div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('variantId', JSON.parse(document.querySelector('script[data-component="pdp-semantic-data"]').textContent).model[0].sku);
      } else {
        const sku = document.querySelector('span[data-js-action="updateSKU"]');
        if (sku) {
          document.querySelector('section.multi-size div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('variantId', sku.textContent);
        }
      }
      const size = document.querySelector('section[data-js-variant-type="single-size"] div[data-select-name="Size"] span.c-select__dropdown-item');
      if (size) {
        const singleSize = size.getAttribute('data-js-action');
        document.querySelector('section.multi-size div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('data-js-action', singleSize);
      }
    }

    function addElementToDocument (id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.setAttribute('content', key);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };

    const isImgZoom = document.querySelector('span.hero-zoom')
      ? document.querySelector('span.hero-zoom') : null;
    // @ts-ignore
    if (isImgZoom !== null) {
      addElementToDocument('isImgZoom', 'Yes', 'Yes');
    } else {
      addElementToDocument('isImgZoom', 'No', 'No');
    }

    const description1 = document.querySelector('#content1 div.c-tabs__copy')
      ? document.querySelector('#content1 div.c-tabs__copy').innerText : '';
    const description2 = document.querySelectorAll('#content1 div.c-tabs__copy ul li')
      ? document.querySelectorAll('#content1 div.c-tabs__copy li') : '';
    if (description2) {
      console.log(description2);
      const bulletsArr = [description2];
      const bulletsArrSliced = bulletsArr.slice(1);
      // @ts-ignore
      description2.forEach(e => bulletsArrSliced.push(e.textContent));
      let concatDesc = bulletsArrSliced.join(' || ');
      if (concatDesc) { concatDesc = '|| ' + concatDesc; }
      addElementToDocument('descriptionBull', concatDesc);
      console.log(concatDesc);
    } else if (description1) {
      addElementToDocument('description', description1);
      console.log(description1);
    }

    // function getElementsByXPath (xpath, parent) {
    //   const results = [];
    //   const query = document.evaluate(xpath, parent || document,
    //     null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //   for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    //     results.push(query.snapshotItem(i).textContent.trim());
    //   }
    //   return results;
    // }
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
  },
  implementation,
};
