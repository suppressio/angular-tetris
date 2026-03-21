import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Moves } from './models/game.model';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('triggers automatic down move and change detection on timer tick', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const moveSpy = spyOn<any>(component, '_move').and.callThrough();
    const detectChangesSpy = spyOn((component as any).cdr, 'detectChanges').and.callThrough();

    component.startGame();
    tick(801);

    expect(moveSpy).toHaveBeenCalledWith(Moves.DOWN);
    expect(detectChangesSpy).toHaveBeenCalled();

    component.ngOnDestroy();
  }));

  it('does not throw on destroy before timer starts', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
