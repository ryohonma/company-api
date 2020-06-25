const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');
const e = require('express');

const setting = {
  domain: true, // ドメインの外からアクセス
  user: '',     // ドメインの外からアクセスするときのユーザー名
  pass: '',     // ↑のパスワード
};

(async () => {
  console.log('start -- ' + new Date());
  const browser = await puppeteer.launch({ headless: false});
  let url = setting.domain ? 'http://jinkyuwap.fsi.local/cws/cws'
    : 'http://www.honsha.fsi.co.jp';

  //　タブの生成
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // タブを移動
  const pages = await browser.pages();
  const detailPage = pages[1]
  await detailPage.bringToFront();

  if (!setting.domain) {
    // ログイン
    await page.$eval('input[id="legacy_xoopsform_block_uname"]', el => el.value = setting.user);
    await page.$eval('input[id="legacy_xoopsform_block_pass"]', el => el.value = setting.pass);

    // click wait
    await page.click('input[type="image"]')

    // move to company
    await page.waitFor('img[id="img0201"]', { timeout: 5000 });
    await page.goto('https://www.honsha.fsi.co.jp/cws/cws', { waitUntil: 'domcontentloaded' });
  }

  // move to list
  await page.waitFor('div[id="cwsheader"]', { timeout: 5000 });

  const mon = 6;
  const year = 2020;
  //"工数情報　照会"サイト移動
  if (setting.domain) {
    await page.goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.project.project_workplan&@SN=root.cws.shuro.personal.project.project_workplan&@FN=FORM_PROJECT_REF&@ACTION_LOG_TXT=%E5%AE%9F%E7%B8%BE%E5%B7%A5%E6%95%B0%E7%85%A7%E4%BC%9A%EF%BC%88%E5%80%8B%E4%BA%BA%EF%BC%89', { waitUntil: 'domcontentloaded' });
  } else {
    await page.goto('https://www.honsha.fsi.co.jp/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.project.project_workplan&@SN=root.cws.shuro.personal.project.project_workplan&@FN=FORM_PROJECT_REF&@ACTION_LOG_TXT=%E5%AE%9F%E7%B8%BE%E5%B7%A5%E6%95%B0%E7%85%A7%E4%BC%9A%EF%BC%88%E5%80%8B%E4%BA%BA%EF%BC%89', { waitUntil: 'domcontentloaded' });
  }
  var selector = await page.$$("table .collect .collect");//工数番号の種類数


  //工数取得
  var resultSelector = await page.$("table .collect");
  var resultDay = await page.evaluateHandle(el => el.previousElementSibling, resultSelector);
  var days = await resultDay.$$eval(".b", list => {
    return list.map(day => day.textContent.slice(1));
  });
  var worklist = days.map(d => { return {days:d,works:[]};});
  for (var i = 0; i < selector.length; i++) {
    var koubann = await resultSelector.$eval(".collect", list => {
      return list.textContent.slice(4,13)
    });
    resultSelector = await page.evaluateHandle(el => el.nextElementSibling, resultSelector);
    var datas = await resultSelector.$$eval(".b", list => {
      return list.map(datas => datas.textContent);
    });
    resultSelector = await page.evaluateHandle(el => el.nextElementSibling, resultSelector);

    for (j = 0; j < datas.length; j++) {
      if (datas[j] !== '') {
        worklist[j].works.push({ code: `${koubann}`, time: `${datas[j]}` });
      }
    }
  }
  //不要な配列の削除
  worklist = worklist.filter(e => { return e.works!="";  });

  var list = [];

  for (var i = 0; i < worklist.length; i++) {
    if (setting.domain) {
      await page.goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.term_kinmu_input&@SN=root.cws.shuro.personal.term_kinmu_input&@FN=form_shuro&@ACTION_LOG_TXT=%E5%8B%A4%E6%80%A0%E5%AE%9F%E7%B8%BE%E3%80%80%E5%85%A5%E5%8A%9B%3Cbr%3E%3Cbr%3E', { waitUntil: 'domcontentloaded' });
    } else {
      await page.goto('https://www.honsha.fsi.co.jp/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.term_kinmu_input&@SN=root.cws.shuro.personal.term_kinmu_input&@FN=form_shuro&@ACTION_LOG_TXT=%E5%8B%A4%E6%80%A0%E5%AE%9F%E7%B8%BE%E3%80%80%E5%85%A5%E5%8A%9B%3Cbr%3E%3Cbr%3E', { waitUntil: 'domcontentloaded' });
    }
   
    //勤務時間取り出す
    await page.waitFor(`#K${year}_${mon}_${worklist[i].days}0STH`, el => {return el.textContent}, {timeout: 5000});
    var sH = await page.$eval(`#K${year}_${mon}_${worklist[i].days}0STH`, el => {return el.textContent});
    var sM = await page.$eval(`#K${year}_${mon}_${worklist[i].days}0STM`, el => {return el.textContent});
    var eH = await page.$eval(`#K${year}_${mon}_${worklist[i].days}0ETH`, el => {return el.textContent});
    var eM = await page.$eval(`#K${year}_${mon}_${worklist[i].days}0ETM`, el => {return el.textContent});

    //期待値として編集
    list.push({ day: `${worklist[i].days}`, start: `${sH}:${sM}`, end: `${eH}:${eM}`, works: `${worklist[i].works}`,/* zaitaku: zaitaku:*/ });
  }

  await browser.close();
  console.log('end --' + new Date());
})();

