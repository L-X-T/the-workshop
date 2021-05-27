import { AsyncFactoryFn, ComponentHarness, TestElement } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

export class RequestComponentHarness extends ComponentHarness {
  static hostSelector = 'app-request-info';
  protected getTitle = this.locatorFor('h2');
  protected getInput = this.locatorFor(MatInputHarness);
  protected getButton = this.locatorFor(MatButtonHarness);
  protected getLookupResult = this.attrLocator('lookup-result');

  async submit(): Promise<void> {
    const button = await this.getButton();
    return await button.click();
  }

  async writeAddress(address: string): Promise<void> {
    const input = await this.getInput();
    return await input.setValue(address);
  }

  async getResult(): Promise<string> {
    const p = await this.getLookupResult();
    return p.text();
  }

  protected attrLocator(tag: string): AsyncFactoryFn<TestElement> {
    return this.locatorFor(`[data-test=${tag}]`);
  }
}
