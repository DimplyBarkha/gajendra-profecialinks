
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'cromwell',
    domain: 'cromwell.co.uk',
    loadedSelector: 'div.row.InfoB',
    noResultsXPath: '//div[@class="NoResultsView_Body col-sm-9"]//h1',
    zipcode: '',
  },
};
