import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { EMPTY, catchError, finalize, take } from 'rxjs';

import {
  Connection,
  ConnectionResponse,
} from '../components/connections/models/connection-model';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  #httpClient = inject(HttpClient);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  connections = signal<Connection[] | null>(null);

  constructor() {
    this.#getConnections();
  }

  #getConnections() {
    this.loading.set(true);
    this.error.set(null);

    this.#httpClient
      .get<ConnectionResponse>('/api/connections')
      .pipe(
        take(1),
        finalize(() => {
          this.loading.set(false);
        }),
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        })
      )
      .subscribe((response) => {
        this.connections.set(response.data.connections);
      });
  }

  authorize(connection: Connection) {
    this.#httpClient
      .post<{ authUrl: string }>(`/mcp/${connection.name}/authorize`, {})
      .pipe(
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
        take(1)
      )
      .subscribe((response) => {
        if (response.authUrl) {
          window.open(response.authUrl, '_blank');
        }
      });
  }
}
