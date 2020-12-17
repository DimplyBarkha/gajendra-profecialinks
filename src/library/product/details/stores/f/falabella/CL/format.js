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
        if (row.aggregateRatingText) {
          row.aggregateRatingText.forEach(item => {
            item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
          });
        }
        if(row.price) {
          row.price.forEach(item=>{
            var str = item.text;
            str = str.split(".");
            if(str.length > 2) {
              str = str.join(".");
              str = str.replace(".","");
              str = str.split(".");
              str = str.join(",");
            }
            else {
              str = str.join(",");
            }
            item.text = str;
          })
        }
        if(row.listPrice) {
          row.listPrice.forEach(item=>{
            var str = item.text;
            str = str.split(".");
            if(str.length > 2) {
              str = str.join(".");
              str = str.replace(".","");
              str = str.split(".");
              str = str.join(",");
            }
            else {
              str = str.join(",");
            }
            item.text = str;
          })
        }
        if(row.aggregateRating) {
          row.aggregateRating.forEach(item=>{
            item.text = item.text.replace(".",",");
          })
        }
        if(row.specifications) {
          let count = 0, array = [], tmp;
          row.specifications.forEach(item=>{
            if(count == 0) {
              tmp = item.text;
              count = 1;
            }
            else if(count == 1) {
              var str = item.text.replace(".",",");
              tmp = tmp+" : "+str;
              array.push(tmp);
              tmp = '';
              count = 0;
            }
          })
          row.specifications=[{"text":array.join(' || ')}];
        }
        if(row.description) {
          var array = [];
          row.description.forEach(item=>{
            item.text = item.text.replace(".",",");
            array.push(item.text);
          })
          for(var i = 0; i < array.length; i++) {
            if(array[i] == ':') {
              array[i+1] = array[i+1]+" ||";
            }
          }
          row.description=[{"text":"|| "+array.join(' ')}];
        }
        if(row.manufacturerDescription) {
          var array = [];
          row.manufacturerDescription.forEach(item=>{
            array.push(item.text);
          })
          row.manufacturerDescription = [{"text":array.join(" ")}];
        }
        if(row.variants){
          var array = [];
          row.variants.forEach(item=>{
            let tmp=JSON.parse(item.text);
            let variantObj = tmp.props.pageProps.productData.variants;
            variantObj.forEach(item => {
              array.push(item.id);
            });
          });
          row.variants = [{"text":array.join(" | ")}];
        }
        if(row.variantCount){
          var array = [];
          row.variantCount.forEach(item=>{
            let tmp=JSON.parse(item.text);
            let variantObj = tmp.props.pageProps.productData.variants;
            variantObj.forEach(item => {
              array.push(item.id);
            });
          });
          row.variantCount = [{"text":array.length}];
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
  