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
      rotulo: 'Operacional',
      icone: 'icons/badge.png',
      chave: 'operacional',
      papeis: ['ADMINISTRADOR - NIVEL 1'],
      children: [
        { rotulo: 'Cadastros', icone: 'icons/add_box.png', caminho: 'operacional/cadastros' },
        {
          rotulo: 'Alocações',
          icone: 'icons/swap_horizontal_circle.png',
          caminho: 'operacional/alocacoes',
        },
        {
          rotulo: 'Dispensas',
          icone: 'icons/calendar_add_on.png',
          caminho: 'operacional/dispensas',
        },
        { rotulo: 'Penalidades', icone: 'icons/dangerous.png', caminho: 'operacional/penalidades' },
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
      ],
    },
    {
      rotulo: 'Eficiência',
      icone: 'icons/insert_chart.png',
      chave: 'eficiencia',
      papeis: ['ADMINISTRADOR - NIVEL 1'],
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
      rotulo: 'Tipos',
      icone: 'icons/post_add.png',
      chave: 'tipos',
      papeis: ['ADMINISTRADOR - NIVEL 1'],
      children: [
        { rotulo: 'Solicitações', icone: 'icons/box_edit.png', caminho: 'tipos/solicitacoes' },
        { rotulo: 'Perfil', icone: 'icons/assignment_ind.png', caminho: 'tipos/perfil' },
        { rotulo: 'Penalidades', icone: 'icons/dangerous.png', caminho: 'tipos/penalidades' },
        { rotulo: 'Dispensas', icone: 'icons/calendar_add_on.png', caminho: 'tipos/dispensas' },
        { rotulo: 'Jornadas', icone: 'icons/schedule.png', caminho: 'tipos/jornadas' },
        {
          rotulo: 'Estados de Jornadas',
          icone: 'icons/search_activity.png',
          caminho: 'tipos/estados-jornadas',
        },
        { rotulo: 'Setores', icone: 'icons/factory.png', caminho: 'tipos/setores' },
        { rotulo: 'Ativos', icone: 'icons/precision_manufacturing.png', caminho: 'tipos/ativos' },
        { rotulo: 'Tags Ativos', icone: 'icons/manufacturing.png', caminho: 'tipos/tags-ativos' },
        {
          rotulo: 'Estados do Ativos',
          icone: 'icons/manage_history.png',
          caminho: 'tipos/estados-ativos',
        },
        { rotulo: 'Ocorrências', icone: 'icons/problem.png', caminho: 'tipos/ocorrencias' },
        { rotulo: 'Falhas', icone: 'icons/warning.png', caminho: 'tipos/falhas' },
        { rotulo: 'Soluções', icone: 'icons/lightbulb_circle.png', caminho: 'tipos/solucoes' },
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
