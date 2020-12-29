
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        row.availabilityText[0].text = row.availabilityText[0].text === 'Out of Stock' ? row.availabilityText[0].text : 'In Stock';
      };
      if (row.alternateImages) {
        var image = row.image[0].text.split('/');
        var altImage = row.alternateImages[0].text.split('/');
        if (image[image.length - 1] === altImage[altImage.length - 1]) {
          row.alternateImages.shift();
        }
        if (row.alternateImages.length === 0) {
          delete row.alternateImages;
        }
      }
      if (row.category) {
        row.category.pop();
      }
      if (row.manufacturerImages) {
        var manuImages = row.manufacturerImages[0].text.split(',');
        row.manufacturerImages = [];
        manuImages.forEach(ele => {
          var obj = {};
          obj.text = ele;
          row.manufacturerImages.push(obj);
        });
      }
      if (row.inTheBoxUrl) {
        let manuImages = row.inTheBoxUrl;
        row.inTheBoxUrl = [];
        manuImages.forEach(ele => {
          let extractfirsturl = ele.text.split(',');
          var obj = {};
          let extracturlbeforeExtn = extractfirsturl[0].split(" ");          
          obj.text = extracturlbeforeExtn[0];     
          if(obj.text.startsWith("//media")){
            row.inTheBoxUrl.push(obj);
          }else{
            obj.text = "//media.flixfacts.com/eyekandy/dyson/v11/it/" + extracturlbeforeExtn[0];
            row.inTheBoxUrl.push(obj);           
          }
          
        });
        
        }
      
      if (row.largeImageCount) {
        var count = (row.alternateImages && row.alternateImages.length) ? row.alternateImages.length : row.image.length;
        row.largeImageCount = [
          {
            text: count,
          }];
      }
      if (row.secondaryImageTotal && row.alternateImages) {
        row.secondaryImageTotal = [
          {
            text: row.alternateImages.length,
          }];
      }
      if (row.shippingDimensions) {
        var dimentions = '';
        row.shippingDimensions.forEach((ele) => {
          dimentions += ' * ' + ele.text;
        });
        row.shippingDimensions = [
          {
            text: (dimentions.slice(3)).trim(),
          },
        ];
      }
    }
  }
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

module.exports = { transform };
