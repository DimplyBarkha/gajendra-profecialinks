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
    var rank_count = 1;
    for (const { group } of data) {
        for (const row of group) {
            if (row.id) {
                row.id.forEach(item => {                    
                    row.rankOrganic = [{ 'text': rank_count }];
                    row.rank = [{ 'text': rank_count }];
                });
                rank_count = rank_count + 1;
            }
            /*if (row.price) {
                let info = [];
                row.price.forEach(item => {
                    info.push(item.text.trim());
                });
                row.price = [{'text':info.join(''),'xpath':row.price[0].xpath}];
            }*/
        }
    }
    return cleanUp(data);
};
module.exports = { transform }