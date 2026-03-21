import { SettingsDialogService } from './settings-dialog.service';

describe('SettingsDialogService', () => {
  let service: SettingsDialogService;

  beforeEach(() => { service = new SettingsDialogService(); });

  // ─── dialog visibility ────────────────────────────────────────────────────

  it('dialog is hidden by default', () => {
    expect(service.show_dialog).toBeFalse();
  });

  it('open() shows the dialog', () => {
    service.open();
    expect(service.show_dialog).toBeTrue();
  });

  it('close() hides the dialog', () => {
    service.open();
    service.close();
    expect(service.show_dialog).toBeFalse();
  });

  it('show_dialog setter works directly', () => {
    service.show_dialog = true;
    expect(service.show_dialog).toBeTrue();
    service.show_dialog = false;
    expect(service.show_dialog).toBeFalse();
  });

  // ─── speed / delay ────────────────────────────────────────────────────────

  it('default speed is 10', () => {
    expect(service.speed).toBe(10);
  });

  it('delay at default speed (10) is 100ms', () => {
    expect(service.delay).toBe(100);
  });

  it('delay at speed 1 is 1000ms', () => {
    service.speed = 1;
    expect(service.delay).toBe(1000);
  });

  it('delay at speed 5 is 600ms', () => {
    service.speed = 5;
    expect(service.delay).toBe(600);
  });

  it('delay decreases as speed increases', () => {
    let prev = Infinity;
    for (let s = 1; s <= 10; s++) {
      service.speed = s;
      expect(service.delay).toBeLessThan(prev);
      prev = service.delay;
    }
  });

  // ─── buttons ─────────────────────────────────────────────────────────────

  it('has exactly two buttons (Close and Save)', () => {
    expect(service.buttons.length).toBe(2);
    expect(service.buttons.map(b => b.label)).toEqual(['Close', 'Save']);
  });

  it('Close button invokes close()', () => {
    service.open();
    const closeBtn = service.buttons.find(b => b.label === 'Close')!;
    closeBtn.fn();
    expect(service.show_dialog).toBeFalse();
  });
});
