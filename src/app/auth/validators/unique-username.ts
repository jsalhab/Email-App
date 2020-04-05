import { Injectable } from "@angular/core";
import { AsyncValidator, FormControl } from "@angular/forms";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable({ providedIn: "root" })
export class UniqueUsername implements AsyncValidator {
  constructor(private authService: AuthService) {}

  validate = (control: FormControl) => {
    const { value } = control;
    return this.authService.usernameAvailable(value).pipe(
      map(value => {
        if (value.available) {
          return null;
        }
      }),
      catchError(error => {
        console.log(error);
        if (error.error.username) {
          return of({ nonUniqueUsename: true });
          // } else {
          //   return of({ noConnection: true });
          // }
        }
      })
    );
  };
}
