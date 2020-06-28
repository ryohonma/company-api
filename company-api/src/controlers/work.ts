import express from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

router.get('/', async (req:express.Request, res:express.Response) => { 
  const browser = await puppeteer.launch({
    args: ['--disable-dev-shm-usage'],
    headless: false 
  }); 

  const url = 'http://www.honsha.fsi.co.jp';
  console.log(url);

  //　タブの生成
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' }); 

  // タブを移動
  const pages = await browser.pages();
  const detailPage = pages[1]
  await detailPage.bringToFront();

  return res.status(200).json({result:0});
});

router.post('/', async (req:express.Request, res:express.Response) => { 
  // ここでpuppeterrのpostを呼び出す
    return res.status(200).json({result:0});
});

export default router;
