import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gtm-ng-guide',
  templateUrl: './ng-guide.component.html',
  styleUrls: ['./ng-guide.component.scss'],
})
export class NgGuideComponent implements OnInit {
  title = 'I need a title';
  constructor() {}

  ngOnInit(): void {}
}
