/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
    const state = context.getState();
    let orgRankCounter = state.orgRankCounter || 0;
    let rankCounter = state.rankCounter || 0;
    const productCodes = state.productCodes || [];
    for (const { group }
        of data) {
        for (const row of group) {
            if (row.id) {
                rankCounter += 1;
            }
            if (!row.sponsored) {
                orgRankCounter += 1;
                row.rankOrganic = [{ text: orgRankCounter }];
            }
            row.rank = [{ text: rankCounter }];
            Object.keys(row).forEach(header => row[header].forEach(el => {
                el.text = clean(el.text);
            }));
            if (row.ratingCount) {
                let text = '';
                row.ratingCount.forEach(item => {
                    text = item.text.match(/\d+/g);
                    item.text = text;
                });
            }
            if (row.reviewCount) {
                let text = '';
                row.reviewCount.forEach(item => {
                    text = item.text.match(/\d+/g);
                    item.text = text;
                });
            }
            if (row.productUrl) {
                let text = '';
                row.productUrl.forEach(item => {
                    text = item.text.match(/.+/g);
                    item.text = 'https://www.trendyol.com' + text;
                });
            }
            if (row.aggregateRating2) {
                const map = { '.': ',' };
                row.aggregateRating2.forEach(item => {
                    item.text = item.text.replace(/[.]/g, function(rep) {
                        return map[rep];
                    });
                });
            }
            if (row.thumbnail) {
                const map = { '.': ',' };
                row.thumbnail.forEach(item => {
                    item.text = "https://img-trendyol.mncdn.com/" + item.text.replace(/\n/g, "").replace(/\s/g, "");
                });
            }
            if (row.price) {
                const map = { '.': ',' };
                row.price.forEach(item => {
                    item.text = item.text.replace('.', ',') + " TL";
                });
            }
            if (row.listPrice) {
                const map = { '.': ',' };
                row.listPrice.forEach(item => {
                    item.text = item.text.replace('.', ',') + " TL";
                });
            }
            if (row.category) {
                const map = { '.': ',' };
                let mixCat = row.category.pop()
                mixCat.text.split('/').forEach((cat) => {
                    let obj = {
                        "text": cat
                    }
                    row.category.push(obj)
                })
            }
            if (row.name) {
                const map = { '.': ',' };
                row.name.forEach(item => {
                    item.text = row.brand[0].text + " " + item.text;
                });
            }
        }
    }
    data = data.filter(function(item, index, data) {
        console.log('group length before' + item.group.length);
        item.group = item.group.filter(function(row) {
            if (parseInt(row.rankOrganic[0].text) > 150) {
                return false;
            }
            return true;
        });
        console.log('group length after' + item.group.length);
        item.rows = item.group.length;
        if (item.group.length !== 0) {
            return true;
        }
        return false;
    });
    context.setState({ rankCounter });
    context.setState({ orgRankCounter });
    context.setState({ productCodes });
    console.log(productCodes);
    return data;
};
module.exports = { transform };