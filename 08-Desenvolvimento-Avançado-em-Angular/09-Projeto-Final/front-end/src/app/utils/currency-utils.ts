export class CurrencyUtils {

  public static stringParaDecimal(input: string | number | null | undefined): number {
    if (input === null || input === undefined) return 0;

    if (typeof input === 'number') return input;

    let value = input.trim();

    if (!value) return 0;

    value = value
      .replace(/R\$\s*/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.');

    const result = Number(value);

    return isNaN(result) ? 0 : result;
  }

  public static decimalParaString(input: number | null | undefined): string {
    if (input === null || input === undefined) return '';

    return input.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
