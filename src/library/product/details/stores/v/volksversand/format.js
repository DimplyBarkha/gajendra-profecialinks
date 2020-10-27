/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
    for (const { group } of data) {
        for (const row of group) {
            if (row.alternateImages) {
                row.alternateImages.splice(0, 1);
                if (row.alternateImages.length == 0) {
                    delete row.alternateImages;
                }
            }
            if (row.promotion) {
                row.promotion.forEach(item => {
                    item.text = item.text.trim() + "%";
                });
            }
            if (row.listPrice) {
                row.listPrice.forEach(item => {
                    item.text = item.text.replace(/\*/g, '').trim();;
                });
            }            
            if (row.descriptionBullets) {
                var bulletArr = [];
                row.descriptionBullets.forEach(item => {
                    bulletArr.push(item.text);
                });
                if (row.description && bulletArr.length) {
                    row.description = [{ "text": "|| " + bulletArr.join(" || ") + " | " + row.description[0]["text"] }];
                }
                row.descriptionBullets = [{ "text": row.descriptionBullets.length }];
            }
            if (row.category) {
                if (row.category.length) {
                    row.category.splice(0, 1);
                }
                row.category.forEach(item => {
                    item.text = item.text.replace('>', '').trim();
                });
            }
            if (row.name && row.brandText) {
                row.name.forEach(item => {
                    item.text = item.text.replace(new RegExp("^\s*" + row.brandText[0]["text"]), '').trim();
                    item.text = item.text.charAt(0).toUpperCase() + item.text.slice(1)
                });
            }
            if (row.aggregateRating) {
                var rating = 0;
                rating = row.aggregateRating.length;
                if (row.aggregateRatingTmp && row.aggregateRatingTmp.length) {
                    rating = rating + .5;
                }
                row.aggregateRating = [{ "text": rating }];
            }
            if (row.aggregateRatingTmp) {
                delete row.aggregateRatingTmp;
            }
            if (row.variants) {
                row.variantCount = [{'text':row.variants.length}];
            }            
        }
    }
    return cleanUp(data);
};

module.exports = { transform };