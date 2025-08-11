import { HttpInterceptorFn } from '@angular/common/http';

export const cookieInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieReq = req.clone({
    withCredentials: true,
  });

  return next(cookieReq);
};
