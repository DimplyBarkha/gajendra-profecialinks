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
        for (let row of group) {          
            if (row.id && row.rank) {
                row.id.forEach(item => {
                    try {
                        let j_data = JSON.parse(item.text);
                        item.text = j_data["sku"];
                    }catch (exception) { console.log('Error in id: '+item.text, exception); }
                });
            }
            if (row.rankOrganic && row.rank) {
                row.rankOrganic.forEach(item => {
                    try {
                        let j_data = JSON.parse(item.text);
                        item.text = j_data["position"];
                    }catch (exception) { console.log('Error in rankOrganic: '+item.text, exception); }
                });
            }
            if (row.rank && row.rank) {
                row.rank.forEach(item => {
                    try {
                        let j_data = JSON.parse(item.text);
                        item.text = j_data["position"];
                    }catch (exception) { console.log('Error in rank: '+item.text, exception); }
                });
            }
            if (row.reviewCount) {
                row.reviewCount.forEach(item => {                    
                    item.text = item.text.replace(/(\s*avaliações|avaliação\s*)+/isg, '').trim();                    
                });
            }
            if (row.aggregateRating2) {
                row.aggregateRating2.forEach(item => {                                         
                    var matches = /.+product-rating-star-(\d)(\d)/isg.exec(item.text);
                    var matches1 = /.+product-rating-star-(\d)/isg.exec(item.text);
                    if (matches) {
                        item.text = matches[1]+"."+matches[2]
                    }
                    else if (matches1) {
                        item.text = matches1[1]
                    }
                });
            }
            if (row.ratingCount) {
                row.ratingCount.forEach(item => {
                    item.text = item.text.replace(/(\s*avaliações|avaliação\s*)+/isg, '').trim();
                });
            }            
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };