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
      if(row.image){
        row.image.forEach(item => {
          item.text='https://www.mediaexpert.pl'+item.text;
        });
      }
      if(row.alternateImages){
        row.alternateImages.forEach(item => {
          item.text='https://www.mediaexpert.pl'+item.text;
        });
      }
      if(row.reviewCount){
        row.reviewCount.forEach(item => {
          let reviewCountData=item.text.split(' ');
          item.text=reviewCountData[0];
        });
      }
      if(row.category){
        var arr=[];
        row.category.forEach(item => {
          arr.push({text:item.text,xpath:item.xpath});
        });
        arr.shift();
        row.category=arr;
      }


      if (row.manufacturer) {
        row.manufacturer.forEach(item => {
          var myRegexp = /producenta\/importera\s+\n(.+?)\s*\n/g;
          var match = myRegexp.exec(item.text);
          if(match.length){
              item.text = match[1].trim();
          }else{
              item.text = "";
          }
        });
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          var myRegexp = /producenta\/importera\s+\n(.+?)\s*\n/g;
          var match = myRegexp.exec(item.text);
          if(match.length){
              item.text = match[1].trim();
          }else{
              item.text = "";
          }
        });
      }
      if (row.warranty) {
        row.warranty.forEach(item => {
          var myRegexp = /Gwarancja\s+\n\s*(.+)/g;
          var match = myRegexp.exec(item.text);
          if(match.length){
              item.text = match[1].trim();
          }else{
              item.text = "";
          }
        });
      }

      

      if(row.color){
        row.color.forEach(item => {
          var data1Arr=item.text.split('Kolor ');
          if(data1Arr.length>1){
            var data2Arr=data1Arr[1].trim().split(' ');
            if(data2Arr.length>1){
              item.text=data2Arr[0];
            }else{
              item.text="";
            }
          }else{
            item.text="";
          }
        });
      }

      if (row.productOtherInformation) {
        row.productOtherInformation.forEach(item => {
          var data1Arr=item.text.split('Informacje dodatkowe ');
          if(data1Arr.length>1){
            var data2Arr=data1Arr[1].split('Moc [W]');
            if(data2Arr.length>1){
              item.text=data2Arr[0];
            }else{
              item.text="";
            }
          }else{
            item.text="";
          }
        });
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };