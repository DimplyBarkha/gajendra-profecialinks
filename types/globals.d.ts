/**
  * Options structure
export {
  *   "type": "RECAPTCHA" || "FUNCAPTCHA" || "IMAGECAPTCHA", // Defines which type of captcha are we trying to solve.
  *   "inputElement": "<CSS_SELECTOR>", // If type is "RECAPTCHA" or "FUNCAPTCHA", this is a css selector for main HTML element containing those captchas
  *   Else for "IMAGECAPTCHA" this is a css selector to the textbox where captcha answer should be provided.
  *   "imageElement": "<CSS_SELECTOR>", // Required only if type is "IMAGECAPTCHA", it should contain css selector to the image element that contains the actual captcha.
  * }
  */
export interface ISolveCaptchaOptions {
    type: 'RECAPTCHA' | 'FUNCAPTCHA' | 'IMAGECAPTCHA';
    inputElement?: string;
    imageElement?: string;
}
/**
 * All header names are lower-case.
 */
export declare type IHeaders = Record<string, string[]>;
export declare enum MergeType {
    APPEND = "APPEND",
    MERGE_ROWS = "MERGE_ROWS"
}
export interface IMergeOptions {
    type?: MergeType;
    transform?: (data: Group[]) => Group[];
}
export interface Group {
    rows?: number;
    url?: string;
    timestamp?: string;
    xpath?: string;
    group: Record<string, any[]>[];
    htmlExtraction?: string;
}
export interface IExtractionPoint {
    mergeOptions?: IMergeOptions;
    extractionConfig: string;
    data: Group[];
    url: string;
    timestamp: string;
}
export interface IResponse {
    headers: IHeaders;
    status: number;
    /**
     * 200-299 status
     */
    ok: boolean;
    url: string;
}
export declare type Button = 'left';
export interface ICookie {
    name: string;
    value: string;
    domain: string;
    hostOnly: boolean;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    session: boolean;
}
export interface ICookieDef {
    name: string;
    url?: string;
    domain?: string;
    path?: string;
}
export interface JsonMap {
    [member: string]: string | number | boolean | null | JsonArray | JsonMap;
}
export declare type JsonArray = Array<string | number | boolean | null | JsonArray | JsonMap>;
export declare type Json = JsonMap | JsonArray | string | number | boolean | null;
export interface ITimeoutable {
    timeout?: number;
}
export interface IWaitOptions extends ITimeoutable {
    waitUntil?: 'load' | 'networkidle0';
}
export interface IGoToOptions extends IWaitOptions {
    method?: 'GET' | 'POST';
    referer?: string;
    checkBlocked?: boolean;
    captureRequests?: boolean;
}
export declare type ScreenshotType = 'jpeg' | 'png' | 'pdf';
export interface IContext {
    /**
     * Function that starts capturing Network Requests happening in the background while the browser is loading the page.
     * This function is required to be called if you want to use searchForRequest function.
     */
    captureRequests(): Promise<void>;
    /**
     * This method fetches an element with selector, scrolls it into view if needed, and then uses page.mouse to click in the center of the element. If there's no element matching selector, the method throws an error.
     *
     * Bear in mind that if click() triggers a navigation event and there's a separate page.waitForNavigation() promise to be resolved, you may end up with a race condition that yields unexpected results. The correct pattern for click and wait for navigation is the following:
     *
     * ```javascript
     * const [response] = await Promise.all([
     *   context.waitForNavigation(waitOptions),
     *   context.click(selector, clickOptions),
     * ]);
     * ```
     */
    click(selector: string, options?: {}): Promise<void>;
    clickAndWaitForNavigation(selector: string, clickOptions?: {}, navigationOptions?: IWaitOptions): Promise<void>;
    /**
     * Gets the full HTML contents of the page, may include the doctype.
     */
    content(): Promise<string>;
    /**
     * Stop the page (window.stop)
     */
    stop(): Promise<void>;
    /**
     * Returns all cookies the current page
     */
    cookies(): Promise<ICookie[]>;
    /**
     * Wait for a subtree modification
     */
    waitForMutuation(selector: string, options: ITimeoutable): Promise<void>;
    /**
     * Delete some cookies
     */
    /**
     * Change the timezone of the page
     */
    /**
     * If the function passed to evaluate returns a Promise, then evaluate would wait for the promise to resolve and return its value.
     */
    evaluate(pageFunction: Function | string, ...args: Json[]): Promise<Json>;
    /**
     * Get data from fetch request to be extracted from (will be placed into an array and then written out)
     */
    /**
     * Will throw an error if the selector does not exist.
     */
    /**
     * Load a URL
     */
    goto(url: string, options?: IGoToOptions): Promise<IResponse>;
    /**
     * Report if the extractor got blocked on the target site.
     * When the target site starts blocking connections, or throwing captchas, and there is no way to bypass it, extractor should report that it got blocked.
     * That way the system will know that the proxy used in this connection should be taken out of rotation for the particular domain,
     * and that this extractor should get a new proxy information on the next attempt.
     */
    reportBlocked(code: number, details?: string): Promise<any>;
    /**
     * Hover over an element
     */
    /**
     * Take a screenshot.
     *
     * Use this sparingly, or consdier if you need it at all.
     */
    screenshot(options?: {
        type?: ScreenshotType;
        fullPage?: boolean;
    }): Promise<void>;
    /**
     * Searches for a Network Request that was performed on the website, and allows gathering details of that request. Requires captureRequests to be called or used during goto
     */
    searchForRequest(urlPattern: string, method: string, pastTimestamp: number, timeout: number): Promise<any>;
    /**
     * Set `select` element values
     */
    select(selector: string, ...values: string[]): Promise<void>;
    /**
     *
     * @param html
     */
    /**
     * Must be set before calling goto
     */
    setUserAgent(ua: string): Promise<void>;
    /**
     * Must be set before calling goto
     */
    setBypassCSP(enabled: boolean): Promise<void>;
    /**
     * Must be set before calling goto
     */
    setExtraHTTPHeaders(headers: Record<string, string>): Promise<void>;
    /**
     * Must be set before calling goto
     */
    setJavaScriptEnabled(enabled: boolean): Promise<void>;
    /**
     * Must be set before calling goto.
     * Default false.
     */
    setLoadImages(enabled: boolean): Promise<void>;
    /**
     * Must be set before calling goto.
     * Default false.
     */
    setLoadAllResources(enabled: boolean): Promise<void>;
    /**
     * Must be set before calling goto
     */
    setViewPort(viewport: {
        width: number;
        height: number;
    }): Promise<void>;
    /**
     * Block advertisments and trackers
     *
     * Must be set before calling goto.
     */
    setBlockAds(enabled: boolean): Promise<void>;
    /**
     * Set the value of an `input` element
     */
    setInputValue(selector: string, value: string): Promise<void>;
    /**
     * Function allowing solving Captchas found on the page. It takes an options argument that defines an element on the page that contains the Captcha, and the type of Captcha it is.
     */
    solveCaptcha(options: ISolveCaptchaOptions): Promise<any>;
    waitForSelector(selector: string, options?: ITimeoutable): Promise<void>;
    waitForFunction(predicate: string | Function, options?: ITimeoutable, ...args: Json[]): Promise<void>;
    /**
     * This will return a promise of a promise when the hook is in place to detect the page change
     */
    waitForNavigation(options?: IWaitOptions): Promise<() => Promise<void>>;
    waitForXPath(xpath: string, options?: ITimeoutable): Promise<void>;
    /**
     * Carry out an extraction, and merge with the data that should be returned
     */
    extract(id: string, mergeOptions?: IMergeOptions): Promise<any>;
}
export interface Action {
    (input: Record<string, any>): Promise<any>;
}
export as namespace ImportIO
