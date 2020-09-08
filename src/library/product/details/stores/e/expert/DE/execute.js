
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    domain: 'expert.de',
    loadedSelector: 'div.widget div.widget-Container--subContent div.widget-ArticleImage--imageContainer',
    noResultsXPath: '//pre[contains(text(), "Not Found")] | //div[contains(@class, "widget-SearchFeedbackTextWidget")] | //div[contains(@class, "widget-SearchFeedbackTextWidget")]//*[contains(text(), "Ihre Suche nach")]',
    zipcode: '',
  },
};
