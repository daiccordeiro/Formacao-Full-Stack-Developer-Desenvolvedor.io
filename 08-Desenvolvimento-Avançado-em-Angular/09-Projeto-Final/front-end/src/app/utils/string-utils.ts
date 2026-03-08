export class StringUtils {

  public static isNullOrEmpty(val?: string | null): boolean {
    return val === undefined || val === null || val.trim() === '';
  }

  public static somenteNumeros(numero?: string | null): string {
    return numero ? numero.replace(/\D/g, '') : '';
  }
}
