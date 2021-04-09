import {Component, TemplateRef} from '@angular/core';
import { SocketIoService } from "./socket-io.service";
import * as Connection from '../../../backend/common/connection';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from "rxjs";
import { ViewChild } from "@angular/core";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  users: any[] = [];
  label: string;
  count: number;
  messages: any[] = [];
  title = 'my-app';

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Day;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
    id: string;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event, '');
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event, '');
      },
    },
  ];

  courts: any = [{
      _id: 'ghrogijrigj45490554',
      events: [
      {
        start: subDays(startOfDay(new Date()), 1),
        end: addDays(new Date(), 1),
        title: 'A 3 day event',
        color: colors.red,
        actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
      },
      {
        start: startOfDay(new Date()),
        title: 'An event with no end date',
        color: colors.yellow,
        actions: this.actions,
      },
      {
        start: subDays(endOfMonth(new Date()), 3),
        end: addDays(endOfMonth(new Date()), 3),
        title: 'A long event that spans 2 months',
        color: colors.blue,
        allDay: true,
      },
      {
        start: addHours(startOfDay(new Date()), 2),
        end: addHours(new Date(), 2),
        title: 'A draggable and resizable event',
        color: colors.yellow,
        actions: this.actions,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
      },
    ]
    },
    {
      _id: 'ghrogijrig35254554',
      events: [
        {
          start: subDays(startOfDay(new Date()), 1),
          end: addDays(new Date(), 1),
          title: 'A 3 day event',
          color: colors.red,
          actions: this.actions,
          allDay: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
        },
        {
          start: startOfDay(new Date()),
          title: 'An event with no end date',
          color: colors.yellow,
          actions: this.actions,
        },
        {
          start: subDays(endOfMonth(new Date()), 3),
          end: addDays(endOfMonth(new Date()), 3),
          title: 'A long event that spans 2 months',
          color: colors.blue,
          allDay: true,
        },
        {
          start: addHours(startOfDay(new Date()), 2),
          end: addHours(new Date(), 2),
          title: 'A draggable and resizable event',
          color: colors.yellow,
          actions: this.actions,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
        },
      ]
    },
    {
      _id: 'ghrogijri689978554',
      events: [
        {
          start: subDays(startOfDay(new Date()), 1),
          end: addDays(new Date(), 1),
          title: 'A 3 day event',
          color: colors.red,
          actions: this.actions,
          allDay: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
        },
        {
          start: startOfDay(new Date()),
          title: 'An event with no end date',
          color: colors.yellow,
          actions: this.actions,
        },
        {
          start: new Date('2021-02-27T11:00:00.000+00:00'),
          end: new Date('2021-02-27T12:00:00.000+00:00'),
          title: 'A long event that spans 2 months',
          color: colors.blue,
          allDay: false,
        },
      ]
    }];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  constructor(private socketService: SocketIoService, private modal: NgbModal) {
    this.socketService.listenToServer(Connection.change).subscribe((change) => {
      console.log(change)
      this.courts[0].events.forEach((event) => {
          event.color = colors.yellow;
      });
       this.onChange(change);
    });

    this.socketService.listenToServer(Connection.notificationCount).subscribe((count) => {
    //  this.notifUser();
      this.count = count;
    });

    this.socketService.listenToServer(Connection.delete).subscribe((user) => {
      this.courts[0].events.forEach((event) => {
        event.color = colors.red;
      });
      this.onDelete(user);
    });

    this.socketService.listenToServer(Connection.create).subscribe((user) => {
      this.courts[0].events.forEach((event) => {
        event.color = colors.blue;
      });
      this.onCreate(user);
    });

    this.socketService.listenToServer(Connection.addedNewUser).subscribe((message) => {
      console.log(message)
      this.messages.push(message);
    });

    this.socketService.listenToServer(Connection.updatedUser).subscribe((message) => {
      this.messages.push(message)
    });

    this.socketService.listenToServer(Connection.deletedUser).subscribe((message) => {
      this.messages.push(message)
    });
  }

  onChange(change: any) {
    const index = this.users.findIndex((user) => user.id === change.id);
    this.users[index].label = change.label;
  }

  onCreate(user: any) { console.log('create')
    this.users.push(user)
  }

  onDelete(change: any) {console.log('delete')
    let index = this.users.findIndex((user) => user.id === change.id);
    this.users.splice(index, 1);
    console.log(this.users)
  }

 // notifUser() {
   // this.socketService.emitToServer(Connection.notificationCount, [])
 // }

  createUser(label: string) {
    const user = {id: Date.now().toString(), label};
    this.socketService.emitToServer(Connection.create, user);
    this.socketService.emitToServer(Connection.notificationCount, []);
    this.socketService.emitToServer(Connection.addedNewUser, user.id);
    this.label = '';
  }

  updateUser(label: string, id: string) {
    this.socketService.emitToServer(Connection.change, {id, label});
    this.socketService.emitToServer(Connection.updatedUser, id);
  }

  deleteUser(id: string) {
    this.socketService.emitToServer(Connection.delete, {id});
    this.socketService.emitToServer(Connection.deletedUser, id);
  }

  handleEvent(action: string, event: any, id: string): void {
    console.log(action, event, id)
    this.modalData = { event, action, id };
    this.modal.open(this.modalContent);
  }
}
