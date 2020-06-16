const puppeteer = require('puppeteer');

const setting = { 
  domain: true, // ドメインの外からアクセス
  user: '',     // ドメインの外からアクセスするときのユーザー名
  pass: '',     // ↑のパスワード
};

(async () => {
  console.log('start -- ' +  new Date());
  const browser = await puppeteer.launch({ headless:false});
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
    await page.$eval('input[id="legacy_xoopsform_block_pass"]' , el => el.value = setting.pass);

    // click wait
    await page.click('input[type="image"]')

    // move to company
    await page.waitFor('img[id="img0201"]', {timeout: 5000});
    await page.goto('https://www.honsha.fsi.co.jp/cws/cws', { waitUntil: 'domcontentloaded' }); 
  }

  // move to list
  await page.waitFor('div[id="cwsheader"]', {timeout: 5000});

  const mon = 6;
  const year = 2020;
  const day = [1,2,3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29,30]
  
  var list = [];

  //工数取得
 if (setting.domain) {
  await page.goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.project.project_workplan&@SN=root.cws.shuro.personal.project.project_workplan&@FN=FORM_PROJECT_REF&@ACTION_LOG_TXT=%E5%AE%9F%E7%B8%BE%E5%B7%A5%E6%95%B0%E7%85%A7%E4%BC%9A%EF%BC%88%E5%80%8B%E4%BA%BA%EF%BC%89', { waitUntil: 'domcontentloaded' }); 
} else {
  await page.goto('https://www.honsha.fsi.co.jp/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.project.project_workplan&@SN=root.cws.shuro.personal.project.project_workplan&@FN=FORM_PROJECT_REF&@ACTION_LOG_TXT=%E5%AE%9F%E7%B8%BE%E5%B7%A5%E6%95%B0%E7%85%A7%E4%BC%9A%EF%BC%88%E5%80%8B%E4%BA%BA%EF%BC%89', { waitUntil: 'domcontentloaded' }); 
}
var work = [];
for(var i=0;i<day.length;i++){
    await()
}

  
 for(var i=0; i<day.length; i++){

  if (setting.domain) {
    await page.goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.project.project_workplan&@SN=root.cws.shuro.personal.project.project_workplan&@FN=FORM_PROJECT_REF&@ACTION_LOG_TXT=%E5%AE%9F%E7%B8%BE%E5%B7%A5%E6%95%B0%E7%85%A7%E4%BC%9A%EF%BC%88%E5%80%8B%E4%BA%BA%EF%BC%89', { waitUntil: 'domcontentloaded' }); 
  } else {
    await page.goto('https://www.honsha.fsi.co.jp/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.project.project_workplan&@SN=root.cws.shuro.personal.project.project_workplan&@FN=FORM_PROJECT_REF&@ACTION_LOG_TXT=%E5%AE%9F%E7%B8%BE%E5%B7%A5%E6%95%B0%E7%85%A7%E4%BC%9A%EF%BC%88%E5%80%8B%E4%BA%BA%EF%BC%89', { waitUntil: 'domcontentloaded' }); 
  }
  // 詳細
  await page.waitFor(`input[id="BTNDTL${year}_${mon}_${day[i]}0"]`, {timeout: 5000});
  await page.click(`input[id="BTNDTL${year}_${mon}_${day[i]}0"]`);

  //勤怠情報取得
  //勤務時間取り出す
  var sH = await page.waitFor('input[id="KNMTMRNGSTH"]', {timeout: 5000});
  var sH = await page.$eval('input[id="KNMTMRNGSTH"]', el => el.value);
  var sM = await page.$eval('input[id="KNMTMRNGSTM"]', el => el.value);
  var eH = await page.$eval('input[id="KNMTMRNGETH"]', el => el.value);
  var eM = await page.$eval('input[id="KNMTMRNGETM"]', el => el.value);
  
  //在宅可否 
 var zaitakucode = await page.$eval('select[name="GI_COMBOBOX13_Seq0S"]', el => el.value);
 var zaitaku
 if(zaitakucode =='1'){
   zaitaku=false;
 }else{
   zaitaku=true;
 }
 
 //期待値として編集
 var newLength = list.push({day:`${day[i]}`, start:`${sH}:${sM}`, end:`${eH}:${eM}`, /*works:`${work}`,*/ zaitaku: zaitaku});
 //返却結果出力
  console.log(`${year}-${mon}-${list[i].day}`);
  console.log(`${list[i].start}~ ${list[i].end}`);
  //for(var i=0;i<works.length;i++){
  //  console.log(`${list.works.code}:${list.works.time}`);
  //}
  if(!list[i].zaitaku){
    console.log(`在宅勤務なし`);
  }else{
    console.log(`在宅勤務実施`);
  }

  console.log('-------------------')
 }

 await browser.close();
  console.log('end --' +  new Date());
})();

