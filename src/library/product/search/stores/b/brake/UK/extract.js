const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'brake',
    transform,
    domain: 'brake.co.uk',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // selecting link node and modifying href attribute to paginate, instead of loading products using "Load more" button
    const prepareForPagination = async function (context) {
      await context.evaluate(async function () {
        if (document.querySelector('head link[rel="next"]')) {
          const linkNode = document.querySelector('head link[rel="next"]');
          let paginationHref = linkNode.getAttribute('href');
          paginationHref = paginationHref.replace(/(\/results?)/, '');
          const regEx = /q=([^=]*):/;
          const match = regEx.exec(paginationHref);
          const escapedSearchTerm = escape(match[1]);
          const reg = new RegExp(match[1]);
          paginationHref = paginationHref.replace(reg, escapedSearchTerm);
          linkNode.setAttribute('href', paginationHref);
        }
      });
    };
    await prepareForPagination(context);
    return await context.extract(productDetails, { transform });
  },
};
