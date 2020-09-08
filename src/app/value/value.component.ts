import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss'],
})
export class ValueComponent implements OnInit {
  values: Value;
  constructor(private http: HttpClient) {}

  ngOnInit(): any {
    this.getValues();
  }

  getValues(): void {
    this.http.get('http://localhost:5000/api/values').subscribe(
      (res: Value) => {
        this.values = res;
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

interface Value {
  id: number;
  name: string;
}
