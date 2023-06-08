import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

type SEATLAYOUT = {
  row_num: number;
  max_seat: number;
  num_of_booked_seat: number;
  start_seat_number: number;
  seats_booked: number[];
};

type COACH = {
  coach: SEATLAYOUT[];
  total: number;
  left: number;
  booked: number;
};


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  //create the coach layout
  private dataStore: COACH = {
    coach: [
      {
        row_num: 1,
        num_of_booked_seat: 0,
        max_seat: 7,
        start_seat_number: 1,
        seats_booked: [],
      },
      {
        row_num: 2,
        num_of_booked_seat: 1,
        max_seat: 7,
        start_seat_number: 8,
        seats_booked: [12],
      },
      {
        row_num: 3,
        num_of_booked_seat: 2,
        max_seat: 7,
        start_seat_number: 15,
        seats_booked: [17, 18],
      },
      {
        row_num: 4,
        num_of_booked_seat: 0,
        max_seat: 7,
        start_seat_number: 22,
        seats_booked: [],
      },
      {
        row_num: 5,
        num_of_booked_seat: 4,
        max_seat: 7,
        start_seat_number: 29,
        seats_booked: [31, 32, 34, 35],
      },
      {
        row_num: 6,
        num_of_booked_seat: 0,
        max_seat: 7,
        start_seat_number: 36,
        seats_booked: [],
      },
      {
        row_num: 7,
        num_of_booked_seat: 0,
        max_seat: 7,
        start_seat_number: 43,
        seats_booked: [],
      },
      {
        row_num: 8,
        num_of_booked_seat: 0,
        max_seat: 7,
        start_seat_number: 50,
        seats_booked: [],
      },
      {
        row_num: 9,
        num_of_booked_seat: 0,
        max_seat: 7,
        start_seat_number: 57,
        seats_booked: [],
      },
      {
        row_num: 10,
        num_of_booked_seat: 0,
        max_seat: 7,
        start_seat_number: 64,
        seats_booked: [],
      },
      {
        row_num: 11,
        num_of_booked_seat: 0,
        max_seat: 7,
        start_seat_number: 71,
        seats_booked: [],
      },
      {
        row_num: 12,
        num_of_booked_seat: 0,
        max_seat: 3,
        start_seat_number: 78,
        seats_booked: [],
      },
    ],
    total: 80,
    booked: 7,
    left: 73,
  };

  private _data = new BehaviorSubject<COACH>(this.dataStore);

  //return datastore as observable
  get data() {
    return this._data.asObservable();
  }

  //returns the booked seat numbers and remaining seats
  book_Seats(numOfSeats: number) {
    let left = numOfSeats;
    let booked_Seats = [];

    main: for (let row_num of this.dataStore.coach) {
      if (left === 0) break main;

      const row_numBookings = Math.min(
        row_num.max_seat - row_num.num_of_booked_seat,
        left
      ); //to determine how many seats are available to book in current row
      left -= row_numBookings;
      row_num.num_of_booked_seat += row_numBookings;
      const bs = row_num.seats_booked;
      let count = 0;

      inner: for (
        let i = row_num.start_seat_number;
        i <= row_num.start_seat_number + row_num.max_seat;
        i++
      ) {
        if (count === row_numBookings) break inner;

        const alreadyBooked = bs.some((n) => n === i);
        if (!alreadyBooked) {
          count++;
          bs.push(i);
          booked_Seats.push(i);
        }
      }
    }
    this.dataStore.booked += numOfSeats;
    this.dataStore.left -= numOfSeats;
    return [booked_Seats, this.dataStore.left];
  }
}
