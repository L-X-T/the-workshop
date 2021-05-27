import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import {
  ComponentFixtureAutoDetect,
  fakeAsync,
  TestBed,
  TestModuleMetadata,
  tick
} from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { asyncScheduler, Observable, scheduled, throwError } from 'rxjs';
import { AddressLookuper } from '../../shared/address-lookuper.service';
import { RequestInfoComponent } from './request-info.component';
import { RequestComponentHarness } from './request-info.component.harness';

describe('Test Address input', () => {
  afterEach(() => expect.hasAssertions());

  const mockLookuper = (results = [true]): Partial<AddressLookuper> => ({
    lookup: jest.fn<Observable<boolean>, [string]>(() => scheduled(results, asyncScheduler))
  });

  const createModuleMetadata = (
    customModuleMetadata: TestModuleMetadata = {}
  ): TestModuleMetadata => ({
    ...{
      declarations: [RequestInfoComponent],
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: AddressLookuper, useValue: null }]
    },
    ...customModuleMetadata
  });

  it('should check if search calls service', () => {
    const lookuper = mockLookuper();
    const component = new RequestInfoComponent(
      lookuper as AddressLookuper,
      ({
        group: jest.fn()
      } as unknown) as FormBuilder
    );
    component.ngOnInit();
    component.formGroup = {
      value: { address: '' }
    } as FormGroup;
    component.lookupResult$.subscribe();

    component.search();

    expect(lookuper.lookup).toBeCalled();
  });

  it('should check if right parameters are passed to lookup service', () => {
    const lookuper = mockLookuper();
    const component = new RequestInfoComponent(
      lookuper as AddressLookuper,
      ({
        group: jest.fn()
      } as unknown) as FormBuilder
    );
    component.ngOnInit();
    component.formGroup = {
      value: { address: 'Lindenstrasse 5, de' }
    } as FormGroup;
    component.lookupResult$.subscribe();

    component.search();

    expect(lookuper.lookup).toHaveBeenCalledWith('Lindenstrasse 5, de');
  });

  it('should check the title', () => {
    const fixture = TestBed.configureTestingModule(createModuleMetadata()).createComponent(
      RequestInfoComponent
    );
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement;
    expect(title.textContent).toBe('Request More Information');

    fixture.componentInstance.title = 'Test Title';
    fixture.detectChanges();
    expect(title.textContent).toBe('Test Title');
  });

  it('should check input fields have right values', () => {
    TestBed.configureTestingModule(createModuleMetadata());
    const fixture = TestBed.createComponent(RequestInfoComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.formGroup.patchValue({
      address: 'Hauptstraße 5'
    });
    const address = fixture.debugElement.query(By.css('input[data-test=address]'))
      .nativeElement as HTMLInputElement;

    expect(address.value).toBe('Hauptstraße 5');
  });

  it('should fail on no input', fakeAsync(() => {
    const fixture = TestBed.configureTestingModule(
      createModuleMetadata({
        providers: [{ provide: AddressLookuper, useValue: mockLookuper([false]) }]
      })
    ).createComponent(RequestInfoComponent);

    fixture.detectChanges();
    fixture.componentInstance.search();
    tick();
    fixture.detectChanges();
    const lookupResult = fixture.debugElement.query(By.css('[data-test=lookup-result]'))
      .nativeElement as HTMLElement;

    expect(lookupResult.textContent.trim()).toBe('Address not found');
  }));

  it('should trigger search on click', fakeAsync(() => {
    const lookuper = mockLookuper();
    const fixture = TestBed.configureTestingModule(
      createModuleMetadata({
        providers: [{ provide: AddressLookuper, useValue: lookuper }]
      })
    ).createComponent(RequestInfoComponent);

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('[data-test=btn-search]'))
      .nativeElement as HTMLButtonElement;
    button.click();
    tick();

    expect(lookuper.lookup).toHaveBeenCalled();
  }));

  it('should find an address', async () => {
    const lookuper = mockLookuper();
    const fixture = TestBed.configureTestingModule(
      createModuleMetadata({
        providers: [{ provide: AddressLookuper, useValue: lookuper }]
      })
    ).createComponent(RequestInfoComponent);

    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RequestComponentHarness
    );

    await harness.writeAddress('Hauptstrasse');
    await harness.submit();
    return expect(harness.getResult()).resolves.toBe('Brochure sent');
  });

  it('should check both not-validation and validated', fakeAsync(() => {
    const lookup = (address) => scheduled([address === 'Winkelgasse'], asyncScheduler);

    const fixture = TestBed.configureTestingModule(
      createModuleMetadata({
        providers: [
          { provide: AddressLookuper, useValue: { lookup } },
          { provide: ComponentFixtureAutoDetect, useValue: true }
        ]
      })
    ).createComponent(RequestInfoComponent);

    const input = fixture.debugElement.query(By.css('[data-test=address]'))
      .nativeElement as HTMLInputElement;
    input.value = 'Diagon Alley';
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.query(By.css('[data-test=btn-search]'))
      .nativeElement as HTMLButtonElement;
    button.click();
    tick();

    const lookupResult = fixture.debugElement.query(By.css('[data-test=lookup-result]'))
      .nativeElement as HTMLElement;

    expect(lookupResult.textContent.trim()).toBe('Address not found');
    input.value = 'Winkelgasse';
    input.dispatchEvent(new Event('input'));
    button.click();
    tick();

    expect(lookupResult.textContent.trim()).toBe('Brochure sent');
  }));

  it('should check the snapshot', () => {
    TestBed.configureTestingModule(createModuleMetadata());
    const fixture = TestBed.createComponent(RequestInfoComponent);

    expect(fixture).toMatchSnapshot();
  });

  it('should catch an error', fakeAsync(() => {
    const lookup = () => throwError(new Error('nominatim not available'), asyncScheduler);

    TestBed.configureTestingModule(
      createModuleMetadata({
        providers: [{ provide: AddressLookuper, useValue: { lookup } }]
      })
    );

    const fixture = TestBed.createComponent(RequestInfoComponent);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-test=address]'))
      .nativeElement as HTMLInputElement;
    input.value = 'Domgasse 5';
    input.dispatchEvent(new Event('input'));
    fixture.componentInstance.search();
    tick();
    fixture.detectChanges();

    const lookupResult = fixture.debugElement.query(By.css('[data-test=lookup-result]'))
      .nativeElement as HTMLElement;

    expect(lookupResult.textContent.trim()).toBe('Address not found');
  }));

  it('should use HttpClientTestingModule', () => {
    const moduleMetaData = createModuleMetadata({
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
    });
    moduleMetaData.imports.push(HttpClientTestingModule);
    TestBed.configureTestingModule(moduleMetaData);

    const httpController = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(RequestInfoComponent);

    const input = fixture.debugElement.query(By.css('[data-test=address]'))
      .nativeElement as HTMLInputElement;
    input.value = 'Hauptstrasse 5';
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.query(By.css('[data-test=btn-search]'))
      .nativeElement as HTMLButtonElement;
    button.click();

    const [request] = httpController.match((req) => !!req.url.match(/nominatim/));
    request.flush([true]);
    fixture.detectChanges();

    const lookupResult = fixture.debugElement.query(By.css('[data-test=lookup-result]'))
      .nativeElement as HTMLElement;
    expect(lookupResult.textContent.trim()).toBe('Brochure sent');
  });

  it('should mock components', () => {
    // tslint:disable-next-line:component-selector
    @Component({ selector: 'mat-form-field', template: '' })
    class MatFormField {}

    // tslint:disable-next-line:component-selector
    @Component({ selector: 'mat-hint', template: '' })
    class MatHint {}

    // tslint:disable-next-line:component-selector
    @Component({ selector: 'mat-icon', template: '' })
    class MatIcon {}

    // tslint:disable-next-line:component-selector
    @Component({ selector: 'mat-label', template: '' })
    class MatLabel {}

    const fixture = TestBed.configureTestingModule({
      declarations: [RequestInfoComponent, MatFormField, MatHint, MatIcon, MatLabel],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AddressLookuper, useValue: null }]
    }).createComponent(RequestInfoComponent);

    fixture.detectChanges();

    expect(true).toBe(true);
  });
});
