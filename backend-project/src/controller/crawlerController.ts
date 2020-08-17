// 放置爬虫相关的逻辑代码,将router.ts中的面向过程代码重构为面向对象代码
import { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import { controller, get, use } from '../decorator';
import { getResponseData } from '../utils/util';
import Crawler from '../utils/crawler';
import Analyzer from '../utils/analyzer';
import fs from 'fs';
import path from 'path';

// 将经过body-parser中间件的Request类型进行类型扩展，直接定义在用到req的文档中,让文档中的变量使用该类型
interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

// 检查是否登录的公共逻辑，抽象成一个函数，该函数可以用作中间件，在需要检查登录状态的路由上用
const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : undefined);
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, '请先登录'));
  }
};

@controller('/api')
export class CrawlerController {
  // 通过元数据将'/getData'根路径与home方法绑定
  @get('/getData')
  @use(checkLogin)
  getData(req: RequestWithBody, res: Response): void {
    const secret = 'secretKey';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = Analyzer.getInstance();
    const crawler = new Crawler(url, analyzer);
    res.json(getResponseData<responseResult.getData>(true));
  }
  @get('/showData')
  @use(checkLogin)
  showData(req: RequestWithBody, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/course.json');
      const result = fs.readFileSync(position, 'utf-8');
      res.json(getResponseData<responseResult.showData>(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData<responseResult.showData>(false, '数据不存在'));
    }
  }
}
