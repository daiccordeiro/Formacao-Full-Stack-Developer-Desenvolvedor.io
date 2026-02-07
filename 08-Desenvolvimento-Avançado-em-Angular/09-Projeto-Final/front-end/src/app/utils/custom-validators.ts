import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export class CustomValidators {

/**
    Valida se o tamanho do campo está dentro de um intervalo
    Exemplo: [6, 15] -> mínimo 6 e máximo 15 caracteres
*/
    static rangeLength(min: number, max: number): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null; // Se vazio, quem valida é o "required"

        const length = control.value.length;
        return (length < min || length > max)
          ? { rangeLength: true }
          : null;
        };
    }


/**
    Valida se o valor do campo é igual ao valor de outro campo
    Exemplo: confirmar senha
 */
    static equalTo(matchTo: string): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent) return null;

        const matchingControl = control.parent.get(matchTo);
        if (!matchingControl) return null;

        return control.value === matchingControl.value
        ? null
        : { equalTo: true };
      };
    }
}
