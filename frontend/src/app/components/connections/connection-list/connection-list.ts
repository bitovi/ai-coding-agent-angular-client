import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faEye,
  faTimesCircle,
} from '@fortawesome/free-regular-svg-icons';
import { faLink, faLock } from '@fortawesome/free-solid-svg-icons';

import { ConnectionService } from '../../../services/connection.service';
import { Connection } from '../models/connection-model';

@Component({
  selector: 'app-connection-list',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './connection-list.html',
  styleUrl: './connection-list.scss',
})
export class ConnectionList {
  #connectionsService = inject(ConnectionService);

  connections = this.#connectionsService.connections.asReadonly();

  constructor(library: FaIconLibrary) {
    library.addIcons(...[faTimesCircle, faCheckCircle, faLink, faLock]);
  }

  authorize(connection: Connection) {
    this.#connectionsService.authorize(connection);
  }
}
