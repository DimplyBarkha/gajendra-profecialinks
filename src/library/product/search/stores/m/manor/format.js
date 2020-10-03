
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
        var rank_temp = 1
        for (const row of group) {
            row.rankOrganic = [{ 'text': rank_temp }];
            row.rank = [{ 'text': rank_temp }];
            rank_temp = rank_temp + 1;
            if (row.productUrl) {
                row.productUrl.forEach(item => {
                    item.text = 'https://www.manor.ch' + item.text;
                });
            }
            if (row.thumbnail) {
                row.thumbnail.forEach(item => {
                    item.text = 'https://www.manor.ch' + item.text;
                });
            }
            if (row.price) {
                row.price.forEach(item => {
                    item.text = item.text.replace('.', ',');
                });
            }
            if (row.aggregateRating2) {
                row.aggregateRating2.forEach(item => {
                    item.text = item.text.replace('.', ',');
                });
            }
            if (row.name) {
                var final_name = '';
                if (row.brandText) {
                    final_name = row.brandText[0].text;
                }
                if (row.subTitle) {
                    final_name = final_name + '-' + row.subTitle[0].text;
                }
                final_name = final_name + ' ' + row.name[0].text;
                row.name = [{ 'text': final_name }]
                row.nameExtended = [{ 'text': final_name }]
            }
            delete row.subTitle;
        }
    }
    return cleanUp(data);
};

module.exports = { transform };