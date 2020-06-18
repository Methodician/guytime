import { Component, Input } from '@angular/core';

@Component({
  selector: 'gtm-toggle-icon',
  templateUrl: './toggle-icon.component.html',
  styleUrls: ['./toggle-icon.component.scss'],
})
export class ToggleIconComponent {
  @Input() deselected;
  @Input() iconName;
}
