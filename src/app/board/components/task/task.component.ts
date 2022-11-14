import { ITask } from './../../../core/models/data.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  @Input() public task!: ITask;

  updateTask() {

  }

  deleteTask() {

  }

}
