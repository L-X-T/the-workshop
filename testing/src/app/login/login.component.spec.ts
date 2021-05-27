import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixtureAutoDetect, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';
import { LoginComponentHarness } from './login.component.harness';

describe('LoginComponent', () => {
  const defaultConfig: TestModuleMetadata = { declarations: [LoginComponent] };
  const createFixture = (moduleDef: TestModuleMetadata = {}) => {
    return TestBed.configureTestingModule({ ...defaultConfig, ...moduleDef }).createComponent(
      LoginComponent
    );
  };

  it('should create', () => {
    const fixture = createFixture();
    expect(fixture).toBeTruthy();
  });

  it('should verify message is shown upon button click with manual cd', () => {
    const fixture = createFixture();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('[data-test=btn-login]'))
      .nativeElement as HTMLButtonElement;
    button.dispatchEvent(new Event('click'));

    const p = fixture.debugElement.query(By.css('[data-test="msg"]'))
      .nativeElement as HTMLParagraphElement;
    fixture.detectChanges();
    expect(p.textContent).toBe('Du hast mich geklickt.');
  });

  it('should verify message is shown upon button click with automatic cd', () => {
    const fixture = createFixture({
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
    });
    const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    button.click();

    const p = fixture.debugElement.query(By.css('p')).nativeElement as HTMLParagraphElement;
    expect(p.textContent).toBe('Du hast mich geklickt.');

    fixture.componentInstance.message = 'Eingeloggt';
  });

  it('should make a snapshot', () => {
    const fixture = createFixture();
    expect(fixture).toMatchSnapshot();
  });

  it('should login with harness', async () => {
    const fixture = createFixture();
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      LoginComponentHarness
    );

    await harness.login();
    return expect(harness.getMessage()).resolves.toBe('Du hast mich geklickt.');
  });
});
