import { Component, Input } from '@angular/core';
import { GroupSettingsModel } from '../../settings/group-settings/group-settings.component';

@Component({
  standalone: false,
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {
  @Input() group!: GroupSettingsModel;
}
