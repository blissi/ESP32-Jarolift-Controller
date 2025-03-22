import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface MenuItem {
  icon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    {
      icon: 'svg i_updown',
      label: 'Kanäle'
    },
    {
      icon: 'svg i_updown2',
      label: 'Gruppen'
    },
    {
      icon: 'svg i_clock',
      label: 'Timer'
    },
    {
      icon: 'svg i_service',
      label: 'Service'
    },
    {
      icon: 'svg i_info',
      label: 'System'
    },
    {
      icon: 'svg i_log',
      label: 'Logbuch'
    },
    {
      icon: 'svg i_upload',
      label: 'Tools'
    },
    {
      icon: 'svg i_settings',
      label: 'Einstellungen'
    },
    {
      icon: 'svg i_help',
      label: 'Hilfe'
    }
  ];

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: MenuItem) {
    // Only toggle if sidebar is not collapsed and item has children
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }
}