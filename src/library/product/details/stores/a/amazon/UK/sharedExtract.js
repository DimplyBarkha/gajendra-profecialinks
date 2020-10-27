module.exports.implementation = async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    // @ts-ignore
    const { transform } = parameters;
    // @ts-ignore
    const { productDetails } = dependencies;
    await context.evaluate(async(inputs) => {
        function addHiddenDiv(id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
        }
        async function buttonCheck() {
            const button = '#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a, #mbc-olp-link';
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!document.querySelector(button)) {
                return button;
            } else {
                return 'false';
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
            .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
            .replace(/&nbsp;/g, ' ');
        addHiddenDiv('added-parentInput', inputs);
        var element = (document.querySelectorAll("div[cel_widget_id*='aplus'] img")) ? document.querySelectorAll("div[cel_widget_id*='aplus'] img") : [];
        if (element) {
            element.forEach(async(node) => {
                node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
                await new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });
            });
        }
        // All transform fields
        const servingSizeUom = await domEvaluate("//*[contains(text(),'Serving')]/following-sibling::*[1]");
        if (servingSizeUom) {
            servingSizeUom.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_servingSizeUom', clean(finalVal));
            });
        }
        const promotion = await domEvaluate("//tr[contains(@id, 'regularprice_savings')] | //span[contains(@class, 'priceBlockDealPriceString')] | //td[contains(@id, 'priceblock_dealprice_lbl')] | //td[contains(@class, 'priceBlockSaving')]");
        if (promotion) {
            promotion.forEach(item => {
                addHiddenDiv('ii_promotion', clean(item.text));
            });
        }
        const servingSize = await domEvaluate("//*[contains(text(),'Serving')]/following-sibling::*[1]");
        if (servingSize) {
            servingSize.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_servingSize', clean(finalVal));
            });
        }
        // @ts-ignore
        let packSize = document.querySelector("h1[id*='title']") ? document.querySelector("h1[id*='title']").innerText : '';
        if (packSize.search(/pack of/gmi) > -1) {
            packSize = (packSize.match(/pack of (\d+)/i)[1]) ? packSize.match(/pack of (\d+)/i)[1] : '';
            addHiddenDiv('ii_packSize', clean(packSize));
        }
        packSize = await domEvaluate("(//div[contains(@id, 'detail-bullets')]//text()[contains(., 'Size')]/following-sibling::*[1] | //div[contains(@id, 'detail-bullets')]//*[contains(text(), 'Size')]/* | //label[contains(text(), 'Size')]/following-sibling::*[1])[1] | //table[contains(@id,'product-specification-table')]//th[contains(text(), 'Number of Items')]/../td | //td[contains(text(),'Item Package Quantity')]/following-sibling::*[1] | //div[@id='ii_packSize'] | //th[contains(text(),'Item Package Quantity')]/following-sibling::*[1]");
        if (packSize) {
            packSize.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/pack of (\d+)/i, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_packSizeNew', clean(finalVal));
            });
        }
        const brandLink = await domEvaluate("//a[@id='bylineInfo']/@href | //div[contains(@id, 'brandBar_feature_div')]//a[contains(@id, 'brand')]/@href");
        if (brandLink) {
            brandLink.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/(.+)/, 'http://www.amazon.co.uk' + '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_brandLink', clean(finalVal));
            });
        }
        let getBrand = document.querySelector('a[id="bylineInfo"]') ? document.querySelector('a[id="bylineInfo"]').innerText : null;
        if (getBrand && getBrand.includes('Visit the')) {
            getBrand = getBrand.split('Visit the')[1];
            getBrand = getBrand.split('Store')[0];
            document.head.setAttribute('brand', getBrand);
        }
        if (getBrand.includes('Brand:')) {
            getBrand = getBrand.split('Brand:')[1];
            document.head.setAttribute('brand', getBrand);
        }
        const totalFatPerServingUom = await domEvaluate("//td[contains(text(),'Fat')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Fat')]/following-sibling::*[1]");
        if (totalFatPerServingUom) {
            totalFatPerServingUom.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_totalFatPerServingUom', clean(finalVal));
            });
        }
        const totalFatPerServing = await domEvaluate("//td[contains(text(),'Fat')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Fat')]/following-sibling::*[1]");
        if (totalFatPerServing) {
            totalFatPerServing.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_totalFatPerServing', clean(finalVal));
            });
        }
        const saltPerServingUom = await domEvaluate("//td[contains(text(),'Salt')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Salt')]/following-sibling::*[1]");
        if (saltPerServingUom) {
            saltPerServingUom.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_saltPerServingUom', clean(finalVal));
            });
        }
        const saltPerServing = await domEvaluate("//td[contains(text(),'Salt')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Salt')]/following-sibling::*[1]");
        if (saltPerServing) {
            saltPerServing.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_saltPerServing', clean(finalVal));
            });
        }
        const proteinPerServing = await domEvaluate("//td[contains(text(),'Protein')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Protein')]/following-sibling::*[1]");
        if (proteinPerServing) {
            proteinPerServing.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_proteinPerServing', clean(finalVal));
            });
        }
        const proteinPerServingUom = await domEvaluate("//td[contains(text(),'Protein')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Protein')]/following-sibling::*[1]");
        if (proteinPerServingUom) {
            proteinPerServingUom.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_proteinPerServingUom', clean(finalVal));
            });
        }
        const sodiumPerServingUom = await domEvaluate("//td[contains(text(),'Sodium')]/following-sibling::*[1]  | //table//tr//*[contains(text(),'Sodium')]/following-sibling::*[1]");
        if (sodiumPerServingUom) {
            let finalVal = '';
            sodiumPerServingUom.forEach(item => {
                item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
            });
            addHiddenDiv('ii_sodiumPerServingUom', clean(finalVal));
        }
        const sodiumPerServing = await domEvaluate("//td[contains(text(),'Sodium')]/following-sibling::*[1]  | //table//tr//*[contains(text(),'Sodium')]/following-sibling::*[1]");
        if (sodiumPerServing) {
            let finalVal = '';
            sodiumPerServing.forEach(item => {
                item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
            });
            addHiddenDiv('ii_sodiumPerServing', clean(finalVal));
        }
        const saturatedFatPerServingUom = await domEvaluate("//td[contains(text(),'Saturate')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Saturate')]/following-sibling::*[1]");
        if (saturatedFatPerServingUom) {
            let finalVal = '';
            saturatedFatPerServingUom.forEach(item => {
                item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
            });
            addHiddenDiv('ii_saturatedFatPerServingUom', clean(finalVal));
        }
        const saturatedFatPerServing = await domEvaluate("//td[contains(text(),'Saturate')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Saturate')]/following-sibling::*[1]");
        if (saturatedFatPerServing) {
            let finalVal = '';
            saturatedFatPerServing.forEach(item => {
                item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
            });
            addHiddenDiv('ii_saturatedFatPerServing', clean(finalVal));
        }
        const totalCarbPerServing = await domEvaluate("//td[contains(text(),'Carb')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Carb')]/following-sibling::*[1]");
        if (totalCarbPerServing) {
            let finalVal = '';
            totalCarbPerServing.forEach(item => {
                item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
            });
            addHiddenDiv('ii_totalCarbPerServing', clean(finalVal));
        }
        const totalCarbPerServingUom = await domEvaluate("//td[contains(text(),'Carb')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Carb')]/following-sibling::*[1]");
        if (totalCarbPerServingUom) {
            let finalVal = '';
            totalCarbPerServingUom.forEach(item => {
                item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
            });
            addHiddenDiv('ii_totalCarbPerServingUom', clean(finalVal));
        }
        const totalSugarsPerServing = await domEvaluate("//td[contains(text(),'Sugar')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Sugar')]/following-sibling::*[1]");
        if (totalSugarsPerServing) {
            let finalVal = '';
            totalSugarsPerServing.forEach(item => {
                item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
            });
            addHiddenDiv('ii_totalSugarsPerServing', clean(finalVal));
        }
        const totalSugarsPerServingUom = await domEvaluate("//td[contains(text(),'Sugar')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Sugar')]/following-sibling::*[1]");
        if (totalSugarsPerServingUom) {
            let finalVal = '';
            totalSugarsPerServingUom.forEach(item => {
                item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
            });
            addHiddenDiv('ii_totalSugarsPerServingUom', clean(finalVal));
        }
        const salesRank = await domEvaluate('//*[@id="SalesRank"]/text()[contains(., "#")] | //*[@id="SalesRank"]//span[contains(., "#")] | //*[@id="SalesRank"]//td[contains(., "in")]');
        if (salesRank) {
            salesRank.forEach(item => {
                let finalVal = item.text;
                if (item.text.match(/([\d]+(?:,[\d]+)?)/) && item.text.match(/([\d]+(?:,[\d]+)?)/).length > 0) {
                    item.text = item.text.match(/([\d]+(?:,[\d]+)?)/)[0];
                    finalVal = item.text;
                }
                addHiddenDiv('ii_salesRank', clean(finalVal));
            });
        }

        const salesRankCategory = await domEvaluate('//*[@id="SalesRank"]/text()[contains(., "#")] | //*[@id="SalesRank"]//span[contains(., "#")]/following-sibling::*[1]/a | //*[@id="SalesRank"]//td[contains(., "in")]');
        if (salesRankCategory) {
            salesRankCategory.forEach(item => {
                let finalVal = item.text;
                if (item.text.match(/[\d]+(?:,[\d]+)? in (.*) \(/) && item.text.match(/[\d]+(?:,[\d]+)? in (.*) \(/).length > 1) {
                    item.text = item.text.match(/[\d]+(?:,[\d]+)? in (.*) \(/)[1];
                    finalVal = item.text;
                }
                addHiddenDiv('ii_salesRankCategory', clean(finalVal));
            });
        }
        const ironPerServingUom = await domEvaluate("//td[contains(text(),'Iron')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Iron')]/following-sibling::*[1]");
        if (ironPerServingUom) {
            ironPerServingUom.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_ironPerServingUom', clean(finalVal));
            });
        }
        const ironPerServing = await domEvaluate("//td[contains(text(),'Iron')]/following-sibling::*[1] | //table//tr//*[contains(text(),'Iron')]/following-sibling::*[1]");
        if (ironPerServing) {
            ironPerServing.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
                finalVal = item.text;
                addHiddenDiv('ii_ironPerServing', clean(finalVal));
            });
        }
        const pricePerUnit2 = await domEvaluate("//span[contains(@id,'priceblock_ourprice')]/following-sibling::*/text()");
        if (pricePerUnit2) {
            pricePerUnit2.forEach(item => {
                let finalVal = '';
                const val = item.text.split('/');
                if (val[1] && val[1].match(/([\d]+)/)) {
                    finalVal = val[0].trim() + ' / ' + val[1].match(/([\d]+)/)[0].trim();
                }
                finalVal = finalVal ? finalVal.replace('(', '').trim() : val[0].replace('(', '').trim();
                addHiddenDiv('ii_pricePerUnit2', clean(finalVal));
            });
        }
        const pricePerUnitUom = await domEvaluate("//span[contains(@id,'priceblock_ourprice')]/following-sibling::*/text()");
        if (pricePerUnitUom) {
            pricePerUnitUom.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/.*(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1').replace('/', '').replace(')', '').trim()}`;
                finalVal = item.text;
                addHiddenDiv('ii_pricePerUnitUom', clean(finalVal));
            });
        }
        const description = await domEvaluate("//*[@id='feature-bullets']/ul/li[not(@id)]");
        const descriptionBottom = await domEvaluate('//*[@id="productDescription"]', true);
        if (description || descriptionBottom) {
            let finalVal = [];
            let text = '';
            description && description.forEach(item => {
                text += ` || ${item.text}`;
            });
            if (text) {
                finalVal = [text.trim(), ...descriptionBottom.map(({ text }) => text.replace(/(\s*[\r\n]\s*)+/g, ' '))];
            } else {
                finalVal = [...descriptionBottom.map(({ text }) => text.replace(/(\s*[\r\n]\s*)+/g, ' '))];
            }
            finalVal = clean(finalVal.join(' | '));
            addHiddenDiv('ii_description', clean(finalVal));
        }
        const allergyAdvice = await domEvaluate("(//*[contains(@class, 'a-alert-heading') and contains(text(), 'WARNING')]/following-sibling::div[contains(@class, 'a-alert-content')] | //div[contains(@id, 'important-information')]/div[contains(@class,'content')]/h4[contains(text(), 'Safety Information')]/../p[text()]/text())[1] | //td[contains(text(),'Allergen')]/following-sibling::*[1]");
        if (allergyAdvice) {
            allergyAdvice.forEach(item => {
                let finalVal = '';
                item.text = `${item.text.replace(/Contains: /g, '')}`;
                finalVal = item.text;
                addHiddenDiv('ii_allergyAdvice', clean(finalVal));
            });
        }
        const imageAlt = await domEvaluate('(//img[@id="landingImage"])[1]/@alt');
        if (imageAlt) {
            imageAlt.forEach(item => {
                let finalVal = '';
                item.text = clean(`${item.text}`);
                finalVal = item.text;
                addHiddenDiv('ii_imageAlt', clean(finalVal));
            });
        }
        const news = await domEvaluate("//*[@id='SalesRank']//td[@class='value']//li[@class='zg_hrsr_item'][last()]");
        if (news) {
            news.forEach((item, index) => {
                let finalVal = '';
                item.text = item.text.replace(/(#\d+)(.*)/, '$1 Best Seller$2');
                finalVal = item.text;
                addHiddenDiv('ii_news', clean(finalVal));
            });
        }
        const fastTrack = await domEvaluate("//div[contains(@id,'ddmDeliveryMessage')]");
        if (fastTrack) {
            let finalVal = '';
            let text = '';
            fastTrack.forEach(item => {
                text += ` ${item.text}`;
            });
            finalVal = clean(text.trim());
            addHiddenDiv('ii_fastTrack', clean(finalVal));
        }
        const variantInformation = await domEvaluate("//div[contains(@id,'variation')]//ul[contains(@class, 'swatch')]/li[contains(@class, 'swatchAvailable') or contains(@class, 'swatchUnavail') or contains(@class, 'swatchSelect')]//img/@alt | //div[@id='variation_style_name']/div[contains(@class,'a-row')] | //div[@id='variation_flavor_name']/div[contains(@class,'a-row')] | //div[@id='variation_size_name']/div[contains(@class,'a-row')] | //div[@id='variation_color_name']/div[contains(@class,'a-row')] | //div[@id='variation_item_package_quantity']/div[contains(@class,'a-row')] | //ul[contains(@class,'swatches')]/li//div[contains(@class,'twisterText')] | //div[contains(@id,'variation')]//select[contains(@name,'dropdown')]/option");
        if (variantInformation) {
            let text = [];
            variantInformation.forEach(item => {
                if (item.text.replace(/.*:(.*)/, '$1').trim()) {
                    text.push(`${item.text.replace(/.*:(.*)/, '$1').trim()}`);
                }
            });
            const value = new Set(text);
            text = Array.from(value);
            const finalVal = clean(text.join(' || '));
            addHiddenDiv('ii_variantInformation', clean(finalVal));
        }
        const specifications = await domEvaluate("//table[contains(@id, 'productDetails_techSpec')]/tbody/tr[text()] | //*[@class='secHeader']//*[contains(text(),'Additional')]/../following-sibling::*[1]//tbody/tr | //table[contains(@id,'product-specification-table')]//tr");
        if (specifications) {
            const text = [];
            specifications.forEach((item) => {
                text.push(item.text);
            });
            const finalVal = clean(text.join(' || '));
            addHiddenDiv('ii_specifications', clean(finalVal));
        }
        const variantAsins = await domEvaluate("//script[contains(., 'ImageBlockBTF')]/text() | //*[@id='twisterJsInitializer_feature_div']//script");
        const asin = await domEvaluate('(//*[@data-asin])[1]/@data-asin');
        const variants = await domEvaluate('//script[contains(., "ImageBlockBTF")]/text() | //*[@id="twisterJsInitializer_feature_div"]//script');
        if (variantAsins) {
            let asinLength = 1;
            let asinValArr = [];
            let finalVal = '';
            variantAsins.forEach(item => {
                const asinArr = item.text.match(/"asin":"(.*?)"/gmi);
                if (asinArr) {
                    const asins = asinArr.map(el => el.replace(/.*?:"?(.*)/, '$1').slice(0, -1));
                    asinValArr = asinValArr.concat(asins);
                } else if (asin) {
                    asinValArr.push(asin[0].text);
                }
            });
            const value = new Set(asinValArr);
            asinValArr = Array.from(value);
            if (asinValArr.length > 1) asinLength = asinValArr.length;
            finalVal = asinValArr.join(' | ');
            addHiddenDiv('ii_variantAsins', clean(finalVal));
            addHiddenDiv('ii_variantCount', clean(asinLength));
            if (variants && asinLength > 1 && variantAsins) {
                addHiddenDiv('ii_variants', clean(finalVal));
            }
        }
        const largeImageCount = await domEvaluate("//script[contains(., 'ImageBlockATF')]/text()");
        if (largeImageCount) {
            for (const item of largeImageCount) {
                const finalVal = item.text.match(/SL1500_.jpg/gm) ? item.text.match(/SL1500_.jpg/gm).length : 0;
                addHiddenDiv('ii_largeImageCount', clean(finalVal));
            }
        }
        const warnings = await domEvaluate("(//*[contains(@class, 'a-alert-heading') and contains(text(), 'WARNING')]/following-sibling::div[contains(@class, 'a-alert-content')])[1] | //div[contains(@id, 'important-information')]/div[contains(@class,'content')]/h4[contains(text(), 'Safety Information')]/../p[text()]/text()| //td[contains(text(),'Use By Recommendation')]/following-sibling::*[1] | //td[contains(text(),'Warning')]/following-sibling::*[1] | //div[contains(@id,'product-safety-warning_feature_div')]//div[@class='content'] | //tr//*[@class='warningAlertImageColumn']/following-sibling::td/span");
        if (warnings) {
            let val = '';
            for (const item of warnings) {
                val += item.text.replace(/\n/gm, '').replace(/\s{2,}/gm, ' ');
            }
            const finalVal = val.trim();
            addHiddenDiv('ii_warnings', (finalVal));
        }
        const brandText = await domEvaluate("//th[contains(text(),'Brand')]/following-sibling::*[1] | //*[@id='bylineInfo'] | //div[contains(@id, 'brandBar_feature_div')]");
        if (brandText) {
            for (const item of brandText) {
                const finalVal = item.text.replace('Brand: ', '');
                addHiddenDiv('ii_brandText', clean(finalVal));
            }
        }
        const productOtherInformation = await domEvaluate("//div[@id='aplus_feature_div' and(contains(.,'From'))]//p[contains(.,'') and not(img)]");
        if (productOtherInformation) {
            const text = [];
            productOtherInformation.forEach(item => {
                text.push(clean(item.text));
            });
            const finalVal = clean(text.join(' | '));
            addHiddenDiv('ii_productOtherInformation', clean(finalVal));
        }
        const weightGross = await domEvaluate("(//*[contains(text(), 'Shipping Weight')]/following-sibling::*[1]/text()[1] | //div[contains(@id, 'detail-bullets')]//div[contains(@class, 'content')]//ul/li/*[contains(text(), 'Shipping Weight')]/following-sibling::text()[1])[1] | //tr[contains(@class,'shipping-weight')][1]//td[2] | (//th[contains(text(), 'Product Dimensions')]/following-sibling::*[1]/text()[1] | //div[contains(@id, 'detail-bullets')]//div[contains(@class, 'content')]//ul/li/b[contains(text(), 'Product Dimensions')]/following-sibling::text()[1])[1] | //tr//td[contains(text(),'Product Dimensions')]/../td[2]| //*[contains(text(),'Package Dimensions')]/following-sibling::*[1] | //div[contains(@id, 'detailBullets_feature_div')]//li[contains(.,'Product Dimensions')]");
        if (weightGross) {
            for (const item of weightGross) {
                if (item.text.includes(' x ')) {
                    const finalVal = item.text.split(';') && item.text.split(';')[1] ? item.text.split(';')[1].trim() : '';
                    addHiddenDiv('ii_weightGross', clean(finalVal));
                }
            }
        }
        const shippingWeight = await domEvaluate("(//*[contains(text(), 'Shipping Weight')]/following-sibling::*[1]/text()[1] | //div[contains(@id, 'detail-bullets')]//div[contains(@class, 'content')]//ul/li/*[contains(text(), 'Shipping Weight')]/following-sibling::text()[1])[1] | (//th[contains(text(), 'Product Dimensions')]/following-sibling::*[1]/text()[1] | //div[contains(@id, 'detail-bullets')]//div[contains(@class, 'content')]//ul/li/b[contains(text(), 'Product Dimensions')]/following-sibling::text()[1])[1] | //tr//td[contains(text(),'Product Dimensions')]/../td[2]| //*[contains(text(),'Package Dimensions')]/following-sibling::*[1] | //div[contains(@id, 'detailBullets_feature_div')]//li[contains(.,'Product Dimensions')]");
        if (shippingWeight) {
            for (const item of shippingWeight) {
                if (item.text.includes(' x ')) {
                    const finalVal = item.text.split(';') && item.text.split(';')[1] ? item.text.split(';')[1].trim() : '';
                    addHiddenDiv('ii_shippingWeight', clean(finalVal));
                }
            }
        }
        const videos = await domEvaluate("//script[contains(text(), 'ImageBlockBTF')]/text()");
        if (videos && videos[0]) {
            // eslint-disable-next-line no-useless-escape
            const regex = /\"url\":\"([^"]+)/g;
            const rawArray = videos[0].text.toString().match(regex);
            const videosArr = [];
            let finalVal = '';
            if (rawArray) {
                rawArray.forEach(item => {
                    const regex2 = /(https.+mp4)/s;
                    videosArr.push(item.match(regex2)[0]);
                });
                finalVal = videosArr.join(' | ').trim().replace(/\| \|/g, '|');
            }
            addHiddenDiv('ii_videos', clean(finalVal));
        }
        const alternateImages = await domEvaluate("//script[contains(., 'ImageBlockATF')]/text()");
        if (alternateImages) {
            const val = [];
            alternateImages.forEach((item) => {
                if (item.text.replace(/\r\n|\n|\r/gm, '').match(/.*'colorImages': { 'initial':(.*)},'colorToAsin.*/)) {
                    // eslint-disable-next-line no-useless-escape
                    let data = item.text.replace(/\r\n|\n|\r/gm, '').match(/.*'colorImages': { 'initial':(.*)},'colorToAsin.*/) ? item.text.replace(/\r\n|\n|\r/gm, '').replace(/.*'colorImages': { 'initial':(.*)},'colorToAsin.*/, '$1').replace(/\"/gm, '"') : {};
                    // @ts-ignore
                    data = JSON.parse(data);
                    data.forEach((ele, index) => {
                        if (index !== 0 && ele.large) {
                            val.push(ele.large);
                            addHiddenDiv('ii_alternateImages', clean(ele.large));
                        }
                    });
                }
            });
            const finalVal = val.length;
            addHiddenDiv('ii_secondaryImageTotal', clean(finalVal));
        }
        const primeFlag = await domEvaluate("//a[@id='SSOFpopoverLink'] | //div[@id='merchant-info'] | //meta[contains(@content,'Prime')]/@content");
        if (primeFlag) {
            let value = '';
            primeFlag.forEach(item => {
                if (!item.text.includes('NO')) {
                    if (item.text.includes('sold by Amazon') && !value.includes('Yes - Shipped and Sold')) {
                        value += 'Yes - Shipped and Sold | ';
                    } else if (item.text.includes('Fulfilled by Amazon') && !value.includes('Yes - Fulfilled')) {
                        value += 'Yes - Fulfilled | ';
                    } else if (item.text.includes('Prime') && !value.includes('Prime')) {
                        value += 'Prime Pantry | ';
                    }
                }
            });
            let finalVal = '';
            if (value) {
                finalVal = value.slice(0, value.length - 3);
            } else {
                finalVal = 'NO';
            }
            addHiddenDiv('ii_primeFlag', clean(finalVal));
        }
        // @ts-ignore
        var CurrentSeller = document.querySelector('div[id="merchant-info"]') ? document.querySelector('div[id="merchant-info"]').innerText : '';
        // @ts-ignore
        var CurrentSellerPrice = document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']") ? document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']").innerText : '';
        // @ts-ignore
        var CurrentSellerShipping = document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';

        // @ts-ignore
        var CurrentSellerPrime = document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';

        if (CurrentSeller && CurrentSeller.search('sold by amazon') < 0 && CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)) {
            CurrentSeller = (CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[1]) ? CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[1] : CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[2];
            if (!CurrentSellerShipping) CurrentSellerShipping = '!0.00';
            if (CurrentSellerPrime.includes('Details')) {
                CurrentSellerPrime = 'YES';
            } else {
                CurrentSellerPrime = 'NO';
            }
            addHiddenDiv('ii_otherSellersName', CurrentSeller);
            addHiddenDiv('ii_otherSellersPrice', CurrentSellerPrice);
            addHiddenDiv('ii_otherSellersShipping', CurrentSellerShipping);
            addHiddenDiv('ii_otherSellersPrime', CurrentSellerPrime);
            console.log('CurrentSeller', CurrentSeller);
            console.log('CurrentSellerPrice', CurrentSellerPrice);
            console.log('CurrentSellerShipping', CurrentSellerShipping);
            console.log('CurrentSellerPrime', CurrentSellerPrime);
        }
        let manufacturerDescription = document.querySelector('.aplus-v2.desktop.celwidget');
        // @ts-ignore
        manufacturerDescription = manufacturerDescription !== null ? manufacturerDescription.innerText : '';
        addHiddenDiv('ii_manufacturerDescription', manufacturerDescription);
        const manufacturerDescriptionNode = await domEvaluate("//div[@id='productDescription']/h3[contains(text(), 'Manufacturer')]//following-sibling::*[1] | //div[@id='ii_manufacturerDescription']");
        if (manufacturerDescriptionNode) {
            let finalVal = '';
            manufacturerDescriptionNode.forEach(item => {
                item.text = `${item.text.replace(/<[^>]*>/gm, '').replace(/\s{2,}|\n|\t|\r/g, ' ').replace(/Read more/gm, '').trim()}`;
                finalVal = clean(item.text);
            });
            addHiddenDiv('ii_manufacturerDescriptionNode', clean(finalVal));
        }
        const manufacturerImages = await domEvaluate('//div[@cel_widget_id="aplus"]//img/@src');
        if (manufacturerImages) {
            const text = [];
            let finalVal = '';
            manufacturerImages.forEach(item => {
                if (!item.text.includes('grey-pixel.gif')) {
                    text.push(`${item.text}`);
                }
            });
            finalVal = clean(text.join(' | '));
            addHiddenDiv('ii_manufacturerImages', clean(finalVal));
        }
        var xPathRes = document.evaluate("//td[contains(text(), 'Hersteller')]/following-sibling::*[1] | //th[contains(text(), 'Manufacturer')]/following-sibling::*[1] | //td[contains(text(),'Manufacturer')]/following-sibling::*[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (!xPathRes.singleNodeValue) {
            const manufacturerName = document.querySelector("meta[name='keywords']").getAttribute('content');
            if (manufacturerName && manufacturerName.split(',').length > 1) {
                const arr = manufacturerName.split(',');
                const val = arr[arr.length - 2].slice(0, 1).toUpperCase() + arr[arr.length - 2].slice(1);
                addHiddenDiv('ii_manufacturerName', val);
            }
        }
        const otherSellerNew = (document.querySelector("span[data-action='show-all-offers-display'] > a")) ? document.querySelector("span[data-action='show-all-offers-display'] > a").getAttribute('href') : '';
        if (otherSellerNew) {
            const otherSellersHtml = await fetch(otherSellerNew, {
                headers: {
                    cookie: document.cookie,
                },
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
            }).then(res => res.text());
            // console.log('otherSellersHtml', otherSellersHtml);
            const domParser = new DOMParser();
            const otherSellersDocument = domParser.parseFromString(otherSellersHtml, 'text/html');
            const pageNotFound = document.evaluate('//title[contains(text(),"Page Not Found")]', otherSellersDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (!pageNotFound) {
                getLbb(otherSellersDocument);
                getOtherSellersInfo(otherSellersDocument, 'h3.olpSellerName span , h3.olpSellerName img', 'div.olpOffer span.olpOfferPrice', 'div.olpOffer', 'div.olpOffer .olpShippingInfo');
            } else {
                getOtherSellersInfo('', '#mbc span.mbcMerchantName, #ii_otherSellersName', 'div[id*="mbc"] span[id*="mbc-price"], #ii_otherSellersPrice', "span[id*='mbc-shipping'], #ii_otherSellersPrime", 'div[id*="mbc"] span[id*="mbc-shipping"], #ii_otherSellersShipping');
            }
        } else {
            getOtherSellersInfo('', '#mbc span.mbcMerchantName, #ii_otherSellersName', 'div[id*="mbc"] span[id*="mbc-price"], #ii_otherSellersPrice', "span[id*='mbc-shipping'], #ii_otherSellersPrime", 'div[id*="mbc"] span[id*="mbc-shipping"], #ii_otherSellersShipping');
        }

        function getOtherSellersInfo(otherSellersDocument, sellerNamSelector, sellerPricesSelector, sellerPrimeSelector, sellerShippingSelector) {
            const samePageFlag = !otherSellersDocument ? 1 : 0;
            otherSellersDocument = otherSellersDocument || document;
            const otherSellersName = otherSellersDocument.querySelectorAll(sellerNamSelector);
            const sellerNames = [];
            otherSellersName && otherSellersName.forEach(name => {
                if (name.tagName === 'IMG') {
                    sellerNames.push(name.alt);
                } else {
                    sellerNames.push(name.innerText.trim());
                }
            });
            sellerNames && addHiddenDiv('pd_otherSellerName', sellerNames.join('|'));
            console.log('sellerNames', sellerNames);
            const sellerPrices = [];
            const otherSellersPrice = otherSellersDocument.querySelectorAll(sellerPricesSelector);
            otherSellersPrice && otherSellersPrice.forEach(price => {
                if (price.innerText) {
                    sellerPrices.push(price.innerText.trim());
                    addHiddenDiv('pd_otherSellersPrice', price.innerText.trim());
                }
            });
            // sellerPrices && addHiddenDiv('pd_otherSellersPrice', sellerPrices.join('|'));
            console.log('sellerPrices', sellerPrices);
            const sellerPrime = [];
            const otherSellersPrime = otherSellersDocument.querySelectorAll(sellerPrimeSelector);
            otherSellersPrime && otherSellersPrime.forEach(prime => {
                if (prime.innerText.includes('Details') && samePageFlag) {
                    sellerPrime.push('Yes');
                } else if (prime.querySelector('i.a-icon-prime')) {
                    sellerPrime.push('Yes');
                } else {
                    sellerPrime.push('No');
                }
            });
            sellerPrime && addHiddenDiv('pd_otherSellersPrime', sellerPrime.join('|'));
            console.log('sellerPrime', sellerPrime);
            const sellerShipping = [];
            const otherSellersShipping2 = otherSellersDocument.querySelectorAll(sellerShippingSelector);
            otherSellersShipping2 && otherSellersShipping2.forEach(shipping => {
                shipping = shipping ? shipping.innerText.toLowerCase() : '';
                if (shipping && shipping.includes('free')) {
                    sellerShipping.push('0.00');
                } else if (shipping && shipping.match(/.([\d]+(?:.[\d]+)?)/)) {
                    sellerShipping.push(shipping.match(/.([\d]+(?:.[\d]+)?)/)[1]);
                }
            });
            while (sellerShipping.length !== sellerNames.length) {
                sellerShipping.push('0.00');
            }
            sellerShipping && addHiddenDiv('pd_otherSellersShipping2', sellerShipping.join('|'));
            console.log('sellerShipping', sellerShipping);
        }
        // @ts-ignore
        async function getLbb(otherSellersDocument) {
            const button = await buttonCheck();
            const otherSellersDiv = "div#olpOfferList div[class*='olpOffer']";
            console.log('##############################', button);
            if (button !== 'false' && otherSellersDocument.querySelector(otherSellersDiv)) {
                console.log('trying button', button);
                const firstCheck = (document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div')) ? document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div') : '';
                const otherSellers = (otherSellersDocument.querySelectorAll(otherSellersDiv)) ? otherSellersDocument.querySelectorAll(otherSellersDiv) : '';
                const price = (document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']")) ? document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']") : '';
                console.log('Sold by box, otherSellers, Actual-price', firstCheck, otherSellers, price);
                if (firstCheck && price) {
                    // @ts-ignore
                    const priceText = parseFloat((price.innerText).slice(1));
                    // @ts-ignore
                    if (!(firstCheck.innerText.toLowerCase().includes('sold by amazon')) && otherSellers) {
                        otherSellers.forEach((seller) => {
                            // @ts-ignore
                            const sellerPrice = (seller.querySelector('span.olpOfferPrice')) ? seller.querySelector('span.olpOfferPrice').innerText.trim() : '';
                            const priceNum = parseFloat(sellerPrice.slice(1));
                            const soldBy = (seller.querySelector('h3.olpSellerName span , h3.olpSellerName img')) ? seller.querySelector('h3.olpSellerName span , h3.olpSellerName img') : '';
                            let sellerNames;
                            if (soldBy.tagName === 'IMG') {
                                sellerNames = (soldBy.alt);
                            } else {
                                sellerNames = (soldBy.innerText.trim());
                            }
                            console.log('Name of seller', sellerNames, priceNum, priceText);
                            // @ts-ignore
                            if (sellerNames.toLowerCase().includes('amazon.co.uk') && priceNum >= priceText) {
                                addHiddenDiv('ii_lbb', 'YES');
                                addHiddenDiv('ii_lbbPrice', `${priceNum}`);
                            }
                        });
                    }
                }
            }
        }
        async function domEvaluate(xpath, field) {
            const node = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
            let nodeVal = node.iterateNext();
            const val = [];
            while (nodeVal) {
                if (field) {
                    // @ts-ignore
                    val.push({ text: nodeVal.innerText });
                } else {
                    // @ts-ignore
                    val.push({ text: nodeVal.textContent });
                }
                nodeVal = node.iterateNext();
            };
            return val;
        }
        // @ts-ignore
    }, inputs);
    return await context.extract(productDetails, { transform });
}