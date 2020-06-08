const puppeteer = require('puppeteer');

const setting = {
  sleep: 200,
  next: false,  // 前の月に翌月の勤怠をいれるときtrue 
  domain: true, // ドメインの外からアクセス
  user: '',     // ドメインの外からアクセスするときのユーザー名
  pass: '',     // ↑のパスワード
};

(async () => {
  console.log('start -- ' +  new Date());
  const browser = await puppeteer.launch({ headless: true });
  let url = setting.domain ? 'http://jinkyuwap.fsi.local/cws/cws'
                           : 'http://www.honsha.fsi.co.jp';

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' }); 

  // タブを移動
  const pages = await browser.pages();
  const detailPage = pages[1];
  await detailPage.bringToFront();

  if (!setting.domain) {
    // ログイン
    await page.$eval('input[id="legacy_xoopsform_block_uname"]', el => el.value = setting.user);
    await page.$eval('input[id="legacy_xoopsform_block_pass"]' , el => el.value = setting.pass);

    // click wait
    await page.click('input[type="image"]')

    // move to company
    await page.waitFor('img[id="img0201"]', {timeout: 5000});
    await page.goto('https://www.honsha.fsi.co.jp/cws/cws', { waitUntil: 'domcontentloaded' }); 
  }

  // move to list
  await page.waitFor('div[id="cwsheader"]', {timeout: 5000});

  if (setting.domain) {
    await page.goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.term_kinmu_input&@SN=root.cws.shuro.personal.term_kinmu_input&@FN=form_shuro&@ACTION_LOG_TXT=%E5%8B%A4%E6%80%A0%E5%AE%9F%E7%B8%BE%E3%80%80%E5%85%A5%E5%8A%9B%3Cbr%3E%3Cbr%3E', { waitUntil: 'domcontentloaded' }); 
  } else {
    await page.goto('https://www.honsha.fsi.co.jp/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.term_kinmu_input&@SN=root.cws.shuro.personal.term_kinmu_input&@FN=form_shuro&@ACTION_LOG_TXT=%E5%8B%A4%E6%80%A0%E5%AE%9F%E7%B8%BE%E3%80%80%E5%85%A5%E5%8A%9B%3Cbr%3E%3Cbr%3E', { waitUntil: 'domcontentloaded' }); 
  }

  // move to next (翌月の勤怠をいれるときは↓のコメントアウトを解除する)
  // await page.waitFor('a[id="TONXTTM"]', {timeout: 5000});
  // await page.click('a[id="TONXTTM"]')

  const mon = 6;
  const year = 2020;
  const list = [
   /*月*/ {day: 1 , start:'8:30', end:'19:00', works: [{code:'PGK801', time:'9:30'}]},
//    /*火*/ {day: 2 , start:'9:00', end:'18:00', works: [{code:'PGKC01', time:'8:00'}]},
//    /*水*/ {day: 3 , start:'9:00', end:'18:00', works: [{code:'PGZC01', time:'7:00'}, {code: 'PGJS01', time:'1:00'}]},
//    /*木*/ {day: 4 , start:'9:00', end:'18:00', works: [{code:'PLAB01', time:'7:00'}, {code: 'GL8L04', time:'1:00'}]},
//    /*金*/ {day: 5 , start:'9:00', end:'18:00', works: [{code:'PGRK01', time:'8:00'}]},
//    /*月*/ {day: 8 , start:'9:00', end:'18:00', works: [{code:'PGRK01', time:'8:00'}]},
//    /*火*/ {day: 9 , start:'9:00', end:'18:00', works: [{code:'PGRK01', time:'8:00'}]},
//    /*水*/ {day: 10, start:'9:00', end:'18:00', works: [{code:'PGRK01', time:'8:00'}]},
//    /*木*/ {day: 11, start:'9:00', end:'18:00', works: [{code:'PGRK01', time:'7:00'}, {code: 'GL8L04', time:'1:00'}]},
//    /*金*/ {day: 12, start:'9:00', end:'18:00', works: [{code:'PGRK01', time:'8:00'}]},
//    /*月*/ {day: 15, start:'9:00', end:'18:00', works: [{code:'PGSD01', time:'8:00'}]},
//    /*火*/ {day: 16, start:'9:00', end:'18:00', works: [{code:'PGSD01', time:'8:00'}]},
//    /*水*/ {day: 17, start:'9:00', end:'18:00', works: [{code:'PGSD01', time:'8:00'}]},
//    /*木*/ {day: 18, start:'9:00', end:'18:00', works: [{code:'PGSD01', time:'7:00'}, {code: 'GL8L04', time:'1:00'}]},
//    /*金*/ {day: 19, start:'9:00', end:'18:00', works: [{code:'PGSD01', time:'8:00'}]},
//    /*月*/ {day: 22, start:'9:00', end:'18:00', works: [{code:'PGSD01', time:'8:00'}]},
//    /*火*/ {day: 23, start:'9:00', end:'18:00', works: [{code:'PGYU01', time:'8:00'}]},
//    /*水*/ {day: 24, start:'9:00', end:'18:00', works: [{code:'PGYU01', time:'8:00'}]},
//    /*木*/ {day: 25, start:'9:00', end:'18:00', works: [{code:'PGYU01', time:'7:00'}, {code: 'GL8L04', time:'1:00'}]},
//    /*金*/ {day: 26, start:'9:00', end:'18:00', works: [{code:'PGYU01', time:'8:00'}]},
//    /*月*/ {day: 29, start:'9:00', end:'18:00', works: [{code:'PGYU01', time:'8:00'}]},
//    /*火*/ {day: 30, start:'9:00', end:'18:00', works: [{code:'PGYU01', time:'8:00'}]}
      ];

  for (var i=0; i<list.length; i++) {
    console.log(`input to ${year}-${mon}-${list[i].day}`);
    // 詳細
    await page.waitFor(`input[id="BTNDTL${year}_${mon}_${list[i].day}0"]`, {timeout: 5000});
    await page.click(`input[id="BTNDTL${year}_${mon}_${list[i].day}0"]`)

    // 時刻を入力
    const sH = list[i].start.split(':')[0];
    const sM = list[i].start.split(':')[1];
    const eH = list[i].end.split(':')[0];
    const eM = list[i].end.split(':')[1];
    await page.waitFor('input[id="KNMTMRNGSTH"]', {timeout: 5000});
    await page.$eval('input[id="KNMTMRNGSTH"]', (el, val) => el.value = val, sH);
    await page.$eval('input[id="KNMTMRNGSTM"]', (el, val) => el.value = val, sM);
    await page.$eval('input[id="KNMTMRNGETH"]', (el, val) => el.value = val, eH);
    await page.$eval('input[id="KNMTMRNGETM"]', (el, val) => el.value = val, eM);

    // 既存の工数をクリアする
    const deleteFunction = async () => {
      let deleteSelecter = await page.$$('span[class="PmEventSpan"]');
      for (let delidx = 0; delidx < deleteSelecter.length; delidx++) {
        const text = await (await deleteSelecter[delidx].getProperty('textContent')).jsonValue();
        if(text.match(/削除/)){
          await page.evaluate((del) => del.click(), deleteSelecter[delidx]);
          // await deleteSelecter[delidx].click();
          await page.waitFor(setting.sleep);
          await deleteFunction();
          break;
        }
      }
    };
    await deleteFunction();

    // 工数を入力
    for (var workidx=0; workidx<list[i].works.length; workidx++) {
      let work = list[i].works[workidx];
      // 登録番号を検索
      await page.$eval('input[id="COLLECT_ID_PRJ_CD_WIDGET_KEY"]', (el,val) => el.value = val, work.code);
      await page.waitFor(setting.sleep);
      await page.click('input[value="検索実行"]');

      // 検索したものチェック
      await page.waitFor('input[id="SEARCHED_LIST_WIDGET_KEY_0"]', {timeout: 5000});
      let checkbox = await page.$('input[id="SEARCHED_LIST_WIDGET_KEY_0"]');
      await page.evaluate((cb) => cb.click(), checkbox);

      // add
      await page.click('input[value="↓編集欄に追加する"]');

      // input Time 
      const h = work.time.split(':')[0];
      const m = work.time.split(':')[1];
      await page.waitFor(`input[id="PmDdEntryTimeInputWidget_${workidx}H`, {timeout: 5000});
      await page.$eval(`input[id="PmDdEntryTimeInputWidget_${workidx}H"]`, (el,val) => el.value = val, h);
      await page.$eval(`input[id="PmDdEntryTimeInputWidget_${workidx}M"]`, (el,val) => el.value = val, m);
    }
    
     //在宅勤務実施
     if(list[i].zaitaku == true){
      await page.select('select[name="GI_COMBOBOX13_Seq0S"]','2',{timeout: 5000});
      await page.$eval('input[name="GI_TIMERANGE14_Seq0STH"]', (el, val) => el.value = val, sH);
      await page.$eval('input[name="GI_TIMERANGE14_Seq0STM"]', (el, val) => el.value = val, sM);
      await page.$eval('input[name="GI_TIMERANGE14_Seq0ETH"]', (el, val) => el.value = val, eH);
      await page.$eval('input[name="GI_TIMERANGE14_Seq0ETM"]', (el, val) => el.value = val, eM);
      }

    // 次へ >登録
    await page.click('input[id="btnNext0"]')
    await page.waitFor('input[id="dSubmission0"]', {timeout: 5000});
    await page.click('input[id="dSubmission0"]')
  }

  await browser.close();
  console.log('end --' +  new Date());
})();



