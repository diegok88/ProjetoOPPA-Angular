export interface MenuItem {
  rotulo: string;
  icone: string;
  caminho?: string;
  chave?: string;
  papeis?: string[];
  children?: MenuItem[];
}
