import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SUBMENU_OPTIONS, SubmenuOptionAdmin } from '../../../const/sidebar-admin.const';

@Component({
  selector: 'app-dashboard-user',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.scss',
})
export class DashboardUser {
  // VARIAVEL DE ARMAZENAMENTO DO SUBMENU ATUAL ABERTO
  protected activeSubmenu = signal<SubmenuOptionAdmin | null>(null);
  // VARIAVEL DO SIDEBAR
  protected isSidebarCollapsed = signal<boolean>(true);
  // FUNÇÃO DE ABERTURA DOS SUBMENUS
  protected toggleOperacionalSubmenu(event: Event) {
    event.preventDefault();
    if (this.activeSubmenu() === SUBMENU_OPTIONS.Operacional) this.activeSubmenu.set(null);
    else this.activeSubmenu.set(SUBMENU_OPTIONS.Operacional);
  }
  protected toggleSolicitacaoSubmenu(event: Event) {
    event.preventDefault();
    if (this.activeSubmenu() === SUBMENU_OPTIONS.Solicitacoes) this.activeSubmenu.set(null);
    else this.activeSubmenu.set(SUBMENU_OPTIONS.Solicitacoes);
  }
  protected toggleEficienciaSubmenu(event: Event) {
    event.preventDefault();
    if (this.activeSubmenu() === SUBMENU_OPTIONS.Eficiencia) this.activeSubmenu.set(null);
    else this.activeSubmenu.set(SUBMENU_OPTIONS.Eficiencia);
  }
  protected toggleTiposSubmenu(event: Event) {
    event.preventDefault();
    if (this.activeSubmenu() === SUBMENU_OPTIONS.Tipos) this.activeSubmenu.set(null);
    else this.activeSubmenu.set(SUBMENU_OPTIONS.Tipos);
  }
  protected toggleUsuarioSubmenu(event: Event) {
    event.preventDefault();
    if (this.activeSubmenu() === SUBMENU_OPTIONS.Usuario) this.activeSubmenu.set(null);
    else this.activeSubmenu.set(SUBMENU_OPTIONS.Usuario);
  }
  // FUNÇÃO DE ABERTURA E FECHAMENTO DO SIDEBAR MANUALMENTE
  protected toggleSidebar() {
    this.isSidebarCollapsed.update((current) => !current);
  }
}
