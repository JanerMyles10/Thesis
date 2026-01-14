import { ComponentFixture, TestBed } from '@angular/core/testing';

// 1. IMPORT THE CORRECT CLASS NAME FROM THE CORRECT FILE PATH
import { CreateShopComponent } from './create-shop';

// 2. UPDATE THE CLASS NAME IN THE 'describe' BLOCK
describe('CreateShopComponent', () => {
  // 3. UPDATE THE TYPE DEFINITIONS
  let component: CreateShopComponent;
  let fixture: ComponentFixture<CreateShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // For standalone components, you just import the component itself.
      // It brings its own dependencies (like FormsModule) with it.
      imports: [CreateShopComponent]
    })
    .compileComponents();

    // 4. UPDATE THE CLASS NAME WHEN CREATING THE COMPONENT
    fixture = TestBed.createComponent(CreateShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});