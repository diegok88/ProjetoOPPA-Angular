import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.scss',
})
export class DashboardAdmin {
  protected activeSubmenu = signal<'operacional' | 'solicitacao' | null>(null);
  protected isSidebarCollapsed = signal<boolean>(true);

  protected toggleOperacionalSubmenu(event: Event) {
    event.preventDefault();
    this.activeSubmenu.update((current) => (current === 'operacional' ? null : 'operacional'));
  }

  protected toggleSolicitacaoSubmenu(event: Event) {
    event.preventDefault();
    this.activeSubmenu.update((current) => (current === 'solicitacao' ? null : 'solicitacao'));
  }

  protected toggleSidebar() {
    this.isSidebarCollapsed.update((current) => !current);
  }
}
