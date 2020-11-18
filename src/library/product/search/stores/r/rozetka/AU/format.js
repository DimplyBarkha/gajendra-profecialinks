  
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
      var rank = 1;
      for (let row of group) {
            let tmp=[];
            if(row.price){
                row.price.forEach(item=>{
                    tmp.push(item.text);
                })
                row.price=[{"text":tmp.join(" ")}];
            }
            if(row.aggregateRating){
                row.aggregateRating.forEach(item=>{
                    item.text=item.text.replace('Рейтинг товара ','').replace(' из 5','');
                })
            }
            if(row.reviewCount){
                row.reviewCount.forEach(item=>{
                    item.text=item.text.replace(' отзывов','');
                })
            }
            if(row.ratingCount){
                row.ratingCount.forEach(item=>{
                    item.text=item.text.replace(' отзывов','');
                })
            }
        row.rank = [{ "text": rank }];
        row.rankOrganic = [{ "text": rank }];
        rank++;
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };