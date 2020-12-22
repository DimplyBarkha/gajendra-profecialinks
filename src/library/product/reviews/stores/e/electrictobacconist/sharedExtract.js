async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform, mergeType } = parameters;
    const { productReviews } = dependencies;
    await context.evaluate(async function () {
        function addHiddenDiv(id, content, ratingVal, date) {
            const catElement = document.createElement('div');
            catElement.id = id;
            catElement.setAttribute('rating', ratingVal);
            catElement.setAttribute('reviewDate', date);
            catElement.textContent = content;
            catElement.style.display = 'none';
            document.body.appendChild(catElement);
        }
        try {
            let script = document.querySelector('script[type="application/ld+json"]');
            if (script) {
                let scriptContent = JSON.parse(script.textContent);
                // US: scriptContent[0], UK: scriptContent[1]
                let index = window.location.href.includes('.co.uk') ? 1 : 0;
                let reviews = scriptContent[index].review;
                if(reviews){
                    reviews.forEach(review => {
                        addHiddenDiv('script-review', review.description, review.reviewRating.ratingValue, review.datePublished);
                    });
                }

            } else {
                throw new Error('Script missing, reviews under new location');
            }
        } catch (exception) {
            throw new Error(`Something went wront in parsing/appending reviews: ${exception}`);
        }

    });

    const mergeOptions = mergeType ? { transform, type: mergeType } : { transform };
    const data = await context.extract(productReviews, mergeOptions);
    return { data, };
}

module.exports = {
    implementation
}