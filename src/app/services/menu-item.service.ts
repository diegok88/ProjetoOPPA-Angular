import { computed, inject, Injectable } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  private auth = inject(AuthService);

  private listaMenu: MenuItem[] = [
    {
      rotulo: 'Principal',
      icone: 'icons/home.png',
      caminho: 'principal',
      papeis: ['ASSISTENCIA - NIVEL 1', 'ADMINISTRADOR - NIVEL 1'],
    },
    {
      rotulo: 'Gestão',
      icone: 'icons/group.png',
      chave: 'gestao',
      papeis: ['ASSISTENCIA - NIVEL 1', 'ADMINISTRADOR - NIVEL 1'],
      children: [
        { rotulo: 'Cadastros', icone: 'icons/badge.png', caminho: 'gestao/cadastros' },
        {
          rotulo: 'Alocações',
          icone: 'icons/swap_horizontal_circle.png',
          caminho: 'gestao/alocacoes',
        },
        {
          rotulo: 'Dispensas',
          icone: 'icons/calendar_add_on.png',
          caminho: 'gestao/dispensas',
        },
        { rotulo: 'Penalidades', icone: 'icons/dangerous.png', caminho: 'gestao/penalidades' },
      ],
    },
    {
      rotulo: 'Assistência',
      icone: 'icons/add_box.png',
      chave: 'assistencia',
      papeis: ['ASSISTENCIA - NIVEL 1'],
      children: [
        { rotulo: 'Perfil', icone: 'icons/assignment_ind.png', caminho: 'perfil' },
        { rotulo: 'Penalidades', icone: 'icons/dangerous.png', caminho: 'assistencia/penalidades' },
        {
          rotulo: 'Dispensas',
          icone: 'icons/calendar_add_on.png',
          caminho: 'assistencia/dispensas',
        },
        { rotulo: 'Jornadas', icone: 'icons/schedule.png', caminho: 'assistencia/jornadas' },
        {
          rotulo: 'Estados de Jornadas',
          icone: 'icons/search_activity.png',
          caminho: 'assistencia/estados-jornadas',
        },
      ],
    },
    {
      rotulo: 'Solicitações',
      icone: 'icons/list_alt.png',
      chave: 'solicitacoes',
      papeis: ['ASSISTENCIA - NIVEL 1', 'ADMINISTRADOR - NIVEL 1'],
      children: [
        { rotulo: 'Escrever', icone: 'icons/box_edit.png', caminho: 'solicitacoes/escrever' },
        { rotulo: 'Enviadas', icone: 'icons/outbox.png', caminho: 'solicitacoes/enviadas' },
        {
          rotulo: 'Recebidas',
          icone: 'icons/move_to_inbox.png',
          caminho: 'solicitacoes/recebidas',
        },
        {
          rotulo: 'Tipos Solicitações',
          icone: 'icons/box_add.png',
          caminho: 'solicitacoes/tipos-solicitacoes',
        },
      ],
    },
    {
      rotulo: 'Eficiência',
      icone: 'icons/insert_chart.png',
      chave: 'eficiencia',
      papeis: ['ASSISTENCIA - NIVEL 1', 'ADMINISTRADOR - NIVEL 1'],
      children: [
        {
          rotulo: 'Monitoração',
          icone: 'icons/bid_landscape.png',
          caminho: 'eficiencia/monitoracao',
        },
        {
          rotulo: 'Ativos',
          icone: 'icons/precision_manufacturing.png',
          caminho: 'eficiencia/ativos',
        },
        { rotulo: 'Operacional', icone: 'icons/speed.png', caminho: 'eficiencia/operacional' },
      ],
    },
    {
      rotulo: 'Empresa',
      icone: 'icons/factory.png',
      chave: 'empresa',
      papeis: ['ASSISTENCIA - NIVEL 1', 'ADMINISTRADOR - NIVEL 1'],
      children: [
        { rotulo: 'Empresa', icone: 'icons/add_business.png', caminho: 'empresa/setores' },
        { rotulo: 'Setores', icone: 'icons/add_column_right.png', caminho: 'empresa/setores' },
        {
          rotulo: 'Competência Setorial',
          icone: 'icons/demography.png',
          caminho: 'empresa/competenciasetorial',
        },
      ],
    },
    {
      rotulo: 'Ativos',
      icone: 'icons/settings_applications.png',
      chave: 'ativos',
      papeis: ['ASSISTENCIA - NIVEL 1'],
      children: [
        { rotulo: 'Ativos', icone: 'icons/precision_manufacturing.png', caminho: 'ativos/ativos' },
        { rotulo: 'Tags Ativos', icone: 'icons/manufacturing.png', caminho: 'ativos/tags-ativos' },
        {
          rotulo: 'Estados do Ativos',
          icone: 'icons/manage_history.png',
          caminho: 'ativos/estados-ativos',
        },
        { rotulo: 'Ocorrências', icone: 'icons/problem.png', caminho: 'ativos/ocorrencias' },
        { rotulo: 'Falhas', icone: 'icons/warning.png', caminho: 'ativos/falhas' },
        { rotulo: 'Soluções', icone: 'icons/lightbulb_circle.png', caminho: 'ativos/solucoes' },
      ],
    },
    {
      rotulo: 'Usuário',
      icone: 'icons/account_box.png',
      chave: 'usuario',
      papeis: ['ASSISTENCIA - NIVEL 1', 'ADMINISTRADOR - NIVEL 1'],
      children: [
        { rotulo: 'Informações', icone: 'icons/id_card.png', caminho: 'usuario/informacoes' },
        { rotulo: 'Trocar senha', icone: 'icons/lock_reset.png', caminho: 'usuario/trocar-senha' },
        { rotulo: 'Trocar PIN', icone: 'icons/keyboard_lock.png', caminho: 'usuario/trocar-pin' },
      ],
    },
  ];

  public menuItens = computed(() => {
    const usuarioPerfil = this.auth.role();
    if (!usuarioPerfil) return [];

    return this.listaMenu.filter((item) => {
      if (!item.papeis || item.papeis.length === 0) return true;
      return item.papeis.includes(usuarioPerfil);
    });
  });
}
