
◇使い方
・node.jsをインストール(持ってるバージョンでダメだったら報告ください)
・checkoutしたフォルダで、npm install
・ソースをちょっと書き換え
54行目～
const list = 
ここが入力データになっています。
入力したいデータに書き換えてください

day:number; // 日付
start:string; // 開始時刻(HH:MM)
end:string // 終了時刻(HH:MM)
works:Array<{code:string, time:string}> // 登録番号(6ケタ)と時間(HH:MM)の配列

◇実行方法
node put_company.js

◇注意
Validationは一切いれてません。
変なデータをいれるとおかしくなります。
バグだらけなので、ツールは信用せず、
実行後にはCompanyを参照して変なデータが入ってないことを確認してください。
できる限り改善していきたいので、バグ見つけたら教えてください。

