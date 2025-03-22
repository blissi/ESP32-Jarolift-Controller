import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  routerLink: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    {
      icon: 'svg i_updown',
      label: 'Kanäle',
      routerLink: "/control"
    },
    {
      icon: 'svg i_updown2',
      label: 'Gruppen',
      routerLink: "/group"
    },
    {
      icon: 'svg i_clock',
      label: 'Timer',
      routerLink: "/timer"
    },
    {
      icon: 'svg i_service',
      label: 'Service',
      routerLink: "/service"
    },
    {
      icon: 'svg i_info',
      label: 'System',
      routerLink: "/system"
    },
    {
      icon: 'svg i_log',
      label: 'Logbuch',
      routerLink: "/logger"
    },
    {
      icon: 'svg i_upload',
      label: 'Tools',
      routerLink: "/tools"
    },
    {
      icon: 'svg i_settings',
      label: 'Einstellungen',
      routerLink: "/settings"
    },
    {
      icon: 'svg i_help',
      label: 'Hilfe',
      routerLink: "/help"
    }
  ];

  toggleSidebar() {
    this.sidebarToggle.emit();
  }
}