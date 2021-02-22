
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
        var itemNo = '';
        for (const row of group) {
            if (row.alternateImages) {
                row.alternateImages.forEach(item => {
                    if (item.text.includes("?")) {
                        let split1 = item.text.split("?");
                        item.text = `${split1[0]}`;
                    }
                });
            }
            if (row.image) {
                row.image.forEach(item => {
                    if (item.text.includes("?")) {
                        let split1 = item.text.split("?");
                        item.text = `${split1[0]}`;
                    }
                });
            }
            if (row.manufacturerDescription) {
                let desc = '';
                row.manufacturerDescription.forEach(item => {
                    desc += `${item.text}`;
                });
                row.manufacturerDescription = [
                    {
                        text: desc
                    },
                ];
            }
            if (row.gtin) {
                row.gtin.forEach(item => {
                    if (item.text.includes('/')) {
                        let split1 = item.text.split('/');
                        console.log("item.text", item.text);
                        item.text = split1[split1.length - 1]
                        item.text = item.text.replace('_A', '').trim();
                    }
                });
            }
            if (row.availabilityText) {
                row.availabilityText.forEach(item => {
                    console.log("checked", item.text);
                    if (item.text === 'InStock') {
                        console.log("item.text", item.text);
                        item.text = 'In Stock';
                    }
                    else {
                        console.log("item.text", item.text);
                        item.text = 'Out of stock';
                    }
                });
            }
            if (row.warnings) {
                row.warnings.forEach(item => {
                    if (item.text.includes('GOVERNMENT WARNING:')) {
                        const split1 = item.text.split('GOVERNMENT WARNING:');
                        item.text = `${split1[1]}`;
                    }
                });
            }
            if (row.variantId) {
                row.variantId.forEach(item => {
                    if (item.text.includes('Item # ')) {
                    item.text = item.text.replace('Item # ','').trim();
                    itemNo = item.text;
                    console.log("item.variantId", itemNo);
                    }
                });
            }
            if (row.price) {
                row.price.forEach(item => {
                    if (item.text.includes('current price: ')) {
                        item.text = item.text.replace('current price: ','').trim();
                    }
                });
            }
            if (row.sku) {
                row.sku.forEach(item => {
                    if (item.text.includes('Model # ')) {
                        item.text = item.text.replace('Model # ','').trim();
                    }
                    else if(itemNo != "--"){
                        if(item.text.includes(itemNo)){
                            let skuText = "(\"itemNumber\":\""+itemNo+"\".*?\"manufacturingInfo\":{\"model\":\".*?\")";
                            var skuId1 = item.text.match(skuText);
                            let skuId2 = ''
                            if (typeof skuId1 !== 'undefined' && skuId1 != null) {
                                skuId2 = skuId1[0].match("{\"model\":\".*?\"");
                                if (typeof skuId2 !== 'undefined' && skuId2 != null) {
                                item.text = skuId2[0].replace('\"model\":\"','').replace('"','').replace('}','').replace('{','');
                                }
                                else {
                                    item.text = '';
                                }
                            }
                            else {
                                skuText = "(\"itemNumber\":\""+itemNo+"\".*?\"vendor\":{\"stockId\":\".*?\")";
                                console.log("item.skuText", skuText);
                                skuId1 = item.text.match(skuText);
                                if (typeof skuId1 !== 'undefined' && skuId1 != null) {
                                    skuId2 = skuId1[0].match("{\"stockId\":\".*?\"");
                                    console.log("item.skuId2", skuId2);
                                    if (typeof skuId2 !== 'undefined' && skuId2 != null) {
                                        item.text = skuId2[0].replace('\"stockId\":\"','').replace('"','').replace('}','').replace('{','');
                                    }
                                    else {
                                        item.text = '';
                                    }
                                }
                                else {
                                    item.text = '';
                                }
                            }
                        }
                    }
                });
            }
            if (row.mpc) {
                row.mpc.forEach(item => {
                    if (item.text.includes('Model # ')) {
                        item.text = item.text.replace('Model # ','').trim();
                    }
                    else if(itemNo != "--"){
                        if(item.text.includes(itemNo)){
                            let mpcText = "(\"itemNumber\":\""+itemNo+"\".*?\"manufacturingInfo\":{\"model\":\".*?\")";
                            let mpcId1 = item.text.match(mpcText);
                            let mpcId2 = ''
                            if (typeof mpcId1 !== 'undefined' && mpcId1 != null) {
                            mpcId2 = mpcId1[0].match("{\"model\":\".*?\"");
                            if (typeof mpcId2 !== 'undefined' && mpcId2 != null) {
                                item.text = mpcId2[0].replace('\"model\":\"','').replace('"','').replace('}','').replace('{','');
                            }
                            else {
                                item.text = '';
                            }
                            }
                            else {
                                mpcText = "(\"itemNumber\":\""+itemNo+"\".*?\"vendor\":{\"stockId\":\".*?\")";
                                console.log("item.skuText", mpcText);
                                mpcId1 = item.text.match(mpcText);
                                if (typeof mpcId1 !== 'undefined' && mpcId1 != null) {
                                    mpcId2 = mpcId1[0].match("{\"stockId\":\".*?\"");
                                    console.log("item.skuId2", mpcId2);
                                    if (typeof mpcId2 !== 'undefined' && mpcId2 != null) {
                                        item.text = mpcId2[0].replace('\"stockId\":\"','').replace('"','').replace('}','').replace('{','');
                                    }
                                    else {
                                        item.text = '';
                                    }
                                }
                                else {
                                    item.text = '';
                                }
                            }
                        }
                    }
                });
            }
            if (row.listPrice) {
                row.listPrice.forEach(item => {
                    if(itemNo != "--"){
                        if(item.text.includes(itemNo)){
                            let listPriceText = "(\"itemNumber\":\""+itemNo+"\".*?\"manufacturingInfo\":{\"model\":.*?\")";
                            let listPriceDetails = item.text.match(listPriceText);
                            if (typeof listPriceDetails !== 'undefined' && listPriceDetails != null) {
                                let listOriginal = listPriceDetails[0].match("\"startPrice\":{\"amount\":.*?\"");
                                if (typeof listOriginal !== 'undefined' && listOriginal != null) {
                                    let listDiscount = listPriceDetails[0].match("\"finalPrice\":{\"amount\":.*?\"");
                                    if (typeof listDiscount !== 'undefined' && listDiscount != null) {
                                    if(listOriginal[0] == listDiscount[0]){
                                        listOriginal = '';
                                        }
                                        item.text = listOriginal[0].replace('\"startPrice\":{\"amount\":','').replace('\"','').replace(',','');
                                    }
                                    else {
                                        item.text = '';
                                    }
                                }
                                else {
                                    item.text = '';
                                }
                            }
                            else {
                                item.text = '';
                            }
                        }
                    }
                    else{
                        item.text = '--';
                    }
                });
            }
            if (row.description) {
                let text = '';
                row.description.forEach((element) => {
                    if (element.xpath.includes('li')) {
                        text += `|| ${element.text}`;
                      } else {
                        text += ` ${element.text}`;
                      }
                });
                row.description = [{ text: text.trim() }];
              }
        }
    }
    return cleanUp(data);
};

module.exports = { transform };
