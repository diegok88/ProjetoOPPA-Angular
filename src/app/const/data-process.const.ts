import { ConfigProcess } from '../interfaces/config-process.interface';

export const DataProcessPerfil: ConfigProcess[] = [
  {
    id: 1,
    processo: 'inativar',
    imagem: 'images/prohibited.png',
    mensagem: 'Deseja inativar a Perfil',
    botao: 'Inativar',
  },
  {
    id: 2,
    processo: 'ativar',
    imagem: 'images/accept.png',
    mensagem: 'Deseja ativar a Perfil',
    botao: 'Ativar',
  },
  {
    id: 3,
    processo: 'eliminar',
    imagem: 'images/trash.png',
    mensagem: 'Deseja eliminar a Perfil',
    botao: 'Eliminar',
  },
] as const;

export const DataProcessEmpresa: ConfigProcess[] = [
  {
    id: 1,
    processo: 'inativar',
    imagem: 'images/prohibited.png',
    mensagem: 'Deseja inativar a Empresa',
    botao: 'Inativar',
  },
  {
    id: 2,
    processo: 'ativar',
    imagem: 'images/accept.png',
    mensagem: 'Deseja ativar a Empresa',
    botao: 'Ativar',
  },
  {
    id: 3,
    processo: 'eliminar',
    imagem: 'images/trash.png',
    mensagem: 'Deseja eliminar a Empresa',
    botao: 'Eliminar',
  },
] as const;
