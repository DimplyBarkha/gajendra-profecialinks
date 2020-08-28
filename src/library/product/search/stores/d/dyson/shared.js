

module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  
  const { productDetails } = dependencies;
  const { domain } = parameters;
  await context.evaluate(async (domain) => {
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
    const fetchURL = 'https://api.dyson.co.uk/apiman-gateway/dyson/search/1.0/gb/?query=dyson::documentType:range:documentType:ACCESSORIES:isLegacy:false:hideInOnsiteSearch:true&currentPage=0&pageSize=20&fields=DEFAULT&lang=en';
    const referrer = 'https://www.dyson.co.uk/search-results.html?searchText=dyson&from=product';

    const searchResults = await fetch(fetchURL, {
      credentials: 'omit',
      headers: { Accept: '*/*' },
      referrer,
      method: 'GET',
      mode: 'cors',
    }).then(r => r.json());
    
    searchResults.products.forEach((category) => {
      const brand = category.name ? category.name.split('™')[0] : '';
      const img = category.rangeImageUrl || '';
      if (category.associatedProducts) {
        category.associatedProducts.forEach((product) => {
          const row = addElementToDocument('added_row', '');
          const listPrice = product.price ? product.price.formattedValue : '';
          const price = product.reducedPrice ? product.reducedPrice.formattedValue : '';
          const isDiscontinued = product.discontinued;
          const name = product.webName || '';
          const prefix = name && name.includes(brand) ? '' : brand;
          row.setAttribute('added_productURL', `https://${domain}${product.productURL}`);
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
        row.setAttribute('added_productURL', `https://${domain}${category.url}`);
        row.setAttribute('added_brand', brand);
        row.setAttribute('added_thumbnail', img);
        row.setAttribute('added_name', name);
        row.setAttribute('added_nameExtended', name);
      }
    });
  }, domain);

  return await context.extract(productDetails, { transform: parameters.transform });
};
