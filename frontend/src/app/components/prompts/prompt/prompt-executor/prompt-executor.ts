import { Component, computed, input } from '@angular/core';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faCirclePlay, faEye } from '@fortawesome/free-regular-svg-icons';

import { Prompt } from '../../models/prompt-model';

@Component({
  selector: 'app-prompt-executor',
  imports: [FontAwesomeModule],
  templateUrl: './prompt-executor.html',
  styleUrl: './prompt-executor.scss',
})
export class PromptExecutor {
  prompt = input<Prompt | undefined>();

  parameters = computed(() => {
    const exampleParams: Record<string, any> = {};

    this.prompt()?.messages.forEach((message: any) => {
      if (message.parameters?.properties) {
        Object.entries(message.parameters.properties).forEach(
          ([name, prop]: [string, any]) => {
            if (prop.default !== undefined) {
              exampleParams[name] = prop.default;
            } else if (prop.type === 'string') {
              exampleParams[name] = prop.description
                ? `Example ${prop.description.toLowerCase()}`
                : `example ${name}`;
            } else if (prop.type === 'number') {
              exampleParams[name] = 42;
            } else if (prop.type === 'boolean') {
              exampleParams[name] = true;
            } else {
              exampleParams[name] = `example ${name}`;
            }
          }
        );
      }
    });

    console.log(exampleParams);

    return exampleParams;
  });

  constructor(private readonly library: FaIconLibrary) {
    this.library.addIcons(faEye, faCirclePlay);
  }
}
