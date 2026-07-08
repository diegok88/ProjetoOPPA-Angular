import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.scss',
})
export class DashboardAdmin {
  protected isSidebarOpen = signal<boolean>(true);
  protected isReportingOpen = signal<boolean>(false);

  protected toggleReportingSubmenu(event: Event) {
    event.preventDefault();
    this.isReportingOpen.update((v) => !v);
  }
}
