import { Component } from '@angular/core';

import { PromptList } from '../../components/prompts/prompt-list/prompt-list';

@Component({
  selector: 'app-dashboard',
  imports: [PromptList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
