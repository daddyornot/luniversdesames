import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ShopList } from './shop-list';

describe('ShopList', () => {
  let component: ShopList;
  let fixture: ComponentFixture<ShopList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
