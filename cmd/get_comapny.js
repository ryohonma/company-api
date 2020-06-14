const puppeteer = require('puppeteer');

const setting = { 
  domain: true, // ドメインの外からアクセス
  user: '',     // ドメインの外からアクセスするときのユーザー名
  pass: '',     // ↑のパスワード
};

(async () => {
  console.log('start -- ' +  new Date());
  const browser = await puppeteer.launch({ headless:true});
  let url = setting.domain ? 'http://jinkyuwap.fsi.local/cws/cws'
                           : 'http://www.honsha.fsi.co.jp';
  
  //　タブの生成
  const page = [await browser.newPage(), await browser.newPage()];
  //page[0]:勤怠画面、page[1]:工数画面
  await page[0].goto(url, { waitUntil: 'domcontentloaded' }); 
  await page[1].goto(url, { waitUntil: 'domcontentloaded' });
                         
  // タブを移動
  const pages = await browser.pages();
  const detailPage = [pages[1],pages[2]];

  if (!setting.domain) {
    for(var i=0 ;i<page.length;i++){
      await detailPage[i].bringToFront();
     // ログイン
    await page[i].$eval('input[id="legacy_xoopsform_block_uname"]', el => el.value = setting.user);
    await page[i].$eval('input[id="legacy_xoopsform_block_pass"]' , el => el.value = setting.pass);

    // click wait
    await page[i].click('input[type="image"]')

    // move to company
    await page[i].waitFor('img[id="img0201"]', {timeout: 5000});
    await page[i].goto('https://www.honsha.fsi.co.jp/cws/cws', { waitUntil: 'domcontentloaded' }); 
    }
  }
  await detailPage[0].bringToFront();

  // move to list
  await page[0].waitFor('div[id="cwsheader"]', {timeout: 5000});

  if (setting.domain) {
    await page[0].goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.term_kinmu_input&@SN=root.cws.shuro.personal.term_kinmu_input&@FN=form_shuro&@ACTION_LOG_TXT=%E5%8B%A4%E6%80%A0%E5%AE%9F%E7%B8%BE%E3%80%80%E5%85%A5%E5%8A%9B%3Cbr%3E%3Cbr%3E', { waitUntil: 'domcontentloaded' }); 
    //await detailPage[1].bringToFront();
    //await page[1].goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.project.project_workplan&@SN=root.cws.shuro.personal.project.project_workplan&@FN=FORM_PROJECT_REF&@ACTION_LOG_TXT=%E5%AE%9F%E7%B8%BE%E5%B7%A5%E6%95%B0%E7%85%A7%E4%BC%9A%EF%BC%88%E5%80%8B%E4%BA%BA%EF%BC%89', { waitUntil: 'domcontentloaded' }); 
    //await detailPage[0].bringToFront();
  } else {
    await page[0].goto('https://www.honsha.fsi.co.jp/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.term_kinmu_input&@SN=root.cws.shuro.personal.term_kinmu_input&@FN=form_shuro&@ACTION_LOG_TXT=%E5%8B%A4%E6%80%A0%E5%AE%9F%E7%B8%BE%E3%80%80%E5%85%A5%E5%8A%9B%3Cbr%3E%3Cbr%3E', { waitUntil: 'domcontentloaded' }); 
    //await detailPage[1].bringToFront();
    //await page[1].goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.project.project_workplan&@SN=root.cws.shuro.personal.project.project_workplan&@FN=FORM_PROJECT_REF&@ACTION_LOG_TXT=%E5%AE%9F%E7%B8%BE%E5%B7%A5%E6%95%B0%E7%85%A7%E4%BC%9A%EF%BC%88%E5%80%8B%E4%BA%BA%EF%BC%89', { waitUntil: 'domcontentloaded' });
    //await detailPage[0].bringToFront();
  }

  const mon = 6;
  const year = 2020;
  const day = [1,2,3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29,30]

  
 for(var i=0; i<day.length; i++){
  // 詳細
  await page[0].waitFor(`input[id="BTNDTL${year}_${mon}_${day[i]}0"]`, {timeout: 5000});
  await page[0].click(`input[id="BTNDTL${year}_${mon}_${day[i]}0"]`);

  //勤怠情報取得
  //勤務時間取り出す
  var sH = await page[0].waitFor('input[id="KNMTMRNGSTH"]', {timeout: 5000});
  var sH = await page[0].$eval('input[id="KNMTMRNGSTH"]', el => el.value);
  var sM = await page[0].$eval('input[id="KNMTMRNGSTM"]', el => el.value);
  var eH = await page[0].$eval('input[id="KNMTMRNGETH"]', el => el.value);
  var eM = await page[0].$eval('input[id="KNMTMRNGETM"]', el => el.value);
  
  //在宅可否 
 var zaitaku = await page[0].$eval('select[name="GI_COMBOBOX13_Seq0S"]', el => el.value);
 
 //工数取得
 //await detailPage[1].bringToFront();
 //var kousuu = [];

 //返却結果出力
  console.log(`${year}-${mon}-${day[i]}`);
  console.log(`${sH}:${sM} ~ ${eH}:${eM}`);
  if(zaitaku =='1'){
    console.log(`在宅勤務なし`);
  }else{
    console.log(`在宅勤務実施`);
  }

  if (setting.domain) {
    await page[0].goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.term_kinmu_input&@SN=root.cws.shuro.personal.term_kinmu_input&@FN=form_shuro&@ACTION_LOG_TXT=%E5%8B%A4%E6%80%A0%E5%AE%9F%E7%B8%BE%E3%80%80%E5%85%A5%E5%8A%9B%3Cbr%3E%3Cbr%3E', { waitUntil: 'domcontentloaded' }); 
  } else {
    await page[0].goto('https://www.honsha.fsi.co.jp/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.term_kinmu_input&@SN=root.cws.shuro.personal.term_kinmu_input&@FN=form_shuro&@ACTION_LOG_TXT=%E5%8B%A4%E6%80%A0%E5%AE%9F%E7%B8%BE%E3%80%80%E5%85%A5%E5%8A%9B%3Cbr%3E%3Cbr%3E', { waitUntil: 'domcontentloaded' }); 
  }
  console.log('-------------------')
 }

 await browser.close();
  console.log('end --' +  new Date());
})();
