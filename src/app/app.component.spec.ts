import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {HarnessLoader} from '@angular/cdk/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {MatCheckboxHarness} from '@angular/material/checkbox/testing';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let rootLoader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should validate activate button only when form is valid', async() => {
    const input = await rootLoader.getHarness(MatInputHarness.with({selector: '#form1 input'}))
    const button = await rootLoader.getHarness(MatButtonHarness);

    await input.setValue('');
    expect(await button.isDisabled()).toBeTrue();
    await input.setValue('T');
    expect(await button.isDisabled()).toBeTrue();
    await input.setValue('Tim');
    expect(await button.isDisabled()).toBeFalse();
  });

  it('should trigger logic on checkbox change', async() => {
    const input = await rootLoader.getHarness(MatInputHarness.with({selector: '#form2Input'}))
    const checkbox = await rootLoader.getHarness(MatCheckboxHarness);

    await input.setValue('Tim');
    expect(await checkbox.isDisabled()).toBeFalse();

    const logicSpy = spyOn(app, 'someLogic').and.callThrough();
    await checkbox.check();
    expect(logicSpy).toHaveBeenCalledTimes(1);
    logicSpy.calls.reset();

    await input.setValue('');
    expect(await checkbox.isDisabled()).toBeTrue();
    expect(logicSpy).toHaveBeenCalledTimes(1);
    logicSpy.calls.reset();
  });
});
