const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    transform,
    domain: 'nordstrom.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
 
      try {
        const varinatInformation = [];
        const id = document.querySelector('meta[property="og:url"]').getAttribute('content');
        const pId = id.match(/\d+$/g) && id.match(/\d+$/g)[0];
        const styleDetails = window.__INITIAL_CONFIG__.sellingEssentials[`product-page-${pId}`];
        console.log('ewewewstyleDetails')
        console.log(styleDetails)
        let type = Object.keys(styleDetails.filterSelections).length && styleDetails.filterAvailabilityById['size'] ? 'size' : 'group';
        const filters = styleDetails.filterAvailabilityById;
        const ids = filters[type].allIds;

        for (const varId of ids) {
          const varinatInfo = {};
          const variant = filters[type].byId[varId];
          Object.assign(varinatInfo, {
            variantId: variant.id,
            avail: variant.isAvailable
          });

          varinatInformation.push(varinatInfo);
        }
        console.log('varinatInformfdfdation')
        console.log(varinatInformation)
        const brand = document.querySelector('h2 span[itemprop="name"]');
        const name = document.querySelector('h1[itemprop="name"]');

        const totalname = `${brand ? brand.textContent : ''} ${name ? name.textContent : ''}`;
        console.log(varinatInformation);
        if (varinatInformation.length) {
          const table = document.createElement('table');
          document.body.appendChild(table);
          const tBody = document.createElement('tbody');
          table.appendChild(tBody);

          for (let index = 0; index < varinatInformation.length; index++) {
            console.log(varinatInformation[index])
            const newlink = document.createElement('tr');
            newlink.setAttribute('class', 'append_variant');

            const variant = document.createElement('td');
            variant.setAttribute('class', 'variant');
            variant.textContent = varinatInformation[index].variantId;
            newlink.appendChild(variant);

            const nameExtended = document.createElement('td');
            nameExtended.setAttribute('class', 'nameextended');
            nameExtended.textContent = `${totalname} ${varinatInformation[index].variantId}`;
            newlink.appendChild(nameExtended);

            const avail = document.createElement('td');
            avail.setAttribute('class', 'avail');
            avail.textContent = varinatInformation[index].avail;
            newlink.appendChild(avail);
            tBody.appendChild(newlink);
          }
        } else {
          const table = document.createElement('table');
          document.body.appendChild(table);
          const tBody = document.createElement('tbody');
          table.appendChild(tBody);
          const tr = document.createElement('tr');
          tr.setAttribute('class', 'append_variant');
          tBody.appendChild(tr);
          const nameExtended = document.createElement('td');
          nameExtended.setAttribute('class', 'nameextended');
          nameExtended.textContent = `${totalname}`;
          tr.appendChild(nameExtended);
        }
      } catch (error) {
        console.log(error.message);
      }

    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
