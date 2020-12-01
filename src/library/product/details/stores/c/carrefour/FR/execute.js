module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'FR',
        store: 'carrefour',
        domain: 'carrefour.fr',
        loadedSelector: 'div[id="product-detail-page"],li.product-grid-item',
        noResultsXPath: '//div[@class="error"] | //div[@class="error-block__content"]//p[contains(text(),"pas avoir de résultats pour votre recherche")]',
        zipcode: '',
    },
};