import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { Subject, Subscription }                           from 'rxjs';
import { Store }                            from '@ngrx/store';
import { PwaService }                       from '@services/pwa.service';
import { backButtonClicked, resetHeader }   from '@app/store/header/header.actions';
import { isBottomSheetOpen }                from '@app/store/bottom-sheet/bottom-sheet.selectors';
import { closeBottomSheet }                 from '@app/store/bottom-sheet/bottom-sheet.actions';

@Component({
  selector: 'gtm-opacity-overlay',
  templateUrl: './opacity-overlay.component.html',
  styleUrls: [ './opacity-overlay.component.scss' ],
})
export class OpacityOverlayComponent implements OnDestroy, AfterViewInit {
  isOpenSubscription: Subscription;

  isBottomSheetOpen$ = this.store.select(isBottomSheetOpen);

  constructor( private store: Store, private elementRef: ElementRef ) {
    this.isOpenSubscription = this.isBottomSheetOpen$.subscribe(( isOpen ) => {
      if ( isOpen ) {
        this.open();
      }
      if ( !isOpen ) {
        this.close();
      }
    });
  }

  ngAfterViewInit() {
    this.close();
  }

  ngOnDestroy(): void {
    this.isOpenSubscription.unsubscribe();
  }

  open = () => {
    if ( this.elementRef ) {
      this.elementRef.nativeElement.style.zIndex = 10;
    }
  }

  close = () => {
    if ( this.elementRef ) {
      this.elementRef.nativeElement.style.zIndex = -2;
    }
  }

  handleOverlayClick = () => {
    this.store.dispatch(closeBottomSheet());
  }

}
