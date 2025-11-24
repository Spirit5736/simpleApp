import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubjectListComponent } from './components/subject-list/subject-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SubjectListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Subject Management';
}
