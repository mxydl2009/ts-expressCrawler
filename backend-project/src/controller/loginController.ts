// 放置登录相关的逻辑代码,将router.ts中的面向过程代码重构为面向对象代码
import { Request, Response } from 'express';
import 'reflect-metadata';
import { controller, get, post } from '../decorator';
import { getResponseData } from '../utils/util';

// 将经过body-parser中间件的Request类型进行类型扩展，直接定义在用到req的文档中,让文档中的变量使用该类型
interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller('/api')
export class LoginController {
  static isLogin(req: RequestWithBody): boolean {
    return !!(req.session ? req.session.login : undefined);
  }

  @get('/isLogin')
  isLogin(req: Request, res: Response): void {
    const isLogin = LoginController.isLogin(req);
    const result = getResponseData<responseResult.isLogin>(isLogin);
    res.json(result);
  }

  @get('/logout')
  logout(req: Request, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData<responseResult.logout>(true));
  }
  @post('/login')
  login(req: RequestWithBody, res: Response): void {
    const { password } = req.body;
    // req.session ? 表示只有用了cookie-session中间件，req上才有session属性
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData<responseResult.login>(true));
    } else {
      if (password === '123' && req.session) {
        //                                                            eyJsb2dpbiI6ImxvZ2luZWR0cnVlIn0=      eyJsb2dpbiI6ImxvZ2luZWR0cnVlIn0=
        req.session.login = 'loginedtrue'; // 布尔值true的值都是eyJsb2dpbiI6dHJ1ZX0=   字符串“loginedtrue”的值eyJsb2dpbiI6ImxvZ2luZWR0cnVlIn0=
        // req.session.test = 'test';
        // 同时设置login和test属性的值eyJsb2dpbiI6ImxvZ2luZWR0cnVlIiwidGVzdCI6InRlc3QifQ==
        res.json(getResponseData<responseResult.login>(true));
      } else {
        res.json(getResponseData<responseResult.login>(false, '登录失败'));
      }
    }
  }
}
