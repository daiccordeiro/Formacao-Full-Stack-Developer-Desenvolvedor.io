import { ContadorComponent } from './contator.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('ContatorComponent', () => {

    let component: ContadorComponent;
    let fixture: ComponentFixture<ContadorComponent>;

    // Roda essa instância para cada teste
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ContadorComponent
            ]
        });

        fixture = TestBed.createComponent(ContadorComponent);
        component = fixture.componentInstance;
        
        component.valor = 0;
        fixture.detectChanges();
    });

    it('Deve incrementar corretamente', () => {
        component.incrementar()
        expect(component.valor).toBe(1);
    });

    it('Deve decrementar corretamente', () => {
        component.incrementar()
        expect(component.valor).toBe(1);

        component.decrementar()
        expect(component.valor).toBe(0);
    });

    it('não deve decrementar abaixo do valor mínimo', () => {
        component.decrementar()
        expect(component.valor).toBe(0);        
    });

    it('não deve incrementar acima do valor máximo', () => {
        for (let i = 0; i < 200; i++) {
            component.incrementar();
        }
        expect(component.valor).toBe(100);
    });
});