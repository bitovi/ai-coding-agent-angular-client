import { SlicePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';

import { ConnectionResponse } from '../../connections/models/connection-model';
import { PromptResponse } from '../models/prompt-model';

@Component({
  selector: 'app-prompt-list',
  imports: [RouterLink, SlicePipe, FontAwesomeModule],
  templateUrl: './prompt-list.html',
  styleUrl: './prompt-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptList {
  promptsRef = httpResource<PromptResponse>(() => '/api/prompts');
  connectionsRef = httpResource<ConnectionResponse>(() => '/api/connections');

  promptsWithConnections = computed(() => {
    const prompts = this.promptsRef.value();
    const connections = this.connectionsRef.value();
  });

  constructor(private readonly library: FaIconLibrary) {
    this.library.addIcons(faClipboard);
  }
}
