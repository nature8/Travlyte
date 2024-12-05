// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck

// import { Browser, Page } from "puppeteer";

// export const startHotelScraping = async (
//   page: Page,
//   browser: Browser,
//   location: string
// ) => {
//   await page.setViewport({ width: 1920, height: 1080 });
//   console.log("Page Viewport set.");
//   await page.waitForSelector(".NhpT-mod-radius-base");
//   console.log("Wait for selector complete.");
//   await page.type(".NhpT-mod-radius-base:nth-child(2)", location);
//   console.log("Page location typing complete.");
//   const liSelector = "ul.EMAt li:first-child";
//   await page.waitForSelector(liSelector);
//   console.log("Page li selector complete.");
//   await page.click(liSelector);
//   console.log("Page li click complete.");
//   const buttonSelector = "#main-search-form button[type='submit']";
//   await page.waitForSelector(buttonSelector);
//   console.log("Page button selector complete.");

//   const [target] = await Promise.all([
//     new Promise((resolve) => browser.once("targetcreated", resolve)),
//     await page.click(buttonSelector),
//   ]);

//   const newPage = await target.page();
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   console.log("Timeout Complete. [New Page Open]");

//   await newPage.bringToFront();
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   console.log("Timeout Complete. [Bring to Front]");

//   // const client = await page.createCDPSession();
//   // console.log('Waiting captcha to solve...');
//   // const { status } = await client.send('Captcha.waitForSolve', {
//   //     detectTimeout: 10000,
//   // });
//   // console.log('Captcha solve status:', status);
//   //   await newPage.bringToFront();
//   console.log("Starting Page Evalution");
//   await new Promise((resolve) => setTimeout(resolve, 30000));

//   return await newPage.evaluate(() => {
//     // Your scraping logic goes here
//     const hotels = [];
//     const selectors = document.querySelectorAll(".yuAt");
//     selectors.forEach((selector) => {
//       const title = selector.querySelector(".IirT-header")?.innerText;

//       const price = parseInt(
//         (selector.querySelector(".D8J--price-container span")?.innerText || "")
//           .replace(/[^\d]/g, "")
//           .trim(),
//         10
//       );

//       const photo = selector.querySelector(".e9fk-photoWrap img")?.src;
//       if (title && price && photo) hotels.push({ title, price, photo });
//     });

//     return hotels;
//   });
// };


/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// src/server/hotelScraping.ts (or similar location)

import { Browser, Page } from "puppeteer";

export const startHotelScraping = async (
  page: Page,
  browser: Browser,
  location: string
) => {
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    console.log("Page viewport set.");

    await page.waitForSelector(".NhpT-mod-radius-base", { visible: true });
    console.log("Selector for location input found.");

    await page.type(".NhpT-mod-radius-base:nth-child(2)", location);
    console.log("Location typed into input.");

    const liSelector = "ul.EMAt li:first-child";
    await page.waitForSelector(liSelector, { visible: true });
    console.log("Location suggestion found.");

    await page.click(liSelector);
    console.log("Location suggestion clicked.");

    const buttonSelector = "#main-search-form button[type='submit']";
    await page.waitForSelector(buttonSelector, { visible: true });
    console.log("Search button found.");

    const [target] = await Promise.all([
      new Promise((resolve) => browser.once("targetcreated", resolve)),
      page.click(buttonSelector),
    ]);

    const newPage = await target.page();
    await newPage.bringToFront();
    await newPage.waitForTimeout(3000);
    console.log("New page loaded and brought to front.");

    await newPage.waitForSelector(".yuAt", { timeout: 60000 });
    console.log("Hotel elements loaded on new page.");

    const hotels = await newPage.evaluate(() => {
      const hotels: { title: string; price: number; photo: string }[] = [];
      const selectors = document.querySelectorAll(".yuAt");

      selectors.forEach((selector) => {
        const title = selector.querySelector(".IirT-header")?.innerText?.trim() || "No Title";
        const priceText = selector.querySelector(".D8J--price-container span")?.innerText?.trim() || "0";
        const price = parseInt(priceText.replace(/[^\d]/g, ""), 10);
        const photo = selector.querySelector(".e9fk-photoWrap img")?.src || "No Photo";

        if (title !== "No Title" && price > 0 && photo !== "No Photo") {
          hotels.push({ title, price, photo });
        }
      });

      return hotels;
    });

    console.log(`Scraped ${hotels.length} hotels.`);
    return hotels;
  } catch (error) {
    console.error("Error during hotel scraping:", error);
    await page.screenshot({ path: 'error_screenshot.png', fullPage: true });
    return [];
  }
};
