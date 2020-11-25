module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'TR',
        store: 'gittigidiyor',
        nextLinkSelector: `li.next-link>a`,
        domain: 'gittigidiyor.com',
        zipcode: '',
    },
};