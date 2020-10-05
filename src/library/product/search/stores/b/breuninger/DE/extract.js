
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    transform: null,
    domain: 'breuninger.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    // extracting data automatically
    await context.extract(productDetails);
    // inserting data manually
    var dataRef = await context.data();
    for (let i = 0; i < dataRef[0].data[0].group.length; i++) {
      dataRef[0].data[0].group[i].rank[0].text = (parseInt(dataRef[0].data[0].group[i].rank[0].text) + 1).toString();
      dataRef[0].data[0].group[i].rankOrganic[0].text = (parseInt(dataRef[0].data[0].group[i].rankOrganic[0].text) + 1).toString();
    }
  },
};
