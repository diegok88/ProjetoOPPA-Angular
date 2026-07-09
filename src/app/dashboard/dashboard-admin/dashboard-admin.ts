import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SUBMENU_OPTIONS, SubmenuOptionAdmin } from '../../../const/sidebar-admin.const';

@Component({
  selector: 'app-dashboard-admin',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.scss',
})
export class DashboardAdmin {
  protected activeSubmenu = signal<SubmenuOptionAdmin | null>(null);
  protected isSidebarCollapsed = signal<boolean>(true);

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

  protected toggleSidebar() {
    this.isSidebarCollapsed.update((current) => !current);
  }
}
