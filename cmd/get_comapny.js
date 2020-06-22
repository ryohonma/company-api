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
  const day = [1,2,3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29,30]; 

  //"工数情報　照会"サイト移動
 if (setting.domain) {
  await page.goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.project.project_workplan&@SN=root.cws.shuro.personal.project.project_workplan&@FN=FORM_PROJECT_REF&@ACTION_LOG_TXT=%E5%AE%9F%E7%B8%BE%E5%B7%A5%E6%95%B0%E7%85%A7%E4%BC%9A%EF%BC%88%E5%80%8B%E4%BA%BA%EF%BC%89', { waitUntil: 'domcontentloaded' }); 
} else {
  await page.goto('https://www.honsha.fsi.co.jp/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.project.project_workplan&@SN=root.cws.shuro.personal.project.project_workplan&@FN=FORM_PROJECT_REF&@ACTION_LOG_TXT=%E5%AE%9F%E7%B8%BE%E5%B7%A5%E6%95%B0%E7%85%A7%E4%BC%9A%EF%BC%88%E5%80%8B%E4%BA%BA%EF%BC%89', { waitUntil: 'domcontentloaded' }); 
}
var work = []; 
var selector = await page.$$("table .collect .collect");//工数番号の種類数

//工数取得
for(var i=0;i<day.length;i++){
  var newLength = work.push({day:`${day[i]}`,works:[]});
  console.log(`${work[work.length-1].day}`);
}
var resultSelector = await page.$("table .collect");
for(var i=0;i<selector.length;i++){
  var koubann = await resultSelector.$eval(".collect", list => {
    return list.textContent
  });
  resultSelector = await page.evaluateHandle(el => el.nextElementSibling, resultSelector);
  var datas = await resultSelector.$$eval(".b", list => {
    return list.map(datas => datas.textContent);
  });
  resultSelector = await page.evaluateHandle(el => el.nextElementSibling, resultSelector);
  //期待値に合わせて整形する
  for(j=0;j<day.length;j++){
    if(!datas[day[j]-1]==''){//day.includes(j+1)とかも使えるかも知れない
        var newLength = work[j].works.push({code:`${koubann}`,time:`${datas[day[j]-1]}`});
    }
  }
}

var list = [];

 for(var i=10; i<day.length; i++){

  if (setting.domain) {
    await page.goto('http://jinkyuwap.fsi.local/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.term_kinmu_input&@SN=root.cws.shuro.personal.term_kinmu_input&@FN=form_shuro&@ACTION_LOG_TXT=%E5%8B%A4%E6%80%A0%E5%AE%9F%E7%B8%BE%E3%80%80%E5%85%A5%E5%8A%9B%3Cbr%3E%3Cbr%3E', { waitUntil: 'domcontentloaded' }); 
  } else {
    await page.goto('https://www.honsha.fsi.co.jp/cws/cws?@SID=null&@SUB=root.cws.shuro.personal.term_kinmu_input&@SN=root.cws.shuro.personal.term_kinmu_input&@FN=form_shuro&@ACTION_LOG_TXT=%E5%8B%A4%E6%80%A0%E5%AE%9F%E7%B8%BE%E3%80%80%E5%85%A5%E5%8A%9B%3Cbr%3E%3Cbr%3E', { waitUntil: 'domcontentloaded' }); 
  }
  // 詳細
  await page.waitFor(`input[id="BTNDTL${year}_${mon}_${day[i]}0"]`, {timeout: 5000});
  await page.click(`input[id="BTNDTL${year}_${mon}_${day[i]}0"]`);

  //勤怠情報取得
  //勤務時間取り出す
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
 var newLength = list.push({day:`${day[i]}`, start:`${sH}:${sM}`, end:`${eH}:${eM}`,works:`${work[i].works}`,zaitaku: zaitaku});
 //返却結果出力
  console.log(`${year}-${mon}-${list[i].day}`);
  console.log(`${list[i].start}~ ${list[i].end}`);
  for(var j=0;j<list[i].works.length;j++){
    console.log(`${list[i].works[j].code}:${list[i].works[j].time}`);
  }
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

