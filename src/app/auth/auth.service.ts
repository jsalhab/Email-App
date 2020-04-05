import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";

interface SignupCredentials {
  username: string;
  password: string;
  passwordConfirmaion: string;
}

interface SigninCredentials {
  username: string;
  password: string;
}

interface signedinResponse {
  authenticated: boolean;
  username: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  rootUrl = "https://api.angular-email.com";
  signedin$ = new BehaviorSubject(null);
  username = "";

  constructor(private http: HttpClient) {}

  usernameAvailable(username: string) {
    return this.http.post<{ available: boolean }>(
      this.rootUrl + "/auth/username",
      {
        username: username
      }
    );
  }

  signup(credentials: SignupCredentials) {
    return this.http
      .post<{ username: string }>(this.rootUrl + "/auth/signup", credentials)
      .pipe(
        tap(response => {
          this.signedin$.next(true);
          this.username = response.username;
        })
      );
  }

  checkAuth() {
    return this.http
      .get<signedinResponse>(this.rootUrl + "/auth/signedin")
      .pipe(
        tap(({ authenticated, username }) => {
          this.signedin$.next(authenticated);
          this.username = username;
        })
      );
  }

  signout() {
    return this.http.post(this.rootUrl + "/auth/signout", {}).pipe(
      tap(() => {
        this.signedin$.next(false);
      })
    );
  }

  signin(credentials: SigninCredentials) {
    return this.http
      .post<{ username: string }>(this.rootUrl + "/auth/signin", credentials)
      .pipe(
        tap(response => {
          this.signedin$.next(true);
          this.username = response.username;
        })
      );
  }
}
