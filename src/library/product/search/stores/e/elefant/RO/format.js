/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const cleanUp = (data, context) => {
        const clean = text => text.toString()
            .replace(/\r\n|\r|\n/g, ' ')
            .replace(/&amp;nbsp;/g, ' ')
            .replace(/&amp;#160/g, ' ')
            .replace(/\u00A0/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .replace(/"\s{1,}/g, '"')
            .replace(/\s{1,}"/g, '"')
            .replace(/^ +| +$|( )+/g, ' ')
            // eslint-disable-next-line no-control-regex
            .replace(/[\x00-\x1F]/g, '')
            .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
        data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
            el.text = clean(el.text);
        }))));
        return data;
    };
    const clean = text => text.toString()

    const state = context.getState();
    let orgRankCounter = state.orgRankCounter || 0;
    let rankCounter = state.rankCounter || 0;


    for (const { group } of data) {
        for (let row of group) {
            if (row.ratingCount) {
                row.ratingCount.forEach(item => {
                    item.text = item.text.replace('.', '');
                });
            }

            // if (row.price) {
            //     let priceText = '';
            //     row.price.forEach(item => {
            //         console.log("item.text", item.text);
            //         priceText = item.text;
            //     });
            //     row.price = [{ 'text': priceText, 'xpath': row.price[0].xpath }];
            // }

            if (row.aggregateRating) {
                let count = 0;
                row.aggregateRating.forEach(item => {
                    if (item.text.includes('rating-one')) {
                        count = 1;
                    }
                    if (item.text.includes('rating-two')) {
                        count = 2;
                    }
                    if (item.text.includes('rating-three')) {
                        count = 3;
                    }
                    if (item.text.includes('rating-four')) {
                        count = 4;
                    }
                    if (item.text.includes('rating-five')) {
                        count = 5;
                    }
                });
                row.aggregateRating = [{ 'text': count, 'xpath': row.aggregateRating[0].xpath }];
            }

            rankCounter += 1;
            if (row.rankOrganic && row.rank) {
                orgRankCounter += 1;
                row.rankOrganic = [{ text: orgRankCounter }];
            }
            row.rank = [{ text: rankCounter }];
            Object.keys(row).forEach(header => row[header].forEach(el => {
                el.text = clean(el.text);
            }))
        }
    }
    context.setState({ rankCounter });
    context.setState({ orgRankCounter });
    return cleanUp(data);
};

module.exports = { transform };