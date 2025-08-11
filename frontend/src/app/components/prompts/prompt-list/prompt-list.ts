import { SlicePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PromptResponse } from '../models/prompt';

@Component({
  selector: 'app-prompt-list',
  imports: [RouterLink, SlicePipe],
  templateUrl: './prompt-list.html',
  styleUrl: './prompt-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptList {
  promptsRef = httpResource<PromptResponse>(() => '/api/prompts');
}
