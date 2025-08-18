import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

import { Prompt } from '../models/prompt-model';
import { PromptDetails } from './prompt-details/prompt-details';
import { PromptExecutor } from './prompt-executor/prompt-executor';
import { PromptHeader } from './prompt-header/prompt-header';

@Component({
  selector: 'app-prompt',
  imports: [PromptHeader, PromptDetails, PromptExecutor],
  templateUrl: './prompt.html',
  styleUrl: './prompt.scss',
})
export class PromptComponent {
  #route = inject(ActivatedRoute);

  promptName = toSignal(
    this.#route.paramMap.pipe(map((params) => params.get('promptName'))),
    { initialValue: '' }
  );

  #promptRef = httpResource<Prompt>(() => {
    if (!this.promptName()) {
      return undefined;
    }

    return `/api/prompts/${this.promptName()}`;
  });

  promptValue = computed(() => {
    return this.#promptRef.value();
  });
}
