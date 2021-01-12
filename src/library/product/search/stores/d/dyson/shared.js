
module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const { domain, country } = parameters;
  const { keywords } = inputs;

  // await context.evaluate(async () => {
  //   async function timeout(ms) {
  //     console.log('waiting for ' + ms + ' millisecs');
  //     return new Promise((resolve) => setTimeout(resolve, ms));
  //   }

  //   let loaderSel = 'span[data-search="product"][class*="search-results__loader"]';
  //   let loaderElm = document.querySelectorAll(loaderSel);
  //   let waitMax = 60000;
  //   let checkAfter = 500;
  //   let timeBeing = 0;
  //   let isLoaderPresent = false;
  //   if(loaderElm.length > 0) {
  //     console.log('we have loader -- need to wait');
  //     isLoaderPresent = true;
  //     if(loaderElm.length === 1) {
  //       while(isLoaderPresent) {
  //         await timeout(checkAfter);
  //         timeBeing = timeBeing + checkAfter;
  //         console.log(`We have waited for ${timeBeing} ms`);
  //         if(timeBeing > waitMax) {
  //           console.log('we have waited for too long - ' + timeBeing + ' Still the loader is there');
  //           break;
  //         }
  //         loaderElm = document.querySelectorAll(loaderSel);
  //         if(loaderElm.length === 0) {
  //           isLoaderPresent = false;
  //         }
  //       }
  //       console.log('do we still have the loader - ' + isLoaderPresent);

  //     } else {
  //       console.log('we have many loaders - not sure what to do');
  //     }
  //   } else {
  //     console.log('no loader found - can steer through');
  //   }
  // });

  await context.evaluate(async (domain, country, keywords) => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      if (Array.isArray(value)) {
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        catElement.innerHTML = innerHTML;
      } else {
        catElement.textContent = value;
      }
      return catElement;
    }

    const apiCoutryCodeMapping = (country, type) => {
      const map = {
        UK: { cc: 'gb', lang: 'en' },
        US: { lang: 'en' },
        CA: { lang: 'en' },
        IE: { lang: 'en' },
        DK: { lang: 'da' },
        BE: { lang: 'nl' },
        CH: { lang: 'de' },
        AT: { lang: 'de' },
        NO: { lang: 'nb' },
        SE: { lang: 'sv' },
        PL: { lang: 'pl' },
      };
      return map[country] && map[country][type] ? map[country][type] : country.toLowerCase();
    };

    const fetchURL = `https://api.${domain}/apiman-gateway/dyson/search/1.0/${apiCoutryCodeMapping(country, 'cc')}/?query=${encodeURIComponent(keywords)}::documentType:range:documentType:ACCESSORIES:isLegacy:false:hideInOnsiteSearch:true&currentPage=0&pageSize=20&fields=DEFAULT&lang=${apiCoutryCodeMapping(country, 'lang')}`;
    const referrer = `https://www.${domain}/search-results.html?searchText=${encodeURIComponent(keywords)}&from=product`;
    console.log('Making API call');
    console.log(JSON.stringify({
      API_Url: fetchURL,
      referrer: referrer,
    }));

    const searchResults = await fetch(fetchURL, {
      credentials: 'omit',
      headers: { Accept: '*/*' },
      referrer,
      method: 'GET',
      mode: 'cors',
    }).then(r => r.json());

    if (!searchResults.products) {
      console.log('No results were found');
      return;
    };

    console.log(searchResults);

    searchResults.products.forEach((category) => {
      const brand = category.name ? category.name.split('™')[0] : '';
      const img = category.rangeImageUrl || '';
      if (category.associatedProducts) {
        category.associatedProducts.forEach((product) => {
          const row = addElementToDocument('added_row', '');
          const listPrice = product.price ? product.price.formattedValue : '';
          const price = product.reducedPrice ? product.reducedPrice.formattedValue : listPrice;
          const isDiscontinued = product.discontinued;
          const name = product.webName || '';
          const prefix = name && name.includes(brand) ? '' : brand;
          row.setAttribute('added_productURL', `${domain}${product.productURL}`);
          row.setAttribute('added_brand', brand);
          row.setAttribute('added_thumbnail', img);
          row.setAttribute('added_sku', product.code || '');
          row.setAttribute('added_mpc', product.mpc || '');
          row.setAttribute('added_name', name);
          row.setAttribute('added_price', isDiscontinued ? '' : price);
          row.setAttribute('added_listPrice', isDiscontinued || listPrice === price ? '' : listPrice);
          row.setAttribute('added_nameExtended', `${prefix ? prefix + ' - ' : ''}${name}`);
        });
      } else {
        const row = addElementToDocument('added_row', '');
        const name = category.name || '';
        row.setAttribute('added_productURL', `${domain}${category.url}`);
        row.setAttribute('added_brand', brand);
        row.setAttribute('added_thumbnail', img);
        row.setAttribute('added_name', name);
        row.setAttribute('added_nameExtended', name);
      }
    });
  }, domain, country, keywords);

  return await context.extract(productDetails, { transform: parameters.transform });
};