import { ComponentHarness } from '@angular/cdk/testing';

export class LoginComponentHarness extends ComponentHarness {
  static hostSelector = 'app-login';

  protected getButton = this.locatorFor('[data-test=btn-login]');
  protected getP = this.locatorFor('p');

  async login(): Promise<void> {
    const button = await this.getButton();
    await button.click();
  }

  async getMessage(): Promise<string> {
    const p = await this.getP();
    return await p.text();
  }
}
