const { transform } = require('../../../../shared');

const implementation = async(
    inputs,
    parameters,
    context,
    dependencies,
) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
        function addHiddenDiv(id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
        }
        let breadCrumbs = [];
        let getBreadCrumbs = document.querySelectorAll('div[data-zone-name="Breadcrumbs"] div[data-auto^="breadcrumb-item"] span')
        for (i = 0; i < getBreadCrumbs.length; i++)
            breadCrumbs.push(getBreadCrumbs[i].innerText);
        let category = breadCrumbs[breadCrumbs.length - 1];
        document.head.setAttribute('category', category);
        if (!document.querySelector('#page-num')) {
            addHiddenDiv('page-num', 1);
        } else {
            const pageEl = document.querySelector('#page-num');
            if (pageEl) {
                const currNum = Number(pageEl.textContent) + 1;
                pageEl.textContent = String(currNum);
            }
        }
    });

    return await context.extract(productDetails, { transform });
};

module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'RU',
        store: 'beru',
        transform,
        domain: 'beru.ru',
        zipcode: '',
    },
    implementation,
};