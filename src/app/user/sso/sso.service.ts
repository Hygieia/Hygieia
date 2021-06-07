import {Inject, Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {throwError} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SsoService {
  authCode: any;
  private LOGIN_ENDPOINT = '/api/login/openid';
  private AUTH_ENDPOINT = '/authcode';

  constructor( @Inject(Router) private router: Router, private route: ActivatedRoute,
               private http: HttpClient) {
    let authCode = '';
    this.route.queryParams.subscribe(params => {
      const key = 'code';
      authCode = params[key];
      if (authCode !== undefined) {
        localStorage.setItem('auth-code', authCode);
      }
    });
  }

  getRedirectUri(): string {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost')) {
      return `http://${hostname}:4200/user/sso/`;
    } else {
      // dashboard-ui is from server side redirect
      return `https://${hostname}/dashboard-ui/user/sso/`;
    }
  }

  obtainAuthCode() {
    if (this.authCode === undefined) {
      // AUTH_ENDPOINT value assigned at deployment server
      // refer obtainAuthCodeLocalHost()
      window.location.href = this.AUTH_ENDPOINT;
    } else {
      return 'no code';
    }
  }

  callSsoLogin() {
    this.http.post<boolean>( this.LOGIN_ENDPOINT,
      new HttpParams({}),
      { headers: {'Content-Type': 'application/x-www-form-urlencoded'}, observe: 'response'})
      .subscribe(loggedIn => {
        const token = loggedIn.headers.get('x-authentication-token');
        localStorage.setItem('access_token', token);
        if (token) {
          this.router.navigate(['/']);
        }
      }, error => throwError(error));
  }

  /**
   * created for development env, replaces obtainAuthCode()
   * with valid auth end point, auth url, and client id
   */
  obtainAuthCodeLocalHost() {
    if (this.authCode === undefined) {
      const redirectUri = this.getRedirectUri();
      // AUTH_ENDPOINT value assigned at deployment server
      window.location.href = environment.authorization.AUTHORIZATION_URL + '?client_id=' + environment.authorization.CLIENT_ID
        + '&redirect_uri=' + redirectUri + '&scope=openid%20profile&response_type=code';
    } else {
      return 'no code';
    }
  }

}
