export interface UsuarioToken {
  id: string;
  email: string;
  claims: any[];
}

export interface UsuarioResponse {
  accessToken: string;
  userToken: UsuarioToken;
}

export class LocalStorageUtils {
  private readonly TOKEN_KEY = 'devio.token';
  private readonly USER_KEY = 'devio.user';


  private get storage(): Storage | null {
    return typeof window !== 'undefined' ? localStorage : null;
  }

  public obterUsuario<T = any>(): T | null {
    const user = this.storage?.getItem(this.USER_KEY);
    return user ? JSON.parse(user) as T : null;
  }

  public salvarDadosLocaisUsuario(response: UsuarioResponse): void {
    this.salvarTokenUsuario(response.accessToken);
    this.salvarUsuario(response.userToken);
  }

  public limparDadosLocaisUsuario(): void {
    this.storage?.removeItem(this.TOKEN_KEY);
    this.storage?.removeItem(this.USER_KEY);
  }

  public obterTokenUsuario(): string | null {
    return this.storage?.getItem(this.TOKEN_KEY) ?? null;
  }

  public salvarTokenUsuario(token: string): void {
    this.storage?.setItem(this.TOKEN_KEY, token);
  }

  public salvarUsuario(user: unknown): void {
    this.storage?.setItem(this.USER_KEY, JSON.stringify(user));
  }
}
