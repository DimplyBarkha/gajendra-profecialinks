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
      let rank = 1;
      let orgRank = 1;
      for (const row of group) {
        if(row.aggregateRating2){
          row.aggregateRating2.forEach(item => {
            item.text = item.text.split(':')[1].trim()
            item.text = item.text.match(/[\d\.\d]{3}/)
          //  console.log(item.text)
          })
        }
        if(row.price){
          row.price.forEach(item => {
            item.text = item.text.replace('\n','')
          })
        }
        if(row.reviewCount){
          row.reviewCount.forEach(item => {
            var strMatch = ''
            strMatch = item.text.match(/\(([0-9]+)\)/)
            item.text = strMatch[1]
          })
        }
        if(row.productUrl){
          row.productUrl.forEach(item => {
            item.text = 'https://www.woolworths.com.au/' + item.text
          })
        }
        if(row.id){
          row.id.forEach(item => {
            var strProdId = ''
            strProdId = item.text.split('/')[3]
            item.text = strProdId
          })
        }
        if(!row.rankOrganic){
          row.rankOrganic = [{ "text": orgRank }];
          orgRank++
        }else{
          delete row.rankOrganic
        }
        row.rank = [{ "text": rank }];
        rank++;
      }
    }

    return cleanUp(data);
  };
  
  module.exports = { transform };