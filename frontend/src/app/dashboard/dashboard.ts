import { Component } from '@angular/core';

interface DashboardCard {
  title: string;
  description: string;
  buttonText: string;
  action: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // convert to a signal
  dashboardCards: DashboardCard[] = [
    {
      title: 'hello-world',
      description:
        "{{greeting}} Claude! Please respond with a friendly greeting and tell me you're working correctly.",
      buttonText: 'Explore',
      action: 'explore',
    },
    {
      title: 'create-jira-issue',
      description:
        "Create a Jira issue in the project '{{projectKey}}' with summary '{{summary}}' and description '{{de...",
      buttonText: 'Explore',
      action: 'explore',
    },
    {
      title: 'Documentation',
      description:
        'Generate comprehensive documentation for your projects automatically.',
      buttonText: 'Explore',
      action: 'explore',
    },
    {
      title: 'Bug Analysis',
      description:
        'Analyze and debug issues in your codebase with AI assistance.',
      buttonText: 'Explore',
      action: 'explore',
    },
    {
      title: 'Performance Optimization',
      description:
        'Optimize your code performance with intelligent recommendations.',
      buttonText: 'Explore',
      action: 'explore',
    },
    {
      title: 'Testing Suite',
      description:
        'Generate and run comprehensive tests for your applications.',
      buttonText: 'Explore',
      action: 'explore',
    },
    {
      title: 'Deployment',
      description: 'Deploy your applications with automated CI/CD pipelines.',
      buttonText: 'Explore',
      action: 'explore',
    },
  ];

  // convert to a signal
  promptCount = this.dashboardCards.length;

  onCardAction(action: string): void {
    console.log('Card action triggered:', action);
  }
}
