import { Component } from '@angular/core';

import { ConnectionList } from '../../components/connections/connection-list/connection-list';
import { PromptList } from '../../components/prompts/prompt-list/prompt-list';

@Component({
  selector: 'app-dashboard',
  imports: [PromptList, ConnectionList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
