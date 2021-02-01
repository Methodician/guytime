import { Component, OnInit, Input } from '@angular/core';
import { ActivityTypeT } from '@models/user';

@Component({
  selector: 'gtm-activities-span',
  templateUrl: './activities-span.component.html',
  styleUrls: ['./activities-span.component.scss'],
})
export class ActivitiesSpanComponent implements OnInit {
  @Input() selectedActivities: ActivityTypeT[] = [];

  constructor() {}

  ngOnInit(): void {}

  isActivityTypeSelected = (activityType: ActivityTypeT) =>
    this.selectedActivities.includes(activityType);
}
