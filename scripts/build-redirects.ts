import {XMLParser} from 'fast-xml-parser';
import {prop, unique} from 'ts-functional';
import { Index } from 'ts-functional/dist/types';

interface ISiteMap {
    urlset: {
        url: Array<{
            loc: string;
            lastmod: string;
            changefreq: string;
            priority: number;
        }>;
    }
}

type Category = Index<string |Category>;

const buildRedirects = async () => {
    // Load the sitemap
    const siteMap = await fetch("https://www.evilinnocence.com/shop/sitemap.xml");
    const siteMapText = await siteMap.text();

    // Extract the urls
    const data:ISiteMap = new XMLParser().parse(siteMapText);
    const urls = data.urlset.url.map(prop("loc"));

    // Remove the protocol and host from the urls
    const relativeUrls = urls.map(url => url.replace("http://www.evilinnocence.com/shop/", ""));

    // Match and remove all of the product pages:  <url>.html
    const productUrls = relativeUrls
        .filter(url => !url.includes("/"))
        .map(url => url.replace(".html", ""));
    const categories = relativeUrls.filter(url => url.includes("/"));

    const terms = categories.reduce((acc:string[], category:string) => {
        const parts = category.split("/").map(url => url.replace(".html", ""));
        return unique([...acc, ...parts]);
    }, []);



    console.log(`Product Pages: ${productUrls.length}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Terms: ${terms.length}`);
    console.log(terms);
}

buildRedirects();