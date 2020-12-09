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
    var rank = 1,tmpProductURL='',tmpImgUrl='',tmpId='';
    for (let row of group) {
      if(row.id){
        row.id.forEach(item=>{
          tmpId=item.text;
        })
      }
      if(row.productUrl){
        row.productUrl.forEach(item=>{
          tmpProductURL=item.text;
        })
      }
      if(row.thumbnail){
        row.thumbnail.forEach(item=>{
          tmpImgUrl=item.text;
        })
      }
      if(tmpId==''){
        let tmpImgUrlStr=tmpImgUrl.split('/').pop();
        let idStrAr=tmpImgUrlStr.split('.');
        row.id=[{"text":idStrAr[0]}];
      }else{
        row.productUrl=[{"text":"https://www.bestbuy.ca/"+tmpProductURL}];
      }

      row.rank = [{ "text": rank }];
      row.rankOrganic = [{ "text": rank }];
      rank++;
    }
  }
  return cleanUp(data);
};
module.exports = { transform };