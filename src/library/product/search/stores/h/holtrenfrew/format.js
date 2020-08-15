/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    const cleanUp = text => text.toString()
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
  
    const prefixImageWithDomain = (image) => {
        const domainPrefix = "https:";
        const { text } = image;
        return { ...image, text: domainPrefix + text };
    }

    const prefixProductUrlWithDomain = (product) => {
        const productDomain = "https://holtrenfrew.com";
        const { text } = product;
        return { ...product, text: productDomain + text };
    }

    for (const { group } of data) {
      for (const row of group) {
        // Added code as brand is not available directly on the webpage
        if(row.productUrl) row.productUrl = row.productUrl.map(prefixProductUrlWithDomain);

        if(row.thumbnail) row.thumbnail = row.thumbnail.map(prefixImageWithDomain);
      }
    }
    return data;
  };
  module.exports = { transform };