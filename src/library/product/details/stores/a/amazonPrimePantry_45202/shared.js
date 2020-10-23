module.exports.implementation = async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function() {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const element = document.getElementById('aplus');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        let getBrand = document.querySelector('#bylineInfo') ? document.querySelector('#bylineInfo').innerText : null
        if (getBrand.toLowerCase().includes('visit the')) {
            getBrand = getBrand.split('Visit the')[1].split('store')[0];
            getBrand = getBrand.split('Store')[0];
            document.head.setAttribute('brand', getBrand);
        }
        if (getBrand.includes('Brand:')) {
            getBrand = getBrand.split('Brand:')[1];
            getBrand = getBrand.split('Store')[0];
            document.head.setAttribute('brand', getBrand);
        }

        function removeDuplicates(array) {
            array.splice(0, array.length, ...(new Set(array)))
        };
        let getRank = document.querySelectorAll('#detailBulletsWrapper_feature_div ul span');
        let rankDetails;
        let product_rank = [];
        let product_rank_category = [];
        getRank.forEach((element) => {
            if (element.innerText && element.innerText.includes('Best Sellers Rank') && element.innerText.includes('#')) {

                rankDetails = element.innerText.split('Best Sellers Rank: ')[1].split('\n');
                if (rankDetails.length) {
                    for (let i = 0; i < rankDetails.length; i++) {
                        product_rank.push(rankDetails[i].split(' ')[0].trim().replace(/#/, '').replace(/,/g, "").trim());
                        product_rank_category.push(rankDetails[i].replace(/^[#,0-9 in]+/, '').trim());
                    }
                }
                console.log(rankDetails)
            }
        });
        removeDuplicates(product_rank);
        removeDuplicates(product_rank_category);
        let category = product_rank_category.join(' | ');
        document.head.setAttribute('category', category);
        for (let i = 0; i < product_rank.length; i++) {
            const div = document.createElement('div');
            div.className = 'rank';
            const getInput = document.createElement('li');
            getInput.id = 'rank';
            div.appendChild(getInput);
            document.body.appendChild(div);
            getInput.setAttribute('value', product_rank[i]);
        }
        let getEnhancedContent = document.querySelector('#aplus');
        let enhancedcontent = ''
        if (getEnhancedContent) {
            let getAllText = getEnhancedContent.querySelectorAll('p');
            for (let i = 0; i < getAllText.length; i++)
                enhancedcontent = enhancedcontent + getAllText[i].innerText
        }
        document.head.setAttribute('enhancedcontent', enhancedcontent);

    });
    return await context.extract(productDetails, { transform });
}