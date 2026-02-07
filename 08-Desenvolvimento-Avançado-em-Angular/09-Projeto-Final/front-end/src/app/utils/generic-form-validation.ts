import { FormGroup, AbstractControl} from '@angular/forms';

export class GenericValidator {

  constructor(private validationMessages: ValidationMessages) { }

  processarMensagens(container: FormGroup): DisplayMessage {
    const messages: DisplayMessage  = {};

      Object.keys(container.controls).forEach(controlKey => {
      const c: AbstractControl = container.controls[controlKey];

      if (c instanceof FormGroup) {
        const childMessages = this.processarMensagens(c);
        Object.assign(messages, childMessages);
        return;
      }

      if (this.validationMessages[controlKey]) {
        messages[controlKey] = '';

        if ((c.dirty || c.touched) && c.errors) {
          Object.keys(c.errors).forEach(messageKey => {
            if (this.validationMessages[controlKey]?.[messageKey]) {
              messages[controlKey] +=
                this.validationMessages[controlKey][messageKey] + '<br />';
            }
          });
        }
      }
    });

    return messages;
  }
}

export interface DisplayMessage {
  [key: string]: string;
}

export interface ValidationMessages {
  [key: string]: {
    [key: string]: string;
  };
}
