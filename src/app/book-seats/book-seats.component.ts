import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-book-seats',
  templateUrl: './book-seats.component.html',
  styleUrls: ['./book-seats.component.css']
})
export class BookSeatsComponent {

  constructor(
    private formBuilder: FormBuilder,
    private databaseService: DatabaseService
  ) {}

  formBooking!: FormGroup;
  public data$!: Observable<any>;
  public error_message = '';
  total: number = 0;
  booked: number = 0;
  left: number | number[] = 0;
  bookings:any = [];
  public sevenSeater = [1, 2, 3, 4, 5, 6, 7];
  public threeSeater = [1, 2, 3];

  ngOnInit(): void {
    this.createForm();
    this.data$ = this.databaseService.data.pipe();
    this.databaseService.data.subscribe((data) => this.left = data.left);
  }

  createForm() {
    this.formBooking = this.formBuilder.group({
      numOfSeats: ['', Validators.required],
    });
  }

  getSeatNum(n: number, row: number): number {
    return (row - 1) * 7 + n;
  }

  //to display reserved or unreserved seat in the html file based on the return value
  checkBooked(n: number, row: number, bs: number[]): boolean {
    const seat = this.getSeatNum(n, row);
    return bs.some((bs) => bs === seat);
  }

  //booking logic
  book_seat() {

    if (!this.formBooking.valid) return;
    let { numOfSeats } = this.formBooking.value;

    if (numOfSeats <= 0) {
      this.error_message = 'Min of 1 passenger required';
      this.hide_error_Message();
      return;
    }

    if (numOfSeats > 7) {
      this.error_message = 'Max 7 passenger at a time';
      this.hide_error_Message();
      return;
    }
    
    if ( numOfSeats > this.left) {
      this.error_message = `Only ${this.left} seats available`;
      this.hide_error_Message();
      return;
    }

    const [booked_Seats, left] = this.databaseService.book_Seats(numOfSeats);
    this.left = left;
    this.bookings.unshift({
      seats: booked_Seats,
    });
  }

  hide_error_Message(t = 1500) {
    setTimeout(() => (this.error_message = ''), t);
  }
}
