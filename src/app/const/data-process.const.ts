import { ConfigProcess } from '../interfaces/config-process.interface';

export const DataProcessPerfil: ConfigProcess[] = [
  {
    id: 1,
    processo: 'inativar',
    imagem: 'images/prohibited.png',
    mensagem: 'Deseja inativar a perfil',
    botao: 'Inativar',
  },
  {
    id: 2,
    processo: 'ativar',
    imagem: 'images/accept.png',
    mensagem: 'Deseja ativar a perfil',
    botao: 'Ativar',
  },
  {
    id: 3,
    processo: 'eliminar',
    imagem: 'images/trash.png',
    mensagem: 'Deseja eliminar a perfil',
    botao: 'Eliminar',
  },
] as const;
