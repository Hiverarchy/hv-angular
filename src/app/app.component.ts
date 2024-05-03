import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {collection, Firestore, getDocs} from '@angular/fire/firestore'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'hiverarchy';
  firestore = inject(Firestore);

  ngOnInit() {
    getDocs(collection(this.firestore, "testPath")).then((response) => {
      console.log(response.docs);
    })
  }
}
