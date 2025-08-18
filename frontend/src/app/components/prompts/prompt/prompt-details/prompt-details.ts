import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  input,
} from '@angular/core';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faClipboard, faMessage } from '@fortawesome/free-regular-svg-icons';

import { Prompt } from '../../models/prompt-model';

@Component({
  selector: 'app-prompt-details',
  imports: [FontAwesomeModule],
  templateUrl: './prompt-details.html',
  styleUrl: './prompt-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptDetails {
  prompt = input<Prompt | undefined>();

  constructor(private readonly library: FaIconLibrary) {
    this.library.addIcons(faClipboard, faMessage);
  }
}
