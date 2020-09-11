module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'ubaldi.com',
        timeout: null,
        country: 'FR',
        store: 'ubaldi',
        zipcode: '',
    },
    implementation: async({ url }, { country, domain, timeout }, context, dependencies) => {
        const newUrl = await context.evaluate(function(url) {
            let searchTerm;
            if (url.split('recherche/')[1]) {
                searchTerm = url.split('recherche/')[1].toLowerCase();
                searchTerm = searchTerm.split('.')[0];
            }
            if (searchTerm &&
                searchTerm.match(/[a-zA-Z]+/g) &&
                searchTerm.match(/[a-zA-Z]+/g).length === 1 &&
                searchTerm.match(/dyson/i)
            ) {
                console.log('redirecting to dyson all products');
                return 'https://www.ubaldi.com/recherche/dyson-brand.php';
                return false;
            };
        }, url);
        url = newUrl || url;
        await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    },
};