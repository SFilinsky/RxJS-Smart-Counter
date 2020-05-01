import {BehaviorSubject, fromEvent, timer} from "rxjs";
import {
  filter,
  map,
  mapTo,
  scan,
  switchMap,
  takeWhile,
  tap,
  withLatestFrom
} from "rxjs/operators";

const input = document.getElementById('input') as HTMLInputElement;
const output = document.getElementById('output') as HTMLDivElement;

const input$ = fromEvent(input, 'input')
  .pipe(
    map((event: InputEvent) => event.currentTarget),
    map((element: HTMLInputElement) => element.value)
  );

const output$ = new BehaviorSubject<number>(10);

const enters$ = fromEvent(input, 'keyup')
  .pipe(
    filter((event: KeyboardEvent) => event.code === 'Enter')
  );

enters$
  .pipe(
    withLatestFrom(input$),
    map(([, input]) => input),
    map(input => parseInt(input)),
    filter(val => Number.isInteger(val)),
    withLatestFrom(output$),
    switchMap(([val, last]) =>
      timer(0, 10)
        .pipe(
          mapTo(Math.sign(val - last)),
          scan((acc, curr) => { return acc + curr }, last),
          tap(curr => { output.innerText = curr + '' }),
          takeWhile(curr => curr !== val)
        )
    ),
    tap(val => output$.next(val))
  )
  .subscribe();


output$.subscribe(val => output.innerText = val + '');
