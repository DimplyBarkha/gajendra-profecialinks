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
        const selector = document.querySelector('div.listing-items a.c-prod-card__images');
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

  try {
    await context.waitForXPath('//div[contains(@class,"--video")]//source/@src', { timeout: 30000 });
    await context.waitForXPath('//picture[@class="c-image-gallery__img"][1]//img[@class="c-image-gallery__img"]/@src', { timeout: 30000 });
  } catch (e) {
    console.log(`There was an error while running the loading images ${e}`);
  }

  await context.evaluate(async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const isVariants = document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item');
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const rpc = [];
    if (isVariants) {
      const variants = document.querySelectorAll('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item');
      var len = document.querySelectorAll('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').length;
      const varData = document.querySelector('script[data-component="pdp-semantic-data"]');
      var length = varData ? JSON.parse(varData.textContent).model.length : -1;
      if (len === length) {
        const sizeVariants = JSON.parse(varData.textContent);
        for (let i = 0; i < sizeVariants.model.length; i++) {
          rpc.push(sizeVariants.model[i].sku);
        }
        for (let i = 0; i < sizeVariants.model.length; i++) {
          if (variants[i] && variants[i] !== undefined && sizeVariants) {
            variants[i].setAttribute('variantId', sizeVariants.model[i].sku);
            variants[i].setAttribute('availability', sizeVariants.model[i].offers[0].availability);
            variants[i].setAttribute('nameExtended', sizeVariants.model[i].name);
            variants[i].setAttribute('data-js-action', sizeVariants.model[i].name.replace(/(.+)(\s)(.+)/g, '$3'));
          }
        }
      } else {
        const variants1 = document.querySelectorAll('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span[class="c-select__dropdown-item"]');
        const sizeVariants1 = varData ? JSON.parse(varData.textContent) : null;
        if (sizeVariants1) {
          for (let i = 0; i < sizeVariants1.model.length; i++) {
            rpc.push(sizeVariants1.model[i].sku);
          }
          for (let i = 0; i < sizeVariants1.model.length; i++) {
            if (variants1[i] && variants1[i] !== undefined && sizeVariants1) {
              variants1[i].setAttribute('variantId', sizeVariants1.model[i].sku);
              variants1[i].setAttribute('availability', sizeVariants1.model[i].offers[0].availability);
              variants1[i].setAttribute('nameExtended', sizeVariants1.model[i].name);
              variants1[i].setAttribute('data-js-action', sizeVariants1.model[i].name.replace(/(.+)(\s)(.+)/g, '$3'));
            }
          }
        }
      }
      if (document.querySelector('section[data-js-component="productHero"]')) {
        document.querySelector('section[data-js-component="productHero"]').setAttribute('firstVariant', rpc[0]);
      }
    } else {
      var newSection = document.createElement('section');
      newSection.setAttribute('data-js-variant-type', 'multi-size');
      if (document.querySelector('section[data-js-component="productHero"]')) {
        document.querySelector('section[data-js-component="productHero"]').append(newSection);
      }
      var newDiv1 = document.createElement('div');
      newDiv1.setAttribute('data-ts-select-label', 'Size');
      if (document.querySelector('section[data-js-component="productHero"] section[data-js-variant-type="multi-size"]')) {
        document.querySelector('section[data-js-component="productHero"] section[data-js-variant-type="multi-size"]').append(newDiv1);
      }
      var newDiv = document.createElement('div');
      newDiv.className = 'c-select__dropdown-item-container';
      if (document.querySelector('section[data-js-component="productHero"] section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"]')) {
        document.querySelector('section[data-js-component="productHero"] section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"]').append(newDiv);
      }
      var newSpan = document.createElement('span');
      newSpan.className = 'c-select__dropdown-item';
      if (document.querySelector('section[data-js-component="productHero"] section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container')) {
        document.querySelector('section[data-js-component="productHero"] section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container').appendChild(newSpan);
      }
      const availability = document.querySelector('button[data-action="add-to-bag"].--disabled');
      if (document.querySelector('section[data-js-component="productHero"]')) {
        if (availability) {
          document.querySelector('section[data-js-component="productHero"]').setAttribute('availability', 'Out of Stock');
        } else {
          document.querySelector('section[data-js-component="productHero"]').setAttribute('availability', 'In Stock');
        }
      }

      const sku = document.evaluate('//span[@data-js-action="updateSKU"]/text()', document).iterateNext() ? document.evaluate('//span[@data-js-action="updateSKU"]/text()', document).iterateNext().textContent.trim() : null;
      const productHeroDesc = document.querySelector('div[data-js-action="productHeroDescription"] h1') ? document.querySelector('div[data-js-action="productHeroDescription"] h1').textContent : '';
      if (sku && document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item')) {
        document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('variantId', sku || '');
        document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('nameExtended', `${productHeroDesc}`);
      }
      else if (sku && document.querySelector('section[data-js-variant-type="multi-colour"] div[data-ts-select-label="Colour"] div.c-select__dropdown-item-container span.c-select__dropdown-item')) {
        document.querySelector('section[data-js-variant-type="multi-colour"] div[data-ts-select-label="Colour"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('variantId', sku || '');
        document.querySelector('section[data-js-variant-type="multi-colour"] div[data-ts-select-label="Colour"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('nameExtended', `${productHeroDesc}`);
      } else {
        const varData = document.querySelector('script[data-component="pdp-semantic-data"]');
        const isSku = varData ? JSON.parse(varData.textContent).model : null;
        if (isSku && document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item')) {
          document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('variantId',
            JSON.parse(varData.textContent).model[0].sku);
          document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('nameExtended', `${productHeroDesc}`);
        }
      }
      const size = document.querySelector('div[data-select-name="Size"] span.c-select__dropdown-item');
      const color = document.querySelector('div.--colour span.--selected');
      if (color && document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item') && document.querySelector('div.--colour span.--selected')) {
        document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('nameExtended', `${productHeroDesc} ${document.querySelector('div.--colour span.--selected').getAttribute('data-js-action')}`);
      }
      if (size && document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item')) {
        const singleSize = size.getAttribute('data-js-action');
        document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('data-js-action', singleSize);
        document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('nameExtended', `${productHeroDesc}`);
      }
      if (color && size && document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item')) {
        document.querySelector('section[data-js-variant-type="multi-size"] div[data-ts-select-label="Size"] div.c-select__dropdown-item-container span.c-select__dropdown-item').setAttribute('nameExtended', `${productHeroDesc}`);
      }
    }

    const image = document.evaluate('//picture[@class="c-image-gallery__img"][1]//img[@class="c-image-gallery__img"]/@src', document).iterateNext();
    if (!image && document.querySelector('div.c-image-gallery__images picture.c-image-gallery__img') && document.querySelector('div.--colour span.--selected img')) {
      document.querySelector('div.c-image-gallery__images picture.c-image-gallery__img').setAttribute('mainimage', document.querySelector('div.--colour span.--selected img').getAttribute('src').replace(/(.+)(_.+)(\?.+)/g, '$1_M'));
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

    document.querySelectorAll('#content1 div.c-tabs__copy li').forEach((ele) => ele.textContent = (` || ${ele.textContent}`));

    // const description1 = document.querySelector('#content1 div.c-tabs__copy')
    //   ? document.querySelector('#content1 div.c-tabs__copy').innerText : '';
    // const description2 = document.querySelectorAll('#content1 div.c-tabs__copy ul li')
    //   ? document.querySelectorAll('#content1 div.c-tabs__copy li') : '';
    // if (description2) {
    //   console.log(description2);
    //   const bulletsArr = [description2];
    //   const bulletsArrSliced = bulletsArr.slice(1);
    //   // @ts-ignore
    //   description2.forEach(e => bulletsArrSliced.push(e.textContent));
    //   let concatDesc = bulletsArrSliced.join(' || ');
    //   if (concatDesc) { concatDesc = '|| ' + concatDesc; }
    //   addElementToDocument('descriptionBull', concatDesc);
    //   console.log(concatDesc);
    // } else if (description1) {
    //   addElementToDocument('description', description1);
    //   console.log(description1);
    // }

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
