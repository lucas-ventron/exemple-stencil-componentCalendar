import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import moment from 'moment';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  @Prop() month: number;
  @Prop() year: number;
  @Prop() forwardButtonActive: boolean = false;
  @Prop() backButtonActive: boolean = false;
  @Prop() eventsOfTheDay: [] = [];

  @Event() eventClick: EventEmitter;

  days = [];
  monthInfo: any = { name: '', current: false };
  daysOfTheWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  namesMonth = [
    { name: 'Janeiro', current: false },
    { name: 'Fevereiro', current: false },
    { name: 'Março', current: false },
    { name: 'Abril', current: false },
    { name: 'Maio', current: false },
    { name: 'Junho', current: false },
    { name: 'Julho', current: false },
    { name: 'Agosto', current: false },
    { name: 'Setembro', current: false },
    { name: 'Outubro', current: false },
    { name: 'Novembro', current: false },
    { name: 'Dezembro', current: false }
  ];
  dayCurrent = moment(new Date()).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  private mountsMonth(month: number, year: number): any[] {
    let days = [];
    const date = moment({ year: year, month: month });

    const totalDayInMonth: number = date.daysInMonth();
    for (let day = 1; day <= totalDayInMonth; day++) {

      const dayInMonth = moment({ year: year, month: month, date: day });
      const typeMarkers: any[] = this.typeMarkers(day);
      days.push({
        day: dayInMonth.format('DD'),
        currentMonth: true,
        typeMarkers: typeMarkers,
        isEvents: (typeMarkers.length) ? true : false,
        dayCurrent: (this.dayCurrent.unix() === dayInMonth.unix()),
        dateUnix: dayInMonth.unix()
      });

      if (day === 1) {
        let prevMonth = (month - 1);
        let newYear = year;
        if (prevMonth < 0) {
          prevMonth = 11;
          newYear = (newYear - 1);
        }
        let prevDay = moment({
          year: newYear,
          month: prevMonth,
          date: day
        }).daysInMonth();
        for (let index = 0; index < dayInMonth.day(); index++) {
          days.unshift({
            day: (prevDay > 0 && prevDay < 10) ? `0${prevDay}` : prevDay,
            currentMonth: false,
            dayCurrent: (this.dayCurrent.unix() === dayInMonth.unix())
          });
          prevDay--;
        }
      }

      if (day === totalDayInMonth) {
        const totalMaxItems: number = 42;
        const total: number = (totalMaxItems - days.length);
        for (let index = 1; index <= total; index++) {
          days.push({
            day: (index > 0 && index < 10) ? `0${index}` : index,
            currentMonth: false,
            dayCurrent: (this.dayCurrent.unix() === dayInMonth.unix())
          });
        }
      }
    }
    return days;
  }

  private typeMarkers(day: number, month: number = this.month, events: any[] = this.eventsOfTheDay): any[] {
    let typeMarkers = [];
    if (events.length) {
      let eventDate = events.filter(x => x.Day === day && x.Month === (month + 1));
      if (eventDate.length) {
        for (let index = 0; index < eventDate.length; index++) {
          const item = eventDate[index];
          if (typeMarkers.length) {
            if (!typeMarkers.includes(item.idEvent)) {
              typeMarkers.push(item.idEvent);
            }
          } else {
            typeMarkers.push(item.idEvent);
          }
        }
      }
    }
    return typeMarkers;
  }

  prev(month: number, year: number): void {
    this.days = [];
    month = (month - 1);
    year = year;
    if (month < 0) {
      month = 11;
      year = (year - 1);
    }
    // this.changeYearOrMonth.emit({ year, month });
    this.setMonthInfo(this.namesMonth[month].name);
    this.setMonth(month);
    this.setYear(year);
    this.setDays(this.mountsMonth(month, year));
  }

  next(month: number, year: number): void {
    this.days = [];
    month = (month + 1);
    year = year;
    if (month > 11) {
      month = 0;
      year = (year + 1);
    }
    // this.changeYearOrMonth.emit({ year, month });
    this.setMonthInfo(this.namesMonth[month].name);
    this.setMonth(month);
    this.setYear(year);
    this.setDays(this.mountsMonth(month, year));
  }

  dayClickMethod(item: any) {
    const { dateUnix, isEvents } = item;
    const obj = {
      unix: dateUnix,
      isEvents
    }
    console.log(obj);
    this.eventClick.emit(obj);
  }

  private setDays(days: any[]): void {
    this.days = days;
  }

  private setMonthInfo(item: any): void {
    this.monthInfo = item;
  }

  private setMonth(month: number): void {
    this.month = month;
  }

  private setYear(year: number): void {
    this.year = year;
  }

  render() {
    this.setDays(this.mountsMonth(this.month, this.year));
    if (this.dayCurrent.month() === this.month) {
      this.namesMonth[this.month].current = true;
    }
    this.setMonthInfo(this.namesMonth[this.month]);

    return (
      <div class="calendar">
        <div class="calendar__area calendar__area--month">
          <div class="calendar__month">
            <div class="calendar__block">
              <div class="calendar__content">
                <div class="calendar__title calendar__title--month">{this.monthInfo.name}</div>
                <div class="calendar__title calendar__title--year">{this.year}</div>
                {
                  this.monthInfo.current
                  ? <div class="calendar__title calendar__title--day">hoje</div>
                  : ''
                }
              </div>
              <ul class="calendar__week">
                {this.daysOfTheWeek.map(item => (
                  <li key={item} class="calendar__text">{item}</li>
                ))}
              </ul>
              <div class="calendar__area">
                {this.days.map(item => (
                  <div
                    class={'calendar__day ' + ((item.dayCurrent)? 'calendar__day--current' : '')}
                    onClick={() => this.dayClickMethod(item)}
                  >
                    <div class="calendar__content">
                      <div class="calendar__number">{item.day}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
