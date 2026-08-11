import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MenuItemService } from '../../services/menu-item.service';

@Component({
  selector: 'app-dashboard-user',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.scss',
})
export class DashboardUser {
  protected authService = inject(AuthService);
  protected menuService = inject(MenuItemService);
  private router = inject(Router);

  protected menuItens = this.menuService.menuItens;
  protected readonly usuario = this.authService.usuario;

  // VARIAVEL DE ARMAZENAMENTO DO SUBMENU ATUAL ABERTO
  protected activeSubmenu = signal<string | null>(null);
  // VARIAVEL DO SIDEBAR
  protected isSidebarCollapsed = signal<boolean>(true);
  // FUNÇÃO DE ABERTURA E FECHAMENTO DO SUBMENUS DO SIDEBAR MANUALMENTE
  protected toggleSubmenu(chave: string | undefined, event: Event): void {
    event.preventDefault();
    if (!chave) return;
    if (this.activeSubmenu() === chave) this.activeSubmenu.set(null);
    else this.activeSubmenu.set(chave);
  }
  // FUNÇÃO DE ABERTURA E FECHAMENTO DO SIDEBAR MANUALMENTE
  protected toggleSidebar(): void {
    this.isSidebarCollapsed.update((atual) => !atual);
  }

  protected logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login-user']),
      error: () => this.router.navigate(['/login-user']),
    });
  }
}
