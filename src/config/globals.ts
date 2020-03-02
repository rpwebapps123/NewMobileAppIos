import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  isPvmUser: boolean = true;
  sfToken: string = "";
  source: string = "Mobile-app";
}