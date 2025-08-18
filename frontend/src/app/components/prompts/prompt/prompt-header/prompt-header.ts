import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { map } from 'rxjs';

@Component({
  selector: 'app-prompt-header',
  imports: [RouterLink],
  templateUrl: './prompt-header.html',
  styleUrl: './prompt-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptHeader {
  #route = inject(ActivatedRoute);
  promptName = toSignal(
    this.#route.paramMap.pipe(map((params) => params.get('promptName'))),
    { initialValue: '' }
  );
}
