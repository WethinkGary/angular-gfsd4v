import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  startButton: Element;
  countButton: Element;
  errorButton: Element;
  completeButton: Element;

  currentCounterLabel: Element;
  evenCounterLabel: Element;
  statusCounterLabel: Element;

  counter = 0;
  counter$: Subject<number>;

  ngOnInit(): void {
    this.startButton = document.querySelector('#start');
    this.countButton = document.querySelector('#count');
    this.errorButton = document.querySelector('#error');
    this.completeButton = document.querySelector('#complete');
    this.currentCounterLabel = document.querySelector('#currentCounter');
    this.evenCounterLabel = document.querySelector('#evenCounter');
    this.statusCounterLabel = document.querySelector('#status');

    console.log(' this.startButton = ' + this.startButton);
    // 開始計數按鈕click訂閱
    fromEvent(this.startButton, 'click').subscribe(() => {
      // 建立新的Subject
      this.counter$ = new Subject();
      // 歸零
      this.counter = 0;
      // 更新狀態
      console.log(' this.statusCounterLabel = ' + this.statusCounterLabel);
      this.statusCounterLabel.innerHTML = '開始計數';

      //訂閱counter$ 並顯示目前計數職
      this.counter$.subscribe(
        data => {
          this.currentCounterLabel.innerHTML = data.toString();
          if (data % 2 == 0) {
            this.evenCounterLabel.innerHTML = data.toString();
          }
        },
        (error: string) => {
          this.statusCounterLabel.innerHTML = '錯誤 ->' + error;
        },
        () => {
          this.statusCounterLabel.innerHTML = 'OK!!!!';
        }
      );

      //偶數計數訂閱
      this.counter$
        .pipe(
          filter(data => data % 2 === 0),
          map(data => {
            this.evenCounterLabel.innerHTML = data.toString();
          })
        )
        .subscribe(() => {});

      // 送出預設值
      this.counter$.next(this.counter);
    });

    // 計數按鈕click訂閱
    fromEvent(this.countButton, 'click').subscribe(() => {
      this.counter$.next(++this.counter);
    });

    // 發生錯誤click訂閱
    fromEvent(this.errorButton, 'click').subscribe(() => {
      const reason = prompt('請輸入錯誤訊息');
      this.counter$.error(reason || 'error');
    });

    // 完成計數click訂閱
    fromEvent(this.completeButton, 'click').subscribe(() => {
      this.counter$.complete();
    });
  }
}
