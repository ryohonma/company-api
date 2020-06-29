// AnglarコアライブラリからComponentシンボルをインポート
// 常にコンポーネントクラスに@Componentで注釈をつける

import { Component, OnInit } from '@angular/core';

// インターフェースの作成
// プロパティを与える
// string...文字の型
// number...数字の型
interface Work {
  number:string;
  time:string;
}

interface WorkingHours {
  day:number;
  start:string;
  end:string;
  worklist:Array<Work>;
}

interface CalendarState {
  year: number;
  month: number;
  dateList: Array<WorkingHours>;
}

// @component...コンポーネントのangularメタデータを指定するデコレーター関数
@Component({
  // selector-コンポーネントのcss要素セレクター-
  selector: 'cw-calendar',
  // templaterUrl-コンポーネントのテンプレートファイルの場所-
  templateUrl: './calendar.component.html',
  // styleUrls-コンポーネントのプライベートcssスタイルの場所-
  styleUrls: ['./calendar.component.scss']
})
// コンポーネントの初期化
// コンストラクターを使用してプロパティを宣言および初期化できる
// 格納モデルの作成（登録するデータを格納するモデル）
// {{変数名}}でコンポーネントが持つ変数を表示することができる。
export class CalendarComponent implements OnInit {

  constructor() { }
  
  public state : CalendarState = {
    year: (new Date()).getFullYear(),
    month:(new Date()).getMonth() + 1,
    dateList: [],
  };
  
  
  
  
  //ライフサイクルフック
  ngOnInit(): void {
    const now = new Date();
    this.createDateList(this.state.year, this.state.month);
  }

  // 日付リストを作成
  public createDateList(year: number, month: number) {
    const endDayOfMonth = new Date(year, month, 0).getDate();
    //0か6だった場合にはプッシュしない
    const dateArray = [];


    for (let i = 1; i <= endDayOfMonth; i++) {
      //dateArray.push({day:i, start:'9:00', end:'17:30'});

      //const week = new Date(year, month, i).getDay();
      const week = new Date(year, month-1, i).getDay();
      

      if (week !==0 && week !==6){
        dateArray.push({day:i, start:'9:00', end:'17:30'})

      }

      
    }
    this.state = { year, month, dateList: dateArray };
  }


  // match day
  public isMatchDay (dt1?: Date, dt2?: Date) {
    if (dt1 === undefined || dt2 === undefined) return false;

    return (
      dt1.getMonth() === dt2.getMonth() &&
      dt1.getFullYear() === dt2.getFullYear() &&
      dt1.getDate() === dt2.getDate()
    );
  }

  // 次の月へ
  public rightClick() {
    let { year } = this.state;
    let month = this.state.month + 1;
    if (month === 13) {
      year += 1;
      month = 1;
    }
    this.createDateList(year, month);
  }

  // 前のつきへ
  public leftClick() {
    let { year } = this.state;
    let month = this.state.month - 1;
    if (month === 0) {
      year -= 1;
      month = 12;
    }
    this.createDateList(year, month);
  };

  // title
  public getTitle() {
    return `${this.state.year}年${this.state.month}月`;
  }

  // 日付を取得
  public getDay(day: number) {
    const dt = new Date(this.state.year, this.state.month - 1, day);

    return this.format(dt, 'MM月DD日（W）', false);
  }


  // 現在時刻が本日かどうか
  private isToday (day: number) {
    const target = new Date(this.state.year, this.state.month - 1, day);

    return this.isMatchDay(target, new Date());
  }

  // 各日付の背景色
  public boxClass (day: number) {
    if (this.isToday(day)) return 'boxToday';

    return 'boxOther';
  }

  // date formater
  private format(date: Date, fmtString: string, zeroPadding = true) {
    const weeks = ['日', '月', '火', '水', '木', '金', '土'];
    const year = date.getFullYear();
    const month = 1 + date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const week = date.getDay();

    const sMonth = zeroPadding ? `0${month}`.slice(-2) : `${month}`;
    const sDay = zeroPadding ? `0${day}`.slice(-2) : `${day}`;
    const sHour = zeroPadding ? `0${hour}`.slice(-2) : `${hour}`;
    const sMinute = zeroPadding ? `0${minute}`.slice(-2) : `${minute}`;
    const sSecond = zeroPadding ? `0${second}`.slice(-2) : `${second}`;
    const sWeek = weeks[week];

    fmtString = fmtString.replace(/YYYY/g, `${year}`);
    fmtString = fmtString.replace(/MM/g, sMonth);
    fmtString = fmtString.replace(/DD/g, sDay);
    fmtString = fmtString.replace(/hh/g, sHour);
    fmtString = fmtString.replace(/mm/g, sMinute);
    fmtString = fmtString.replace(/ss/g, sSecond);
    fmtString = fmtString.replace(/W/g, sWeek);

    return fmtString;
  }

}
