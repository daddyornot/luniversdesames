import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {ShopItem} from './shop-item';
import {Product} from '../../../core/models/product';
import {provideRouter} from '@angular/router';
import {ShopList} from '../shop-list/shop-list';

describe('ShopItem', () => {
  let component: ShopItem;
  let fixture: ComponentFixture<ShopItem>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Description',
    price: 10,
    imageUrl: 'image.jpg',
    type: 'PHYSICAL',
    stones: [{id: 1, name: 'Amethyst', description: 'Description'}]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopItem],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {path: 'boutique/:id', component: ShopList}
        ])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ShopItem);
    component = fixture.componentInstance;

    // Set the required input BEFORE detectChanges (which triggers ngOnInit)
    fixture.componentRef.setInput('product', mockProduct);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
