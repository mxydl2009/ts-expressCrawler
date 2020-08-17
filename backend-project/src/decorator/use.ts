import { RequestHandler } from 'express';
import { CrawlerController, LoginController } from '../controller';

// 定义一个use()中间件的装饰器工厂函数，将中间件定义在被装饰的方法上
export function use(middleware: RequestHandler) {
  return function(target: CrawlerController | LoginController, key: string) {
    const originMiddlewares =
      Reflect.getMetadata('middlewares', target, key) || [];
    originMiddlewares.push(middleware);
    Reflect.defineMetadata('middlewares', originMiddlewares, target, key);
  };
}
