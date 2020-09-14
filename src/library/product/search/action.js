module.exports = {
    parameters: [{
            name: 'country',
            description: '2 letter ISO code for the country',
        },
        {
            name: 'store',
            description: 'store name',
        },
        {
            name: 'domain',
            description: 'The top private domain of the website (e.g. amazon.com)',
        },
        {
            name: 'zipcode',
            description: 'to set location',
            optional: true,
        },
        {
            name: 'defaultResults',
            description: 'default results value.',
            optional: true,
        },
        {
            name: 'mergeType',
            description: 'For merge rows ranking calculation.',
            optional: true,
        },
    ],
    inputs: [{
            name: 'keywords',
            description: 'keywords to search for',
            type: 'string',
        },
        {
            name: 'Keywords',
            description: 'keywords to search for',
            type: 'string',
        },
        {
            name: 'Brands',
            description: 'brands to search for',
            type: 'string',
        },
        {
            name: 'results',
            description: 'the minimum number of results required',
            type: 'number',
        },
    ],
    dependencies: {
        execute: 'action:product/search/execute',
        paginate: 'action:product/search/paginate',
        extract: 'action:product/search/extract',
    },
    path: './search/stores/${store[0:1]}/${store}/${country}/search',
    implementation: async({ keywords, Keywords, Brands, results }, { country, store, domain, zipcode, defaultResults, mergeType }, context, { execute, extract, paginate }) => {
        results = results || defaultResults || 150;
        // TODO: consider moving this to a reusable function
        const length = (results) => results.reduce((acc, { group }) => acc + (Array.isArray(group) ? group.length : 0), 0);

        keywords = (Keywords) || (Brands) || (keywords);
        console.log('zip:' + zipcode);
        // do the search
        const resultsReturned = await execute({ keywords, zipcode });

        if (!resultsReturned) {
            console.log('No results were returned');
            return;
        }

        // try gettings some search results
        const pageOne = await extract({});

        let collected = length(pageOne);

        console.log('Got initial number of results', collected);

        // check we have some data
        if (collected === 0) {
            return;
        }

        let page = 2;
        while (collected < results && await paginate({ keywords, page, offset: collected, mergeType })) {
            const data = await extract({});
            const count = length(data);
            // if (count === 0) {
            //     // no results
            //     break;
            // }
            collected = (mergeType && (mergeType === 'MERGE_ROWS') && count) || (collected + count);
            collected = count;

            page++;
            console.log('count value', collected);
        }
        console.log("MergeType", mergeType === 'MERGE_ROWS');
        console.log('type', typeof mergeType);
        console.log("mergeType value", mergeType);


    },
};