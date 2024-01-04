import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, fromEvent } from 'rxjs';
import { SelectValue } from './select/select.component';
import { User } from './select/test/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(debounceTime(250))
      .subscribe((res) => console.log(res));
  }

  @ViewChild('input') input!: ElementRef;

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.selectValue = new User(2, 'Niels Bohr', 'niels', 'Denmark');
    // }, 5000);
    this.selectValue.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }
  title = 'custom-select-option';
  onSelectionChanged(e: any) {
    console.log(e);
  }
  selectValue: FormControl<SelectValue<User>> = new FormControl([
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
  ]);

  users: User[] = [
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(4, 'Isaac Newton', 'isaac', 'United Kingdom'),
    new User(5, 'Stephen Hawking', 'stephen', 'United Kingdom'),
    new User(6, 'Max Planck', 'max', 'Germany'),
    new User(7, 'James Clerk Maxwell', 'james', 'United Kingdom'),
    new User(8, 'Michael Faraday', 'michael', 'United Kingdom'),
    new User(9, 'Richard Feynman', 'richard', 'USA'),
    new User(10, 'Ernest Rutherford', 'ernest', 'New Zealand'),
  ];
  sisolayWithFn(user: User) {
    return user.name;
  }
  compareWithFn(user: User | null, user2: User | null) {
    return user?.id === user2?.id;
  }
}
