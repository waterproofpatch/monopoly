import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'animated-digit',
  templateUrl: 'animated-digit.component.html',
  styleUrls: ['animated-digit.component.css'],
})
export class AnimatedDigitComponent implements AfterViewInit, OnChanges {
  @Input() duration: number = 0;
  @Input() digit: number = 0;
  @Input() steps: number = 0;
  @ViewChild('animatedDigit') animatedDigit: ElementRef = {} as ElementRef;
  originalValue: number = 0;

  animateCount() {
    if (!this.animatedDigit) {
      return;
    }
    if (!this.duration) {
      this.duration = 1000;
    }

    if (typeof this.digit === 'number') {
      this.counterFunc(
        this.digit,
        this.duration,
        this.animatedDigit,
        this.originalValue
      );
    }
  }

  counterFunc(
    endValue: number,
    durationMs: number,
    element: ElementRef,
    initialValue: number
  ) {
    if (!this.steps) {
      this.steps = 12;
    }

    let currentValue = initialValue;
    const stepCount = Math.abs(durationMs / this.steps);
    const valueIncrement = (endValue - currentValue) / stepCount;
    const sinValueIncrement = Math.PI / stepCount;

    let currentSinValue = 0;

    function step() {
      if (!element.nativeElement) {
        return;
      }
      currentSinValue += sinValueIncrement;
      currentValue += valueIncrement * Math.sin(currentSinValue) ** 2 * 2;

      element.nativeElement.textContent =
        '$' + Math.abs(Math.floor(currentValue));

      if (currentSinValue < Math.PI) {
        window.requestAnimationFrame(step);
      } else {
        // we won't recur again, now is the time to fix up miscalculations when setting the element
        element.nativeElement.textContent = '$' + endValue;
      }
    }

    step();
  }

  ngAfterViewInit() {
    if (this.digit) {
      this.originalValue = this.digit;
      this.animateCount();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['digit']) {
      this.animateCount();
      this.originalValue = this.digit;
    }
  }
}
